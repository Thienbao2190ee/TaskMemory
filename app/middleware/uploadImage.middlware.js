const multer = require('multer');
const fs = require('fs');

const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;

    let uploadPath = `uploads/images/${year}/${month}`;

    if (file.fieldname === 'imageCrop') {
      uploadPath = `uploads/images/${year}/${month}/crop`;
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const type = file.mimetype.slice(6, file.mimetype.length);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + type);
  }
});

  
exports.upload = multer({ storage: storage })