const isAuth = async function (req, res, next) {
    var jwt = require("../helper/auth.helper");
    var authorizationHeader = req.headers.authorization;
    const _token = authorizationHeader?.split(" ")[1];
    if (_token) {
      try {
        await jwt
          .checkToken(_token)
          .then((data) => {
            req.user_id = data?.data?.userid;
            next();
          })
          .catch((err) => {
            res.send({
              result: false,
              error: [{ msg: err.message }],
            });
          });
      } catch (error) {
        return res.send({ result: false, msg: "Invalid token or token expired" });
      }
    } else {
      return res.send({ result: false, msg: "Token does not exist" });
    }
  };
  
  module.exports = {
    isAuth: isAuth,
  };