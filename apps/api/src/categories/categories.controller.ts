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
import { CategoriesService } from './categories.service';
import {
  CategoryResponseDto,
  GetAllCategoriesParamsDto,
  GetAllCategoriesResponseDto,
  GetCategoriesParamsDto,
  GetCategoriesResponseDto,
} from './dtos/get-category.dto';
import { CreateCategoryParamsDto } from './dtos/create-category.dto';
import { UpdateCategoryParamsDto } from './dtos/update-category.dto';

@ApiBearerAuth()
@ApiTags('Categories')
@Roles('admin')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get Categories' })
  @ApiOkResponse({
    type: GetCategoriesResponseDto,
  })
  async findMany(@Query() params: GetCategoriesParamsDto) {
    return this.categoriesService.findMany(params);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiOkResponse({
    type: GetAllCategoriesResponseDto,
  })
  async findAll(@Query() params: GetAllCategoriesParamsDto) {
    return this.categoriesService.findAll(params);
  }

  @Post()
  @ApiOperation({ summary: 'Create category' })
  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  async createBrand(@Body() params: CreateCategoryParamsDto) {
    return this.categoriesService.create(params);
  }

  @Patch(':categoryId')
  @ApiOperation({ summary: 'Update category' })
  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  async updateBrand(
    @Param('categoryId', ParseIntPipe) id: number,
    @Body() params: UpdateCategoryParamsDto,
  ) {
    return this.categoriesService.update(id, params);
  }

  @Delete(':categoryId')
  @ApiOperation({ summary: 'Delete category' })
  @ApiOkResponse({
    type: CategoryResponseDto,
  })
  async delete(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.delete(categoryId);
  }
}
