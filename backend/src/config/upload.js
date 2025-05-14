// config/upload.js
const multer = require('multer');

module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: parseInt(process.env.MAX_UPLOAD_BYTES) || 50 * 1024 * 1024 }
});
