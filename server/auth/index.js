/**
 * Created by sojharo on 20/07/2017.
 */
'use strict';

const express = require('express');

const router = express.Router();

const logger = require('../components/logger');
const auth = require('../auth/auth.service');
const config = require('../config/environment');
const Users = require('../api/user/Users.model');

const TAG = 'auth/index.js';

require('./facebook/passport').setup(Users, config);

router.use('/facebook', require('./facebook'));

if (config.env === 'development') {
  router.get('/local/:name', (req, res) => {
    logger.serverLog(TAG, 'localhost authentication with params: '+ JSON.stringify(req.params));
    Users.findOne({ name: req.params.name }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!err && user !== null) {
        req.user = user;
        auth.setTokenCookie(req, res);
      } else {
        let payload = new Users({
          name: req.params.name,
          locale: 'en',
          gender: req.params.name,
          provider: 'local',
          fbToken: '',
          fbId: ''
        });
        payload.save((error, userPayload) => {
          if (error) {
            return done(error);
          }
          req.user = userPayload;
          auth.setTokenCookie(req, res);
        });
      }
    });
  });
}


module.exports = router;
