import express from "express";
import { getYourConnections } from "../controllers/connection.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

const connectionRouter = express.Router();

connectionRouter
  .route("/connections")
  .get(authenticateUser, getYourConnections);

export { connectionRouter };
