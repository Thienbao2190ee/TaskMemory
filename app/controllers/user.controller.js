const db = require("../models/connectDb");
const { validationResult } = require("express-validator");
const userService = require("../services/user.service");

exports.login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        result: false,
        error: errors.array(),
      });
    }

    userService.login(req.body, (err, dataRes) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      }
      return res.send({
        result: true,
        data: dataRes,
      });
    });

  } catch (err) {
    console.error(err);
    res.send({
      result: false,
      error: [err],
    });
  }

};


exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(200).send({
        result: false,
        error: errors.array(),
      });
    }

    userService.register(req.body, (err, dataRes) => {
      if (err) {
        return res.send({
          result: false,
          error: [err],
        });
      } else {
        // Chỉ gửi một phản hồi duy nhất ở đây
        return res.send({
          result: true,
          data: dataRes,
        });
      }
    });

  } catch (err) {
    console.error(err);
    res.send({
      result: false,
      error: [err],
    });
  }  
};

exports.getall = async (req, res) => {
  try {
      userService.getall((err, dataRes) => {
          if (err)
              return res.send({ result: false, error: [err] });

          // Chuyển đổi email từ Buffer thành chuỗi (string)
          dataRes = dataRes.map(item => {
              if (item.email && item.email instanceof Buffer) {
                  item.email = item.email.toString();
              }
              return item;
          });

          return res.send({ result: true, data: dataRes });
      })
  } catch (err) {
      return res.send({ result: false, error: [err] });
  }
}


exports.update = async (req, res) => {
  try{
    const id = req.params.id
    console.log(id)
    userService.update(id, {
      name: req.body.name,
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      refresh_token: req.body.refresh_token,
      updated_at: new Date(),
    }, (err, dataRes) => {
      if(err)
        return res.send({result: false, error: [err]});

      return res.send({result: true, data: dataRes});
    })
  }catch(err){
    return res.send({result: false, error: [err]});
  }
}

exports.delete = async (req, res) => {
  try{
    const id = req.params.id
  }catch(err){
    
  }
}