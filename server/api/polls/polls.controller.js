/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Polls = require('./Polls.model');
const PollResponse = require('./pollresponse.model');

const TAG = 'api/polls/polls.controller.js';


exports.index = function (req, res) {
  logger.serverLog(TAG, 'Poll get api is working');
  Polls.find((err, polls) => {
    logger.serverLog(TAG, polls);
    logger.serverLog(TAG, `Error: ${err}`);
    res.status(200).json({ status: 'success', payload: polls });
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

exports.submitresponses = function (req, res) {
    logger.serverLog(TAG, `Inside submitresponses of Poll ${JSON.stringify(req.body)}`);
    /*
    Expected body
    {
    response:String,//response submitted by subscriber
    pollId: _id of Poll,
    subscriberId: _id of subscriber,
    }
    */

    PollResponse.create(req.body, (err, pollresponse) => {
    if (err) {
       return res.status(404).json({ status: 'failed', description: 'Poll response not created' });
     }
      return res.status(200).json({ status: 'success', payload: pollresponse });
   });
};


exports.getresponses = function (req, res) {
    logger.serverLog(TAG, 'Inside getresponses of Poll');

    PollResponse.find({ pollId: req.params.id }).populate('pollId subscriberId').exec((err, pollresponses) => {
              if (err) {
                return res.status(404).json({ status: 'failed', description: 'Poll responses not found' });
              }

                return res.status(200).json({ status: 'success', payload: pollresponses });
             });
};
exports.report = function (req, res) {

};
exports.send = function (req, res) {

};


exports.seed = function (req, res) {
 const rawDocuments = [
   { platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0 },
   { platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0 },
   { platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0 },
   { platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0 },
   { platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0 },
   ];

 Polls.insertMany(rawDocuments)
      .then((mongooseDocuments) => {
          logger.serverLog(TAG, 'Polls Table Seeded');
          res.status(200).json({ status: 'Success' });
      })
      .catch((err) => {
          /* Error handling */
          logger.serverLog(TAG, 'Unable to seed the database');
          res.status(500).json({ status: 'Failed', err });
      });
};
