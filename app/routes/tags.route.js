const router = require("express").Router();
const { body } = require("express-validator");
const tagsController = require("../controllers/tags.controller");
const {product_CONST} = require("../config/constant");
const jwtMiddleWare = require("../middleware/jwt.middleware");
const { upload } = require("../middleware/uploadImage.middlware");


module.exports = app => {

    router.get('/getall', 
        // jwtMiddleWare.isAuth,
        tagsController.getall 
    );

    router.get('/getbyid/:id', 
        // jwtMiddleWare.isAuth, 
        tagsController.getById
    );

    router.post('/delete/:id', 
        // jwtMiddleWare.isAuth, 
        tagsController.delete
    );

    router.post('/create', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        tagsController.create 
    );

    router.post('/update/:id', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        tagsController.update 
    );
    // router.post('/update-status/:id', 
    //     // jwtMiddleWare.isAuth,
    //     // upload.single('image'),
    //     tagsController.update_status
    // );

    app.use('/api/tags', router)
}