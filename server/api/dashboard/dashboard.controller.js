
/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Pages = require('../pages/Pages.model');
const Subscribers = require('../subscribers/Subscribers.model');
const Broadcasts = require('../broadcasts/broadcasts.model');
const Polls = require('../polls/Polls.model');
const Surveys = require('../surveys/surveys.model');
const TAG = 'api/pages/pages.controller.js';

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Get Dashboard API called');
  const data = {};
  Pages.count((err, c) => {
    data.pagesCount = c;
    res.status(200).json(data);
  });
};

exports.enable = function (req, res) {

};

exports.disable = function (req, res) {
  const updateData = {
    connected: false,
  };
  Pages.update({ _id: req.body._id }, updateData, (err, affected) => {
    logger.serverLog(TAG, `affected rows ${affected}`);
  });
};

exports.otherPages = function (req, res) {
  Pages.find({ connected: false }, (err, pages) => {
    logger.serverLog(TAG, pages);
    logger.serverLog(TAG, `Error: ${err}`);
    res.status(200).json(pages);
  });
};

exports.stats = function (req, res) {
  let payload = {
    scheduledBroadcast: 0,
    username: req.user.name
  };
  Pages.count({ connected: true, userId: req.user._id }, (err, pagesCount) => {
    if (err) return res.status(500).json({ status: 'failed', description: JSON.stringify(err) });
    payload.pages = pagesCount;
    Subscribers.count({ userId: req.user._id }, (err2, subscribersCount) => {
      if (err2) {
        return res.status(500).json({status: 'failed', description: JSON.stringify(err2)});
      }
      payload.subscribers = subscribersCount;
      Broadcasts.find({ userId: req.user._id }).sort('datetime', -1).limit(10).exec(
        (err3, recentBroadcasts) => {
          if (err3) {
            return res.status(500).json({ status: 'failed', description: JSON.stringify(err3) });
          }
          payload.recentBroadcasts = recentBroadcasts;
          Broadcasts.count({ userId: req.user._id }, (err4, broadcastsCount) => {
            if (err4) {
              return res.status(500).json({ status: 'failed', description: JSON.stringify(err4) });
            }
            Polls.count({ userId: req.user._id }, (err5, pollsCount) => {
              if (err5) {
                return res.status(500).json({ status: 'failed',
                  description: JSON.stringify(err5) });
              }
              Surveys.count({ userId: req.user._id }, (err6, surveysCount) => {
                if (err6) {
                  return res.status(500).json({ status: 'failed',
                    description: JSON.stringify(err6) });
                }
                payload.activityChart = {
                  messages: broadcastsCount,
                  polls: pollsCount,
                  surveys: surveysCount
                };

                res.status(200).json({ status: 'success',
                  payload });
              });
            });
          });
        }
      );
    });
  });
};


exports.seed = function (req, res) {
  const rawDocuments = [
    { pageCode: '1', pageName: 'Cat Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', connected: true, userId: 5, likes: 0, numberOfFollowers: 0 },
    { pageCode: '2', pageName: 'Dank Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', connected: false, userId: 5, likes: 50, numberOfFollowers: 25 },
    { pageCode: '3', pageName: 'Dog Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', connected: false, userId: 5, likes: 37, numberOfFollowers: 89 },
    { pageCode: '4', pageName: 'Elephant Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', connected: true, userId: 5, likes: 53, numberOfFollowers: 74 },
  ];

  Pages.insertMany(rawDocuments)
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
