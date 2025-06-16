import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { connectToDb } from "./config/db.js";
import { userRouter } from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import requestRouter from "./src/routes/request.route.js";

dotenv.config();
const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     origin:"https://chat-website-mv79.vercel.app/",
//     credentials: true,
//   })
// );
const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-website-mv79.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/send", requestRouter);
import { Chat } from "./src/models/chat.model.js";
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
import { Server } from "socket.io";
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
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

    console.log(uniqueRoomId, "unique room id for join chat message");
    socket.join(uniqueRoomId);
  });

  socket.on(
    "sendMessage",
    async (senderName, userId, message, targetUserId) => {
      console.log("sender name :", senderName, userId, message, targetUserId);
      try {
        const uniqueRoomId = [userId, targetUserId].sort().join("$");
        // const chat = await Chat.findOne({
        //   participants: { $or: [userId, targetUserId] },
        // });
        let chat = await Chat.findOne({
          $or: [
            { participants: [userId, targetUserId] },
            { participants: [targetUserId, userId] },
          ],
        });
        if (!chat) {
          chat = new Chat({
            participants: [userId, targetUserId],
            messages: [],
          });
        }
        chat.messages.push({ message, senderId: userId });

        await chat.save();

        io.to(uniqueRoomId).emit("messageRecieved", { message });
      } catch (error) {
        console.log(error);
      }
    }
  );
  socket.on("disconnect", () => {});
});
connectToDb()
  .then(() => {
    const port = process.env.PORT;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(() => {
    console.log("connection failed");
  });
