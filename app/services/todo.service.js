const db = require("../models/connectDb");
const dbs = require("../models/connectDb").promise();
const tableName = "todo";
// const Product = require("../models/product.model");
const bcrypt = require('bcrypt');
const {USER_CONST, QUERY_CONST} = require("../config/constant");

// const { deleteImage } = require('../utils/uploadImage');

const authHelper = require('../helper/auth.helper');

exports.getall = async (result) => {
    try {
        const query = `SELECT * FROM ${tableName} ORDER BY id desc`;
        db.query(query, (err, dataRes) => {
            if (err) {
                return result({ msg: 'Lỗi' }, null);
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: error }, null);
    }
};

exports.create = async (data, result) => {
    try {
        const query = `INSERT INTO ${tableName} SET ?`;

        console.log(data);

        data.created_at = new Date();

        const checknameQuery = `SELECT COUNT(*) as count FROM ${tableName} WHERE name = ?`;
        db.query(checknameQuery, [data.name], (nameErr, nameResult) => {
            if (nameErr) {
                return result({ msg: 'Lỗi kiểm tra name' }, null);
            }
            
            if (nameResult[0].count > 0) {
                return result({ msg: 'name đã tồn tại trong trước đó' }, null);
            }
            
            db.query(query, data, (err, dataRes) => {
                if (err) {
                    return result({ msg: 'Lỗi khi thêm dữ liệu' }, null);
                }
                result(null, dataRes);
            });
        });
    } catch (error) {
        result({ msg: error }, null);
    }
}

exports.update = async (id, data, result) => {
    try {
        const query = `UPDATE ${tableName} SET ? WHERE id = ?`;

        // Đảm bảo không thay đổi trường created_at
        delete data.created_at;

        db.query(query, [data, id], (err, dataRes) => {
            if (err) {
                return result({ msg: err }, null);
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: error }, null);
    }
}




exports.getById = async (id, result) => {
    try {
        const query = `SELECT * FROM ${tableName} WHERE id = ?`;
        db.query(query, [id], (err, dataRes) => {
            if (err) {
                return result({ msg: 'Lỗi khi truy vấn dữ liệu' }, null);
            }

            if (dataRes && dataRes.length > 0) {
                return result(null, dataRes[0]); 
            } else {
                return result({ msg: 'Không tìm thấy bản ghi với ID đã cho' }, null);
            }
        });
    } catch (error) {
        result({ msg: error }, null);
    }
};

exports.delete = async (id, result) => {
    try {
        const query = `DELETE FROM ${tableName} WHERE id = ?`;
        db.query(query, [id], (err, deleteRes) => {
            if (err) {
                return result({ msg: 'Lỗi khi xóa dữ liệu' }, null);
            }

            if (deleteRes.affectedRows === 0) {
                return result({ msg: 'Không tìm thấy bản ghi với ID đã cho' }, null);
            } else {
                return result(null, { msg: `Xóa dữ liệu ID:${id} thành công` });
            }
        });
    } catch (error) {
        result({ msg: error }, null);
    }
};

