import dayjs from 'dayjs';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function pathParser(path: string, slug?: number | number[] | string | string[]) {
  const slugs = [slug].flat();
  const replacedPath =
    slugs.reduce((obj: string, item) => obj?.replace(/\[\w+\]/, item?.toString() ?? ''), path) ??
    '';
  return replacedPath
    ?.toString()
    ?.replace(/\/(\/)+/g, '/')
    .replace(/\/$/g, '');
}

export const formatVND = (value: number | undefined) =>
  value ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) : '';

export const formatDate = (dayString: string) => {
  if (!dayString) return;

  return dayjs(dayString).format('YYYY-MM-DD');
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
