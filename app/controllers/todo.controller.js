const db = require("../models/connectDb");
const { validationResult } = require("express-validator");
const todoService = require("../services/todo.service");

// const {processAndSaveImage, deleteImage} = require('../utils/uploadImage')

exports.getall = async (req, res) => {
  try {
    todoService.getall((err, dataRes) => {
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

      todoService.getById(id, (err, dataRes) => {
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
        status : req.body.status,
        created_at : new Date,
    }

    todoService.create(data, (errss, dataRes) => {
        if (errss) {
            console.log('error todo:::', errss);
            return res.send({
                result: false,
                error: 'Tạo dữ liệu không thành công'
            });
        }

            todoService.getall((err, dataRes) => {
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
        todoService.getById(id, async (err, dataRes) => {
            if (err) {
                return res.send({ result: false, error: 'Đã xẫy ra lỗi' });
            }

            if (!dataRes) {
                return res.send({ result: false, error: 'Không tìm thấy bản ghi với ID đã cung cấp'});
            }

            // Tạo một đối tượng dữ liệu mới dựa trên dữ liệu hiện tại và dữ liệu mới từ yêu cầu
            let data = {
                name: req.body.name || dataRes.name,
                status : req.body.status || dataRes.status,
                created_at :  dataRes.created_at,
                updated_at : new Date ,
            };

            // Kiểm tra nếu có tệp ảnh mới được tải lên.
            // if (req.file && req.body.image != 'undefined') {
            //     if (req.file.size > 1000000) {
            //         return res.send({
            //             result: false,
            //             error: [{msg: 'File gửi không được lớn hơn 1MB'}]
            //         });
            //     } else {
            //         deleteImage(dataRes?.image)
            //         deleteImage(dataRes?.thumb)
            //         deleteImage(dataRes?.webps)
            //         deleteImage(dataRes?.webps_thumb)
            //         const processedImagePaths = await new Promise((resolve, reject) => {
            //             processAndSaveImage(req.file, 200, 200, (err, paths) => {
            //                 if (err) {
            //                     reject(err);
            //                 } else {
            //                     resolve(paths);
            //                 }
            //             });
            //         });

            //         data = {
            //             ...data,
            //             ...processedImagePaths
            //         };
            //     }
            // }
            // if( req.body.image == 'undefined' ) data.image = dataRes.image

            // Cập nhật bản ghi với dữ liệu mới
            todoService.update(id, data, (errss, dataRes) => {
                if (errss)
                    return res.send({
                        result: false,
                        error: [errss]
                    });

                // Sau khi cập nhật thành công, lấy dữ liệu mới bằng cách gọi hàm getprojectById hoặc getall
                todoService.getall((err, newDataRes) => {
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
  
      todoService.getall((err, initialData) => {
        if (err)
          return res.send({ result: false, error: [err] });
  
        todoService.delete(id, (err, deletedData) => {
          if (err) {
            return res.send({ result: false, error: [err] });
          }
  
          if (!deletedData) {
            return res.send({ result: false, error: [{ msg: 'Không tìm thấy bản ghi với ID đã cung cấp' }] });
          }
  
          todoService.getall((err, newData) => {
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