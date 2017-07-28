/**
 * Created by sojharo on 27/07/2017.
 */

var Messages = require('./messages.model').Messages;
var Pages = require('../pages/pages.model').Pages;
var Subscribers = require('../subscribers/subscribers.model').Subscribers;

var logger = require('../../components/logger');

const TAG = 'api/messages/messages.controller.js';

exports.index = function (req, res) {
  logger.serverLog(TAG, 'messages API is working');

  Messages.findAll().then(function (messages) {
    if (!messages) return res.status(404).json({status: 'failed', description: 'Messages not found'});
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

            Subscribers
              .findOrCreate({where: {senderId: sender}, defaults: payload})
              .spread((subsriber, created) => {
                logger.serverLog(TAG, 'Subscriber created: ' + created);
                // return done(err, user);
                res.status(200).json({status: 'success', payload: subsriber});
              });

          }
        });

      

      });
    }
  }

};
