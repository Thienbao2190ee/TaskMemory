
const db = require("../models/connectDb");

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

exports.isExists = (tableName,data) => {
    data.forEach(element => {
        // Lấy danh sách các key trong object element
        const keys = Object.keys(element);
      
        // Lặp qua từng key và thực hiện các thao tác khác
        keys.forEach(key => {
          const exists = `SELECT COUNT(*) as count FROM ${tableName} WHERE ${key} = ?`;
          console.log(key);
          // Tiếp tục xử lý các thao tác khác với exists
        });
      });
}

exports.create = async (tableName,data, result) => {
    try {
        const query = `INSERT INTO ${tableName} SET ?`;

        data.created_at = new Date();

        const checkAliasQuery = `SELECT COUNT(*) as count FROM ${tableName} WHERE alias = ?`;
        db.query(checkAliasQuery, [data.alias], (aliasErr, aliasResult) => {
            if (aliasErr) {
                return result({ msg: 'Lỗi kiểm tra alias' }, null);
            }
            
            if (aliasResult[0].count > 0) {
                return result({ msg: 'Alias đã tồn tại trong trước đó' }, null);
            }
            
            db.query(query, data, (err, dataRes) => {
                if (err) {
                    console.log(err)
                    return result({ msg: 'Lỗi khi thêm dữ liệu' }, null);
                }
                result(null, dataRes);
            });
        });
    } catch (error) {
        result({ msg: error }, null);
    }
}