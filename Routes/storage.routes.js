const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const File = require('../model/file')
const Dummy = require('../model/dummy')


// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Change the destination directory to `uploads` within the project root directory
    cb(null, "/storage-pool");
  },
  filename: function (req, file, cb) {
    // Add a timestamp prefix to the file name to avoid overwriting files with the same name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

// Create multer middleware with the storage configuration
const upload = multer({ storage: storage });

// Define a route that accepts file uploads
router.post("/upload", upload.single("file"), function (req, res) {
  // The uploaded file is now stored in the specified directory
  res.send("File uploaded successfully!");
});

router.get("/download/:filename", function (req, res) {
  const file = path.join("/storage-pool", req.params.filename);

  // Check if file exists
  if (!fs.existsSync(file)) {
    return res.status(404).send("File not found");
  }

  // Send file to client
  res.download(file);


});






module.exports = router;
