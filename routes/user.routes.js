const express = require("express");
const userRoute = express.Router();
const { db } = require("../utils/connectDB");
const useAuthentication = require("../middlewares/useAuthentication");
const userCollection = db.collection("users");

userRoute.post("/login", async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const isUserExist = await userCollection.findOne({ email });
    console.log(isUserExist);

    if (isUserExist) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }
    const newUser = {
      name,
      email,
      role,
      enrolled_courses: [],
      teaching_courses: [],
    };
    const result = await userCollection.insertOne(newUser);
    res.status(201).json({
      status: true,
      message: "User created successfully",
      data: { ...newUser, ...result },
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message || "An error occurred while creating user",
    });
  }
});

userRoute.get("/single/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message || "An error occurred while creating user",
    });
  }
});

userRoute.get("/role/:email", useAuthentication, async (req, res) => {
  const email = req.params.email;

  if (email !== req.decoded.email) {
    return res.status(403).send({ message: "forbidden access" });
  }

  const query = { email: email };
  const user = await userCollection.findOne(query);
  console.log(user);

  res.send({ role: user ? user.role : "" });
});

module.exports = userRoute;
