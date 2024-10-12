const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const jwtRoutes = require("./routes/jwt.routes");
const courseRouter = require("./routes/course.routes");

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//api routes

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jwt", jwtRoutes);
app.use("/api/v1/courses", courseRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Success.API is running",
  });
});

app.get("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `The endpoint ${req.url} is not available`,
  });
});

// Export the app
module.exports = app;
