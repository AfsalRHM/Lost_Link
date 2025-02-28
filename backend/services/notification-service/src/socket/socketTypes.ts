import { Socket } from "socket.io";

// Client emits these events to the server
export interface ClientToServerEvents {
  setup: (userId: string) => void;
  joinRoom: (room: string) => void;
  newUserMessage: (newMessageRecieved: any) => void;
  newAdminMessage: (newMessageRecieved: any) => void;
}

// Server emits these events to the client
export interface ServerToClientEvents {
  notificationConnected: (userId: string) => void;
  adminNewNotification: (newMessageRecieved: any) => void;
  userNewNotification: (newMessageRecieved: any) => void;
  userNotificationJoined: (room: string, userId: string) => void;
}

// Events for server-to-server communication (optional)
export interface InterServerEvents {
  ping: () => void;
}

// Custom properties on the socket (e.g., user info)
export interface CustomSocketData {
  userId?: string;
}

// Typed socket instance
export type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  CustomSocketData
>;
