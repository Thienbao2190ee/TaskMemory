const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const app = express();

const port = process.env.PORT;
const base_url = process.env.BASE_URL;

require('dotenv').config
app.use(express.json());

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));

var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); //Cấp quyền cho client được truy cập để sử dụng tài nguyên, "*" là tất cả client.
    res.header(
      "Access-Control-Allow-Methods",
      "GET,PUT,POST,DELETE, OPTIONS, PATCH"
    ); // Các phương thức của client khi gọi api
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    ); //Content-Type: application/json định dạng kiểu dữ liệu json
    res.header("Access-Control-Allow-Credentials", true);
    next();
  };
  app.use(allowCrossDomain); // nhận biến allowCrossDomain ở trên
  app.use(cors({ origin: true, credentials: true })); // origin: true cho phép client truy cập.
  

require('./app/routes/user.route.js')(app)
require('./app/routes/product.route.js')(app)
require('./app/routes/photo.route')(app)
require('./app/routes/project.route')(app)
require('./app/routes/todo.route')(app)
require('./app/routes/task.route')(app)
require('./app/routes/team.route')(app)
require('./app/routes/tags.route')(app)


app.listen(port, function () {
    console.log(`Hi Bro! We was be running in ${base_url}:${port}`)
})