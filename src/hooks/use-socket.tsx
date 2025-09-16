import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { socket } from '../lib/socket';

interface Notification {
  message: string;
  title?: string;
}

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    socket.on('notification', (data: Notification) => {
      console.log('Received notification', data);
      setNotifications((prev) => [...prev, data]);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket.IO connection error', err);
    });
  }, []);

  return { connected, notifications, socket };
};

