import { Module } from '@nestjs/common';
import { BrandsController } from './brand.controller';
import { BrandsService } from './brand.service';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
