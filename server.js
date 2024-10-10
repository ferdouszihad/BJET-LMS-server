// server.js
require("dotenv").config();
const app = require("./app"); // Import the app
const { connect } = require("./utils/connectDB");

// Start the server
const PORT = process.env.PORT || 5000;

connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });
