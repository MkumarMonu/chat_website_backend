import { User } from "../models/user.model.js";
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

const cookieOption = {
  httpOnly: true,
  secure: process.env.cookie_secure === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "none",
};

console.log("cookie secure", cookieOption.secure);
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

    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = user.generateToken();
    res.cookie("userToken", token, cookieOption);
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

const logoutUser = async (req, res) => {
  try {
    if (!req.cookies.userToken) {
      return res.status(400).json({
        success: false,
        message: "User is not logged in!",
      });
    }
    res.clearCookie("userToken", cookieOption);
    return res
      .status(200)
      .json({ success: true, message: "Logout successfully!" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { user } = req;
    return res.status(200).json({
      success: true,
      message: "user data fetched successfully!",
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
    return res.status(200).json({
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

export { registerUser, loginUser, logoutUser, getUserById, getAllUsers };
