/**
 * Created by sojharo on 28/07/2017.
 */

var Polls = require('./polls.model').Polls;

var logger = require('../../components/logger');

const TAG = 'api/broadcasts/broadcasts.controller.js';

exports.index = function (req, res) {
  Polls
    .create({
      statement: req.body.statement
    })
    .then((poll) => {
      logger.serverLog(TAG, 'Poll created: ' + JSON.stringify(poll));
      res.status(201).json({ status: 'success', payload: poll});
    });
};
