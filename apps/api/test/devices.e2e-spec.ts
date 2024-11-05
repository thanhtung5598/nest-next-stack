import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { DevicesModule } from '@/devices/devices.module';
import { SharedModule } from '@/libs/shared/shared.module';
import { ConfigModule } from '@nestjs/config';
import request from 'supertest';
import { addDeviceForUser, clearDevices, createDevice } from '@/libs/test/factories/device.factory';
import { Device, DeviceStatus, User, UsingStatus } from '@prisma/client';
import { setupNestApplication } from '@/libs/utils/nest-application-setup';
import { GetDevicesResponseDto } from '@/devices/dtos/device.dto';
import { faker } from '@faker-js/faker/.';
import { prismaInstance } from '@repo/db';
import { PrismaService } from '@/libs/shared/services/prisma.service';
import { OrderDirection } from '@/libs/commons/enum';
import {
  MockAdminUserMiddleware,
  MOCK_ADMIN_EMAIL,
} from '@/libs/test/middlewares/mock-admin-user.middleware';
import { DeviceUsingStatus } from '@/devices/dtos/device.dto';
import { createBorrowRequest } from '@/libs/test/factories/borrow.factory';
import { clearPrismaModelData } from '@/libs/test/helper';

describe('DevicesController (e2e)', () => {
  let app: INestApplication;
  let server: any;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '../.env.test',
        }),
        DevicesModule,
        SharedModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupNestApplication(app);
    app.use(new MockAdminUserMiddleware().use);
    await app.init();
    server = app.getHttpServer();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await clearDevices();
  });

  describe('/devices/:id (GET)', () => {
    let device: Device;
    let user: User;

    beforeEach(async () => {
      device = await createDevice();
      user = await prisma.user.findFirst();
    });

    describe('get device successful', () => {
      describe('using device', () => {
        beforeEach(async () => {
          await addDeviceForUser(device.id, user.id);
        });

        it('', async () => {
          const res = await request(server).get('/devices/' + device.id);
          expect(res.statusCode).toBe(HttpStatus.OK);
          const parsedDevice = res.body;
          expect(parsedDevice.id).toBe(device.id);
          expect(parsedDevice.userOwner.id).toBe(user.id);
          expect(parsedDevice.usingStatus).toBe(DeviceUsingStatus.using);
        });
      });

      describe('available device', () => {
        it('', async () => {
          const res = await request(server).get('/devices/' + device.id);
          expect(res.statusCode).toBe(HttpStatus.OK);
          const parsedDevice = res.body;
          expect(parsedDevice.id).toBe(device.id);
          expect(parsedDevice.usingStatus).toBe(DeviceUsingStatus.available);
        });
      });

      describe('requesting device', () => {
        beforeEach(async () => {
          await createBorrowRequest(user, device);
        });
        it('', async () => {
          const res = await request(server).get('/devices/' + device.id);
          expect(res.statusCode).toBe(HttpStatus.OK);
          const parsedDevice = res.body;
          expect(parsedDevice.id).toBe(device.id);
          expect(parsedDevice.usingStatus).toBe(DeviceUsingStatus.requesting);
        });
      });
    });

    it('return record not found error', async () => {
      const id = device.id + 1;
      const res = await request(server).get('/devices/' + id);
      expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(res.body.message).toContain('No Device found');
    });
  });

  describe('/devices (GET)', () => {
    let devices: Device[];
    const deviceCount = 5;
    beforeEach(async () => {
      devices = await Promise.all(
        Array.from({ length: deviceCount }).map(async () => await createDevice()),
      );
    });

    it('return a list of devices with pagination', async () => {
      const res = await request(server).get('/devices/');
      expect(res.statusCode).toBe(HttpStatus.OK);
      const { pagination, data } = res.body as GetDevicesResponseDto;
      expect(data.length).toBe(deviceCount);
      expect(pagination.total).toBe(deviceCount);
      expect(pagination.currentPage).toBe(1);
    });

    describe('with keyword search', () => {
      let device: Device;

      beforeEach(async () => {
        device = await createDevice({
          data: {
            name: 'Device include keyword in name',
          },
        });
      });

      it('return matched devices and pagination', async () => {
        const keyword = 'keyword';
        const res = await request(server).get('/devices/').query({ keyword });
        const { data } = res.body as GetDevicesResponseDto;
        expect(data[0].name).toContain(keyword);
      });
    });

    describe('filter with status', () => {
      let expectedDevice: Device;

      beforeEach(async () => {
        expectedDevice = await prisma.device.update({
          where: {
            id: devices[0].id,
          },
          data: {
            status: DeviceStatus.maintenance,
          },
        });
      });

      it('', async () => {
        const res = await request(server)
          .get('/devices/')
          .query({ status: DeviceStatus.maintenance });
        const { data: responseDevices } = res.body as GetDevicesResponseDto;
        expect(responseDevices[0].id).toEqual(expectedDevice.id);
        expect(responseDevices[0].status).toEqual(DeviceStatus.maintenance);
      });
    });

    describe('filter with using status', () => {
      let device: Device;
      let user: User;

      beforeEach(async () => {
        device = await createDevice({
          data: {
            name: 'Device include keyword in name',
          },
        });
        user = await prisma.user.findFirst({});
      });

      describe('using', () => {
        beforeEach(async () => {
          await clearPrismaModelData(prismaInstance.userDevice);
          await clearPrismaModelData(prismaInstance.borrowRequest);
        });

        describe('keep by user', () => {
          beforeEach(async () => {
            await addDeviceForUser(device.id, user.id);
          });

          it('', async () => {
            const res = await request(server)
              .get('/devices/')
              .query({ usingStatus: DeviceUsingStatus.using });
            const { data: responseDevices } = res.body as GetDevicesResponseDto;
            expect(responseDevices[0].usingStatus).toEqual(DeviceUsingStatus.using);
          });
        });

        describe('borrowing by user', () => {
          beforeEach(async () => {
            await createBorrowRequest(user, device, {
              status: UsingStatus.using,
            });
          });

          it('', async () => {
            const res = await request(server)
              .get('/devices/')
              .query({ usingStatus: DeviceUsingStatus.using });
            const { data: responseDevices } = res.body as GetDevicesResponseDto;
            expect(responseDevices[0].usingStatus).toEqual(DeviceUsingStatus.using);
          });
        });
      });

      describe('requesting', () => {
        beforeEach(async () => {
          await createBorrowRequest(user, device);
        });

        it('', async () => {
          const res = await request(server)
            .get('/devices/')
            .query({ usingStatus: DeviceUsingStatus.requesting });
          const { data: responseDevices } = res.body as GetDevicesResponseDto;
          expect(responseDevices[0].usingStatus).toEqual(DeviceUsingStatus.requesting);
        });
      });

      describe('available', () => {
        it('', async () => {
          const res = await request(server)
            .get('/devices/')
            .query({ usingStatus: DeviceUsingStatus.available });
          const { data: responseDevices } = res.body as GetDevicesResponseDto;
          expect(responseDevices[0].usingStatus).toEqual(DeviceUsingStatus.available);
        });
      });
    });

    describe('with price order', () => {
      it('', async () => {
        const res = await request(server)
          .get('/devices/')
          .query({ sortField: 'price', sortOrder: OrderDirection.ASC });
        expect(res.statusCode).toBe(HttpStatus.OK);
        const { data: responseDevices } = res.body as GetDevicesResponseDto;
        const devicePrices = responseDevices.map(({ price }) => price);

        const isPriceIncreasing = devicePrices.every((v, i) => i === 0 || v >= devicePrices[i - 1]);
        expect(isPriceIncreasing).toBe(true);
      });
    });

    describe('with buyAt order', () => {
      it('', async () => {
        const res = await request(server)
          .get('/devices/')
          .query({ sortField: 'buyAt', sortOrder: OrderDirection.ASC });
        expect(res.statusCode).toBe(HttpStatus.OK);
        const { data: responseDevices } = res.body as GetDevicesResponseDto;
        const deviceBuyTimes = responseDevices.map(({ buyAt }) => new Date(buyAt).getTime());

        const isPriceIncreasing = deviceBuyTimes.every(
          (v, i) => i === 0 || v >= deviceBuyTimes[i - 1],
        );
        expect(isPriceIncreasing).toBe(true);
      });
    });
  });

  describe('/devices (POST)', () => {
    it('should create a new device', async () => {
      const brand = await prisma.brand.findFirst({ select: { id: true } });

      const params = {
        name: faker.commerce.productName(),
        serialNumber: faker.string.sample(),
        status: DeviceStatus.in_stock,
        sku: faker.string.sample(),
        price: faker.number.int({ min: 10000, max: 10000000 }),
        priceVat: faker.number.int({ min: 10000, max: 10000000 }),
        note: faker.lorem.sentence(),
        imageUrl: faker.image.urlLoremFlickr(),
        categoryId: 1,
        buyAt: faker.date.past(),
        usedAt: faker.date.past(),
        expiredWarrantyAt: faker.date.past(),
        brandId: brand?.id,
        model: faker.string.sample(),
      };

      const res = await request(server).post('/devices/').send(params);
      expect(res.statusCode).toBe(HttpStatus.CREATED);
      const data = res.body;
      expect(data.name).toEqual(params.name);
      expect(data.usingStatus).toEqual(DeviceUsingStatus.available);
    });

    describe('create failed', () => {
      let device: Device;

      beforeEach(async () => {
        device = await createDevice();
      });

      const defaultParams = {
        name: faker.commerce.productName(),
        status: DeviceStatus.in_stock,
        price: null,
        priceVat: null,
        note: faker.lorem.sentence(),
        imageUrl: faker.image.urlLoremFlickr(),
        categoryId: 1,
        sku: faker.string.sample(),
        serialNumber: faker.string.sample(),
        buyAt: faker.date.past(),
        usedAt: faker.date.past(),
        expiredWarrantyAt: faker.date.past(),
      };

      describe('SKU has existed', () => {
        it('', async () => {
          const params = { ...defaultParams, sku: device.sku };

          const res = await request(server).post('/devices/').send(params);
          expect(res.statusCode).toBe(HttpStatus.CONFLICT);
          expect(res.body.message).toContain('sku');
        });
      });

      describe('serial number has existed', () => {
        it('', async () => {
          const params = { ...defaultParams, serialNumber: device.serialNumber };

          const res = await request(server).post('/devices/').send(params);
          expect(res.statusCode).toBe(HttpStatus.CONFLICT);
          expect(res.body.message).toContain('serial_number');
        });
      });

      describe('category is not exist', () => {
        it('', async () => {
          const params = { ...defaultParams, categoryId: 0 };
          const res = await request(server).post('/devices/').send(params);
          expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
          expect(res.body.message).toContain('No Category found');
        });
      });

      describe('brand is not exist', () => {
        it('', async () => {
          const params = { ...defaultParams, brandId: 0 };
          const res = await request(server).post('/devices/').send(params);
          expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
          expect(res.body.message).toContain('No Brand found');
        });
      });

      describe('sku and serial number are not valid', () => {
        it('', async () => {
          const params = {
            ...defaultParams,
            sku: 'foo bar',
            serialNumber: 'foo bar',
          };

          const res = await request(server).post('/devices/').send(params);
          expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
          expect(res.body.message.length).toBe(2);
        });
      });
    });
  });

  describe('/devices/:id (PATCH)', () => {
    let device: Device;
    const defaultParams = {
      name: faker.commerce.productName(),
    };

    beforeEach(async () => {
      device = await createDevice({
        include: { category: true },
      });
    });

    describe('update success', () => {
      it('return the updated device', async () => {
        const params = {
          ...defaultParams,
          status: DeviceStatus.maintenance,
        };
        const res = await request(server)
          .patch('/devices/' + device.id)
          .send(params);
        expect(res.statusCode).toBe(HttpStatus.OK);
        const data = res.body;
        expect(data.id).toBe(device.id);
        expect(data.name).toBe(params.name);
        expect(data.name).not.toEqual(device.name);
        expect(data.status).toEqual(DeviceStatus.maintenance);
        const updatedDevice = await prismaInstance.device.findUnique({
          where: { id: device.id },
          select: {
            updatedAt: true,
          },
        });

        expect(updatedDevice.updatedAt).not.toEqual(device.updatedAt);
      });

      describe('update category', () => {
        it('', async () => {
          const newCategory = await prismaInstance.category.findFirst({
            where: {
              NOT: {
                id: device.categoryId,
              },
            },
          });

          const params = {
            ...defaultParams,
            categoryId: newCategory.id,
          };
          const res = await request(server)
            .patch('/devices/' + device.id)
            .send(params);
          expect(res.statusCode).toBe(HttpStatus.OK);
          const data = res.body;
          expect(data.id).toBe(device.id);
          expect(data.category.id).toBe(newCategory.id);
        });
      });

      describe('update brand', () => {
        it('', async () => {
          const newBrand = await prismaInstance.brand.findFirst({
            where: !!device.brandId
              ? {
                  NOT: {
                    id: device.brandId,
                  },
                }
              : {},
          });

          const params = {
            ...defaultParams,
            brandId: newBrand.id,
          };
          const res = await request(server)
            .patch('/devices/' + device.id)
            .send(params);
          expect(res.statusCode).toBe(HttpStatus.OK);
          const data = res.body;
          expect(data.id).toBe(device.id);
          expect(data.brand.id).toBe(newBrand.id);
        });
      });
    });

    describe('update failed', () => {
      describe('wrong device id', () => {
        it('', async () => {
          const params = {
            ...defaultParams,
          };
          const id = device.id + 1;
          const res = await request(server)
            .post('/devices/' + id)
            .send(params);
          expect(res.statusCode).toBe(HttpStatus.NOT_FOUND);
        });
      });
    });
  });

  describe('/available (GET)', () => {
    let devices: Device[];
    let deviceCount = 5;
    let user: User;

    beforeEach(async () => {
      devices = await Promise.all(Array.from({ length: deviceCount }).map(() => createDevice()));
      user = await prismaInstance.user.findFirst();
      await addDeviceForUser(devices[0].id, user.id);
    });

    describe('get available success', () => {
      it('', async () => {
        const params = {};
        const res = await request(server).get('/devices/available').send(params);
        expect(res.statusCode).toBe(HttpStatus.OK);
        const { data } = res.body;
        expect(data.length).toBe(deviceCount - 1);
        const availableIds = data.map((_) => _.id);
        expect(availableIds).not.toContain(devices[0].id);
      });
    });
  });

  describe('/borrowable (GET)', () => {
    let devices: Device[];
    let deviceCount = 5;
    let currentUser: User;
    let user2: User;

    beforeEach(async () => {
      devices = await Promise.all(Array.from({ length: deviceCount }).map(() => createDevice()));
      currentUser = await prismaInstance.user.findFirst({
        where: {
          email: MOCK_ADMIN_EMAIL,
        },
      });
      await addDeviceForUser(devices[0].id, currentUser.id);
      user2 = await prismaInstance.user.findFirst({
        where: {
          NOT: {
            id: currentUser.id,
          },
        },
      });
      await addDeviceForUser(devices[1].id, user2.id);
    });

    describe('get borrowable success', () => {
      it('result include user owner device', async () => {
        const params = {};
        const res = await request(server).get('/devices/borrowable').send(params);
        expect(res.statusCode).toBe(HttpStatus.OK);
        const { data } = res.body;
        expect(data.length).toBe(deviceCount - 1);
        const borrowableIds = data.map((_) => _.id);
        expect(borrowableIds).toContain(devices[0].id);
        expect(borrowableIds).not.toContain(devices[1].id);
      });
    });
  });
});
