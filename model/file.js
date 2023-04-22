const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    storageFileName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at', // and `updated_at` to store the last updated date
    },
  }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;
