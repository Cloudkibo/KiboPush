/**
 * Created by sojharo on 27/07/2017.
 */

var logger = require('../../components/logger');
var Polls = require('./Polls.model');
const TAG = 'api/polls/polls.controller.js';



exports.index = function (req, res) {
  Polls.find(function(err, polls){
    logger.serverLog(TAG,  polls);
    logger.serverLog(TAG, "Error: " +  err);
    res.status(200).json(polls)  
  })
};

exports.create = function (req, res) {
    var poll = new Polls({platform: 'facebook', statement: req.body.statement,
          options: req.body.options, sent: 0 });

    //save model to MongoDB
    poll.save(function (err) {
      if (err) {
        res.status(500).json({status: 'Failed', error: err, description: 'Failed to insert record'});
      }
      else {
        res.status(200).json({status: 'Success'});
      }
    });
};

exports.report = function (req, res) {
 
};
exports.send = function (req, res) {
   
};



exports.seed = function (req, res) {
 var rawDocuments = [
   {platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0 },
   {platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0 },
   {platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0},
   {platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0 },
   {platform: 'facebook', statement: 'Can smoking cause cancer', options: ['Yes', 'No', 'Dont Care'], sent: 0},
   ];

 Polls.insertMany(rawDocuments)
      .then(function(mongooseDocuments) {
          logger.serverLog(TAG, "Polls Table Seeded");
          res.status(200).json({status: 'Success'});
      })
      .catch(function(err) {
          /* Error handling */
          logger.serverLog(TAG, "Unable to seed the database");
          res.status(500).json({status: 'Failed', err: err});
      });
};