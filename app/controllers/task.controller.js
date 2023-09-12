const db = require("../models/connectDb");
const { validationResult } = require("express-validator");
const taskService = require("../services/task.service");

// const {processAndSaveImage, deleteImage} = require('../utils/uploadImage')

exports.getall = async (req, res) => {
  try {
    taskService.getall((err, dataRes) => {
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

      taskService.getById(id, (err, dataRes) => {
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
      name: req.body.name,
      des:  req.body.des,
      status:  req.body.status,
      sort:  req.body.sort,
      publish:  req.body.publish,
      projectid: req.body.projectid,
      userid: req.body.userid,
      type: req.body.type,
      created_at : new Date,
    }

    taskService.create(data, (errss, dataRes) => {
        if (errss) {
            console.log('error todo:::', errss);
            return res.send({
                result: false,
                error: errss
            });
        }

            taskService.getall((err, dataRes) => {
                if (err)
                    return res.send({ result: false, error: 'Tạo dữ liệu không thành công' });
                return res.send({ result: true, data: {msg: 'Tạo dữ liệu mới thành công', newData: dataRes} });
            })
      })

  } catch (err) {
      return res.send({
          result: false,
          error: {msg : 'Máy chủ xảy ra lỗi!'}
      });
  }
};



exports.update = async (req, res) => {
    try {
        const id = req.params.id; // Lấy ID của bản ghi cần cập nhật từ request.

        // Lấy bản ghi hiện tại bằng ID
        taskService.getById(id, async (err, dataRes) => {
            if (err) {
                return res.send({ result: false, error: 'Đã xẫy ra lỗi' });
            }

            if (!dataRes) {
                return res.send({ result: false, error: 'Không tìm thấy bản ghi với ID đã cung cấp'});
            }

            // Tạo một đối tượng dữ liệu mới dựa trên dữ liệu hiện tại và dữ liệu mới từ yêu cầu
            let data = {
              name: req.body.name || dataRes.name,
              des:  req.body.des || dataRes.des,
              status:  req.body.status || dataRes.status,
              sort:  req.body.sort || dataRes.sort,
              publish:  req.body.publish || dataRes.publish,
              projectid: req.body.projectid || dataRes.projectid,
              userid: req.body.userid || dataRes.userid,
              type: req.body.type || dataRes.type,
              created_at : dataRes.created_at,
              updated_at : new Date ,
            };

            // Cập nhật bản ghi với dữ liệu mới
            taskService.update(id, data, (errss, dataRes) => {
                if (errss)
                    return res.send({
                        result: false,
                        error: [errss]
                    });

                // Sau khi cập nhật thành công, lấy dữ liệu mới bằng cách gọi hàm getprojectById hoặc getall
                taskService.getall((err, newDataRes) => {
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
  
      taskService.getall((err, initialData) => {
        if (err)
          return res.send({ result: false, error: [err] });
  
        taskService.delete(id, (err, deletedData) => {
          if (err) {
            return res.send({ result: false, error: [err] });
          }
  
          if (!deletedData) {
            return res.send({ result: false, error: [{ msg: 'Không tìm thấy bản ghi với ID đã cung cấp' }] });
          }
  
          taskService.getall((err, newData) => {
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