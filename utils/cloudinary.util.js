// utils/cloudinary.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

// upload file từ đường dẫn (từ folder uploads)
const uploadToCloudinary = (filePath, folder) => {
  return cloudinary.uploader.upload(filePath, {
    folder: folder || "specializations"
  });
};

module.exports = { uploadToCloudinary };