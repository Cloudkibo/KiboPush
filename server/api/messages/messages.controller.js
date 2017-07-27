/**
 * Created by sojharo on 27/07/2017.
 */

var Messages = require('./messages.model').Messages;
var Pages = require('../pages/pages.model').Pages;

var logger = require('../../components/logger');

const TAG = 'api/messages/messages.controller.js';

exports.index = function (req, res) {
  logger.serverLog(TAG, 'messages API is working');

  Messages.findAll().then(function (messages) {
    if (!messages) return res.status(404).json({status: 'failed', payload: []});
    logger.serverLog(TAG, 'messages object sent to client');
    res.status(200).json({status: 'success', payload: messages});
  });
};

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
			      Pages.findOne({
					    where: {
					      pageId: page,
					    }
					  }).then(function (page) {
					    if (!page) return res.status(404).json({status: 'failed', payload: 'Page not found'});
					     //fetch subsriber info from Graph API
					      // fetch customer details
				          var optionsChat = {
				            url: 'https://graph.facebook.com/v2.6/' + sender + '?access_token=' + page.accessToken,
				            qs: {access_token: page.accessToken},
				            method: 'GET'

				          };

				          function callbackChat(error, response, body) {
				            let subsriber = JSON.parse(body);
				            logger.serverLog('info', 'This is subsriber ' + JSON.stringify(subsriber));

				            if (!error) {
				             
							var payload = {
					          name: customer.first_name+' '+customer.last_name,
					          locale: customer.locale,
					          gender: customer.gender,
					          provider: 'facebook',
					          timezone: customer.timezone,
					          profilePic: rcustomer.profile_pic,
					          fbToken: '',
					        };

					        if (customer.email) {
					          payload = _.merge(payload, { email: customer.email });
					        }

					        User
					          .findOrCreate({ where: { fbId: sender }, defaults: payload })
					          .spread((user, created) => {
					            logger.serverLog(TAG, 'User created: ' + created);
					           // return done(err, user);
					            res.status(200).json({status: 'success', payload: user});
					          });

					     }
					 }
					 request.post(optionsChat, callbackChat);


					 
			     
			  		});
	  	}
	  }
  
};
