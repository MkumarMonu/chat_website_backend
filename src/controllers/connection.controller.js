import connections from "../models/connection.model.js";

const getYourConnections = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;
    const getConnections = await connections
      .find({
        $or: [
          {
            fromUser: loggedInUserId,
            status: "accepted",
          },
          { toUser: loggedInUserId, status: "accepted" },
        ],
      })
      .populate({ path: "fromUser", select: "username" })
      .populate({ path: "toUser", select: "username" });
    if (!getConnections) {
      return res
        .status(404)
        .json({ success: false, message: "No connections found" });
    }
    return res.status(200).json({
      success: true,
      message: "Your all connections fetched successfully!",
      data: getConnections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export { getYourConnections };
