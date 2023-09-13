const db = require("../models/connectDb");
const { validationResult } = require("express-validator");
const tagsService = require("../services/tags.service");

// const {processAndSaveImage, deleteImage} = require('../utils/uploadImage')

exports.getall = async (req, res) => {
  try {
    tagsService.getall((err, dataRes) => {
          if (err)
              return res.send({ result: false, error: [err] });
          return res.send({ result: true, data: dataRes });
    })
  } catch (err) {
      return res.send({ result: false, error: [err] });
  }
}

exports.getById = async (req, res) => {
  try {
      const id = req.params.id; // Lấy ID từ request.

      tagsService.getById(id, (err, dataRes) => {
          if (err) {
              return res.send({ result: false, error: 'Đã xẩy ra lỗi' });
          }

          if (!dataRes) {
              return res.send({ result: false, error: 'Không tìm thấy bản ghi với ID đã cung cấp' });
          }

          return res.send({ result: true, data: {msg: `Lấy dữ liệu ID:${id} thành công`,newData: dataRes} });
      });
  } catch (err) {
      return res.send({ result: false, error: [err] });
  }
}

exports.create = async (req, res) => {
  try {
    
    const data = {
        name : req.body.name,
        publish : req.body.publish,
        color : req.body.color,
        created_at : new Date,
    }

    tagsService.create(data, (errss, dataRes) => {
        if (errss) {
            console.log('error todo:::', errss);
            return res.send({
                result: false,
                error: errss
            });
        }

            tagsService.getall((err, dataRes) => {
                if (err)
                    return res.send({ result: false, error: 'Tạo dữ liệu không thành công' });
                return res.send({ result: true, data: {msg: 'Tạo dữ liệu mới thành công', newData: dataRes} });
            })
      })

  } catch (err) {
      return res.send({
          result: false,
          error: 'Máy chủ xảy ra lỗi!'
      });
  }
};



exports.update = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID của bản ghi cần cập nhật từ request.

        // Lấy bản ghi hiện tại bằng ID
        tagsService.getById(id, async (err, dataRes) => {
          if (!dataRes) {
              return res.send({ result: false, error: 'Không tìm thấy bản ghi với ID đã cung cấp'});
          }
            if (err) {
              console.log(err);
                return res.send({ result: false, error: 'Đã xẫy ra lỗi' });
            }


            // Tạo một đối tượng dữ liệu mới dựa trên dữ liệu hiện tại và dữ liệu mới từ yêu cầu
            let data = {
                name: req.body.name || dataRes.name,
                publish : req.body.publish || dataRes.publish,
                color : req.body.color || dataRes.color,
                created_at :  dataRes.created_at,
                updated_at : new Date,
            };
            // console.log(dataRes);

            // Cập nhật bản ghi với dữ liệu mới
            tagsService.update(id, data, (errss, dataRes) => {
                if (errss)
                    return res.send({
                        result: false,
                        error: [errss]
                    });

                // Sau khi cập nhật thành công, lấy dữ liệu mới bằng cách gọi hàm getprojectById hoặc getall
                tagsService.getall((err, newDataRes) => {
                    if (err)
                        return res.send({ result: false, error: 'Đã xẩy ra lỗi' });

                    return res.status(200).send({ result: true, data: {msg: 'Cập nhật thành công', newData: newDataRes} });
                });
            });
        });

    } catch (err) {
        return res.send({
            result: false,
            error: 'Máy chủ xảy ra lỗi!'
        });
    }
};
// exports.update_status = async (req,res) => {
//     try {
//         const id = req.params.id

//         const {status } = req.body


//     } catch () {
        
//     }
// }

  

exports.delete = async (req, res) => {
    try {
      const id = req.params.id; // Lấy ID từ request.
  
      tagsService.getall((err, initialData) => {
        if (err)
          return res.send({ result: false, error: [err] });
  
        tagsService.delete(id, (err, deletedData) => {
          if (err) {
            return res.send({ result: false, error: [err] });
          }
  
          if (!deletedData) {
            return res.send({ result: false, error: [{ msg: 'Không tìm thấy bản ghi với ID đã cung cấp' }] });
          }
  
          tagsService.getall((err, newData) => {
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