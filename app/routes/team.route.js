const router = require("express").Router();
const { body } = require("express-validator");
const teamController = require("../controllers/team.controller");
const {product_CONST} = require("../config/constant");
const jwtMiddleWare = require("../middleware/jwt.middleware");
const { upload } = require("../middleware/uploadImage.middlware");


module.exports = app => {

    router.get('/getall', 
        // jwtMiddleWare.isAuth,
        teamController.getall 
    );

    router.get('/getbyid/:id', 
        // jwtMiddleWare.isAuth, 
        teamController.getById
    );

    router.post('/delete/:id', 
        // jwtMiddleWare.isAuth, 
        teamController.delete
    );

    router.post('/create', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        teamController.create 
    );

    router.post('/update/:id', 
        // jwtMiddleWare.isAuth,
        // upload.single('image'),
        teamController.update 
    );
    // router.post('/update-status/:id', 
    //     // jwtMiddleWare.isAuth,
    //     // upload.single('image'),
    //     teamController.update_status
    // );

    app.use('/api/team', router)
}