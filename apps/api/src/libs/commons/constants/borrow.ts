import { UsingStatus } from '@prisma/client';

export const IN_PROCESS_BORROW_STATUSES = [
  UsingStatus.using,
  UsingStatus.requesting,
  UsingStatus.returning,
];

export const IN_KEEPING_DEVICE_STATUSES = [UsingStatus.using, UsingStatus.returning];
