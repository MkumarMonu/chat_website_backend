import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDb } from "./config/db.js";
import { userRouter } from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";
import requestRouter from "./src/routes/request.route.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    origin:"https://chat-website-mv79.vercel.app/",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/send", requestRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

connectToDb()
  .then(() => {
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(() => {
    console.log("connection failed");
  });
