/**
 * Created by sojharo on 24/07/2017.
 */

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var needle = require('needle');
var _ = require('lodash');

var logger = require('../../components/logger');
const TAG = 'api/auth/facebook/passport';

var options = {
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
    function (accessToken, refreshToken, profile, done) {
      if (profile._json) {
        logger.serverLog(TAG, 'facebook auth done for: ' +
          profile._json.name + ' with fb id: ' + profile._json.id);
      }

      needle.get('https://graph.facebook.com/me?fields=' +
        'id,name,locale,email,timezone,gender,picture' +
        '&access_token=' + accessToken, options, function (err, resp) {
        logger.serverLog(TAG, 'error from graph api to get user data: ');
        logger.serverLog(TAG, JSON.stringify(err));
        logger.serverLog(TAG, 'resp from graph api to get user data: ');
        logger.serverLog(TAG, JSON.stringify(resp.body));

        if (err) return done(err);

        var payload = {
          name: resp.body.name,
          locale: resp.body.locale,
          gender: resp.body.gender,
          provider: 'facebook',
          timezone: resp.body.timezone,
          profilePic: resp.body.picture.data.url,
          fbToken: accessToken
        };

        if (resp.body.email) {
          payload = _.merge(payload, { email: resp.body.email });
        }

        User
          .findOrCreate({ where: { fbId: resp.body.id }, defaults: payload })
          .spread((user, created) => {
            logger.serverLog(TAG, 'User created: ' + created);

            fetchPages('https://graph.facebook.com/v2.10/' +
              resp.body.id + '/accounts?limit=2&' + 'access_token=' +
              accessToken);

            return done(err, user);
          });
      });
    }
  ));
};

function fetchPages(url) {
  needle.get(url, options, function (err2, resp) {
    logger.serverLog(TAG, 'error from graph api to get pages list data: ');
    logger.serverLog(TAG, JSON.stringify(err2));
    logger.serverLog(TAG, 'resp from graph api to get pages list data: ');
    logger.serverLog(TAG, JSON.stringify(resp.body));

    const data = resp.body.data;
    const cursor = resp.body.paging;

    logger.serverLog(TAG, JSON.stringify(cursor));

    if (cursor.previous) {
      fetchPages(cursor.next);
    }

  });
}
