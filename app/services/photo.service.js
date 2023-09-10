const db = require("../models/connectDb");
const dbs = require("../models/connectDb").promise();
const tableName = "tbl_photo";
const PhotoModel = require("../models/photo.model");
const bcrypt = require('bcrypt');
const {USER_CONST, QUERY_CONST} = require("../config/constant");

const { deleteImage } = require('../utils/uploadImage');

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

exports.create = async (newData, result) => {
    try {
        const query = 'INSERT INTO ' + tableName + ' SET ?';

        newData.created_at = new Date();

        db.query(query, newData, (err, dataRes) => {
            if (err) {
                console.log(err)
                return result({ msg: 'Lỗi khi chèn dữ liệu' }, null);
            }
            result(null, { id: dataRes.insertId, ...newData });
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