const mysql = require('mysql');
const pool  = mysql.createPool({
    host     : '127.0.0.1',   // 数据库地址
    user     : 'root',    // 数据库用户
    password : '123456',  // 数据库密码
    database : 'pathway'  // 选中数据库
});
const fn_query = require("./query")

let fn_loadElement = async(figId) => {
    let result = await fn_query(`SELECT *\
    FROM Gene\
    WHERE fig_id = ${figId};`);
    return await result;
}

module.exports = fn_loadElement;