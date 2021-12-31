var express = require('express');
var router = express.Router();
var functions = require('../helpers/functions');
var authHandler = require('../handlers/authHandler');


router.post('/login',authHandler.login);

router.post('/register',authHandler.register);

module.exports = router;