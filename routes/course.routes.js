const express = require("express");
const { ObjectId } = require("mongodb");
const { db } = require("../utils/connectDB");
const useAuthentication = require("../middlewares/useAuthentication");
const courseRouter = express.Router();
const userCollection = db.collection("users");
const courseCollection = db.collection("courses");

courseRouter.get("/teaching/:email", useAuthentication, async (req, res) => {
  try {
    const { email } = req.params;

    const user = await userCollection.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Bad Request. User Not Found",
      });
    }
    let {  teaching_courses } = user;
    
    teaching_courses = teaching_courses?.map((course) => new ObjectId(course));

    const result =
      (await courseCollection
        .find({ _id: { $in: teaching_courses } })
        .toArray()) || [];
    res.json(result);
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});

courseRouter.post("/create", useAuthentication, async (req, res) => {
  const courseData = { ...req.body, status: "publish" };
  const result = await courseCollection.insertOne(courseData);
  await userCollection.updateOne(
    { email: req.body?.teacher[0] },
    { $push: { courses: result.insertedId } }
  );

  res.send(result);
});

module.exports = courseRouter;
