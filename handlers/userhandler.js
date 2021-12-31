let express = require('express'),
jwt = require('jsonwebtoken'),
functions = require('../helpers/functions'),
config = require('../server/config'),
emailValidator = require('email-validator'),
user = require('../dao/userDao');




let userHandler = {

   getList(req,res,next){
      
       let search = req.body.search;
    
        user.getEmployees(search)
            .then((result) => {

            
             res.json({ "status": true, "function": "getList", "message": "Fetched Successfully", "data": result });

            })
           
            .catch((err) => {
                console.log(err);
                res.json({ "status": false, "function": "login", error: err, "message": "Connection error", "errorcode": "serverError" });
            })
    },
    addEmployee(req,res,next){

        console.log("req.body",req.body);
        if (!req.body.name) res.json({ "status": false, "function": "addEmployee", "message": "Name is required", "errorcode": "validationError" });

    //    else if (!req.body.email) res.json({ "status": false, "function": "addEmployee", "message": "Email is required", "errorcode": "validationError" });
    
    //     else if (!emailValidator.validate(req.body.email)) res.json({ "status": false, "function": "addEmployee", "message": "Invalid email", "errorcode": "validationError" });
    
    //     else if (!req.body.age) res.json({ "status": false, "function": "addEmployee", "message": "Password is required", "errorcode": "validationError" });
    
    //     else if (!req.body.mobile) res.json({ "status": "false", "function": "addEmployee", "message": "Mobile is required", "errorcode": "validationError" });
    
        else {
    
            let userDetails = {};
    
            userDetails.name = req.body.name;
    
            userDetails.email = req.body.email;
    
            userDetails.age = req.body.age;

            userDetails.mobile = req.body.mobile;

            userDetails.address = req.body.address;

            
            
    
            user.getUserByEmail(req.body.email)
                .then((user_details) => {
    
                    if (user_details.length) res.json({ "status": false, "function": "addEmployee", "message": "Email already exists." });
    
                    else {
    
                        
                        return functions.insert('employee', userDetails);
    
                    } 
    
                })
    
                .then((result) => {
    
                   
    
                    if (!result.insertId) throw 'Database error';
    
                    else 
    
                      
    
                    res.json({ "status": true, "function": "addEmployee", "message": "Successfully Added" });
                })
    
                .catch((err) => {
                    console.log(err);
                    res.json({ "status": false, "function": "addEmployee", error: err, "message": "Connection error", "errorcode": "serverError" });
                })
            }
    
    },
    updateEmployee(req,res,next){
        console.log("req.body",req.body);
        if (!req.body.name) res.json({ "status": false, "function": "addEmployee", "message": "Name is required", "errorcode": "validationError" });

    //    else if (!req.body.email) res.json({ "status": false, "function": "addEmployee", "message": "Email is required", "errorcode": "validationError" });
    
    //     else if (!emailValidator.validate(req.body.email)) res.json({ "status": false, "function": "addEmployee", "message": "Invalid email", "errorcode": "validationError" });
    
    //     else if (!req.body.age) res.json({ "status": false, "function": "addEmployee", "message": "Password is required", "errorcode": "validationError" });
    
    //     else if (!req.body.mobile) res.json({ "status": "false", "function": "addEmployee", "message": "Mobile is required", "errorcode": "validationError" });
    
        else {
    
            let userDetails = {};

           
    
            userDetails.name = req.body.name;
    
            userDetails.age = req.body.age;

            userDetails.mobile = req.body.mobile;

            userDetails.address = req.body.address;

            
            
    
            functions.update('employee', userDetails,{"employeeId": req.body.empId})
        
                .then((result) => {
    
                   
    
                    if (!result.affectedRows) throw 'Database error';
    
                    else 
    
                      
    
                    res.json({ "status": true, "function": "updateEmployee", "message": "Successfully Updated" });
                })
    
                .catch((err) => {
                    console.log(err);
                    res.json({ "status": false, "function": "updateEmployee", error: err, "message": "Connection error", "errorcode": "serverError" });
                })
            }
    },
    deleteEmployee(req,res,next){
       
        functions.delete("employee",{"employeeId":req.body.empId})
        .then((result)=>{
            res.json({ "status": true, "function": "deleteEmployee", "message": "Successfully Deleted" });
        })

    }
 }



module.exports = userHandler;

