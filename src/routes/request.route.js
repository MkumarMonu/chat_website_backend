import express from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import {
  acceptOrRejectRequest,
  getAllRequest,
  sendRequest,
} from "../controllers/request.controller.js";

const requestRouter = express.Router();

requestRouter
  .route("/request/:status/:toUserId")
  .post(authenticateUser, sendRequest);

requestRouter
  .route("/review/getAllRequest")
  .get(authenticateUser, getAllRequest);

requestRouter
  .route("/acceptOrRejectRequest/:status/:requestId")
  .post(authenticateUser, acceptOrRejectRequest);

export default requestRouter;
