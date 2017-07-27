/**
 * Created by sojharo on 20/07/2017.
 */
'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../components/logger');
var config = require('../config/environment');
var Users = require('../api/user/user.model').Users;

const TAG = 'auth/index.js';

require('./facebook/passport').setup(Users, config);

router.use('/facebook', require('./facebook'));


module.exports = router;
