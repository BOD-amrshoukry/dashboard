import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (userId: number) => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<
    { message: string; title?: string }[]
  >([]);

  useEffect(() => {
    const socket = io('http://localhost:1337', { transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO', socket.id);
      setConnected(true);
      socket.emit('joinRoom', userId);
    });

    socket.on('notification', (data) => {
      console.log('Received notification', data);
      setNotifications((prev) => [...prev, data]);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error', err);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return { connected, notifications };
};

