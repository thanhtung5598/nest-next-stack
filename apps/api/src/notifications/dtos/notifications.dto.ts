import { CursorPaginateQueryDto } from '@/libs/commons/dtos/pagination-params.dto';
import { CursorPaginationResultDto } from '@/libs/commons/dtos/pagination-result.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class NotificationResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  targetUri: string;

  @ApiProperty({ required: false })
  @Expose()
  @Transform(({ obj }) => {
    if (obj.targetUri) {
      return process.env.FRONT_END_HOST + obj.targetUri;
    }

    return null;
  })
  absoluteTargetUrl: string;

  @ApiProperty({ required: false })
  @Expose()
  body: string;

  @ApiProperty({ required: false })
  @Expose()
  checkedAt?: Date;

  @ApiProperty({ default: false })
  @Expose()
  @Transform(({ obj }) => !!obj.checkedAt)
  isRead: boolean;

  @ApiProperty({ required: false })
  @Expose()
  notifiedAt?: Date;
}

export class GetNotificationsResponseDto extends CursorPaginationResultDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  @Type(() => NotificationResponseDto)
  @Expose()
  data: NotificationResponseDto[];

  @ApiProperty()
  @Expose()
  unreadNotificationCount: number;
}

export class GetNotificationsQueryDto implements CursorPaginateQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lastEndCursor?: number;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number;
}
