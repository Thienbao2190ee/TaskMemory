const db = require("../models/connectDb");
const { validationResult } = require("express-validator");
const photoService = require("../services/photo.service");

const {processAndSaveImage, deleteImage} = require('../utils/uploadImage')

exports.getall = async (req, res) => {
    try {
      photoService.getall((err, dataRes) => {
            if (err)
                return res.send({ result: false, error: [err] });
            return res.send({ result: true, data: dataRes });
      })
    } catch (err) {
        return res.send({ result: false, error: [err] });
    }
}


function ensureDirectoryExists(directory) {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }
  
  exports.create = async (req, res) => {
    try {
        const data = {
            name: req.body.name,
        };

        if (req.files) {
            console.log(req.files);

            const image = req.files.image[0];
            const imageCrop = req.files.imageCrop[0];

            data.image = image.destination + '/' + image.filename;
            data.imageCrop = imageCrop.destination + '/' + imageCrop.filename;
        }

        photoService.create(data, (err, resultData) => {
            if (err) {
                console.error(err);
                return res.status(500).send({
                    result: false,
                    error: [{ msg: 'Lỗi khi tạo dữ liệu' }],
                });
            }

            photoService.getall((err, dataRes) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({
                        result: false,
                        error: [{ msg: 'Lỗi khi truy vấn dữ liệu' }],
                    });
                }

                return res.send({
                    result: true,
                    message: 'Thêm mới thành công!',
                    data: [{ msg: 'Thêm mới thành công', newData: dataRes }],
                });
            });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            result: false,
            error: [{ msg: 'Máy chủ xảy ra lỗi!' }],
        });
    }
};

exports.delete = async (req, res) => {
    try {
      const id = req.params.id; // Lấy ID từ request.
  
      photoService.getall((err, initialData) => {
        if (err)
          return res.send({ result: false, error: [err] });
  
        photoService.delete(id, (err, deletedData) => {
          if (err) {
            return res.send({ result: false, error: [err] });
          }
  
          if (!deletedData) {
            return res.send({ result: false, error: [{ msg: 'Không tìm thấy bản ghi với ID đã cung cấp' }] });
          }
  
          photoService.getall((err, newData) => {
            if (err)
              return res.send({ result: false, error: [err] });
            return res.send({
              result: true,
              data: { msg: `Xóa dữ liệu ID:${id} thành công`, newData },
            });
          });
        });
      });
    } catch (err) {
      return res.send({ result: false, error: [err] });
    }
  };