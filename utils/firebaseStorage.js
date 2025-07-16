const admin = require('../config/firebaseAdmin');

async function uploadFile(file, path) {
  const bucket = admin.storage().bucket();
  const fileUpload = bucket.file(path);

  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype,
    },
    public: true,
  });

  return `https://storage.googleapis.com/${bucket.name}/${path}`;
}

module.exports = {
  uploadFile,
};
