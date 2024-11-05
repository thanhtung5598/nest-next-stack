import { BorrowsModule } from '@/borrows/borrows.module';
import { CreateBorrowParamsDto, UpdateBorrowProcessType } from '@/borrows/dtos/borrow.dto';
import { PrismaService } from '@/libs/shared/services/prisma.service';
import { SharedModule } from '@/libs/shared/shared.module';
import {
  createBorrowRequest,
  setAsReturningBorrow,
  setAsUsingBorrow,
} from '@/libs/test/factories/borrow.factory';
import { addDeviceForUser, createDevice } from '@/libs/test/factories/device.factory';
import { clearPrismaModelData } from '@/libs/test/helper';
import { setupNestApplication } from '@/libs/utils/nest-application-setup';
import { faker } from '@faker-js/faker/.';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BorrowRequest, Device, User, UsingStatus } from '@prisma/client';
import request from 'supertest';
import { v4 as uuidv4 } from 'uuid';
import {
  MockAdminUserMiddleware,
  MOCK_ADMIN_EMAIL,
} from '@/libs/test/middlewares/mock-admin-user.middleware';
import { OrderDirection } from '@/libs/commons/enum';
import { NotificationsModule } from '@/notifications/notifications.module';
import { BullModule } from '@nestjs/bullmq';
import {
  BorrowRequestResponseDto,
  GetBorrowRequestResponseDto,
} from '@/libs/commons/dtos/borrow-request.dto';
import { BorrowStatus } from '@/libs/commons/enums/borrow';

const deviceCount = 5;

