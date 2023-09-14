
const db = require("../models/connectDb");

exports.create = async (tableName, data, result) => {
    try {
        const query = `INSERT INTO ${tableName} SET ?`;

        data.created_at = new Date();
            
        db.query(query, data, (err, dataRes) => {
            if (err) {
                console.log(err)
                return result({ msg: 'Lỗi khi thêm dữ liệu' }, null);
            }
            result(null, dataRes);
        });
    } catch (error) {
        result({ msg: error }, null);
    }
}

exports.getById = async(tableName, id, fields, result) => {
	try {
        if( fields.trim() == '*') 
            var selectedFields = '*';
        else
            var selectedFields = fields.map(field => `${tableName}.${field}`).join(', ');

		const query = `SELECT ${selectedFields} FROM ${tableName} WHERE id = ?`;

		db.query(query, [id], (err, dataRes) => {
			if (err) {
				console.log(err);
				return result({
					msg: 'Lỗi khi truy vấn dữ liệu'
				}, null);
			}
			result(null, dataRes);
		});
	} catch (error) {
		result({
			msg: error
		}, null);
	}
};

exports.getall = async (tableName,page, resultsPerPage, result) => {
    try { 
        const offset = (page - 1) * resultsPerPage;
        
        const countQuery = `SELECT COUNT(*) as rowCount FROM ${tableName}`;
        db.query(countQuery, (countErr, countRes) => {
            if (countErr) {
                console.log(countErr);
                return result({ msg: 'Lỗi' }, null);
            }

            const rowCount = countRes[0].rowCount;
            const maxPage = Math.ceil(rowCount / resultsPerPage);

            if (page < 1 || page > maxPage) {
                return result({ msg: 'Invalid page number' }, null);
            }

            const query = `
            SELECT *
            FROM ${tableName}
            ORDER BY id DESC
            LIMIT ?, ?;
            `;

            db.query(query, [offset, resultsPerPage], (err, dataRes) => {
                if (err) {
                    console.log(err);
                    return result({ msg: 'Lỗi' }, null);
                }

                const nextPage = page < maxPage ? page + 1 : null;
                const prePage = page > 1 ? page - 1 : null;

                result(null, {
                    data: dataRes,
                    maxPage: maxPage,
                    currentPage: page,
                    nextPage: nextPage,
                    prePage: prePage,
                });
            });
        });
    } catch (error) {
        console.log(error);
        result({ msg: error }, null);
    }
};


exports.update = async(tableName, id, newData, result) => {
	try {
		const selectQuery = `SELECT * FROM ${tableName} WHERE id = ?`;

		db.query(selectQuery, [id], (selectErr, selectData) => {
			if (selectErr) {
				console.log(selectErr);
				return result({
					msg: 'Lỗi khi truy vấn dữ liệu cũ'
				}, null);
			}

			if (selectData.length === 0) {
				return result({
					msg: 'Không tìm thấy dữ liệu để cập nhật'
				}, null);
			}

			const oldData = selectData[0];

			const updateQuery = `UPDATE ${tableName} SET ? WHERE id = ?`;

			const updatedData = {...oldData, ...newData
			};

			db.query(updateQuery, [updatedData, id], (updateErr, updateDataRes) => {
				if (updateErr) {
					console.log(updateErr);
					return result({
						msg: 'Lỗi khi cập nhật dữ liệu'
					}, null);
				}
				result(null, updateDataRes);
			});
		});
	} catch (error) {
		result({
			msg: error
		}, null);
	}
};

exports.deleteById = async(tableName, id, result) => {
	try {
		const query = `DELETE FROM ${tableName} WHERE id = ?`;

		db.query(query, [id], (err, dataRes) => {
			if (err) {
				console.log(err);
				return result({
					msg: 'Lỗi khi xóa dữ liệu'
				}, null);
			}
			result(null, dataRes);
		});
	} catch (error) {
		result({
			msg: error
		}, null);
	}
};

exports.isExists = async(tableName, data) => {
	try {
		for (const element of data) {
			const keys = Object.keys(element);

			const promises = keys.map(async(key) => {
				const query = 'SELECT COUNT(*) AS count FROM ?? WHERE ?? = ?';
				const values = [tableName, key, element[key]];
				const [rows] = await connection.promise().query(query, values);
				return rows[0].count > 0;
			});

			const results = await Promise.all(promises);

			if (results.includes(true)) {
				return true;
			}
		}
		return false;
	} catch (error) {
		console.error('Lỗi:', error);
		return false;
	} finally {
		connection.end();
		return false;
	}
};