var express = require('express');
var router = express.Router();
var functions = require('../helpers/functions');
var userHandler = require('../handlers/userHandler');


router.post('/getList',userHandler.getList);

router.post('/addEmployee',userHandler.addEmployee);

router.post('/updateEmployee',userHandler.updateEmployee);

router.post('/deleteEmployee', userHandler.deleteEmployee);


module.exports = router;
