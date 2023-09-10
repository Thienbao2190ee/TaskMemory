const router = require("express").Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const {USER_CONST} = require("../config/constant");
const jwtMiddleWare = require("../middleware/jwt.middleware")

module.exports = app => {

    router.post('/register', [
        body('fullname', 'Tên đầy đủ của bạn cần ít nhất 3 kí tự')
        .isLength( {min: 3} ),
        body('name', 'Tên người dùng bạn cần ít nhất 3 kí tự')
        .isLength( {min: 3} ),
        body('email', 'Email không hợp lệ')
        .isEmail(),
        body('phone', 'Số điện thoại không đúng định dạng')
        .isNumeric()
        .isMobilePhone(),
        body('password', USER_CONST.PASSWORD_EMPTY)
        .notEmpty(),
    ], userController.register);

    router.post('/login', [
        body("email", USER_CONST.EMAIL_EMPTY)
        .notEmpty(),
        body("password", USER_CONST.PASSWORD_EMPTY)
        .notEmpty(),
        body("password", USER_CONST.PASSWORD_MUST_BE_8_CHARACTER)
        .isLength({ min: 8 }),
    ], userController.login);

    router.get('/getall', 
    jwtMiddleWare.isAuth,
    userController.getall 
    );

    router.put('/updatebyid/:id', userController.update);

    app.use('/api/user', router)
}