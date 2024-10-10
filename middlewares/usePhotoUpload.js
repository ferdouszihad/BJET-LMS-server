const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary.config");

// Create a storage object for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "users", // Optional: Specify a folder for uploads
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed file formats
  },
});

// Create a multer instance
const upload = multer({ storage: storage });

module.exports = upload;
