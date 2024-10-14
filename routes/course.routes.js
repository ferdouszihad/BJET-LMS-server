const express = require("express");
const { ObjectId, Timestamp } = require("mongodb");
const { db } = require("../utils/connectDB");
const useAuthentication = require("../middlewares/useAuthentication");
const courseRouter = express.Router();
const userCollection = db.collection("users");
const courseCollection = db.collection("courses");
const moduleCollection = db.collection("modules");

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
        .find({ _id: { $in: teaching_courses }, status: "publish" })
        .toArray()) || [];
    res.json(result);
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
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

courseRouter.post("/modules/create", async (req, res) => {
  try {
    const newModuleData = {
      ...req.body,
      created_at: new Timestamp(),
    };

    const result = await moduleCollection.insertOne(newModuleData);
    res.send(result);

    console.log(req.body);
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
    console.log(e);
  }
});

courseRouter.get("/modules/:course_id", async (req, res) => {
  try {
    const { course_id } = req.params;
    const courseModules = await moduleCollection.find({ course_id }).toArray();
    res.send(courseModules);
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
    console.log(e);
  }
});

courseRouter.get("/module/single/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const module = await moduleCollection.findOne({ _id: new ObjectId(id) });
    res.send(module);
  } catch (e) {
    res.status(500).json({
      status: false,
      message: e.message || "Internal Server Error",
    });
    console.log(e);
  }
});
module.exports = courseRouter;
