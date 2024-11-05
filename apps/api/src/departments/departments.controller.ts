import { Roles } from '@/libs/commons/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  DepartmentResponseDto,
  GetAllDepartmentsParamsDto,
  GetAllDepartmentsResponseDto,
  GetDepartmentsParamsDto,
  GetDepartmentsResponseDto,
} from './dtos/get-department.dto';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentParamsDto } from './dtos/create-department.dto';
import { UpdateDepartmentParamsDto } from './dtos/update-department.dto';

@ApiBearerAuth()
@ApiTags('Departments')
@Roles('admin')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Get Departments' })
  @ApiOkResponse({
    type: GetDepartmentsResponseDto,
  })
  async findMany(@Query() params: GetDepartmentsParamsDto) {
    return this.departmentsService.findMany(params);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Get all departments' })
  @ApiOkResponse({
    type: GetAllDepartmentsResponseDto,
  })
  async findAll(@Query() params: GetAllDepartmentsParamsDto) {
    return this.departmentsService.findAll(params);
  }

  @Post()
  @ApiOperation({ summary: 'Create department' })
  @ApiOkResponse({
    type: DepartmentResponseDto,
  })
  async create(@Body() params: CreateDepartmentParamsDto) {
    return this.departmentsService.create(params);
  }

  @Patch(':departmentId')
  @ApiOperation({ summary: 'Update department' })
  @ApiOkResponse({
    type: DepartmentResponseDto,
  })
  async update(
    @Param('departmentId', ParseIntPipe) id: number,
    @Body() params: UpdateDepartmentParamsDto,
  ) {
    return this.departmentsService.update(id, params);
  }

  @Delete(':departmentId')
  @ApiOperation({ summary: 'Delete department' })
  @ApiOkResponse({
    type: DepartmentResponseDto,
  })
  async delete(@Param('departmentId', ParseIntPipe) departmentId: number) {
    return this.departmentsService.delete(departmentId);
  }
}
