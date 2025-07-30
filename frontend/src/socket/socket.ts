import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_NODE_ENV == "Development"
    ? import.meta.env.VITE_SOCKET_URL_DEV
    : import.meta.env.VITE_SOCKET_URL;
const SOCKET_NOTIF_URL =
  import.meta.env.VITE_NODE_ENV == "Development"
    ? import.meta.env.VITE_SOCKET_NOTIF_URL_DEV
    : import.meta.env.VITE_SOCKET_NOTIF_URL;

if (!SOCKET_URL || !SOCKET_NOTIF_URL) {
  console.log(
    "Missing required environment variables. Please check your .env file - From socket.ts"
  );
}

let chatSocket: Socket;
let notifSocket: Socket;

export const getSocket = () => {
  if (!chatSocket) {
    chatSocket = io(SOCKET_URL, {
      withCredentials: true,
      secure: false,
      transports: ["websocket"],
      path: "/chat/socket.io/",
    });
  }
  return chatSocket;
};

export const getNotifSocket = () => {
  if (!notifSocket) {
    notifSocket = io(SOCKET_NOTIF_URL, {
      withCredentials: true,
      secure: false,
      transports: ["websocket"],
      path: "/notif/socket.io/",
    });
  }
  return notifSocket;
};
