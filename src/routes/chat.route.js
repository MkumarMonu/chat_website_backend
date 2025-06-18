import express from "express";
import { getChat } from "../controllers/chat.controller.js";

const chatRouter = express.Router();
chatRouter.route("/chatHistory/:targetUserId").get(getChat);

export { chatRouter };
