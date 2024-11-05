import { UserRole } from '@prisma/client';

export class TokenAsyncDto {
  id: string;
  role: UserRole;
}
