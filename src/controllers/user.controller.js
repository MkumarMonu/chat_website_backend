import { User } from "../models/user.model.js";
import { generateToken } from "../utills/tokenService.js";
import cookieParser from "cookie-parser";

const registerUser = async (req, res) => {
  try {
    const { username, phone, email, avatar, password } = req.body;
    if (!username || !phone || !email || !avatar || !password) {
      return res
        .status(400)
        .json({ success: true, message: "Please fill all fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    await User.create(req?.body);
    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log("Internal Server Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to create user" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const userID = user?._id;
    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = generateToken(userID);
    res.cookie("userToken", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      // path: "/",
    });
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login user",
      error,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id);
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }
    return res.status(400).json({
      success: true,
      message: "user data fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({ success: false, message: "No user found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "All user data fetched successfully",
        users,
      });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Internal Server Error", error });
  }
};

export { registerUser, loginUser, getUserById,getAllUsers };
