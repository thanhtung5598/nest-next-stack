import { PrismaService } from '@/libs/shared/services/prisma.service';
import { Brand, Prisma } from '@prisma/client';
import { GetBrandsParamsDto } from './dtos/get-brand.dto';
import { offsetPaginate } from '@/libs/utils/pagination';
import { Injectable } from '@nestjs/common';
import { CreateBrandParamsDto } from './dtos/create-brand.dto';
import { UpdateBrandParamsDto } from './dtos/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findMany(params: GetBrandsParamsDto) {
    const { keyword, ...rest } = params;

    const where: Prisma.BrandWhereInput = {};

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    return offsetPaginate(this.prisma.brand, {
      where,
      ...rest,
    });
  }

  async findOne(id: number): Promise<Brand> {
    return this.prisma.brand.findUniqueOrThrow({
      where: { id },
    });
  }

  async create(params: CreateBrandParamsDto) {
    try {
      return this.prisma.brand.create({
        data: params,
      });
    } catch (error) {
      throw error;
    }
  }

  async update(brandId: number, params: UpdateBrandParamsDto) {
    try {
      return this.prisma.brand.update({
        where: {
          id: brandId,
        },
        data: params,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(brandId: number) {
    try {
      return this.prisma.brand.delete({
        where: {
          id: brandId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
