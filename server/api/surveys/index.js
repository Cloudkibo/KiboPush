'use strict';

var express = require('express');

var router = express.Router();

var logger = require('../../components/logger');
var controller = require('./surveys.controller');
var auth = require('../../auth/auth.service');
const TAG = 'api/surveys/index.js';



router.get('/', controller.index);
router.post('/create', controller.create);
router.post('/edit', controller.edit);
router.post('/send', controller.send);
router.post('/submitresponse', controller.submitresponse);

router.get('/:id', controller.show); //show survey and responses of the survey
router.get('/showquestions/:id',controller.showQuestions);


module.exports = router;
