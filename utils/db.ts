import mongoose from "mongoose";

require("dotenv").config();

const dbURL: string = process.env.DB_URI || "";

const connectToDB = async () => {
  try {
    const client = await mongoose.connect(dbURL);
    console.log("Connected to MongoDB");
  } catch (error: any) {
    console.error("Error connecting to MongoDB", error);
    console.log(error.message);
    setTimeout(connectToDB, 10000);
  }
};

export default connectToDB;
