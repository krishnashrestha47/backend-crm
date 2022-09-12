import express from "express";

const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.json({
      status: "success",
      message: "ticket router got hit",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
