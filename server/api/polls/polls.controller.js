/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Polls = require('./Polls.model');
const PollResponse = require('./pollresponse.model');
const Subscribers = require('../subscribers/Subscribers.model');
const needle = require('needle');
const Pages = require('../pages/Pages.model');

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
    const poll = new Polls({ platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });

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
    logger.serverLog(TAG, 'Inside sendpoll ' + JSON.stringify(req.body));
    /*
    Expected request body
     { platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });

    */

    var messageData={
                            "attachment":{
                              "type":"template",
                              "payload":{
                                "template_type":"button",
                                "text":req.body.statement,
                                "buttons":[
                                  {
                                    "type":"postback",
                                    "title":req.body.options[0],
                                     "payload":JSON.stringify({poll_id:req.body._id,option:req.body.options[0]})
                                  },
                                  {
                                    "type":"postback",
                                    "title":req.body.options[1],
                                     "payload":JSON.stringify({poll_id:req.body._id,option:req.body.options[1]})
                                  },
                                  {
                                    "type":"postback",
                                    "title":req.body.options[2],
                                     "payload":JSON.stringify({poll_id:req.body._id,option:req.body.options[2]})
                                  }
                                ]
                              }
                            }
                          }
        logger.serverLog(TAG, 'Poll to be sent ' + JSON.stringify(messageData));
        Pages.find({userId:req.user._id},function(err,pages){
          if(err){
                logger.serverLog(TAG, 'Error ' + JSON.stringify(err));
                return res.status(404).json({ status: 'failed', description: 'Pages not found'});
          
          }
          else{
            for(var z=0;z<pages.length;z++)
            {
             
                Subscribers.find({pageId:pages[z]._id}, function (err, subscribers) {
                  if(err) { 
                    return res.status(404).json({ status: 'failed', description: 'Subscribers not found'});
                  }
                  for(var j=0;j< subscribers.length;j++){
                          logger.serverLog(TAG, 'At Subscriber fetched ' + JSON.stringify(subscribers[j]));
                          logger.serverLog(TAG, 'At Pages fetched ' + JSON.stringify(pages[z].accessToken));
            
                          var data = {
                                      recipient: {id: subscribers[j].senderId}, //this is the subscriber id
                                      message: messageData,
                                    }
                          var options= {
                              qs: {access_token: pages[z].accessToken},
                             }
                          needle.post('https://graph.facebook.com/v2.6/me/messages', data,options, (err, resp) => {
                              logger.serverLog(TAG, 'Sending poll to subscriber response ' + JSON.stringify(resp.body));
                               if (err) {
                                  return res.status(404).json({ status: 'failed', description: err});
                                }

                                 // return res.status(200).json({ status: 'success', payload: resp.body });
                            
                          });
                  }
                });
            }
                return res.status(200).json({ status: 'success', payload: 'Poll sent successfully.' });
              
          }
      });
    

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
