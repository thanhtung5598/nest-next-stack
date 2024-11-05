import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '@/libs/commons/decorators/roles.decorator';
import { CurrentUser } from '@/libs/commons/decorators/current-user';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  GetUserRes,
  GetAllUsersParamsDto,
  GetAllUsersResponseDto,
  GetAllUserDevicesParamsDto,
  GetAllUserDevicesResponseDto,
  GetAllBorrowDevicesParamsDto,
  GetAllBorrowDevicesResponseDto,
} from './dto/get-users.dto';
import { AddUserDevicesDto, CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDeviceParamsDto } from './dto/delete-user-device.dto';
import { Serialize } from '@/libs/commons/interceptors/serialize.interceptor';
import { BorrowRequestService } from '@/libs/shared/services/borrow-request.service';
import { GetBorrowRequestResponseDto } from '@/libs/commons/dtos/borrow-request.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Roles('admin')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly borrowRequestService: BorrowRequestService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    type: GetAllUsersResponseDto,
  })
  getAllUsers(@Query() GetAllUsersParamsDto: GetAllUsersParamsDto) {
    return this.usersService.findMany(GetAllUsersParamsDto);
  }

  @Post()
  @ApiOperation({
    summary: 'Create User',
  })
  @ApiOkResponse({
    type: UserEntity,
  })
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Get('/me')
  @ApiOperation({
    summary: 'Get Profile Info',
  })
  @Roles('admin', 'employee')
  @ApiOkResponse({
    type: GetUserRes,
  })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.getUser(user.id);
  }

  @Get('devices')
  @ApiOperation({
    summary: 'Get My Devices',
  })
  @ApiOkResponse({
    type: GetAllUserDevicesResponseDto,
  })
  @Roles('admin', 'employee')
  async getMeDevices(
    @CurrentUser() user: any,
    @Query() getAllUserDevicesParamsDto: GetAllUserDevicesParamsDto,
  ) {
    return this.usersService.getUserDevices(user.id, getAllUserDevicesParamsDto);
  }

  @Get('borrow_devices')
  @ApiOperation({
    summary: 'Get My Borrow Devices',
  })
  @ApiOkResponse({
    type: GetAllBorrowDevicesResponseDto,
  })
  @Roles('admin', 'employee')
  async getMeBorrowDevices(
    @CurrentUser() user: any,
    @Query() getAllBorrowDevicesParamsDto: GetAllBorrowDevicesParamsDto,
  ) {
    return this.usersService.getBorrowDevices(user.id, getAllBorrowDevicesParamsDto);
  }

  @Get('borrow_history')
  @Roles('admin', 'employee')
  @ApiOperation({ summary: 'Get list of borrow history' })
  @ApiOkResponse({ type: GetBorrowRequestResponseDto })
  @Serialize(GetBorrowRequestResponseDto)
  @HttpCode(HttpStatus.OK)
  async getMeBorrowDevicesHistory(
    @CurrentUser() user: any,
    @Query() getAllBorrowDevicesParamsDto: GetAllBorrowDevicesParamsDto,
  ) {
    return this.borrowRequestService.getList(getAllBorrowDevicesParamsDto, user.id);
  }

  @Get(':userId/borrow_history')
  @Roles('admin', 'employee')
  @ApiOperation({ summary: 'Get list of borrow history' })
  @ApiOkResponse({ type: GetBorrowRequestResponseDto })
  @Serialize(GetBorrowRequestResponseDto)
  @HttpCode(HttpStatus.OK)
  async getBorrowDevicesHistory(
    @Param('userId') userId: string,
    @Query() getAllBorrowDevicesParamsDto: GetAllBorrowDevicesParamsDto,
  ) {
    return this.borrowRequestService.getList(getAllBorrowDevicesParamsDto, userId);
  }

  @Get(':userId')
  @ApiParam({
    name: 'userId',
  })
  @ApiOperation({
    summary: 'Get User Profile By userId',
  })
  @ApiOkResponse({
    type: GetUserRes,
  })
  getUser(@Param('userId') userId: string) {
    return this.usersService.getUser(userId);
  }

  @Patch(':userId')
  @ApiOperation({
    summary: 'Update User Profile',
  })
  @ApiOkResponse({
    type: UpdateUserDto,
  })
  updateUser(@Param('userId') userId: string, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(userId, body);
  }

  @Get(':userId/devices')
  @ApiOperation({
    summary: 'Get User Devices',
  })
  @ApiOkResponse({
    type: GetAllUserDevicesResponseDto,
  })
  async getUserDevices(
    @Param('userId') userId: string,
    @Query() getAllUserDevicesParamsDto: GetAllUserDevicesParamsDto,
  ) {
    return this.usersService.getUserDevices(userId, getAllUserDevicesParamsDto);
  }

  @Get(':userId/borrow_devices')
  @ApiOperation({
    summary: 'Get User Borrow Devices',
  })
  @ApiOkResponse({
    type: GetAllBorrowDevicesResponseDto,
  })
  async getBorrowDevices(
    @Param('userId') userId: string,
    @Query() getAllBorrowDevicesParamsDto: GetAllBorrowDevicesParamsDto,
  ) {
    return this.usersService.getBorrowDevices(userId, getAllBorrowDevicesParamsDto);
  }

  @Post(':userId/devices')
  @ApiOperation({
    summary: 'Add Devices For User',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  async addUserDevices(@Param('userId') userId: string, @Body() params: AddUserDevicesDto) {
    return this.usersService.addUserDevices(userId, params.deviceIds);
  }

  @Delete(':userId/device')
  @ApiOperation({
    summary: 'Delete User Device',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
  })
  async deleteUserDevice(
    @Param('userId') userId: string,
    @Body() deleteUserDeviceParamsDto: DeleteUserDeviceParamsDto,
  ) {
    return this.usersService.deleteUserDevice(userId, deleteUserDeviceParamsDto);
  }
}
