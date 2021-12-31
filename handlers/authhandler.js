let express = require('express'),
jwt = require('jsonwebtoken'),
moment = require('moment'),
functions = require('../helpers/functions'),
randomstring = require('randomstring'),
randToken = require('rand-token'),
fs = require('fs'),
config = require('../server/config'),
auth = require('../dao/authDao'),
emailValidator = require('email-validator');



let authHandler = {

   login(req,res,next){

    let loginDet = {};

    let param = {};



    if (!req.body.email) res.json({ "status": false, "function": "login", "message": "Email is required.", "errorcode": "validationError" });

    else if (!req.body.password) res.json({ "status": false, "function": "login", "message": "Password is required.", "errorcode": "validationError" });
     
    else {
        auth.getUserByEmail(req.body.email)
            .then((result) => {

                let password = '';

                if (!result.length) res.json({ "status": false, "function": "login", "message": "User does not exist", "errorcode": "validationError" });

                    password = result[0].password;

                if (password != req.body.password) res.json({ "status": false, "function": "login", "message": "Incorrect Password", "errorcode": "validationError" });

               

                else {

                    param = {
                        employeeId:result[0].employeeId,
                        email:result[0].email,
                        
                    }

                    loginDet = result[0];


                        let token = jwt.sign(param, config.secret, {
                            expiresIn: 10000 
                        });
    
   
                        res.setHeader("AuthToken", token);
    
        
                        delete loginDet['password'];

                      

                            res.json({ "status": true, "function": "login", "message": "Logged in successfully.", "data": loginDet });

                }

            })
           
            .catch((err) => {
                console.log(err);
                res.json({ "status": false, "function": "login", error: err, "message": "Connection error", "errorcode": "serverError" });
            })
    }
 },



 register(req, res, next) {

    console.log("reqest",req.body);

    if (!req.body.name) res.json({ "status": false, "function": "register", "message": "Name is required", "errorcode": "validationError" });

    else if (!req.body.email) res.json({ "status": false, "function": "register", "message": "Email is required", "errorcode": "validationError" });

    else if (!emailValidator.validate(req.body.email)) res.json({ "status": false, "function": "register", "message": "Invalid email", "errorcode": "validationError" });

    else if (!req.body.password) res.json({ "status": false, "function": "register", "message": "Password is required", "errorcode": "validationError" });

    //else if (!req.body.phone) res.json({ "status": "false", "function": "register", "message": "Phone is required", "errorcode": "validationError" });

    else {

        let userDetails = {};

        userDetails.name = req.body.name;

        userDetails.email = req.body.email;

        userDetails.password = req.body.password;
        

        auth.getUserByEmail(req.body.email)
            .then((user_details) => {

                if (user_details.length) res.json({ "status": false, "function": "register", "message": "Email already exists." });

                else {

                    
                    return functions.insert('admin', userDetails);

                } 

            })

            .then((result) => {

               

                if (!result.insertId) throw 'Database error';

                else 

                  

                res.json({ "status": true, "function": "register", "message": "Successfully Registered" });
            })

            .catch((err) => {
                console.log(err);
                res.json({ "status": false, "function": "register", error: err, "message": "Connection error", "errorcode": "serverError" });
            })



    }


},


}

module.exports = authHandler;