/**
 * Created by sojharo on 27/07/2017.
 */

var logger = require('../../components/logger');
var Broadcasts = require('./Broadcasts.model');
const TAG = 'api/pages/pages.controller.js';



exports.index = function (req, res) {
  logger.serverLog(TAG,'Broadcasts get api is working');
  Broadcasts.find(function(err, broadcasts){
    if(err) return res.status(404).json({status: 'failed', description: 'Broadcasts not found'});
    logger.serverLog(TAG,  broadcasts);
    logger.serverLog(TAG, "Error: " +  err);
    res.status(200).json({status: 'success', payload: broadcasts});
  });
};

exports.create = function (req, res) {
  logger.serverLog(TAG, 'Inside Create Broadcast, req body = '+ JSON.stringify(req.body));
  Broadcasts.create(req.body, function(err, broadcast) {
    if(err) { 
       return res.status(404).json({status: 'failed', description: 'Broadcasts not created'});
     }
    return res.status(200).json({status: 'success', payload: broadcast});
   
  });
};

exports.edit = function (req, res) {
 logger.serverLog(TAG, 'This is body in edit broadcast '+ JSON.stringify(req.body) );
 Broadcasts.findById(req.body.broadcast._id, function (err, broadcast) {
    if(err) { 
       return res.status(404).json({status: 'failed', description: 'Broadcasts not found'});
     }
     
     broadcast.text = req.body.broadcast.text;
     broadcast.save(function(err2){
               if(err) { 
                       return res.status(404).json({status: 'failed', description: 'Broadcast update failed.'});
                     }
               return res.status(200).json({status: 'success', payload: req.body.broadcast});   
              });
  });
}


// Get a single broadcast
exports.show = function(req, res) {
  Broadcasts.findById(req.params.id).populate('userId').exec(function (err, broadcast){
      if(err) { 
              return res.status(404).json({status: 'failed', description: 'Broadcast not found'});
              }
               return res.status(200).json({status: 'success', payload: broadcast});  
    });
  

};

exports.send = function (req, res) {
   //we will write here the logic to send broadcast
};



exports.seed = function (req, res) {
 var rawDocuments = [
   {platform: 'facebook', type: 'message', poll: {}, survey: [], message: 'Seed Message 1', userId: '1', pageId: '1', media: null, link: null},
   {platform: 'facebook', type: 'message', poll: {}, survey: [], message: 'Seed Message 2', userId: '1', pageId: '1', media: null, link: null},
   {platform: 'facebook', type: 'message', poll: {}, survey: [], message: 'Seed Message 3', userId: '1', pageId: '1', media: null, link: null},
   {platform: 'facebook', type: 'message', poll: {}, survey: [], message: 'Seed Message 4', userId: '1', pageId: '1', media: null, link: null},
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