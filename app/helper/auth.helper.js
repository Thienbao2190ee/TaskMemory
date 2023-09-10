const { constants } = require("fs/promises");
const jwt = require("jsonwebtoken");
const Constants = require("../config/constant");
const RBush = require("rbush");
const tree = new RBush(16);

const {
  TOKEN_TIME_LIFE,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_TIME_LIFE,
} = Constants.TOKEN_CONST;
// console.log(ACCESS_TOKEN);

let make = async function (data) {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await jwt.sign(
        data,
        ACCESS_TOKEN,
        { algorithm: "HS256", expiresIn: TOKEN_TIME_LIFE }
      );
      resolve(token);
    } catch (err) {
      reject(err);
    }
  });
};

let refreshToken = async function (data) {
  return new Promise(async (resolve, reject) => {
    try {
      const refreshToken = await jwt.sign(
        data,
        REFRESH_TOKEN,
        { algorithm: "HS256", expiresIn: REFRESH_TOKEN_TIME_LIFE }
      );
      resolve(refreshToken);
    } catch (err) {
      reject(err);
    }
  });
};

// check token
let checkToken = function (token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, ACCESS_TOKEN, function (err, data) {
      if (err) {
        // console.log(err);
        return reject(err);
      }
      console.log(data)
      return resolve({ data: data });
    });
  });
};

module.exports = {
  make: make,
  refreshToken: refreshToken,
  checkToken: checkToken,
  tree,
};
