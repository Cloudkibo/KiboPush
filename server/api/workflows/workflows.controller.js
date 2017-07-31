/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Workflows = require('./Workflows.model');
const TAG = 'api/workflows/workflows.controller.js';


exports.index = function (req, res) {
  Workflows.find((err, workflows) => {
    logger.serverLog(TAG, workflows);
    logger.serverLog(TAG, `Error: ${err}`);
    res.status(200).json(workflows);  
  });
};

exports.create = function (req, res) {
    const poll = new Polls({ platform: 'facebook',
statement: req.body.statement,
          options: req.body.options,
sent: 0 });

    //save model to MongoDB
    poll.save((err) => {
      if (err) {
        res.status(500).json({ status: 'Failed', error: err, description: 'Failed to insert record' });
      } else {
        res.status(200).json({ status: 'Success' });
      }
    });
};

exports.report = function (req, res) {
 
};
exports.send = function (req, res) {
   
};


exports.seed = function (req, res) {
 const rawDocuments = [
   { condition: 'message contains', keywords: ['Hi', 'Hello', 'Howdy'], reply: 'How are you?', isActive: true, sent: 0 },
   { condition: 'message contains', keywords: ['Hi', 'Hello', 'Howdy'], reply: 'How are you?', isActive: true, sent: 0 },
   { condition: 'message contains', keywords: ['Hi', 'Hello', 'Howdy'], reply: 'How are you?', isActive: true, sent: 0 },
   { condition: 'message contains', keywords: ['Hi', 'Hello', 'Howdy'], reply: 'How are you?', isActive: true, sent: 0 },
   { condition: 'message contains', keywords: ['Hi', 'Hello', 'Howdy'], reply: 'How are you?', isActive: true, sent: 0 },
   ];

 Workflows.insertMany(rawDocuments)
      .then((mongooseDocuments) => {
          logger.serverLog(TAG, 'Workflows Table Seeded');
          res.status(200).json({ status: 'Success' });
      })
      .catch((err) => {
          /* Error handling */
          logger.serverLog(TAG, 'Unable to seed the database');
          res.status(500).json({ status: 'Failed', err });
      });
};
