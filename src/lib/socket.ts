// socket.ts
import { io, Socket } from 'socket.io-client';

export const socket: Socket = io('http://localhost:1337', {
  transports: ['websocket'],
});

