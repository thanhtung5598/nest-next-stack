import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from './libs/shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DevicesModule } from './devices/devices.module';
import { BorrowsModule } from './borrows/borrows.module';
import { UploadModule } from './upload/upload.module';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from './notifications/notifications.module';
import { CategoriesModule } from './categories/categories.module';
import { DepartmentsModule } from './departments/departments.module';
import { BrandsModule } from './brands/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    SharedModule,
    AuthModule,
    UsersModule,
    DevicesModule,
    BorrowsModule,
    CategoriesModule,
    DepartmentsModule,
    BrandsModule,
    UploadModule,
    NotificationsModule,
  ],
  controllers: [],
})
export class AppModule {}
