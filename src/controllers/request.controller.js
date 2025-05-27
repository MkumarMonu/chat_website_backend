import connections from "../models/connection.model.js";
import { User } from "../models/user.model.js";

const sendRequest = async (req, res) => {
  try {
    const fromUserId = req.user?._id;
    const { status, toUserId } = req.params;
    if ((!fromUserId || !toUserId, !status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    const allowedSendRequest = ["ignored", "interested"];
    if (!allowedSendRequest.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status type!",
        status,
      });
    }

    const findToUser = await User.findOne({ _id: toUserId });
    if (!findToUser) {
      return res.status(400).json({ success: false, message: "No user found" });
    }

    const requestAlreadyExist = await connections.findOne({
      $or: [
        { fromUser: fromUserId, toUser: toUserId },
        { fromUser: toUserId, toUser: fromUserId },
      ],
    });
    if (requestAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "Request already exist" });
    }

    const newConnection = new connections({
      fromUser: fromUserId,
      toUser: toUserId,
      status,
    });
    const saveConnection = await newConnection.save();
    if (!saveConnection) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to save connection!" });
    }
    return res.status(200).json({
      success: true,
      message: "Request sent successfully!",
      saveConnection,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const reviewRequest = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const fetchRequest = await connections
      .find({ toUser: loggedInUserId })
      .populate({ path: "toUser", select: "username email" });
    if (!fetchRequest) {
      return res
        .status(400)
        .json({ success: false, message: "No request found" });
    }
    return res.status(200).json({
      success: true,
      message: "Request found",
      requests: fetchRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error,
    });
  }
};

export { sendRequest, reviewRequest };
