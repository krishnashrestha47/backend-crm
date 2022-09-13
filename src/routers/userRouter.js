import express from "express";
import { insertUser } from "../models/user/User.model.js";

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "user router got hit",
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const result = await insertUser(data);

    result?._id
      ? res.json({
          status: "success",
          message: "The user has been created successfully",
          result,
        })
      : res.json({
          status: "error",
          message: "Couldn't register the user",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
