import express from "express";
import { getChat } from "../controllers/chat.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

const chatRouter = express.Router();
chatRouter.route("/chatHistory/:targetUserId").get(authenticateUser, getChat);

export { chatRouter };
