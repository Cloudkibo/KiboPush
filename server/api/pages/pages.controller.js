/**
 * Created by sojharo on 27/07/2017.
 */

var logger = require('../../components/logger');
var Pages = require('./Pages.model');
const TAG = 'api/pages/pages.controller.js';



exports.index = function (req, res) {
  
};

exports.enable = function (req, res) {

};

exports.disable = function (req, res) {
 
};
exports.allPages = function (req, res) {
   Pages.find(function(err, pages){
    logger.serverLog(TAG,  pages);
    logger.serverLog(TAG, "Error: " +  err);
    res.status(200).json(pages);  
  })
};



exports.seed = function (req, res) {
 var rawDocuments = [
   {pageCode: '1', pageName: 'Cat Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', enabled: true, connected: true, userId: 5},
   {pageCode: '2', pageName: 'Dank Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', enabled: false, connected: false, userId: 5},
   {pageCode: '3', pageName: 'Dog Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', enabled: true, connected: false, userId: 5},
   {pageCode: '4', pageName: 'Elephant Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', enabled: false, connected: true, userId: 5},
   ];

 Pages.insertMany(rawDocuments)
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