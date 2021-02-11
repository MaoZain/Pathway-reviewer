const mysql = require('mysql');
const pool  = mysql.createPool({
    host     : 'mysql_container',   // database address
    user     : 'root',    // user
    password : '123456',  // password
    database : 'pathway'  // database
});

//connect to databse
let fn_query = function( sql, values ) {
    // return a Promise
    return new Promise(( resolve, reject ) => {
      pool.getConnection(function(err, connection) {
        if (err) {
          reject( err )
        } else {
          connection.query(sql, values, ( err, rows) => {
            if ( err ) {
              reject( err );
              console.log(err);
            } else {
              resolve( rows )
            }
            // kill connection
            connection.release()
          })
        }
      })
    })
}
  
module.exports =  fn_query