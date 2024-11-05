import { PrismaService } from '@/libs/shared/services/prisma.service';
import { Category, Prisma } from '@prisma/client';
import { GetAllCategoriesParamsDto, GetCategoriesParamsDto } from './dtos/get-category.dto';
import { Injectable } from '@nestjs/common';
import { offsetPaginate } from '@/libs/utils/pagination';
import { CreateCategoryParamsDto } from './dtos/create-category.dto';
import { UpdateCategoryParamsDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: GetCategoriesParamsDto) {
    const { keyword, ...rest } = params;

    const where: Prisma.CategoryWhereInput = {};

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    return offsetPaginate(this.prisma.category, {
      where,
      ...rest,
    });
  }

  async findAll(params: GetAllCategoriesParamsDto) {
    const { keyword } = params;

    const where: Prisma.CategoryWhereInput = {};

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    return this.prisma.category.findMany({
      where,
    });
  }

  async findOne(id: number): Promise<Category> {
    return this.prisma.category.findUniqueOrThrow({
      where: { id },
    });
  }

  async create(params: CreateCategoryParamsDto) {
    try {
      return this.prisma.category.create({
        data: params,
      });
    } catch (error) {
      throw error;
    }
  }

  async update(categoryId: number, params: UpdateCategoryParamsDto) {
    try {
      return this.prisma.category.update({
        where: {
          id: categoryId,
        },
        data: params,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(categoryId: number) {
    try {
      return this.prisma.category.delete({
        where: {
          id: categoryId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
