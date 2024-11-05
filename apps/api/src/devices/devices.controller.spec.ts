import { Test, TestingModule } from '@nestjs/testing';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { PrismaService } from '@/libs/shared/services/prisma.service';

describe('DevicesController', () => {
  let controller: DevicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicesController],
      providers: [DevicesService, PrismaService],
    }).compile();

    controller = module.get<DevicesController>(DevicesController);
  });

  it('should define', async () => {
    expect(controller).toBeDefined();
  });
});
