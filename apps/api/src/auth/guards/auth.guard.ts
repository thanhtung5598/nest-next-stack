import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ApiConfigService } from '../../libs/shared/services/api-config.service';
import { IS_PUBLIC_KEY } from '../../libs/commons/decorators/skip-auth.decorator';
import { PrismaService } from '@/libs/shared/services/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.authConfig.privateKey,
      });

      const currentUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ accessToken: token }, { refreshToken: token }],
        },
        select: {
          id: true,
          role: true,
        },
      });

      if (currentUser?.id !== user?.id) {
        throw new UnauthorizedException('Invalid Token');
      }

      request['user'] = currentUser;
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Expired');
      }

      throw new UnauthorizedException('Invalid Token');
    }

    return true;
  }
}
