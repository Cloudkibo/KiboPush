'use strict';

const express = require('express');

const router = express.Router();

const logger = require('../../components/logger');
const controller = require('./surveys.controller');
const auth = require('../../auth/auth.service');
const TAG = 'api/surveys/index.js';


router.get('/', auth.isAuthenticated(),controller.index);
router.post('/create',auth.isAuthenticated(), controller.create);
router.post('/edit',auth.isAuthenticated(), controller.edit);
router.post('/send', auth.isAuthenticated(),controller.send);
router.post('/submitresponse', controller.submitresponse);

router.get('/:id',auth.isAuthenticated(), controller.show); //show survey and responses of the survey
router.get('/showquestions/:id',auth.isAuthenticated(), controller.showQuestions);


module.exports = router;
