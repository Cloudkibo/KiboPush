/**
 * Created by sojharo on 27/07/2017.
 */

var logger = require('../../components/logger');
var Broadcasts = require('./Broadcasts.model');
const TAG = 'api/pages/pages.controller.js';



exports.index = function (req, res) {
  Broadcasts.find(function(err, broadcasts){
    logger.serverLog(TAG,  broadcasts);
    logger.serverLog(TAG, "Error: " +  err);
    res.status(200).json(broadcasts)  
  })
};

exports.create = function (req, res) {

};

exports.edit = function (req, res) {
 
};
exports.send = function (req, res) {
   
};



exports.seed = function (req, res) {
 var rawDocuments = [
   {platform: 'facebook', type: 'message', poll: [], survey: [], message: 'Seed Message 1', userId: '1', pageId: '1', media: null, link: null},
   {platform: 'facebook', type: 'message', poll: [], survey: [], message: 'Seed Message 2', userId: '1', pageId: '1', media: null, link: null},
   {platform: 'facebook', type: 'message', poll: [], survey: [], message: 'Seed Message 3', userId: '1', pageId: '1', media: null, link: null},
   {platform: 'facebook', type: 'message', poll: [], survey: [], message: 'Seed Message 4', userId: '1', pageId: '1', media: null, link: null},
   ];

 Broadcasts.insertMany(rawDocuments)
      .then(function(mongooseDocuments) {
          logger.serverLog(TAG, "Pages Table Seeded");
          res.status(200).json({status: 'Success'});
      })
      .catch(function(err) {
          /* Error handling */
          logger.serverLog(TAG, "Unable to seed the database");
          res.status(500).json({status: 'Failed'});
      });
};