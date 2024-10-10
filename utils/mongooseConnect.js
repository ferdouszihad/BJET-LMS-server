const mongoose = require("mongoose");
const uri = process.env.URI;
console.log(uri);

const connect = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Successfully connected to the lms-server database!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

module.exports = { connect };
