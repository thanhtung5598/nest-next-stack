import { ApiProperty } from '@nestjs/swagger';

export class TokenVerificationDto {
  @ApiProperty()
  code: string;
}
