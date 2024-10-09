import express from "express";
import { registerUser } from "../controllers/user.controller";
const userRoute = express.Router();

userRoute.post("/register", registerUser);

export default userRoute;
