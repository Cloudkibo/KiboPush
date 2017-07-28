/**
 * Created by sojharo on 28/07/2017.
 */

var Broadcasts = require('./broadcasts.model').Broadcasts;

var logger = require('../../components/logger');

const TAG = 'api/broadcasts/broadcasts.controller.js';

exports.index = function (req, res) {
  Broadcasts
    .create({
      type: req.body.type,
      platform: req.body.platform
    })
    .then((broadcast) => {
      logger.serverLog(TAG, 'Broadcast created: ' + JSON.stringify(broadcast));
      res.status(201).json({ status: 'success', payload: broadcast});
    });
};
