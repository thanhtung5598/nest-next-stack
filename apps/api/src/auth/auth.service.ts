import {
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiConfigService } from '../libs/shared/services/api-config.service';
import { TokenAsyncDto } from './dto/token-async.dt';
import { PrismaService } from '@/libs/shared/services/prisma.service';

@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ApiConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.oauth2Client = new OAuth2Client({
      clientId: this.configService.googleConfig.clientId,
      clientSecret: this.configService.googleConfig.clientSecret,
      redirectUri: this.configService.googleConfig.callbackURL,
    });
  }

  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      state: 'GOOGLE_LOGIN',
      access_type: 'online',
      scope: ['email', 'profile', 'openid'],
      include_granted_scopes: true,
      prompt: 'consent',
    });
  }

  async authenticate(loginDto: TokenVerificationDto) {
    try {
      const { tokens } = await this.oauth2Client.getToken(loginDto.code);

      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: this.configService.googleConfig.clientId,
      });
      const payload = ticket.getPayload();

      return {
        id: payload?.sub,
        email: payload?.email,
        firstName: payload?.given_name,
        lastName: payload?.family_name,
      };
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: (error as Error).message,
        },
      });
    }
  }

  async createToken(payload: TokenAsyncDto, type: 'access' | 'refresh') {
    const expiresIn =
      type === 'access'
        ? this.configService.authConfig.jwtExpirationTime
        : this.configService.authConfig.jwtExpirationRefreshTokenTime;

    const token = await this.jwtService.signAsync(payload, { expiresIn });

    return new TokenPayloadDto({
      token,
      expiresIn,
    });
  }

  async grantTokens(data: {
    userId: string;
    accessToken: string;
    refreshToken: string;
  }): Promise<void> {
    const { userId, accessToken, refreshToken } = data;

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        accessToken,
        refreshToken,
      },
    });
  }

  async revokeTokens(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        accessToken: null,
        refreshToken: null,
      },
    });
  }

  async refreshTokens(payload: TokenAsyncDto) {
    const accessToken = await this.createToken(payload, 'access');
    const refreshToken = await this.createToken(payload, 'refresh');

    await this.grantTokens({
      userId: payload.id,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(data: TokenVerificationDto) {
    const socialData = await this.authenticate(data);

    const user = await this.prisma.user.findUnique({
      where: { email: socialData.email },
      select: {
        id: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: TokenAsyncDto = {
      id: user.id,
      role: user.role,
    };

    const accessToken = await this.createToken(payload, 'access');
    const refreshToken = await this.createToken(payload, 'refresh');

    await this.grantTokens({
      userId: user.id,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
    try {
      await this.revokeTokens(userId);
      return {
        message: 'success',
      };
    } catch (error) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'Unable to log out. Please try again later.',
        },
      });
    }
  }
}
