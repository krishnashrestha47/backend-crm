import express from "express";
import { passwordCompare, PasswordHash } from "../helpers/bcryptHelper.js";
import { getUser, insertUser } from "../models/user/User.model.js";

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

//create a new user

router.post("/", async (req, res, next) => {
  try {
    const hashPassword = PasswordHash(req.body.password);
    req.body.password = hashPassword;
    const result = await insertUser(req.body);

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
    error.status = 500;
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message = "Email already exists";
    }
    next(error);
  }
});

//user login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUser({ email });

    if (user?._id) {
      const comparePassword = passwordCompare(password, user.password);
      if (comparePassword) {
        user.password = undefined;
        res.json({
          status: "success",
          message: "user login successful",
          user,
        });
        return;
      }
    }
    res.status(401).json({
      status: "error",
      message: "Invalid login credentials",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
