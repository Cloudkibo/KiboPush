/**
 * Created by sojharo on 27/07/2017.
 */

var logger = require('../../components/logger');
var Broadcasts = require('../broadcasts/Broadcasts.model');
const TAG = 'api/pages/pages.controller.js';



exports.index = function (req, res) {
  Broadcasts.find({type:'poll'},function(err, polls){
    logger.serverLog(TAG,  polls);
    logger.serverLog(TAG, "Error: " +  err);
    res.status(200).json(polls)  
  })
};

exports.create = function (req, res) {

};

exports.report = function (req, res) {
 
};
exports.send = function (req, res) {
   
};



exports.seed = function (req, res) {
 var rawDocuments = [
   {platform: 'facebook', type: 'poll', 
   poll: {statement: 'Do you think social media destroys productivity',
   options:[{optionStatment: 'Yes'}, {optionStatment: 'No'}, {optionStatment: 'Maybe'}]},
   survey: [], message: null, userId: '1', pageId: '1', media: null, link: null},
   {platform: 'facebook', type: 'poll', 
   poll: {statement: 'Do you see global warming as a real threat',
   options:[{optionStatment: 'Yes'}, {optionStatment: 'No'}, {optionStatment: 'Maybe'}]},
   survey: [], message: null, userId: '1', pageId: '1', media: null, link: null},
   {platform: 'facebook', type: 'poll', 
   poll: {statement: 'Do you think college education is worth it',
   options:[{optionStatment: 'Yes'}, {optionStatment: 'No'}, {optionStatment: 'Maybe'}]},
   survey: [], message: null, userId: '1', pageId: '1', media: null, link: null},
   ];

 Broadcasts.insertMany(rawDocuments)
      .then(function(mongooseDocuments) {
          logger.serverLog(TAG, "Polls Table Seeded");
          res.status(200).json({status: 'Success'});
      })
      .catch(function(err) {
          /* Error handling */
          logger.serverLog(TAG, "Unable to seed the database");
          res.status(500).json({status: 'Failed'});
      });
};