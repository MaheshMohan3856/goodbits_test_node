let functions = require('../helpers/functions'),
    mysql = require('mysql'),
    config = require('../server/config');

let userDao = {
    getEmployees(search){
        let sql = `SELECT employeeId,name, email,age,mobile,address  from employee`;

        if(search != "" ){
         sql = sql + ` WHERE employeeId LIKE "%${search}%" OR name LIKE "%${search}%" OR email LIKE "%${search}%" OR age LIKE "%${search}%" OR mobile LIKE "%${search}%" OR address LIKE "%${search}%"`;
        }
           return functions.selectQuery(sql);
   },
   getUserByEmail(email=''){
    let sql = `SELECT employeeId, email, name, password from employee WHERE email = ${mysql.escape(email)}`;
       return functions.selectQuery(sql);
   },
   
  
  

}


module.exports = userDao;