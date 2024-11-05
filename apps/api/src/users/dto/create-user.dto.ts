import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty()
  @IsInt()
  departmentId?: number;
}

export class AddUserDevicesDto {
  @ApiProperty({
    type: [Number],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'Device IDs cannot be an empty array' })
  @Type(() => Number) // Ensure each value is transformed to a number
  @IsNumber({}, { each: true, message: 'Each device ID must be a number' })
  deviceIds: number[];
}
