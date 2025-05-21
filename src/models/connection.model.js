import mongoose from "mongoose";

const connectionSchema = mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["ignored", "interested", "accepted", "rejected"],
    },
  },
  { timestamps: true }
);

const connections = mongoose.model("connection", connectionSchema);
export default connections;
