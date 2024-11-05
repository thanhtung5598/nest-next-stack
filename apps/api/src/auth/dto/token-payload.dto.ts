import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadDto {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  token: string;

  constructor(data: { expiresIn: number; token: string }) {
    this.expiresIn = data.expiresIn;
    this.token = data.token;
  }
}
