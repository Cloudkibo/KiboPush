/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Broadcasts = require('./Broadcasts.model');
const Pages = require('../pages/Pages.model');
const PollResponse = require('../polls/pollresponse.model');
const Subscribers = require('../subscribers/Subscribers.model');
const TAG = 'api/broadcast/broadcast.controller.js';

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Broadcasts get api is working');
  Broadcasts.find((err, broadcasts) => {
    if (err) return res.status(404).json({ status: 'failed', description: 'Broadcasts not found' });
    logger.serverLog(TAG, broadcasts);
    res.status(200).json({ status: 'success', payload: broadcasts });
  });
};

exports.create = function (req, res) {
  logger.serverLog(TAG, `Inside Create Broadcast, req body = ${JSON.stringify(req.body)}`);
  Broadcasts.create(req.body, (err, broadcast) => {
    if (err) {
       return res.status(404).json({ status: 'failed', description: 'Broadcasts not created' });
     }
    return res.status(200).json({ status: 'success', payload: broadcast });
  });
};

exports.edit = function (req, res) {
 logger.serverLog(TAG, `This is body in edit broadcast ${JSON.stringify(req.body)}`);
 Broadcasts.findById(req.body.broadcast._id, (err, broadcast) => {
    if (err) {
       return res.status(404).json({ status: 'failed', description: 'Broadcasts not found' });
     }

     broadcast.text = req.body.broadcast.text;
     broadcast.save((err2) => {
               if (err) {
                       return res.status(404).json({ status: 'failed', description: 'Broadcast update failed.' });
                     }
               return res.status(200).json({ status: 'success', payload: req.body.broadcast });
              });
  });
};


// Get a single broadcast
exports.show = function (req, res) {
  Broadcasts.findById(req.params.id).populate('userId').exec((err, broadcast) => {
      if (err) {
              return res.status(404).json({ status: 'failed', description: 'Broadcast not found' });
              }
               return res.status(200).json({ status: 'success', payload: broadcast });
    });
};

exports.send = function (req, res) {
   //we will write here the logic to send broadcast
};


exports.seed = function (req, res) {
 const rawDocuments = [
   { platform: 'facebook', type: 'message', poll: {}, survey: [], message: 'Seed Message 1', userId: '1', pageId: '1', media: null, link: null },
   { platform: 'facebook', type: 'message', poll: {}, survey: [], message: 'Seed Message 2', userId: '1', pageId: '1', media: null, link: null },
   { platform: 'facebook', type: 'message', poll: {}, survey: [], message: 'Seed Message 3', userId: '1', pageId: '1', media: null, link: null },
   { platform: 'facebook', type: 'message', poll: {}, survey: [], message: 'Seed Message 4', userId: '1', pageId: '1', media: null, link: null },
   ];

 Broadcasts.insertMany(rawDocuments)
      .then((mongooseDocuments) => {
          logger.serverLog(TAG, 'Pages Table Seeded');
          res.status(200).json({ status: 'Success' });
      })
      .catch((err) => {
          /* Error handling */
          logger.serverLog(TAG, 'Unable to seed the database');
          res.status(500).json({ status: 'Failed' });
      });
};

//webhook for facebook
exports.getfbMessage = function (req, res) {
  // This is body in chatwebhook {"object":"page","entry":[{"id":"1406610126036700","time":1501650214088,"messaging":[{"recipient":{"id":"1406610126036700"},"timestamp":1501650214088,"sender":{"id":"1389982764379580"},"postback":{"payload":"{\"poll_id\":121212,\"option\":\"option1\"}","title":"Option 1"}}]}]} 
  logger.serverLog(TAG, 'message received from FB Subscriber');
  const messaging_events = req.body.entry[0].messaging;

  for (let i = 0; i < messaging_events.length; i++) {
    const event = req.body.entry[0].messaging[i];
    logger.serverLog(TAG, JSON.stringify(event));
    if (event.message) {
      const sender = event.sender.id;
      const page = event.recipient.id;
      //get accesstoken of page
      Pages.findOne({ pageId: page }).then((page) => {
        if (!page) return res.status(404).json({ status: 'failed', description: 'Page not found' });
        //fetch subsriber info from Graph API
        // fetch customer details
        const options = {
          url: `https://graph.facebook.com/v2.6/${sender}?access_token=${page.accessToken}`,
          qs: { access_token: page.accessToken },
          method: 'GET'

        };

        needle.get(options.url, options, (error, response) => {
          const subsriber = JSON.parse(response.body);
          logger.serverLog(TAG, `This is subsriber ${JSON.stringify(subsriber)}`);

          if (!error) {
            let payload = {
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
              payload = _.merge(payload, { email: customer.email });
            }

            Subscribers.findOne({ senderId: sender }, (err, subsriber) => {
              if (err) {
                //subsriber not found, create subscriber
                Subscribers.create(payload, (err2, subsriber) => {
                   if (err) {
                    return res.status(404).json({ status: 'failed',
                      description: 'Subscriber not created' });
                    }
                   return res.status(200).json({ status: 'success', payload: subsriber });
                    });
                   }
            });
        }
      });
    });
  }


  //if event.post, writing a logic to save response of poll
  if(event.postback){
          var resp = JSON.parse(event.postback.payload);
           logger.serverLog(TAG, resp);
           if(resp.poll_id){
            //find subscriber from sender id
            Subscribers.findOne({ senderId: event.sender.id }, (err, subsriber) => {
              if (err) {
                logger.serverLog(TAG, 'Error occured in finding subscriber');
              }

              var pollbody = {
              response: resp.option, //response submitted by subscriber
              pollId: resp.poll_id,
              subscriberId: subscriber._id,

                       }
             PollResponse.create(pollbody, (err, pollresponse) => {
                if (err) {
                   return res.status(404).json({ status: 'failed', description: 'Poll response not created' });
                 }
                  return res.status(200).json({ status: 'success', payload: pollresponse });
               });
            });
           
           }
      }
}
};
