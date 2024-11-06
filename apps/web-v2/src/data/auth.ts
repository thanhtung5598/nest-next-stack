import { env } from '@/libs/constant';
import { fetcher } from '@/libs/fetcher';

export type AuthMethod = 'google';

type GetAuthRes = {
  authorizeLink: string;
  codeVerifier: string;
};

type LoginReq = {
  code: string;
};

type LoginRes = {
  accessToken: {
    expiresIn: number;
    token: string;
  };
  refreshToken: {
    expiresIn: number;
    token: string;
  };
};
class AuthService {
  public baseUrl = `${env?.basePath}/api/auth/google`;

  public getAuthLink() {
    return fetcher<GetAuthRes>(`${this.baseUrl}/authorize-link`);
  }

  public login({ code }: LoginReq) {
    return fetcher<LoginRes>(`${this.baseUrl}/login`, {
      method: 'POST',
      body: JSON.stringify({
        code: code,
      }),
    });
  }

  public logout() {
    return fetcher<LoginRes>(`${this.baseUrl}/logout`, {
      method: 'POST',
    });
  }
}

export const authService = new AuthService();
