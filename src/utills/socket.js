import { Server } from "socket.io";
import { Chat } from "../models/chat.model.js";

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-website-mv79.vercel.app",
  "https://chat-website-woad.vercel.app/",
];

export const initilizeSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST", "DELETE", "PUT"],
    },
  });

  io.on("connection", (socket) => {
    console.log("successfully connected :");
    socket.onAny((event, ...args) => {
      console.log(`🔥 Event received: ${event}`, args);
    });
    socket.on("joinChat", async (senderName, userId, targetUserId) => {
      const uniqueRoomId = [userId, targetUserId].sort().join("$");
      socket.join(uniqueRoomId);
    });

    socket.on(
      "sendMessage",
      async (senderName, userId, message, targetUserId) => {
        // console.log("sender name :", senderName, userId, message, targetUserId);
        try {
          const uniqueRoomId = [userId, targetUserId].sort().join("$");
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({ message, senderId: userId });

          await chat.save();

          io.to(uniqueRoomId).emit("messageRecieved", {
            message,
            senderId: userId,
            senderName,
          });
        } catch (error) {
          console.log(error);
        }
      }
    );
    socket.on("disconnect", () => {});
  });
};
