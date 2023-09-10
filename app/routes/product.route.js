const router = require("express").Router();
const { body } = require("express-validator");
const productController = require("../controllers/product.controller");
const {product_CONST} = require("../config/constant");
const jwtMiddleWare = require("../middleware/jwt.middleware");
const { upload } = require("../middleware/uploadImage.middlware");


module.exports = app => {

    router.get('/getall', 
        jwtMiddleWare.isAuth,
        productController.getall 
    );

    router.get('/getbyid/:id', 
        jwtMiddleWare.isAuth, 
        productController.getById
    );

    router.post('/delete/:id', 
        jwtMiddleWare.isAuth, 
        productController.delete
    );

    router.post('/create', 
        jwtMiddleWare.isAuth,
        upload.single('image'),
        productController.create 
    );

    router.post('/update/:id', 
        jwtMiddleWare.isAuth,
        upload.single('image'),
        productController.update 
    );

    app.use('/api/product', router)
}