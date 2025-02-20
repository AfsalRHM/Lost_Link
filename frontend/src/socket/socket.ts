import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
    });
  }
  return socket;
};
