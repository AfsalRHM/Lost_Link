import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  CustomSocketData,
  TypedSocket,
} from "./socketTypes";

import NotificationService from "../services/notificationService";

let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  CustomSocketData
>;

export const initializeSocket = (server: any) => {
  const notificationService = new NotificationService();

  io = new Server(server, {
    cors: {
      origin: ["https://lostlink.live", "https://www.lostlink.live"],
      credentials: true,
    },
    path: "/socket.io/",
  });

  console.log("Socket.IO initialized", "path: /notif/socket.io/");

  io.on("connection", (socket: TypedSocket) => {
    console.log("User connected:", socket.id); // temperory
    // Setting Up the Socket
    socket.on("setup", (userId: string) => {
      socket.join(userId);
      socket.emit("notificationConnected", userId);
    });

    // Joining the Room for Notifications
    socket.on("joinRoom", (room) => {
      socket.join(room);
      socket.emit("userNotificationJoined", room, socket.id);
    });

    socket.on("newUserMessage", async (newMessageRecieved) => {
      const notificationData = await notificationService.createNotification(
        newMessageRecieved
      );
      socket.to("admin").emit("adminNewNotification", notificationData.data);
    });

    socket.on("newAdminMessage", async (newMessageRecieved) => {
      const notificationData = await notificationService.createNotification(
        newMessageRecieved
      );
      socket.to("admin").emit("userNewNotification", notificationData.data);
    });

    // To disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized");
  return io;
};
