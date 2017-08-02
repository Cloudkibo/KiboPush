
/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger');
const Pages = require('./Pages.model');
const TAG = 'api/pages/pages.controller.js';
const Users = require('../user/Users.model');
const needle = require('needle');

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Get pages API called');
  logger.serverLog(TAG, req.user);
  Pages.find((err, pages) => {
    logger.serverLog(TAG, pages);
    logger.serverLog(TAG, `Error: ${err}`);
    res.status(200).json({ status: 'success', payload: pages });
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

exports.addPages = function (req, res) {
  logger.serverLog(TAG, 'Add Pages called '+ JSON.stringify(req.body));
  Users.findOne({ fbId: req.body.fbid},(err, user) => {
    if(err){
       return res.status(404).json({ status: 'failed', description: err});
    }
    else{
     logger.serverLog(TAG, user); 
     fetchPages('https://graph.facebook.com/v2.10/' +
              user.fbId + '/accounts?access_token=' +
              user.fbToken, user); 
     return res.status(200).json({ status: 'success', payload: user});
    }
   
   
  });
};



// TODO use this after testing
function fetchPages(url, user) {
  var options = {
        headers: {
          'X-Custom-Header': 'CloudKibo Web Application'
        },
        json:true

      }
  needle.get(url, options, (err, resp) => {
    logger.serverLog(TAG, 'error from graph api to get pages list data: ');
    logger.serverLog(TAG, JSON.stringify(err));
    logger.serverLog(TAG, 'resp from graph api to get pages list data: ');
    logger.serverLog(TAG, JSON.stringify(resp.body));
    logger.serverLog(TAG, 'user data for fetch pages: ');
    logger.serverLog(TAG, JSON.stringify(user));

    const data = resp.body.data;
    const cursor = resp.body.paging;

    data.forEach((item) => {
      Pages
        .findOne({ pageId: item.id },function(err, page) {
          if(!page){
            logger.serverLog(TAG, 'Page not found. Creating a page ');
            var page = new Pages({ pageId: item.id,
                                  pageName: item.name,
                                  accessToken: item.access_token,
                                  userId:user._id});
            //save model to MongoDB
            page.save((err,page) => {
              if (err) {
                 logger.serverLog(TAG, `Error occured ${err}`); 
              }
              logger.serverLog(TAG, `Page ${item.name} created: ${page}`); 
            });
          }
         
          });

     }); 
    if (cursor.next) {
      fetchPages(cursor.next, user);
    }
  });
}

exports.seed = function (req, res) {
  const rawDocuments = [
    { pageCode: '1', pageName: 'Cat Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', connected: true, likes: 0, numberOfFollowers: 0 },
    { pageCode: '2', pageName: 'Dank Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', connected: false,  likes: 50, numberOfFollowers: 25 },
    { pageCode: '3', pageName: 'Dog Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', connected: false, likes: 37, numberOfFollowers: 89 },
    { pageCode: '4', pageName: 'Elephant Memes', pagePic: 'url', numberOfFollowers: 23, accessToken: 'getToken', connected: true, likes: 53, numberOfFollowers: 74 },
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
