const express = require("express");
const jwtRoutes = express.Router();
const jwt = require("jsonwebtoken");
jwtRoutes.post("/sign", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
});

module.exports = jwtRoutes;