describe('BorrowsController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '../.env.test',
        }),
        BullModule.forRootAsync({
          inject: [ConfigService],
          useFactory: () => ({
            connection: {
              host: process.env.REDIS_HOST,
              port: Number(process.env.REDIS_PORT),
              password: process.env.REDIS_PASSWORD,
              db: Number(process.env.REDIS_DB),
            },
          }),
        }),
        BorrowsModule,
        SharedModule,
        NotificationsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupNestApplication(app);
    app.use(new MockAdminUserMiddleware().use);
    await app.init();
    server = app.getHttpServer();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await Promise.all(Array.from({ length: deviceCount }).map(async () => await createDevice()));
  });

  afterAll(async () => {
    await clearPrismaModelData(prisma.borrowRequest);
    await clearPrismaModelData(prisma.userDevice);
    await clearPrismaModelData(prisma.device);
    await app.close();
  });

  describe('/borrows/ (POST)', () => {
    let user: User;
    let device: Device;
    let defaultParams: CreateBorrowParamsDto;

    beforeEach(async () => {
      user = await prisma.user.findUnique({
        where: {
          email: MOCK_ADMIN_EMAIL,
        },
      });
      device = await createDevice();

      defaultParams = {
        deviceId: device.id,
        note: faker.lorem.lines(),
        borrowedAt: new Date(),
      };
    });

    describe('create borrow request successful', () => {
      it('', async () => {
        const params = {
          ...defaultParams,
        };

        const res = await request(server).post('/borrows/').send(params);
        expect(res.statusCode).toBe(HttpStatus.CREATED);
        const borrow = res.body;
        expect(borrow.status).toBe(BorrowStatus.requesting);
        expect(borrow.device.id).toBe(device.id);
        expect(borrow.user.id).toBe(user.id);
        expect(borrow.note).toEqual(params.note);
        expect(borrow.borrowedAt).not.toBeNull();
      });
    });

    describe('create borrow request failed', () => {
      describe('device is not exist', () => {
        it('', async () => {
          const params = {
            ...defaultParams,
            deviceId: 0,
          };
          const res = await request(server).post('/borrows/').send(params);
          expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
          expect(res.body.message).toContain('No Device found');
        });
      });

      describe('device is in borrow process', () => {
        beforeEach(async () => {
          await createBorrowRequest(user, device);
        });

        afterEach(async () => {
          await clearPrismaModelData(prisma.borrowRequest);
        });

        it('', async () => {
          const params = {
            ...defaultParams,
          };
          const res = await request(server).post('/borrows/').send(params);
          expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(res.body.message).toBe(`The device id=${params.deviceId} is in borrow process`);
        });
      });

      describe('device is kept by another user', () => {
        beforeEach(async () => {
          const user2 = await prisma.user.findFirst({
            where: {
              NOT: {
                id: user.id,
              },
            },
          });
          await addDeviceForUser(defaultParams.deviceId, user2.id);
        });

        it('', async () => {
          const params = {
            ...defaultParams,
          };
          const res = await request(server).post('/borrows/').send(params);
          expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(res.body.message).toBe(`The device id=${params.deviceId} is kept by another user`);
        });
      });
    });
  });

  describe('/borrows/:id (GET)', () => {
    let user: User;
    let device: Device;
    let expectedBorrowRequest: BorrowRequest;

    beforeAll(async () => {
      user = await prisma.user.findUnique({
        where: {
          email: 'employee_test@example.com',
        },
      });
      device = await prisma.device.findFirst();
      expectedBorrowRequest = await createBorrowRequest(user, device);
    });

    afterAll(async () => {
      await clearPrismaModelData(prisma.borrowRequest);
    });

    describe('get borrow request successful', () => {
      it('', async () => {
        const res = await request(server).get('/borrows/' + expectedBorrowRequest.id);
        expect(res.statusCode).toBe(HttpStatus.OK);
        const responseRequest = res.body;
        expect(res.statusCode).toBe(HttpStatus.OK);
        expect(responseRequest.id).toEqual(expectedBorrowRequest.id);
        expect(responseRequest.device.id).toEqual(device.id);
        expect(responseRequest.user.id).toEqual(user.id);
        expect(responseRequest.note).toEqual(expectedBorrowRequest.note);
        expect(responseRequest.status).toEqual(BorrowStatus.requesting);
        expect(responseRequest.device).toHaveProperty('category');
      });
    });

    describe('get borrow request failed', () => {
      it('', async () => {
        const res = await request(server).get('/borrows/' + 0);
        expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
        expect(res.body.message).toContain('No BorrowRequest found');
      });
    });
  });

  describe('/borrows/ (GET)', () => {
    let user: User;
    let device: Device;

    beforeAll(async () => {
      user = await prisma.user.findUnique({
        where: {
          email: 'employee_test@example.com',
        },
      });
      device = await prisma.device.findFirst();

      Promise.all([
        await createBorrowRequest(user, device, {
          status: UsingStatus.using,
          borrowedAt: new Date(),
        }),
        await createBorrowRequest(user, device, {
          borrowedAt: new Date('2025-01-01'),
        }),
      ]);
    });

    describe('get borrow requests successful', () => {
      it('', async () => {
        const res = await request(server).get('/borrows/');
        expect(res.statusCode).toBe(HttpStatus.OK);
        const { data, pagination } = res.body as GetBorrowRequestResponseDto;
        expect(data[0].device).not.toBeUndefined();
        expect(data[0].device).toHaveProperty('category');
        expect(data[0].user).not.toBeUndefined();
        expect(pagination.currentPage).toBe(1);
      });

      it('query with device name', async () => {
        const keyword = device.name.split(' ')[0];
        const res = await request(server).get('/borrows/').query({ keyword });
        expect(res.statusCode).toBe(HttpStatus.OK);
        const { data } = res.body as GetBorrowRequestResponseDto;
        expect(data[0].device.name).toContain(keyword);
        expect(data[0].user).not.toBeUndefined();
      });

      it('query with status', async () => {
        const res = await request(server)
          .get('/borrows/')
          .query({ status: BorrowStatus.requesting });
        expect(res.statusCode).toBe(HttpStatus.OK);
        const { data } = res.body as GetBorrowRequestResponseDto;
        const borrowRequest = data[0];
        expect(borrowRequest.status).toBe(BorrowStatus.requesting);
      });

      it('with order', async () => {
        const res = await request(server).get('/borrows/').query({
          sortOrder: OrderDirection.ASC,
          sortField: 'borrowedAt',
        });
        expect(res.statusCode).toBe(HttpStatus.OK);
        const { data } = res.body as GetBorrowRequestResponseDto;
        const borrowRequests = data;
        expect(borrowRequests.length).toBe(2);
        const request1Date = new Date(borrowRequests[0].borrowedAt).getTime();
        const request2Date = new Date(borrowRequests[1].borrowedAt).getTime();
        expect(request2Date).toBeGreaterThan(request1Date);
      });
    });
  });

  describe('/borrows/:id/process (PATCH)', () => {
    let user: User;
    let device: Device;
    let borrowRequest: BorrowRequest;

    beforeEach(async () => {
      user = await prisma.user.findUnique({
        where: {
          email: 'employee_test@example.com',
        },
      });
      device = await prisma.device.findFirst();
      borrowRequest = await createBorrowRequest(user, device);
    });

    afterEach(async () => {
      await clearPrismaModelData(prisma.borrowRequest);
    });

    describe('approve', () => {
      describe('success', () => {
        it('', async () => {
          const res = await request(server)
            .patch('/borrows/' + borrowRequest.id + '/process')
            .send({
              type: UpdateBorrowProcessType.approve,
            });
          expect(res.statusCode).toBe(HttpStatus.ACCEPTED);
          const approvedRequest = res.body as BorrowRequestResponseDto;
          expect(approvedRequest.status).toBe(BorrowStatus.borrowing);
          expect(approvedRequest.approver).not.toBeNull();
          expect(approvedRequest.approvedAt).not.toBeNull();
        });
      });

      describe('failed', () => {
        describe('wrong borrow id', () => {
          it('', async () => {
            const res = await request(server)
              .patch('/borrows/' + 0 + '/process')
              .send({
                type: UpdateBorrowProcessType.approve,
              });

            expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(res.body.message).toContain('No BorrowRequest found');
          });
        });

        describe('borrow can not be approved', () => {
          beforeEach(async () => {
            setAsUsingBorrow(borrowRequest.id);
          });

          it('', async () => {
            const res = await request(server)
              .patch('/borrows/' + borrowRequest.id + '/process')
              .send({
                type: UpdateBorrowProcessType.approve,
              });

            expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(res.body.message).toEqual('Can not approve this request');
          });
        });
      });
    });

    describe('reject', () => {
      describe('success', () => {
        it('', async () => {
          const rejectionReason = faker.lorem.lines();
          const res = await request(server)
            .patch('/borrows/' + borrowRequest.id + '/process')
            .send({
              type: UpdateBorrowProcessType.reject,
              data: {
                rejectionReason,
              },
            });
          expect(res.statusCode).toBe(HttpStatus.ACCEPTED);
          const rejectedRequest = res.body as BorrowRequest;
          expect(rejectedRequest.rejectedAt).not.toBeNull();
          expect(rejectedRequest.status).toBe(BorrowStatus.rejected);
          expect(rejectedRequest.rejectionReason).toEqual(rejectionReason);
        });
      });

      describe('failed', () => {
        describe('wrong borrow id', () => {
          it('', async () => {
            const res = await request(server)
              .patch('/borrows/' + 0 + '/process')
              .send({
                type: UpdateBorrowProcessType.reject,
              });
            expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
            expect(res.body.message).toContain('No BorrowRequest found');
          });
        });

        describe('request can not be rejected', () => {
          beforeEach(async () => {
            await setAsUsingBorrow(borrowRequest.id);
          });

          it('', async () => {
            const res = await request(server)
              .patch('/borrows/' + borrowRequest.id + '/process')
              .send({
                type: UpdateBorrowProcessType.reject,
              });
            expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(res.body.message).toEqual('Can not reject this request');
          });
        });
      });
    });

    describe('request return', () => {
      describe('success', () => {
        beforeEach(async () => {
          user = await prisma.user.findUnique({
            where: {
              email: MOCK_ADMIN_EMAIL,
            },
          });
          borrowRequest = await createBorrowRequest(user, device);
          await setAsUsingBorrow(borrowRequest.id);
        });

        it('', async () => {
          const res = await request(server)
            .patch('/borrows/' + borrowRequest.id + '/process')
            .send({
              type: UpdateBorrowProcessType.requestReturn,
            });
          expect(res.statusCode).toBe(HttpStatus.ACCEPTED);
          const requestReturn = res.body as BorrowRequest;
          expect(requestReturn.status).toBe(BorrowStatus.returnConfirm);
        });
      });

      describe('failed', () => {
        describe('status is not using', () => {
          beforeEach(async () => {
            user = await prisma.user.findUnique({
              where: {
                email: MOCK_ADMIN_EMAIL,
              },
            });
            borrowRequest = await createBorrowRequest(user, device);
          });

          it('', async () => {
            const res = await request(server)
              .patch('/borrows/' + borrowRequest.id + '/process')
              .send({
                type: UpdateBorrowProcessType.requestReturn,
              });
            expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(res.body.message).toContain('Can not request return this borrow request');
          });
        });

        describe('user is not request owner', () => {
          beforeEach(async () => {
            await setAsUsingBorrow(borrowRequest.id);
          });

          it('', async () => {
            const res = await request(server)
              .patch('/borrows/' + borrowRequest.id + '/process')
              .send({
                type: UpdateBorrowProcessType.requestReturn,
              });
            expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
            expect(res.body.message).toContain('User is not request owner');
          });
        });
      });
    });

    describe('confirm return', () => {
      describe('success', () => {
        beforeEach(async () => {
          await setAsReturningBorrow(borrowRequest.id);
        });

        it('', async () => {
          const res = await request(server)
            .patch('/borrows/' + borrowRequest.id + '/process')
            .send({
              type: UpdateBorrowProcessType.confirmReturn,
            });
          expect(res.statusCode).toBe(HttpStatus.ACCEPTED);
          const borrow = res.body as BorrowRequest;
          expect(borrow.status).toBe(BorrowStatus.returned);
          expect(borrow.returnedAt).not.toBeNull();
        });
      });

      describe('failed', () => {
        describe('can not confirm return', () => {
          beforeEach(async () => {
            await setAsUsingBorrow(borrowRequest.id);
          });

          it('', async () => {
            const res = await request(server)
              .patch('/borrows/' + borrowRequest.id + '/process')
              .send({
                type: UpdateBorrowProcessType.confirmReturn,
              });
            expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
            expect(res.body.message).toContain('Can not confirm return this borrow request');
          });
        });
      });
    });
  });
});
