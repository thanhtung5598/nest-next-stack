import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDeviceParamsDto {
  @ApiProperty()
  deviceId: number;
}
