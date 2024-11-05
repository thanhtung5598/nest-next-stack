import { PrismaClient, User, UserRole } from '@prisma/client';
import { DepartmentCode } from './department';

const data = [
  {
    name: 'Nguyen Xuan Manh',
    email: 'manh_nguyen_xuan@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U050JG3202F-0b8a68dac8ee-512',
  },
  {
    name: 'Tran Ngoc Bao',
    email: 'bao_tran_ngoc@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U050449CT55-372e4fc2edf4-512',
  },
  {
    name: 'Le Van Quy',
    email: 'quy_le_van@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U050FMF96KX-9c51af8cd411-512',
  },
  {
    name: 'Kifushi Kazuha',
    email: 'kazuha_kifushi@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.CORPORATE,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U04VB94S9U7-e70c284b08ea-512',
  },
  {
    name: 'Kudo Kodai',
    email: 'kodai_kudo@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.BRSE,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U0508SBD88M-8b0e4369433a-512',
  },
  {
    name: 'Mai Le Quynh Trang',
    email: 'trang_mai_le_quynh@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.CORPORATE,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U0518AUPG8Y-ca3bc8245bfd-512',
  },
  {
    name: 'Phan Chau Vu',
    email: 'vu_phan_chau@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U050X8PUZK3-5e23a60eee43-512',
  },
  {
    name: 'Tran Bao Hien',
    email: 'hien_tran_bao@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U050FMESAER-cbe90febd78c-512',
  },
  {
    name: 'Bui Quoc Khai',
    email: 'khai_bui_quoc@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U050JL3F04S-e66dad439ef0-512',
  },
  {
    name: 'Kieu Duy',
    email: 'duy_kieu@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U050FMF7CKF-d569112f82c9-512',
  },
  {
    name: 'Thai Thi Hoai Thu',
    email: 'thu_thai_thi_hoai@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.BRSE,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U050C26DN7Q-b40456ef45bf-512',
  },
  {
    name: 'Tran Thi Nguyet',
    email: 'nguyet_tran_thi@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.CORPORATE,
  },
  {
    name: 'Le Thanh Tung',
    email: 'tung_le_thanh@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U05CD5FQ39P-a62760285f40-512',
  },
  {
    name: 'Le Dang Khoa',
    email: 'khoa_le_dang@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U05EMPQ69LL-500b1a9d19ae-512',
  },
  {
    name: 'Lu Thi Cam Hang',
    email: 'hang_lu_thi_cam@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.BRSE,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U05E4QFE0CF-a158b84c6556-512',
  },
  {
    name: 'Bach Quang Chien',
    email: 'chien_bach_quang@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U05PSLY44KV-d6cdb4b8c51e-512',
  },
  {
    name: 'Tran Hoang Nam',
    email: 'nam_tran_hoang@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U05R9V58M2M-5ccb859f245a-512',
  },
  {
    name: 'Nguyen Tran My Anh',
    email: 'anh_nguyen_tran_my@bita.jp',
    role: UserRole.admin,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U06BN27KSRF-6a415e88d0fe-192',
  },
  {
    name: 'Anh My',
    email: 'anhmynguyen043@gmail.com@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U06BN27KSRF-6a415e88d0fe-192',
  },
  {
    name: 'Do Ngoc Bich Tram',
    email: 'tram_do_ngoc_bich@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U06DF2302V7-44cf5bff9218-512',
  },
  {
    name: 'Nguyen Minh Hieu',
    email: 'hieu_nguyen_minh@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U072BCBLPDW-ffc29f501db5-512',
  },
  {
    name: 'Nguyen Thi Thu Hoai',
    email: 'hoai_nguyen_thi_thu@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.BRSE,
    avatarUrl: 'https://ca.slack-edge.com/T04FZDSTTGA-U050C26DN7Q-b40456ef45bf-512',
  },
  {
    name: 'Nguyen Thu Trinh',
    email: 'trinh_nguyen_thu@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
  },
  {
    name: 'Ngo Tran Gia Thinh',
    email: 'thinh_ngo_tran_gia@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
  },
  {
    name: 'Pham Nguyen Gia Hung',
    email: 'hung_pham_nguyen_gia@bita.jp',
    role: UserRole.employee,
    departmentCode: DepartmentCode.DEVELOPMENT,
  },
];

export async function createUsers(prisma: PrismaClient): Promise<User[]> {
  const departments = await prisma.department.findMany({
    select: {
      id: true,
      code: true,
    },
  });

  const departmentIdByCode = departments.reduce((acc, department) => {
    // @ts-ignore
    acc[department.code] = department.id;
    return acc;
  }, {});

  const usersData = data.map((user) => ({
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl,
    // @ts-ignore
    departmentId: departmentIdByCode[user.departmentCode],
  }));

  return await prisma.$transaction(
    usersData.map((user) => {
      return prisma.user.upsert({
        where: {
          email: user.email,
        },
        create: {
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user?.avatarUrl,
          departmentId: user.departmentId,
        },
        update: {},
      });
    }),
  );
}

export async function createTestUser(prisma: PrismaClient) {
  const adminDepartment = await prisma.department.findUnique({
    where: {
      code: DepartmentCode.CORPORATE,
    },
  });

  if (adminDepartment === null) {
    return;
  }

  const testUsers = [
    {
      name: 'Admin test',
      email: 'admin_test@example.com',
      departmentId: adminDepartment.id,
      role: UserRole.admin,
    },
    {
      name: 'Employee test',
      email: 'employee_test@example.com',
      departmentId: adminDepartment.id,
      role: UserRole.employee,
    },
    {
      name: 'Employee test 2',
      email: 'employee_test_2@example.com',
      departmentId: adminDepartment.id,
      role: UserRole.employee,
    },
  ];

  return Promise.all(
    testUsers.map(async (user) => {
      return await prisma.user.upsert({
        where: {
          email: user.email,
        },
        create: {
          name: user.name,
          email: user.email,
          role: user.role,
          departmentId: user.departmentId,
        },
        update: {},
      });
    }),
  );
}
