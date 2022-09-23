import jwt from "jsonwebtoken";
import {
  deleteSession,
  insertSession,
} from "../models/session/SessionModel.js";
import { updateUser } from "../models/user/User.model.js";

export const createAccessJWT = async (payload) => {
  const accessJWT = jwt.sign({ payload }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1m",
  });
  const obj = {
    token: accessJWT,
    type: "jwt",
  };
  await insertSession(obj);
  return accessJWT;
};

export const createRefreshJWT = async (payload) => {
  const refreshJWT = jwt.sign({ payload }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  await updateUser({ email: payload }, { refreshJWT });
  return refreshJWT;
};

export const verifyAccessJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (error) {
    if (error.message === "jwt expired") {
      deleteSession({ type: "jwt", token });
    }
    return error.message;
  }
};

export const verifyRefreshJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return error.message;
  }
};
