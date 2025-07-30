import { Server } from "socket.io";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  CustomSocketData,
  TypedSocket,
} from "./socketTypes";

let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  CustomSocketData
>;

const CORS_ORIGINS = process.env.CORS_ORIGINS;

if (!CORS_ORIGINS) {
  console.log(
    "Missing required environment variables. Please check your .env file - From socket.ts"
  );
}

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: CORS_ORIGINS?.split(","),
      credentials: true,
    },
    path: "/chat/socket.io/",
  });

  console.log("Socket.IO initialized");

  io.on("connection", (socket: TypedSocket) => {
    // Setting Up the Socket
    socket.on("setup", (userId: string) => {
      socket.join(userId);
      socket.emit("connected", userId);
    });

    // Joining the Room for Chat
    socket.on("joinRoom", (room) => {
      socket.join(room);
      socket.emit("userJoined", room, socket.id);
    });

    socket.on("newUserMessage", (newMessageRecieved) => {
      const chatId = newMessageRecieved.chat;
      socket.to(chatId).emit("userMessageRecieved", newMessageRecieved);
    });

    socket.on("newAdminMessage", (newMessageRecieved) => {
      const chatId = newMessageRecieved.chat;
      socket.to(chatId).emit("adminMessageRecieved", newMessageRecieved);
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
