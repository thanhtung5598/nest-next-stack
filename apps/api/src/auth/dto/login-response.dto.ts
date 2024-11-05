import { ApiProperty } from '@nestjs/swagger';
import { TokenPayloadDto } from './token-payload.dto';

export class LoginResponseDto {
  @ApiProperty({ type: TokenPayloadDto, description: 'JWT access token' })
  accessToken: TokenPayloadDto;

  @ApiProperty({ type: TokenPayloadDto, description: 'JWT refresh token' })
  refreshToken: TokenPayloadDto;
}
