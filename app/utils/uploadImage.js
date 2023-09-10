const sharp = require('sharp');
const fs = require('fs');

function generateRandomFileName() {
  const timestamp = Date.now();
  const randomValue = Math.floor(Math.random() * 1000); // Số ngẫu nhiên từ 0 đến 999
  return `${timestamp}-${randomValue}`;
}

function processAndSaveImage(file, width, height, callback) {
  const imagePath = `${file.destination}/${file.filename}`;
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  
  const thumbPath = `uploads/images/${year}/${month}/thumb`;

  const webpPath = `uploads/webps/${year}/${month}`;
  const thumbWebpPath = `uploads/webps/${year}/${month}/thumb`;
  
  // Kiểm tra và tạo đường dẫn nếu chưa tồn tại
  ensureDirectoryExists(thumbPath);

  ensureDirectoryExists(webpPath);
  ensureDirectoryExists(thumbWebpPath);
  
  const webpName = generateRandomFileName();
  
  // Tạo phiên bản WebP với kích thước 400x400
  createThumbnail(imagePath, webpPath + '/' + webpName + '.webp', 400, 400, () => {
    createThumbnail(imagePath, thumbWebpPath + '/' + webpName + '.webp', 200, 200, () => {
      createThumbnail(imagePath, thumbPath + '/' + file.filename, width, height, () => {
        callback(null, {
          image: imagePath,
          thumb: thumbPath + '/' + file.filename,
          webps: webpPath + '/' + webpName + '.webp',
          webps_thumb: thumbWebpPath + '/' + webpName + '.webp',
        });
      });
    });
  });
}
function deleteImage(filePath) {
  try {
    // Kiểm tra xem tệp tồn tại trước khi xóa
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Xóa tệp ảnh
      console.log(`Xóa tệp ${filePath} thành công.`);
    } else {
      console.log(`Tệp ${filePath} không tồn tại.`);
    }
  } catch (error) {
    console.error(`Lỗi khi xóa tệp ${filePath}:`, error);
  }
}
function ensureDirectoryExists(filePath) {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath, { recursive: true });
  }
}


function createThumbnail(sourcePath, outputPath, width, height, callback) {
  sharp(sourcePath)
    .resize({ width, height })
    .toFile(outputPath, (err) => {
      if (err) {
        console.error(err);
        return callback(err);
      }
      callback(null);
    });
}

module.exports = {
    processAndSaveImage,
    createThumbnail,
    deleteImage
};