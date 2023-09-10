

// USER


const USER_CONST = {
    EMAIL_EMPTY: 'Email là bắt buộc',
    PASSWORD_EMPTY: 'Password là bắt buộc',
    PASSWORD_MUST_BE_8_CHARACTER: 'Password là ít nhất 8 ký tự',
    NAME_BE_3_CHARACTER: 'Tên người dùng là ít nhất 3 ký tự',

    EMAIL_IS_EXSIST_IN_DB: 'Email đã tồn tại trên hệ thống',
    NAME_IS_EXSIST_IN_DB: 'Tên người dùng đã tồn tại trên hệ thống'
}

//QUERY

const QUERY_CONST = {
    NOT_SUCCESS: 'Có lỗi xảy ra trong quá trình truy vấn'
}

const TOKEN_CONST = {
    ACCESS_TOKEN: "optech12345!@#",
    REFRESH_TOKEN: "optech123456!@#",
    TOKEN_TIME_LIFE: "7d",
    REFRESH_TOKEN_TIME_LIFE: "7d",
}

module.exports = {
    USER_CONST,
    QUERY_CONST,
    TOKEN_CONST
};