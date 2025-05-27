import connections from "../models/connection.model.js";
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

const isProd = process.env.NODE_ENV === "production";

const cookieOption = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
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
    // the user will not see the data
    // user who are already in his connection
    // logged in user himself
    //
    //  here first take all the data from the connection collection which we do not to show to the logged in user
    //  after that take all the user data from the user collection and from the user data remove all the data
    //  which we do not to show to the logged in user which we have find from the connection collection
    const limit = parseInt(req.params.limit) || 10;
    const page = parseInt(req.params.page) || 1;
    const skip = (page - 1) * limit;
    const currentUserId = req.user?._id;
    const connectionRequests = await connections
      .find({
        $or: [{ fromUser: currentUserId }, { toUser: currentUserId }],
      })
      .select("fromUser toUser");
    const hideUserFromHome = new Set();
    connectionRequests.forEach((request) => {
      hideUserFromHome.add(request.fromUser.toString());
      hideUserFromHome.add(request.toUser.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromHome) } },
        { _id: { $ne: currentUserId } },
      ],
    })
      .select("username email phone avatar")
      .skip(skip)
      .limit(limit);

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
