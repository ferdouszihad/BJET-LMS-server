const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary.config"); // Your Cloudinary config

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });
// Mongoose model for MongoDB

const uploadRoute = express.Router();
uploadRoute.post("/file", upload.single("file"), async (req, res) => {
  try {
    const { file } = req; // File uploaded via form
    const { content } = req.body; // HTML content or text

    // Upload the file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" }, // Supports different file types (video, PDF, image, etc.)
      (error, result) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        // Save the HTML content and file link to MongoDB
        res.status(200).json({
          content, // HTML content or any text content
          fileUrl: result.secure_url, // Store Cloudinary file URL
          createdAt: new Date(),
        });
      }
    );

    // Pipe the file to Cloudinary uploader
    cloudinaryResponse.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Use multer to handle file uploads

module.exports = uploadRoute;
