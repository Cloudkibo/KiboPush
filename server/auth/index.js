/**
 * Created by sojharo on 20/07/2017.
 */
'use strict';

const express = require('express');

const router = express.Router();

const logger = require('../components/logger');
const config = require('../config/environment');
const Users = require('../api/user/Users.model');

const TAG = 'auth/index.js';

require('./facebook/passport').setup(Users, config);

router.use('/facebook', require('./facebook'));


module.exports = router;
