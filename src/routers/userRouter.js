import express from "express";

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

router.post("/", (req, res, next) => {
  try {
    res.json(req.body);
  } catch (error) {}
});

export default router;
