const router = require("express").Router();
const { body } = require("express-validator");
const projectController = require("../controllers/project.controller");
const {product_CONST} = require("../config/constant");
const jwtMiddleWare = require("../middleware/jwt.middleware");
const { upload } = require("../middleware/uploadImage.middlware");


module.exports = app => {

    router.get('/getall', 
        // jwtMiddleWare.isAuth,
        projectController.getall 
    );

    router.get('/getbyid/:id', 
        // jwtMiddleWare.isAuth, 
        projectController.getById
    );

    router.post('/delete/:id', 
        // jwtMiddleWare.isAuth, 
        projectController.delete
    );

    router.post('/create', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        projectController.create 
    );

    router.post('/update/:id', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        projectController.update 
    );

    app.use('/api/project', router)
}