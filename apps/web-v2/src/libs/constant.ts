import { ROUTE } from './enum';

export const ENV_NAME = process.env.NEXT_PUBLIC_NODE_ENV?.toString() ?? 'development';

export const env = {
  development: {
    basePath: 'http://localhost:3000',
  },
}[ENV_NAME];

export const routeType: Record<string, (string | RegExp)[]> = {
  protected: [ROUTE.LOGIN],
};

export const isDevEnv = () => {
  return ['development'].includes(ENV_NAME);
};

export const ASSETS = {
  FALLBACK_AVATAR: `/static/users/default_avatar.png`,
};

export const UPLOAD_AVATAR_ACCEPTED_FILE_TYPES = ['image/jpg', 'image/png', 'image/jpeg'];

export const MAX_FILE_SIZE = 5; // 5MB
