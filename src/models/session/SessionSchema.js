import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  associates: {
    type: String,
    default: "",
  },
});

export default mongoose.model("Session", sessionSchema);
