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
import { GetBrandsParamsDto, GetBrandsResponseDto } from './dtos/get-brand.dto';
import { BrandsService } from './brand.service';
import { BrandResponseDto } from './dtos/get-brand.dto';
import { CreateBrandParamsDto } from './dtos/create-brand.dto';
import { UpdateBrandParamsDto } from './dtos/update-brand.dto';

@ApiBearerAuth()
@ApiTags('Brands')
@Roles('admin')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  @ApiOperation({ summary: 'Get brands' })
  @ApiOkResponse({
    type: GetBrandsResponseDto,
  })
  async findMany(@Query() params: GetBrandsParamsDto) {
    return this.brandsService.findMany(params);
  }

  @Post()
  @ApiOperation({ summary: 'Create brand' })
  @ApiOkResponse({
    type: BrandResponseDto,
  })
  async create(@Body() params: CreateBrandParamsDto) {
    return this.brandsService.create(params);
  }

  @Patch(':brandId')
  @ApiOperation({ summary: 'Update brand' })
  @ApiOkResponse({
    type: BrandResponseDto,
  })
  async update(@Param('brandId', ParseIntPipe) id: number, @Body() params: UpdateBrandParamsDto) {
    return this.brandsService.update(id, params);
  }

  @Delete(':brandId')
  @ApiOperation({ summary: 'Delete brand' })
  @ApiOkResponse({
    type: BrandResponseDto,
  })
  async delete(@Param('brandId', ParseIntPipe) brandId: number) {
    return this.brandsService.delete(brandId);
  }
}
