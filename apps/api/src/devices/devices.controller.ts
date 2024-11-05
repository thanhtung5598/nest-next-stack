import {
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
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { Roles } from '@/libs/commons/decorators/roles.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Serialize } from '@/libs/commons/interceptors/serialize.interceptor';
import {
  CreateDeviceParamsDto,
  DeviceResponseDto,
  GetAvailableDevicesQueryDto,
  GetAvailableDevicesResDto,
  GetBorrowableDevicesQueryDto,
  GetBorrowableDevicesResDto,
  GetDevicesQueryDto,
  GetDevicesResponseDto,
  UpdateDeviceParamsDto,
} from './dtos/device.dto';
import { CurrentUser } from '@/libs/commons/decorators/current-user';
import { DeviceStatisticDto } from './dtos/device-dashboard.dto';

@ApiBearerAuth()
@ApiTags('Devices')
@Roles('admin')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all devices' })
  @ApiOkResponse({ type: GetDevicesResponseDto })
  @Serialize(GetDevicesResponseDto)
  async findMany(@Query() query: GetDevicesQueryDto) {
    return await this.devicesService.getList(query);
  }

  @Get('/available')
  @ApiOperation({ summary: 'Get available devices' })
  @ApiOkResponse({ type: GetAvailableDevicesResDto })
  @Serialize(GetAvailableDevicesResDto)
  @HttpCode(HttpStatus.OK)
  async getAvailableDevices(@Query() query: GetAvailableDevicesQueryDto) {
    return {
      data: await this.devicesService.getAvailableDevices(query),
    };
  }

  @Get('/borrowable')
  @ApiOperation({ summary: 'Get available devices' })
  @ApiOkResponse({ type: GetBorrowableDevicesResDto })
  @Serialize(GetBorrowableDevicesResDto)
  @HttpCode(HttpStatus.OK)
  @Roles('admin', 'employee')
  async getBorrowableDevices(
    @Query() query: GetBorrowableDevicesQueryDto,
    @CurrentUser() currentUser: any,
  ) {
    const { id: userId } = currentUser;
    return {
      data: await this.devicesService.getBorrowableDevices(userId, query),
    };
  }

  @Get('/statistic')
  @Roles('admin')
  @ApiOperation({ summary: 'Get number of devices by category, all devices, borrowing devices' })
  @ApiOkResponse({ type: DeviceStatisticDto })
  @Serialize(DeviceStatisticDto)
  async getNumberOfDevicesByCategory() {
    return {
      total: await this.devicesService.getNumberOfTotalDevices(),
      borrowing: await this.devicesService.getNumberOfBorrowingDevices(),
      deviceByCategory: await this.devicesService.getNumberOfDevicesByCategory(),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get device by id' })
  @ApiOkResponse({ type: DeviceResponseDto })
  @Serialize(DeviceResponseDto)
  @Roles('admin', 'employee')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const device = await this.devicesService.findOne(id);
    return device;
  }

  @Post()
  @ApiOperation({ summary: 'Create an device' })
  @ApiOkResponse({ type: DeviceResponseDto })
  @Serialize(DeviceResponseDto)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDeviceParamsDto: CreateDeviceParamsDto) {
    return this.devicesService.create(createDeviceParamsDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update device' })
  @ApiOkResponse({ type: DeviceResponseDto })
  @Serialize(DeviceResponseDto)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDeviceParamsDto: UpdateDeviceParamsDto,
  ) {
    await this.devicesService.findOne(id);

    return this.devicesService.update(id, updateDeviceParamsDto);
  }
}
