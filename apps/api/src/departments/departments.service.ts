import { PrismaService } from '@/libs/shared/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetAllDepartmentsParamsDto, GetDepartmentsParamsDto } from './dtos/get-department.dto';
import { Prisma } from '@prisma/client';
import { offsetPaginate } from '@/libs/utils/pagination';
import { CreateDepartmentParamsDto } from './dtos/create-department.dto';
import { UpdateDepartmentParamsDto } from './dtos/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: GetDepartmentsParamsDto) {
    const { keyword, ...rest } = params;

    const where: Prisma.DepartmentWhereInput = {};

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    return offsetPaginate(this.prisma.department, {
      where,
      ...rest,
    });
  }

  async findAll(params: GetAllDepartmentsParamsDto) {
    const { keyword } = params;

    const where: Prisma.DepartmentWhereInput = {};

    if (keyword) {
      where.name = {
        contains: keyword,
        mode: 'insensitive',
      };
    }

    return this.prisma.department.findMany({
      where,
    });
  }

  async create(params: CreateDepartmentParamsDto) {
    try {
      return this.prisma.department.create({
        data: params,
      });
    } catch (error) {
      throw error;
    }
  }

  async update(departmentId: number, params: UpdateDepartmentParamsDto) {
    try {
      return this.prisma.department.update({
        where: {
          id: departmentId,
        },
        data: params,
      });
    } catch (error) {
      throw error;
    }
  }

  async delete(departmentId: number) {
    try {
      return this.prisma.department.delete({
        where: {
          id: departmentId,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
