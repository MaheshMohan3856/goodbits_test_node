let functions = require('../helpers/functions'),
    mysql = require('mysql'),
    config = require('../server/config');

let authDao = {
    getUserByEmail(email=''){
        let sql = `SELECT adminId, email, name, password from admin WHERE email = ${mysql.escape(email)}`;
           return functions.selectQuery(sql);
   },
   
  
  

}


module.exports = authDao;