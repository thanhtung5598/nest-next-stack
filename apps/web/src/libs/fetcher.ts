import { getCookie } from 'cookies-next';
import { COOKIE_KEYS } from './enum';

export enum ErrorCode {}

type RequestInitOptions = RequestInit & {
  excludedError?: ErrorCode[];
};

function fetchData<T = JSON>(input: RequestInfo | URL, init?: RequestInitOptions): Promise<T> {
  const token = getCookie(COOKIE_KEYS.TOKEN);

  const headers = {
    ...(init?.headers ?? { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(input, {
    ...init,
    headers,
  })
    .then(async (res) => {
      if (res.status === 204) return Promise.resolve();
      return res?.ok ? res?.json() : Promise.reject(res);
    })
    .catch((err) => Promise.reject(err));
}

export function fetcher<T = JSON>(input: RequestInfo | URL, init?: RequestInitOptions): Promise<T> {
  return fetchData<T>(input, init);
}
