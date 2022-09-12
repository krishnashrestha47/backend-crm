import mongoose from "mongoose";

export const dbConnection = () => {
  try {
    const connection = mongoose.connect(process.env.MONGO_URL);
    connection && console.log("MongoDB has been connected");
  } catch (error) {
    console.log(error);
  }
};
