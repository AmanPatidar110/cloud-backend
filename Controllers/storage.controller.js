const File = require('../model/file');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { async } = require('@firebase/util');
const fs = require('fs');
const { fetchFiles, removeFile } = require('../Services/storage.service');
const User = require('../model/user');
const { sendEmail } = require('../Services/email.service');

exports.downloadFile = async (req, res) => {
  const storageFileName = req.params.storageFileName;

  try {
    const filePath = path.join(__dirname, '..', 'uploads', storageFileName);

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

exports.uploadFile = async (req, res) => {
  console.log('IN Upload', req.file, req?.user?._id);
  const file = new File({
    fileName: req?.file?.originalname,
    userId: req?.user?._id,
    storageFileName: req?.file?.filename,
    fileSize: req?.file?.size / 1048576,
  });

  const savedFile = await file.save();
  req.fileId = savedFile._id;
  User.updateOne(
    { _id: req?.user?._id },
    { $inc: { usedSpace: req?.file?.size / 1048576 } }
  )
    .then((result) => {
      console.log(
        `Successfully updated usedSpace by adding ${req?.file?.size / 1048576}`
      );
    })
    .catch((error) => {
      console.error('Error updating user', error);
    });

  const bodyy = `
Dear user,

We wanted to inform you that a new file has been uploaded to your cloud storage. The file is named "${req?.file?.originalname}".
\n\n
If you have any questions or concerns about this file, please don't hesitate to contact us.
\n\n
Best regards,
IIITK Cloud Team
`;
  await sendEmail(
    (to = '119cs0005@iiitk.ac.in'),
    (subject = 'New file uploaded to your cloud storage!'),
    (htmlbody = 'New File added'),
    (body = bodyy)
  );
  res.json({
    message: 'File uploaded successfully',
    file: { ...savedFile.toObject() },
  });
};

exports.getUserFile = async (req, res, next) => {
  try {
    const searchText = req.query.searchText;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit || 10);
    const fileId = req.query.fileId;

    console.log('fetching files', limit, page, searchText, fileId);
    const userId = req?.user?._id;
    const response = await fetchFiles(limit, page, searchText, fileId, userId);

    const user = await User.findOne({ _id: userId });
    // console.log('channel added', response);
    res.status(200).json({ ...response, user });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
};

exports.deleteFile = async (req, res, next) => {
  try {
    const fileId = req.query.fileId;

    console.log('deleting files', fileId);
    const response = await removeFile(fileId, req?.user?._id);
    res.status(200).json({ ...response });
  } catch (error) {
    if (!error.statusCode) error.statusCode = 500;
    console.log(error);
    return next(error);
  }
};
