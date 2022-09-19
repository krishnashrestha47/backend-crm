import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Session", sessionSchema);
