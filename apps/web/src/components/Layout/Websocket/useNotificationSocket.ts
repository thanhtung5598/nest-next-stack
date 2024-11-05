import { useState } from 'react';
import { createWebSocketStore } from '.';
import { INotification, useFetchNotifications } from '@/data/notifications';

type MessageFromServer =
  | {
      type: 'new-notification';
      data: INotification;
    }
  | {
      type: 'mark-as-read-success';
      data: { id: number };
    };

export function useNotificationSocket() {
  // const { data: listNotification } = useFetchNotifications();
  const [newNotifications, setNewNotifications] = useState<INotification[]>([]);

  createWebSocketStore({
    onCallback: (socket) => {
      if (socket) {
        socket.on('notification', (payload: MessageFromServer) => {
          console.log('payload', payload);

          switch (payload.type) {
            case 'new-notification':
              const { data } = payload;
              setNewNotifications((prevNotifications) => [data, ...prevNotifications]);
              break;

            case 'mark-as-read-success':
              break;

            default:
              break;
          }
        });
      }
    },
  });

  return { data: [...newNotifications] } as const;
}
