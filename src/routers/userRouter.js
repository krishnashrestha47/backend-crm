import express from "express";
import { passwordCompare, PasswordHash } from "../helpers/bcryptHelper.js";
import {
  otpNotification,
  profileUpdateNotification,
} from "../helpers/emailHelper.js";
import { createAccessJWT, createRefreshJWT } from "../helpers/jwtHelper.js";
import { createOtp } from "../helpers/randomGeneratorHelper.js";
import { userAuthorization } from "../middlewares/authMiddleware.js";
import {
  deleteSession,
  getSession,
  insertSession,
} from "../models/session/SessionModel.js";
import { getUser, insertUser, updateUser } from "../models/user/User.model.js";

const router = express.Router();

router.get("/", userAuthorization, (req, res, next) => {
  try {
    const userInfo = req.userInfo;
    res.json({
      status: "success",
      message: "user router got hit",
      userInfo,
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
    //query to get user by email
    const user = await getUser({ email });

    if (user?._id) {
      //if user exist, compare password /check for authentication
      const comparePassword = passwordCompare(password, user.password);
      if (comparePassword) {
        // create JWTs if matched
        const accessJWT = await createAccessJWT(user.email);
        const refreshJWT = await createRefreshJWT(user.email);
        //send password as undefined if successful
        user.password = undefined;
        user.refreshJWT = undefined;
        res.json({
          status: "success",
          message: "user login successful",
          user,
          accessJWT,
          refreshJWT,
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

// otp for  password reset

router.post("/otp-request", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (email) {
      //check if user exists
      const user = await getUser({ email });
      if (user?._id) {
        //create otp and send email
        const obj = {
          token: createOtp(),
          associate: email,
          type: "updatePassword",
        };

        const result = await insertSession(obj);
        if (result?._id) {
          res.json({
            status: "success",
            message:
              "If your email exists in our system, we will send you a link to reset your password, Please check your email, ",
          });
          //send the otp to user email
          return otpNotification({
            token: result.token,
            email,
            name: user.name,
          });
        }
      }
    }
    res.json({
      status: "error",
      message: "Invalid request",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

// reset password with otp

router.patch("/reset-password", async (req, res, next) => {
  try {
    const { email, password, otp } = req.body;

    // get session info based on the otp and email and get the id

    const session = await getSession({
      token: otp,
      associate: email,
    });
    console.log(session);
    if (session?._id) {
      //based on the email, update password in the database after encrypting
      const resetPassword = {
        password: PasswordHash(password),
      };
      const updatedUser = await updateUser({ email }, resetPassword);
      if (updatedUser?._id) {
        //send email notification to user after password update
        profileUpdateNotification({
          name: updatedUser.name,
          email: updatedUser.email,
        });
        return res.json({
          status: "success",
          message: "Your password has been updated",
        });
      }
    }
    res.json({
      status: "error",
      message: "Invalid request, unable to update the password",
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

export default router;
