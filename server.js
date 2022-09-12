import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
// import bodyParser from "body-parser";

const app = express();

const PORT = process.env.PORT || 8000;

// //set body parser
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

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

//global error handling
app.use((error, req, res) => {
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
