const express = require("express");
const { ObjectId, Timestamp } = require("mongodb");
const { db } = require("../utils/connectDB");
const useAuthentication = require("../middlewares/useAuthentication");
const courseRouter = express.Router();
const userCollection = db.collection("users");
const courseCollection = db.collection("courses");
courseRouter.get("/single/:id", useAuthentication, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const course = await courseCollection.findOne({ _id: new ObjectId(id) });
    if (!course) {
      return res
        .status(404)
        .json({ status: false, message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});
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
    let { teaching_courses } = user;

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
  const result = await courseCollection.insertOne({
    ...courseData,
    modules: [],
  });
  await userCollection.updateOne(
    { email: req.body?.teacher[0] },
    { $push: { teaching_courses: result.insertedId } }
  );

  res.send(result);
});

courseRouter.put("/update-thumbnail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { thumbnail } = req.body;
    const result = await courseCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { thumbnail: thumbnail } }
    );
    res.send(result);
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});

courseRouter.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await courseCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...req.body } }
    );
    res.send(result);
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});
module.exports = courseRouter;
