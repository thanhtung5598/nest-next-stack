'use client';

import React, { useState, ChangeEvent, useRef } from 'react';
import { useNotifications } from '@toolpad/core';
import { Avatar as MuiAvatar, IconButton, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

type AvatarUploadProps = {
  avatar?: string;
  acceptedFileTypes: string[];
  maxSize: number;
  onComplete: (file: File) => void;
};

export function AvatarUpload(props: AvatarUploadProps) {
  const { avatar, acceptedFileTypes, maxSize, onComplete } = props;

  const notifications = useNotifications();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const _handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    validFileTypes: string[],
    maxSize: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validFileTypes.includes(file.type)) {
        notifications.show(`Wrong file type ${validFileTypes.join(', ')}`, { severity: 'error' });
        return;
      }

      const maxSizeBytes = maxSize * 1024 * 1024; // convert to MB

      if (file.size > maxSizeBytes) {
        notifications.show(`File size must be less than ${maxSize}`, { severity: 'error' });
        return;
      }

      onComplete?.(file);

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-fit">
      <Typography variant="subtitle1" gutterBottom className="text-gray-400 text-sm">
        Your Avatar
      </Typography>
      <input
        type="file"
        accept={acceptedFileTypes.join(',')}
        onChange={(e) => _handleFileChange(e, acceptedFileTypes, maxSize)}
        className="hidden"
        ref={fileInputRef}
      />
      <IconButton
        aria-label="upload"
        className="relative flex items-center justify-center rounded-md"
        onClick={() => fileInputRef.current?.click()}
      >
        <MuiAvatar
          src={preview || avatar}
          alt="Avatar"
          className="rounded-md"
          sx={{ width: 80, height: 80, opacity: 0.7 }}
        />
        <UploadIcon
          sx={{
            position: 'absolute',
            fontSize: '26px',
            color: '#fff',
          }}
        />
      </IconButton>
    </div>
  );
}
