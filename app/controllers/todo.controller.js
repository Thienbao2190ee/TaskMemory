const db = require("../models/connectDb");
const { validationResult } = require("express-validator");
const todoService = require("../services/todo.service");
const rootService = require("../services/root.service")

exports.getall = async (req, res) => {
  try {
    rootService.getall('todo', 1, 10,(err, dataRes) => {
          if (err)
              return res.send({ result: false, error: [err] });
          return res.send({ result: true, ...dataRes });
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

exports.changeStatus = async (req, res) => {
  try {
      const id = req.params.id;
      const status = req.params.status


      newsService.getById(id, (err , dataRes) => {
          if (status == null || typeof status === 'undefined')
              data.status = dataRes.status
          
          // if (sort == null || typeof sort === 'undefined')
          //     data.sort = dataRes.sort    
  
          // if (hot == null || typeof hot === 'undefined')
          //     data.hot = dataRes.hot

          newsService.update(id, data, (errss, dataRes) => {
              if (errss)
                  return res.send({
                      result: false,
                      ...errss
                  });
              newsService.getById(id, (err , dataRes) => {
                  return res.send({
                      result: true,
                      msg: 'Cập nhật dữ liệu thành công',
                      data: dataRes
                  });
              })
          });
      });

  } catch (err) {
      return res.send({
          result: false,
          msg: 'Máy chủ xảy ra lỗi!',
          error: []
      });
  }
}

  

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