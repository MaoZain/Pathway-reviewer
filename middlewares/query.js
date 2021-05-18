const mysql = require('mysql');
//product
const pool  = mysql.createPool({
    host     : 'localhost',   // database address
    user     : 'pathway',    // user
    password : 'pathway147',  // password
    database : 'pathway_review'  // database
});
//develop in my own machine
// const pool  = mysql.createPool({
//   host     : 'localhost',   // database address
//   user     : 'root',    // user
//   password : 'root1234',  // password
//   database : 'pathway_600'  // database
// });

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