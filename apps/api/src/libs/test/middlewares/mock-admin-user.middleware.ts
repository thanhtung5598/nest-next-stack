import { Injectable, NestMiddleware } from '@nestjs/common';
import { prismaInstance } from '@repo/db';
import { NextFunction } from 'express';

export const MOCK_ADMIN_EMAIL = 'admin_test@example.com';

@Injectable()
export class MockAdminUserMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const admin = await prismaInstance.user.findFirst({
      where: {
        email: MOCK_ADMIN_EMAIL,
      },
      select: {
        id: true,
        role: true,
      },
    });

    req['user'] = {
      id: admin.id,
      role: admin.role,
    };

    next();
  }
}
