require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../models/user.model";
import { catchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
//register user
interface IRegistration {
  name: string;
  email: string;
  password: string;
  photo?: string;
}

export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, photo } = req.body;
      const isEmailExist = await userModel.findOne({ email: email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user: IRegistration = {
        name,
        email,
        password,
        photo,
      };
      const activationToken = createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = {
        user: { name: user.name },
        activationCode,
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../view/activation.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation.ejs",
          data,
        });

        res.status(200).json({
          success: true,
          message:
            "User registered successfully. Please check your email for activation.",
        });
      } catch (err: any) {
        next(new ErrorHandler(err.message, 400));
      }
    } catch (err: any) {
      next(new ErrorHandler(err.message, 400));
    }
  }
);
interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.TOKEN as Secret,
    {
      expiresIn: "5m",
    }
  );

  return {
    token,
    activationCode,
  };
};
