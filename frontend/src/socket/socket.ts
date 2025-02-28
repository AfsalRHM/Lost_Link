import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const SOCKET_NOTIF_URL = import.meta.env.VITE_SOCKET_NOTIF_URL;

let chatSocket: Socket;
let notifSocket: Socket;

export const getSocket = () => {
  if (!chatSocket) {
    chatSocket = io(SOCKET_URL, {
      withCredentials: true,
    });
  }
  return chatSocket;
};

export const getNotifSocket = () => {
  if (!notifSocket) {
    notifSocket = io(SOCKET_NOTIF_URL, {
      withCredentials: true,
    });
  }
  return notifSocket;
};
