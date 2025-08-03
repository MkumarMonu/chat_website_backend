import express from "express";
import dotenv from "dotenv";
import http from "http";
import cors from "cors";
import { connectToDb } from "./config/db.js";
import { userRouter } from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import requestRouter from "./src/routes/request.route.js";
import { initilizeSocketServer } from "./src/utills/socket.js";
import { chatRouter } from "./src/routes/chat.route.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-website-mv79.vercel.app",
  "https://chat-website-woad.vercel.app/",
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
app.use("/api/v1/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("app is healthy!");
});

const server = http.createServer(app);
initilizeSocketServer(server);

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
