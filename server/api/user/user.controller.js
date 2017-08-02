/**
 * Created by sojharo on 27/07/2017.
 */

 var Users = require('./Users.model');

const logger = require('../../components/logger');

const TAG = 'api/user/user.controller.js';

exports.index = function (req, res) {
   Users.findOne({_id: req.user._id},(err, user) => {
     if (!user) return res.status(404).json({status: 'failed', description: 'User not found'});
     logger.serverLog(TAG, 'user object sent to client');
     res.status(200).json({status: 'success', payload: user});
   });
};
