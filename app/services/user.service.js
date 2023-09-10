const db = require("../models/connectDb");
const dbs = require("../models/connectDb").promise();
const tableName = "tbl_users";
const User = require("../models/user.model");
const bcrypt = require('bcrypt');
const {USER_CONST, QUERY_CONST} = require("../config/constant");

const authHelper = require('../helper/auth.helper');

exports.getall = async (result) => {
    try {
        const query = `SELECT id, name, email, fullname, created_at FROM ${tableName}`;
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


const executeQuery = (query, value, result) => {
    try {
        db.query(query, value, (err, dataRes) => {
            if (err) {
                return result({ msg: err }, null);
            }
            result(null, dataRes);
        });
    } catch (err) {
        result({ msg: err }, null);
    }
};

exports.getByEmail = async (email, result) => {
    const query = `SELECT id, name, fullname FROM tbl_users WHERE email = ?`;
    executeQuery(query, email, result);
};

exports.getByName = async (name, result) => {
    const query = `SELECT id, name, fullname FROM tbl_users WHERE name = ?`;
    executeQuery(query, name, result);
};


exports.register = async (data, result) => {
    try {
        // Kiểm tra email trước
        const emailCheckResult = await new Promise((resolve, reject) => {
            exports.getByEmail(data.email, (_err, _result) => {
                if (_err) {
                    reject(_err);
                } else {
                    resolve(_result);
                }
            });
        });

        // Kiểm tra name
        const nameCheckResult = await new Promise((resolve, reject) => {
            exports.getByName(data.name, (_err, _result) => {
                if (_err) {
                    reject(_err);
                } else {
                    resolve(_result);
                }
            });
        });

        if (emailCheckResult.length > 0) {
            return result({ msg: USER_CONST.EMAIL_IS_EXSIST_IN_DB }, null);
        }

        if (nameCheckResult.length > 0) {
            return result({ msg: USER_CONST.NAME_IS_EXSIST_IN_DB }, null);
        }

        data.password = await bcrypt.hash(data.password, 1);
        const query = `INSERT INTO ${tableName} SET ?`;

        db.query(query, data, (err, dataRes) => {
            if (err) {
                return result({ success: false, message: 'Lỗi khi đăng ký tài khoản.' });
            }
            return result({ success: true, message: 'Đăng ký tài khoản thành công.'});
        });
    } catch (err) {
        result({ success: false, message: err.message });
    }
};



exports.login = async (data, result) => {
    try {
        const query = `SELECT * FROM ${tableName} WHERE email = ?`;
        db.query(query, data.email, async (err, dataRes) => {
            if (err) {
                return result({ success: false, message: 'Lỗi khi kiểm tra tài khoản.' });
            }

            if (!dataRes || dataRes.length === 0) {
                return result({ success: false, message: 'Tài khoản không tồn tại.' });
            }

            const user = dataRes[0];
            const isMatch = await bcrypt.compare(data.password, user.password);

            if (!isMatch) {
                return result({ success: false, message: 'Sai mật khẩu.' });
            }

            // Tạo access_token và refresh_token
            const access_token = await authHelper.make({ userid: user.id });
            const refresh_token = await authHelper.refreshToken({ userid: user.id });

            // Lưu refresh_token vào cơ sở dữ liệu
            const updateQuery = `UPDATE ${tableName} SET refresh_token = ? WHERE id = ?`;
            db.query(updateQuery, [refresh_token, user.id], (updateErr, updateResult) => {
                if (updateErr) {
                    return result({ success: false, message: 'Lỗi khi lưu refresh_token.' });
                }

                return result({ success: true, message: 'Đăng nhập thành công.', data: { access_token, refresh_token } });
            });
        });
    } catch (err) {
        result({ success: false, message: 'Lỗi khi đăng nhập.' });
    }
};


exports.update = async (id, data, result) => {
    try {
        const query = `UPDATE ${tableName} SET name = ?, fullname = ?, email = ?, phone = ?, refresh_token = ?, updated_at = ? WHERE id = ?`;
        const values = [
            data.name,
            data.fullname,
            data.email,
            data.phone,
            data.refresh_token,
            data.updated_at,
            id
        ];

        db.query(query, values, (err, dataRes) => {
            if (err) {
                return result({ success: false, message: err.message }, null);
            }

            if (dataRes.affectedRows === 0) {
                return result({ success: false, message: `Có vẻ như ID ${id} không tồn tại trên hệ thống` }, null);
            }

            return result(null, { success: true, message: 'Cập nhật thành công.' });
        });
    } catch (err) {
        return result({ success: false, message: QUERY_CONST.NOT_SUCCESS }, null);
    }
};
