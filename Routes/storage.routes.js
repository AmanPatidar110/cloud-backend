const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  downloadFile,
  uploadFile,
  userFiles,
  getUserFile,
  deleteFile,
} = require('../Controllers/storage.controller');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        '-' +
        uniqueSuffix +
        '.' +
        file.originalname.split('.').pop()
    );
  },
});

const upload = multer({ storage: storage });

router.get('/', getUserFile);
router.delete('/delete_file', deleteFile);
router.post('/add_file', upload.single('file'), uploadFile);
router.get('/download_file/:storageFileName', downloadFile);


module.exports = router;
