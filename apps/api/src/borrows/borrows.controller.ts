import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/libs/commons/decorators/roles.decorator';
import { BorrowsService } from './borrows.service';
import {
  CreateBorrowParamsDto,
  GetBorrowsQueryDto,
  UpdateBorrowProcessParamsDto,
  UpdateBorrowProcessType,
} from './dtos/borrow.dto';
import { Serialize } from '@/libs/commons/interceptors/serialize.interceptor';
import { CurrentUser } from '@/libs/commons/decorators/current-user';
import { UserRole } from '@prisma/client';
import { BorrowRequestService } from '@/libs/shared/services/borrow-request.service';
import {
  BorrowRequestResponseDto,
  GetBorrowRequestResponseDto,
} from '@/libs/commons/dtos/borrow-request.dto';
import {
  DeviceBorrowStatisticParamsDto,
  DeviceBorrowStatisticResponseDto,
} from './dtos/borrow-dashboard.dto';

@ApiBearerAuth()
@ApiTags('Borrows')
@Controller('borrows')
export class BorrowsController {
  constructor(
    private readonly borrowsService: BorrowsService,
    private readonly borrowRequestService: BorrowRequestService,
  ) {}

  @Get('/statistic')
  @Roles('admin')
  @ApiOperation({ summary: 'Get monthly/daily request/return count' })
  @ApiOkResponse({ type: [DeviceBorrowStatisticResponseDto] })
  @Serialize(DeviceBorrowStatisticResponseDto)
  async getBorrowDevicesStatistic(@Query() query: DeviceBorrowStatisticParamsDto) {
    const { type } = query;
    switch (type) {
      case 'monthly':
        return this.borrowsService.getBorrowDevicesByMonth();
      case 'daily':
        return this.borrowsService.getBorrowDevicesByDay();
      default:
        return new BadRequestException('Invalid type');
    }
  }

  @Roles('employee', 'admin')
  @Get(':id')
  @ApiOperation({ summary: 'Get a borrow request' })
  @ApiOkResponse({ type: BorrowRequestResponseDto })
  @Serialize(BorrowRequestResponseDto)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.borrowsService.findOne(id);
  }

  @Post()
  @Roles('employee', 'admin')
  @ApiOperation({ summary: 'Create a borrow request' })
  @ApiOkResponse({ type: BorrowRequestResponseDto })
  @Serialize(BorrowRequestResponseDto)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createBorrowParamsDto: CreateBorrowParamsDto,
    @CurrentUser() currentUser: any,
  ) {
    const { id: userId } = currentUser;
    return this.borrowsService.create(userId, createBorrowParamsDto);
  }

  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get list of borrow requests' })
  @ApiOkResponse({ type: GetBorrowRequestResponseDto })
  @Serialize(GetBorrowRequestResponseDto)
  @HttpCode(HttpStatus.OK)
  async getList(@Query() query: GetBorrowsQueryDto) {
    return this.borrowRequestService.getList(query);
  }

  @Roles('admin', 'employee')
  @Patch(':id/process')
  @ApiOperation({ summary: 'Update borrow request process' })
  @ApiOkResponse({ type: BorrowRequestResponseDto })
  @Serialize(BorrowRequestResponseDto)
  @HttpCode(HttpStatus.ACCEPTED)
  async approve(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: any,
    @Body() params: UpdateBorrowProcessParamsDto,
  ) {
    const { role } = currentUser;

    switch (params.type) {
      case UpdateBorrowProcessType.approve:
        const { id: approverId } = currentUser;
        if (role !== UserRole.admin) {
          throw new UnauthorizedException();
        }
        return this.borrowsService.approve(id, approverId);

      case UpdateBorrowProcessType.reject:
        if (role !== UserRole.admin) {
          throw new UnauthorizedException();
        }
        const { rejectionReason } = params.data || {};
        return this.borrowsService.reject(id, rejectionReason);

      case UpdateBorrowProcessType.requestReturn:
        const { id: userRequestId } = currentUser;
        return this.borrowsService.requestReturn(id, userRequestId);

      case UpdateBorrowProcessType.confirmReturn:
        if (role !== UserRole.admin) {
          throw new UnauthorizedException();
        }
        return this.borrowsService.confirmReturn(id);

      default:
        throw new BadRequestException('Invalid process type');
    }
  }
}
