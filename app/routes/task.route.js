const router = require("express").Router();
const { body } = require("express-validator");
const taskController = require("../controllers/task.controller");
const {product_CONST} = require("../config/constant");
const jwtMiddleWare = require("../middleware/jwt.middleware");
const { upload } = require("../middleware/uploadImage.middlware");


module.exports = app => {

    router.get('/getall', 
        // jwtMiddleWare.isAuth,
        taskController.getall 
    );

    router.get('/getbyid/:id', 
        // jwtMiddleWare.isAuth, 
        taskController.getById
    );

    router.post('/delete/:id', 
        // jwtMiddleWare.isAuth, 
        taskController.delete
    );

    router.post('/create', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        taskController.create 
    );

    router.post('/update/:id', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        taskController.update 
    );
    // router.post('/update-status/:id', 
    //     // jwtMiddleWare.isAuth,
    //     // upload.single('image'),
    //     taskController.update_status
    // );

    app.use('/api/task', router)
}