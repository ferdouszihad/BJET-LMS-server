import express from "express";
import { activateUser, registerUser } from "../controllers/user.controller";
const userRoute = express.Router();

userRoute.post("/register", registerUser);

userRoute.post("/activate-user", activateUser);

export default userRoute;
