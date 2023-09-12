const db = require("../models/connectDb");
const { validationResult } = require("express-validator");
const projectService = require("../services/project.service");

// const {processAndSaveImage, deleteImage} = require('../utils/uploadImage')

exports.getall = async (req, res) => {
  try {
    projectService.getall((err, dataRes) => {
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

      projectService.getById(id, (err, dataRes) => {
          if (err) {
              return res.send({ result: false, error: [err] });
          }

          if (!dataRes) {
              return res.send({ result: false, error: [{msg: 'Không tìm thấy bản ghi với ID đã cung cấp'}] });
          }

          return res.send({ result: true, data: {msg: `Lấy dữ liệu ID:${id} thành công`,newData: dataRes} });
      });
  } catch (err) {
      return res.send({ result: false, error: [err] });
  }
}

exports.create = async (req, res) => {
  try {
      let data = {};
      data.name = req.body.name;
      data.user_id = req.body.user_id;

      console.log(data);



      projectService.create(data, (errss, dataRes) => {
          if (errss)
              return res.send({
                  result: false,
                  error: [errss]
              });
            projectService.getall((err, dataRes) => {
                if (err)
                    return res.send({ result: false, error: [err] });
                return res.send({ result: true, data: {msg: 'Tạo dữ liệu mới thành công', newData: dataRes} });
            })
      })

  } catch (err) {
      return res.send({
          result: false,
          error: [{msg: 'Máy chủ xảy ra lỗi!'}]
      });
  }
};



exports.update = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID của bản ghi cần cập nhật từ request.

        // Lấy bản ghi hiện tại bằng ID
        projectService.getById(id, async (err, dataRes) => {
            if (err) {
                return res.send({ result: false, error: [err] });
            }

            if (!dataRes) {
                return res.send({ result: false, error: [{msg: 'Không tìm thấy bản ghi với ID đã cung cấp'}] });
            }

            // Tạo một đối tượng dữ liệu mới dựa trên dữ liệu hiện tại và dữ liệu mới từ yêu cầu
            let data = {
                name: req.body.name || dataRes.name,
                alias: req.body.alias || dataRes.alias,
                image: req.body.image || dataRes.image,
                thumb: req.body.thumb || dataRes.thumb,
                webps: req.body.webps || dataRes.webps,
                webps_thumb: req.body.webps_thumb || dataRes.webps_thumb,
            };

            // // Kiểm tra nếu có tệp ảnh mới được tải lên.
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
            projectService.update(id, data, (errss, dataRes) => {
                if (errss)
                    return res.send({
                        result: false,
                        error: [errss]
                    });

                // Sau khi cập nhật thành công, lấy dữ liệu mới bằng cách gọi hàm getprojectById hoặc getall
                projectService.getall((err, newDataRes) => {
                    if (err)
                        return res.send({ result: false, error: [err] });

                    return res.status(200).send({ result: true, data: {msg: 'Cập nhật thành công', newData: newDataRes} });
                });
            });
        });

    } catch (err) {
        return res.send({
            result: false,
            error: [{msg: 'Máy chủ xảy ra lỗi!'}]
        });
    }
};

  

exports.delete = async (req, res) => {
    try {
      const id = req.params.id; // Lấy ID từ request.
  
      projectService.getall((err, initialData) => {
        if (err)
          return res.send({ result: false, error: [err] });
  
        projectService.delete(id, (err, deletedData) => {
          if (err) {
            return res.send({ result: false, error: [err] });
          }
  
          if (!deletedData) {
            return res.send({ result: false, error: [{ msg: 'Không tìm thấy bản ghi với ID đã cung cấp' }] });
          }
  
          projectService.getall((err, newData) => {
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