import mongoose from "mongoose";

const connectionSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["sent", "connected", "rejected"],
    },
  },
  { timestamps: true }
);

const connections = mongoose.model("connection", connectionSchema);
export default connections;
