import { ApiProperty } from '@nestjs/swagger';

export class BrandEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}
