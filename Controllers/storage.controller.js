const File = require("../model/file")
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { async } = require("@firebase/util");
const fs = require('fs');


exports.downloadFile = async(req, res) => {
  const filename = req.params.filename;

  try {
    const filePath = path.join(__dirname, '..', 'uploads', filename);


    if (!fs.existsSync(filePath)) {
      console.log(filePath);
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });



exports.uploadFile = (req, res) => {
  upload.single('file')(req, res, async function (err) {
    
    
    
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error' });
    } else if (err) {
      return res.status(500).json({ message: 'Server error',error: err });
    }

    const file = new File({
      filename: req.file.filename,
      userId: req.body.userId,
    });

    await file.save();

    res.json(file);
  });
};

exports.userFiles = (req, res) => {
  const userId = "janjnsdjdnfjnsdfjndsf"; // assuming you're passing the userId as a URL parameter

  File.find({ userId: userId })
    .then(files => {
      return res.json(files);
    })
    .catch(err => {
      return res.status(500).send(err);
    });
};
