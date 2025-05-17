import express from "express";
import {
  getAllUsers,
  getUserById,
  loginUser,
  registerUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/getUser/:id").get(getUserById);
userRouter.route("/getAllUser").get(getAllUsers);

export { userRouter };
