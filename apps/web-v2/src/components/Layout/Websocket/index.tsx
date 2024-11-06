import { COOKIE_KEYS } from '@/libs/enum';
import { getCookie } from 'cookies-next';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

// type MessageFromServer = {
//   type: 'update';
//   data: any;
// };

// type MessageToServer = {
//   type: 'increment' | 'reset';
// };

type CreateWebSocketStoreOptions = {
  onCallback: (socket: Socket | null) => void;
};

export function createWebSocketStore(options?: CreateWebSocketStoreOptions) {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  const { onCallback } = options || {};

  if (!socketUrl) {
    throw new Error('Socket.IO URL is not defined');
  }

  let socket: Socket | null = null;

  useEffect(() => {
    socket = io(socketUrl, {
      auth: {
        token: getCookie(COOKIE_KEYS.TOKEN),
      },
    });

    socket.on('connect', () => console.log('Socket.IO connected'));
    socket.on('disconnect', () => console.log('Socket.IO disconnected'));

    return () => {
      socket?.disconnect();
    };
  }, [socketUrl]);

  useEffect(() => {
    if (socket && onCallback) {
      onCallback(socket);
    }
  }, []);
}
