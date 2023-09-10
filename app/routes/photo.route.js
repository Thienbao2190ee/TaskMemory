const router = require("express").Router();
const photoController = require("../controllers/photo.controller");
const jwtMiddleWare = require("../middleware/jwt.middleware");
const { upload } = require("../middleware/uploadImage.middlware");


module.exports = app => {

    router.get('/getall', 
        // jwtMiddleWare.isAuth,
        photoController.getall 
    );

    router.post('/create', 
        // jwtMiddleWare.isAuth,
        upload.fields([{ name: 'image', maxCount: 1 }, { name: 'imageCrop', maxCount: 1 }]),
        photoController.create 
    );
    router.post('/delete/:id', 
        // jwtMiddleWare.isAuth, 
        photoController.delete
    );

    app.use('/api/photo', router)
}