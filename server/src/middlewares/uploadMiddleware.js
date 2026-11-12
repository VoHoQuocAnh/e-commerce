// server/src/middlewares/uploadMiddleware.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const env = require('../config/environment');
const HTTP_CODES = require('../constants/httpCodes');
const ApiError = require('../utils/ApiError');

const ALLOWED_MIMES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(
        new ApiError(HTTP_CODES.BAD_REQUEST, 'Chỉ hỗ trợ định dạng ảnh JPG, PNG, WEBP hoặc AVIF')
      );
    }
    cb(null, true);
  },
});

const uploadBufferToCloudinary = (buffer, folder = 'calem-studio') => {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      'Chưa cấu hình thông tin Cloudinary trong biến môi trường'
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) {
          return reject(new ApiError(HTTP_CODES.BAD_GATEWAY, `Lỗi upload ảnh: ${error.message}`));
        }
        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );
    stream.end(buffer);
  });
};

const deleteFromCloudinary = async (publicId) => {
  if (!publicId || !env.CLOUDINARY_CLOUD_NAME) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Non-blocking cleanup
  }
};

module.exports = {
  upload,
  uploadBufferToCloudinary,
  deleteFromCloudinary,
};
