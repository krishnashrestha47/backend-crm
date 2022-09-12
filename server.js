import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());

import { dbConnection } from "./src/config/dbConfig.js";
import bodyParser from "body-parser";
dbConnection();

app.get("/", (req, res) => {
  res.json("Hello");
});

//routers
import userRouter from "./src/routers/userRouter.js";
import ticketRouter from "./src/routers/ticketRouter.js";
app.use("/api/v1/user", userRouter);
app.use("/api/v1/ticket", ticketRouter);

//global error handling
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 400);
  res.json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error && console.log(error);
  console.log(`Server is running at http://localhost:${PORT}`);
});
