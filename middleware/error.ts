import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

module.exports = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error.  Please try again";

  //wrong mongoDB Id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Duplicate key Error message
  if (err.code === 11000) {
    const message = `Duplicate key error. Please ensure the unique constraint. Duplicate ${Object.keys(
      err.keyValue
    )} Entered`;

    err = new ErrorHandler(message, 400);
  }
  //wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please login again.";
    err = new ErrorHandler(message, 401);
  }
  //JWT expired errr
  if (err.name === "TokenExpiredError") {
    const message = "Token has expired. Please login again.";
    err = new ErrorHandler(message, 401);
  }

  //wrong refresh token error message
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please login again.";
    err = new ErrorHandler(message, 401);
  }

  res.status(err.statusCode).json({
    status: err.statusCode,
    success: false,
    message: err.message,
    error: err.stack,
  });
};
