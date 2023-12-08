const express = require("express");
const {
  fileDownloadController,
  fileUploadController,
  fileFetchController,
  fileDeleteController,
} = require("../controller/FileController");
const shortid = require("shortid");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Create the uploads folder if it doesn't exist
const uploadFolder = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueCode = generateAlphanumeric(6);
    cb(null, `${uniqueCode}_${file.originalname}`);
  },
});

function generateAlphanumeric(length) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset.charAt(randomIndex);
  }

  return result;
}

const upload = multer({ storage });
//File Upload Route
router.post("/upload", upload.single("file"), fileUploadController);

//All Files Get Route
router.get("/fetchfiles/:userid", fileFetchController);
//File Download Route
router.get("/download/:code", fileDownloadController);

//File Delete Routes
router.delete("/deletefile/:fileId", fileDeleteController);

module.exports = router;
