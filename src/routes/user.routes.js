import express from "express";
import {
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/getUser").get(authenticateUser, getUserById);
userRouter.route("/getAllUser").get(getAllUsers);

export { userRouter };
