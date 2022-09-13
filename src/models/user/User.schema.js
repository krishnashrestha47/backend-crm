import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  company: {
    type: String,
    maxlength: 50,
    required: true,
  },
  address: {
    type: String,
    maxlength: 100,
    required: true,
  },
  phone: {
    type: Number,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    index: 1,
    maxlength: 50,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", UserSchema);
