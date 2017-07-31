/**
 * Created by sojharo on 27/07/2017.
 */

var logger = require('../../components/logger');
var Broadcasts = require('./Broadcasts.model');
var Pages = require('../pages/Pages.model');
var Subscribers = require('../subscribers/Subscribers.model');
const TAG = 'api/broadcast/broadcast.controller.js';



exports.index = function (req, res) {
  logger.serverLog(TAG,'Broadcasts get api is working');
  Broadcasts.find(function(err, broadcasts){
    if(err) return res.status(404).json({status: 'failed', description: 'Broadcasts not found'});
    logger.serverLog(TAG,  broadcasts);
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

//webhook for facebook
exports.getfbMessage = function (req, res) {
  logger.serverLog(TAG, 'message received from FB Subscriber');
  let messaging_events = req.body.entry[0].messaging

  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i];
    logger.serverLog(TAG, JSON.stringify(event));
    if (event.message) {

      let sender = event.sender.id;
      let page = event.recipient.id;
      //get accesstoken of page
      Pages.findOne({pageId: page}).then(function (page) {
        if (!page) return res.status(404).json({status: 'failed', description: 'Page not found'});
        //fetch subsriber info from Graph API
        // fetch customer details
        var options = {
          url: 'https://graph.facebook.com/v2.6/' + sender + '?access_token=' + page.accessToken,
          qs: {access_token: page.accessToken},
          method: 'GET'

        };

        needle.get(options.url, options, function (error, response) {
          let subsriber = JSON.parse(response.body);
          logger.serverLog(TAG, 'This is subsriber ' + JSON.stringify(subsriber));

          if (!error) {

            var payload = {
              firstName: customer.first_name,
              lastName: customer.last_name,
              locale: customer.locale,
              gender: customer.gender,
              provider: 'facebook',
              timezone: customer.timezone,
              profilePic: rcustomer.profile_pic,
              pageScopedId: '',
            };

            if (customer.email) {
              payload = _.merge(payload, {email: customer.email});
            }

            Subscribers.findOne({senderId : sender}, function(err, subsriber){
              if(err){
                //subsriber not found, create subscriber
                Subscribers.create(payload, function(err2, subsriber) {
                   if(err) { 
                    return res.status(404).json({status: 'failed', description: 'Subscriber not created'});
                    }
                   return res.status(200).json({status: 'success', payload: subsriber}); 
                    });
                   }
            });
           

          
        };

      

      });
    });
  }
}

};