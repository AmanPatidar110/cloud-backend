const express = require("express");
const multer = require("multer"); 
const router = express.Router(); 
const { downloadFile, uploadFile } = require("../Controllers/storage.controller");

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

const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/download/:filename", downloadFile);

module.exports = router;
