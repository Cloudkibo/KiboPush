/**
 * Created by sojharo on 27/07/2017.
 */

var Pages = require('./pages.model').Pages;

var logger = require('../../components/logger');

const TAG = 'api/pages/pages.controller.js';

exports.index = function (req, res) {
  Pages.findAll({
    where: {
      userId: req.user.id
    },
    attributes: ['pageId', 'pageName', 'pagePic', 'numberOfFollowers', 'likes',
      'enabled']
  }).then(function (pages) {
    if (!pages) {
      return res.status(404).json({status: 'failed', description: 'Some error occurred'});
    }
    logger.serverLog(TAG, 'fb pages list sent to client');
    res.status(200).json({status: 'success', payload: pages});
  });
};

exports.enable = function (req, res) {
  Pages.update({
    enabled: true
  }, {
    where: {
      id: req.body.id
    }
  }).then(function (pages) {
    if (!pages) {
      return res.status(404).json({status: 'failed', description: 'Some error occurred'});
    }
    logger.serverLog(TAG, 'updated the pages for enabling');
    res.status(200).json({status: 'success', payload: pages});
  });
};

exports.disable = function (req, res) {
  Pages.update({
    enabled: false
  }, {
    where: {
      id: req.body.id
    }
  }).then(function (pages) {
    if (!pages) {
      return res.status(404).json({status: 'failed', description: 'Some error occurred'});
    }
    logger.serverLog(TAG, 'updated the pages for disabling');
    res.status(200).json({status: 'success', payload: pages});
  });
};
