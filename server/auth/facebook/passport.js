/**
 * Created by sojharo on 24/07/2017.
 */

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const needle = require('needle');
const _ = require('lodash');
const Pages = require('../../api/pages/Pages.model');
const Users = require('../../api/user/Users.model');

const logger = require('../../components/logger');
const TAG = 'api/auth/facebook/passport';

const options = {
  headers: {
    'X-Custom-Header': 'CloudKibo Web Application'
  },
  json: true
};

exports.setup = function (User, config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL,
      profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
      if (profile._json) {
        logger.serverLog(TAG, `facebook auth done for: ${
          profile._json.name} with fb id: ${profile._json.id}`);
      }

      needle.get(`${'https://graph.facebook.com/me?fields=' +
      'id,name,locale,email,timezone,gender,picture' +
      '&access_token='}${accessToken}`, options, (err, resp) => {
        logger.serverLog(TAG, 'error from graph api to get user data: ');
        logger.serverLog(TAG, JSON.stringify(err));
        logger.serverLog(TAG, 'resp from graph api to get user data: ');
        logger.serverLog(TAG, JSON.stringify(resp.body));

        if (err) return done(err);

        let payload = new Users({
          name: resp.body.name,
          locale: resp.body.locale,
          gender: resp.body.gender,
          provider: 'facebook',
          timezone: resp.body.timezone,
          profilePic: resp.body.picture.data.url,
          fbToken: accessToken,
          fbId: resp.body.id
        });

        if (resp.body.email) {
          payload = _.merge(payload, { email: resp.body.email });
        }

        Users.find({
            fbId: resp.body.id
          },
          (err, user) => {
            if (err) {
              return done(err);
            }
            if (!user) {
               payload.save(function(error) {
            if (!error) {
                // Do something with the document
                return done(error, payload);
            } else {
                return done(error);
                }
            });
            } else {
              return done(err, user);
            }
          }
        );
      });
    }
  ));
};

// TODO use this after testing
function fetchPages(url, user) {
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
                                  user});
            //save model to MongoDB
            page.save((err,page) => {
              if (err) {
                res.status(500).json({ status: 'Failed', error: err, description: 'Failed to insert page' });
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
