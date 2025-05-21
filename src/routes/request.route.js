import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { reviewRequest, sendRequest } from "../controllers/request.controller.js";

const requestRouter = express.Router();

requestRouter
  .route("/request/:status/:toUserId")
  .post(authenticateUser, sendRequest);

  requestRouter
  .route("review/request/:status/:toUserId")
  .post(authenticateUser, reviewRequest);

export default requestRouter;
