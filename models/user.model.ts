import mongoose, { Document, Model, Schema } from "mongoose";
import bcript from "bcryptjs";

//email regex pattern
const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//interface for user

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  photo: string;
  role: string;
  isVerfied: boolean;
  createdAt: Date;
  courses: Array<{ course: string }>;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },
    email: {
      type: String,
      required: [true, "email is not valid"],
      validate: {
        validator: (value: string) => emailRegex.test(value),
        message: "Please enter a valid email address",
      },
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Password must be atleast 6 characters"],
      select: false,
    },
    photo: {
      type: String,
      default: "https://img.icons8.com/?size=96&id=tcBrHq0RlezH&format=png",
    },
    role: {
      type: String,
      enum: ["user", "admin", "teacher"],
      default: "user",
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcript.hash(this.password, 10);
  next();
});
//compare password

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcript.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
