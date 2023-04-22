const File = require('../model/file');

exports.fetchFiles = async (limit, page, searchText, fileId, userId) => {
  console.log('limit', limit, page, searchText, fileId, typeof userId);
  if (fileId) {
    const file = await File.findOne({ _id: fileId, userId: userId });

    return {
      msg: 'ok',
      file: { ...file.toObject() },
    };
  } else {
    const totalDocs = await File.find({
      userId: userId,
      fileName: searchText
        ? { $regex: searchText || '', $options: 'i' }
        : { $exists: true },
    }).count();

    console.log(totalDocs, 'totalDocs');
    const files = await File.find({
      userId: userId,
      fileName: searchText
        ? { $regex: searchText || '', $options: 'i' }
        : { $exists: true },
    })
      .skip((limit || 10) * (page - 1 || 0))
      .limit(limit || 10);
    return { msg: 'ok', files: [...files], totalDocs };
  }
};

exports.removeFile = async (fileId, userId) => {
  if (fileId) {
    const file = await File.deleteOne({ _id: fileId, userId: userId });
    return {
      msg: 'File deleted',
    };
  } else {
    return { msg: 'File Id not received!' };
  }
};
