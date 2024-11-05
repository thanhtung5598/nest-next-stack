import { ApiProperty } from '@nestjs/swagger';

export class DepartmentEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;
}
