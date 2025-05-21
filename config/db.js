import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://root:monu$8958@cluster0.vez1g.mongodb.net/chatData"
    );
    console.log("connected to db successfully!");
  } catch (error) {
    console.log("connection failed to db!");
  }
};

export { connectToDb };
