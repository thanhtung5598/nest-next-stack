import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublicApi';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
