require("dotenv").config();
const express = require("express");
export const app = express();

import cors from "cors";
import cookieParser from "cookie-parser";
import { NextFunction, Request, Response } from "express";
import userRoute from "./routes/user.routes";

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN || [],
    credentials: true,
  })
);

//Routess
app.use("/api/v1/users", userRoute);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 200,
    message: "Welcome to LMS Server. API Version is 1.1.1",
  });
});
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`The EndPoint ${req.originalUrl} is not available}`);
  next(err);
});
