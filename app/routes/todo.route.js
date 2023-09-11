const router = require("express").Router();
const { body } = require("express-validator");
const todoController = require("../controllers/todo.controller");
const {product_CONST} = require("../config/constant");
const jwtMiddleWare = require("../middleware/jwt.middleware");
const { upload } = require("../middleware/uploadImage.middlware");


module.exports = app => {

    router.get('/getall', 
        // jwtMiddleWare.isAuth,
        todoController.getall 
    );

    router.get('/getbyid/:id', 
        // jwtMiddleWare.isAuth, 
        todoController.getById
    );

    router.post('/delete/:id', 
        // jwtMiddleWare.isAuth, 
        todoController.delete
    );

    router.post('/create', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        todoController.create 
    );

    router.post('/update/:id', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        todoController.update 
    );
    router.post('/update-status/:id', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        todoController.update 
    );

    app.use('/api/todo', router)
}