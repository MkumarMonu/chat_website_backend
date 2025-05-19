import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authenticateUser = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(" ")[1] || req.cookies.userToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authorized!" });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodedData;
    const user = await User.findById(_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Authentication failed!" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export { authenticateUser };
