/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Broadcasts = require('./broadcasts.model');
const Pages = require('../pages/Pages.model');
const PollResponse = require('../polls/pollresponse.model');
const SurveyResponse = require('../surveys/surveyresponse.model');
const SurveyQuestions = require('../surveys/surveyquestions.model');
const Subscribers = require('../subscribers/Subscribers.model');
const TAG = 'api/broadcast/broadcast.controller.js';
const needle = require('needle');

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
  logger.serverLog(TAG, `Inside send broadcast ${JSON.stringify(req.body)}`);
  /*
   Expected request body
   { platform: 'facebook',statement: req.body.text });
   */

  const messageData = {
    text: req.body.text
  };

  Pages.find({ userId: req.user._id }, (err, pages) => {
    if (err) {
      logger.serverLog(TAG, `Error ${JSON.stringify(err)}`);
      return res.status(404).json({ status: 'failed', description: 'Pages not found' });
    }

    pages.forEach(page => {
      logger.serverLog(TAG, `Page in the loop ${JSON.stringify(page)}`);

      Subscribers.find({ pageId: page._id }, (err, subscribers) => {
        if (err) {
          return logger.serverLog(TAG, `Error ${JSON.stringify(err)}`);
        }
        logger.serverLog(TAG, `Subscribers of page ${JSON.stringify(subscribers)}`);

        subscribers.forEach(subscriber => {
          logger.serverLog(TAG, `At Subscriber fetched ${JSON.stringify(subscriber)}`);

          const data = {
            recipient: {
              id: subscriber.senderId //this is the subscriber id
            },
            message: messageData,
          };

          needle.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${page.accessToken}`,
            data, (err2, resp) => {
              if (err2) {
                return logger.serverLog(TAG, `At send message broadcast ${JSON.stringify(err2)}`);
              }
              logger.serverLog(TAG,
                `Sent broadcast to subscriber response ${JSON.stringify(resp.body)}`);
            });
        });
      });
    });
    return res.status(200).json({ status: 'success', payload: 'Broadcast sent successfully.' });
  });
};

exports.verifyhook = function (req, res) {
  if (req.query['hub.verify_token'] === 'VERIFY_ME') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong token');
  }
};

exports.seed = function (req, res) {
  const rawDocuments = [
    {
      platform: 'facebook',
      type: 'message',
      poll: {},
      survey: [],
      message: 'Seed Message 1',
      userId: '1',
      pageId: '1',
      media: null,
      link: null
    },
    {
      platform: 'facebook',
      type: 'message',
      poll: {},
      survey: [],
      message: 'Seed Message 2',
      userId: '1',
      pageId: '1',
      media: null,
      link: null
    },
    {
      platform: 'facebook',
      type: 'message',
      poll: {},
      survey: [],
      message: 'Seed Message 3',
      userId: '1',
      pageId: '1',
      media: null,
      link: null
    },
    {
      platform: 'facebook',
      type: 'message',
      poll: {},
      survey: [],
      message: 'Seed Message 4',
      userId: '1',
      pageId: '1',
      media: null,
      link: null
    },
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
        //fetch subsriber info from Graph API
        // fetch customer details
        logger.serverLog(TAG, `This is a page${JSON.stringify(page)}`);
        const options = {
          url: `https://graph.facebook.com/v2.6/${sender}?access_token=${page.accessToken}`,
          qs: { access_token: page.accessToken },
          method: 'GET'

        };

        needle.get(options.url, options, (error, response) => {
          logger.serverLog(TAG, `This is a response from graph api${JSON.stringify(response.body)}`);
          const subsriber = response.body;
          logger.serverLog(TAG, `This is subsriber ${JSON.stringify(subsriber)}`);

          if (!error) {
            const payload = {
              firstName: subsriber.first_name,
              lastName: subsriber.last_name,
              locale: subsriber.locale,
              gender: subsriber.gender,
              userId: page.userId,
              provider: 'facebook',
              timezone: subsriber.timezone,
              profilePic: subsriber.profile_pic,
              pageScopedId: '',
              email: '',
              senderId: sender,
              pageId: page._id,
            };

            Subscribers.findOne({ senderId: sender }, (err, subscriber) => {
              logger.serverLog(TAG, err);
              logger.serverLog(TAG, subscriber);
              if (subscriber == null) {
                //subsriber not found, create subscriber
                Subscribers.create(payload, (err2, subsriber) => {
                  if (err2) {
                    logger.serverLog(TAG, err2);
                  }
                  logger.serverLog(TAG, 'new Subscriber added');
                });
              } else {
                // return res.status(200).json({ status: 'success', payload: subscriber });
              }
            });
          } else {

          }
        });
      });
    }


    //if event.post, the response will be of survey or poll. writing a logic to save response of poll
    if (event.postback) {
      var resp = JSON.parse(event.postback.payload);
      logger.serverLog(TAG, resp);
      logger.serverLog(TAG, ` payload ${resp.poll_id}`);
      if (resp.poll_id) {
        //find subscriber from sender id
        Subscribers.findOne({ senderId: event.sender.id }, (err, subscriber) => {
          if (err) {
            logger.serverLog(TAG, 'Error occured in finding subscriber');
          }

          const pollbody = {
            response: resp.option, //response submitted by subscriber
            pollId: resp.poll_id,
            subscriberId: subscriber._id,

          };
          PollResponse.create(pollbody, (err, pollresponse) => {
            if (err) {
              logger.serverLog(TAG, err);
            }
          });
        });
      } else if (resp.survey_id) {
        //this is the response of survey question
        //first save the response of survey
                //find subscriber from sender id
        Subscribers.findOne({ senderId: event.sender.id }, (err, subscriber) => {
          if (err) {
            logger.serverLog(TAG, 'Error occured in finding subscriber');
          }

          const surveybody = {
            response: resp.option, //response submitted by subscriber
            surveyId: resp.survey_id,
            questionId: resp.question_id,
            subscriberId: subscriber._id,

          };
          SurveyResponse.create(surveybody, (err1, surveyresponse) => {
            if (err1) {
              logger.serverLog(TAG, err1);
            }

            //send the next question
            SurveyQuestions.find({
              surveyId: resp.survey_id,
              _id: {$gt: resp.question_id}
            }).populate('surveyId').exec((err2, questions) => {
              if (err2) {
                logger.serverLog(TAG, 'Survey questions not found');
              }
              logger.serverLog(TAG, `Questions are ${JSON.stringify(questions)}`);
              if (questions.length > 0) {
               first_question = questions[0];
               //create buttons
                const buttons = [];
                let next_question_id = 'nil';
                if (questions.length > 1) {
                next_question_id = questions[1]._id;
               }

                for (let x = 0; x < first_question.options.length; x++) {
                buttons.push({
                                type: 'postback',
                                title: first_question.options[x],
                  payload: JSON.stringify({
                    survey_id: resp.survey_id,
                    option: first_question.options[x],
                    question_id: first_question._id,
                    next_question_id,
                    userToken: resp.userToken
                  })
                });
                  }
                logger.serverLog(TAG, `buttons created${JSON.stringify(buttons)}`);
                needle.get(`https://graph.facebook.com/v2.10/${event.recipient.id}?fields=access_token&access_token=${resp.userToken}`, (err3, response) => {
                        if (err3) {
                          logger.serverLog(TAG, `Page accesstoken from graph api Error${JSON.stringify(err3)}`);
                        }

                          logger.serverLog(TAG, `Page accesstoken from graph api ${JSON.stringify(response.body)}`);
                  const messageData = {
                                                    attachment: {
                                                      type: 'template',
                                                      payload: {
                                                        template_type: 'button',
                                                        text: first_question.statement,
                                                        buttons,

                                                        }
                                                      }
                                            };
                            const data = {
                              recipient: { id: event.sender.id }, //this is the subscriber id
                              message: messageData,
                            };
                  logger.serverLog(TAG, messageData);
                            needle.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`, data, (err4, respp) => {
                              logger.serverLog(TAG, `Sending survey to subscriber response ${JSON.stringify(respp.body)}`);
                              if (err4) {

                              }
                            });
                          });
              }

              //else send thank you message
              else {
                needle.get(`https://graph.facebook.com/v2.10/${event.recipient.id}?fields=access_token&access_token=${resp.userToken}`, (err3, response) => {
                        if (err3) {
                          logger.serverLog(TAG, `Page accesstoken from graph api Error${JSON.stringify(err3)}`);
                        }

                          logger.serverLog(TAG, `Page accesstoken from graph api ${JSON.stringify(response.body)}`);
                  const messageData = {
                                                text: 'Thank you. Response submitted successfully.'
                                            };
                            const data = {
                              recipient: { id: event.sender.id }, //this is the subscriber id
                              message: messageData,
                            };
                  logger.serverLog(TAG, messageData);
                            needle.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${response.body.access_token}`, data, (err4, respp) => {
                              logger.serverLog(TAG, `Sending survey to subscriber response ${JSON.stringify(respp.body)}`);
                              if (err4) {
                              }
                            });
                          });
              }
            });
          });
        });
      } else {
      }
    } else {
    }
  }

  return res.status(200).json({status: 'success', description: 'got the data.'});
};
