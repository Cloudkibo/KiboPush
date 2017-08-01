
/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Pages = require('../pages/Pages.model');
const TAG = 'api/pages/pages.controller.js';

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Get pages API called');
  var data = {};
  Pages.count(function(err, c) {
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
