import { ASSETS } from '@/libs/constant';
import { ImgHTMLAttributes } from 'react';

type AvatarProps = {
  avatarFallback?: string;
} & ImgHTMLAttributes<HTMLImageElement>;

export function Avatar({
  src,
  alt = 'avatar',
  className,
  avatarFallback = ASSETS.FALLBACK_AVATAR,
  ...innerProps
}: AvatarProps) {
  return (
    <img
      src={src || avatarFallback}
      className={className}
      alt={alt}
      onError={(e) => ((e.target as HTMLImageElement).src = avatarFallback)}
      {...innerProps}
    />
  );
}
