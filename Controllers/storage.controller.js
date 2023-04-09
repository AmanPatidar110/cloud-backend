exports.downloadFile = (req, res) => {
  const file = path.join("/storage-pool", req.params.filename);

  // Check if file exists
  if (!fs.existsSync(file)) {
    return res.status(404).send("File not found");
  }

  // Send file to client
  res.download(file);
};

exports.uploadFile = (req, res) => {
  // The uploaded file is now stored in the specified directory
  res.send("File uploaded successfully!");
};
