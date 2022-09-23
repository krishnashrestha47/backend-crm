import express from "express";
import { createAccessJWT, verifyRefreshJWT } from "../helpers/jwtHelper.js";
import { getUser } from "../models/user/User.model.js";

const router = express.Router();

//get access token
router.get("/", async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const decoded = await verifyRefreshJWT(authorization);
    if (decoded?.payload) {
      const user = await getUser({ email: decoded.payload });
      if (user?._id) {
        const newAccessJWT = await createAccessJWT({ email: decoded.payload });

        res.json({
          status: "success",
          message: "here is the fresh token",
          newAccessJWT,
        });
      }
      return;
    }
    res.status(403).json({
      status: "error",
      message: "Forbidden",
    });
  } catch (error) {
    error.status = 403;
    next(error);
  }
});

export default router;
