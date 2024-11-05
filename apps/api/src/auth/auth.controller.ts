import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthorizeLinkDto } from './dto/authorize-link.dto';
import { TokenVerificationDto } from './dto/token-verification.dto';
import { Response } from 'express';
import { Public } from '@/libs/commons/decorators/skip-auth.decorator';
import { CurrentUser } from '@/libs/commons/decorators/current-user';
import { LoginResponseDto } from './dto/login-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google/authorize-link')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get authorize link from google',
  })
  @ApiOkResponse({
    type: AuthorizeLinkDto,
  })
  getGoogleAuthorizeLink(): AuthorizeLinkDto {
    return { authorizeLink: this.authService.generateAuthUrl() };
  }

  @Public()
  @Post('google/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Use code from authorize-link to login',
  })
  @ApiOkResponse({
    type: LoginResponseDto,
  })
  async authenticate(@Body() body: TokenVerificationDto, @Res() response: Response) {
    const result = await this.authService.login(body);
    response.json(result);
  }

  @Post('/refresh-token')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Use "Authorization: Bearer <refreshToken>" to obtain a new access token',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Token refreshed successfully',
    type: LoginResponseDto,
    status: HttpStatus.OK,
  })
  async refreshToken(@CurrentUser() user: any, @Res() response: Response) {
    const result = await this.authService.refreshTokens({
      id: user.id,
      role: user.role,
    });

    response.json(result);
  }

  @ApiBearerAuth()
  @Post('/logout')
  @ApiOperation({
    summary: 'Use "Authorization: Bearer <accessToken>" to remove session',
  })
  @ApiOkResponse({
    description: 'Logout successfully',
    status: HttpStatus.NO_CONTENT,
  })
  async logout(@CurrentUser() user: any) {
    return await this.authService.logout(user.id);
  }
}
