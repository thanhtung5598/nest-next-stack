import { PrismaClient, Department } from '@prisma/client';

export enum DepartmentCode {
  DEVELOPMENT = 'development',
  CORPORATE = 'corporate',
  BRSE = 'brse',
  OFFICE = 'office',
  STOCK = 'stock',
}

const data = [
  {
    name: 'Development',
    code: DepartmentCode.DEVELOPMENT,
  },
  {
    name: 'Corporate',
    code: DepartmentCode.CORPORATE,
  },
  {
    name: 'BrSE',
    code: DepartmentCode.BRSE,
  },
  {
    name: 'Office',
    code: DepartmentCode.OFFICE,
  },
  {
    name: 'Stock',
    code: DepartmentCode.STOCK,
  },
];

export async function createDepartments(prisma: PrismaClient): Promise<Department[]> {
  return Promise.all(
    data.map(async (department) => {
      return await prisma.department.upsert({
        where: {
          code: department.code,
        },
        create: {
          name: department.name,
          code: department.code,
        },
        update: {},
      });
    }),
  );
}
