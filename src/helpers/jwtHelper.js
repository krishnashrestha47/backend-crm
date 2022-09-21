import jwt from "jsonwebtoken";
import { insertSession } from "../models/session/SessionModel.js";
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

export const verifyAccessJWT = (userJWT) => {
  try {
    const verifyJWT = jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET);
    return verifyJWT;
  } catch (error) {
    return error.message;
  }
};
