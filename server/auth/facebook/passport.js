/**
 * Created by sojharo on 24/07/2017.
 */

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var needle = require('needle');
var _ = require('lodash');

var logger = require('../../components/logger');
const TAG = 'api/auth/facebook/passport';

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

      var options = {
        headers: {
          'X-Custom-Header': 'CloudKibo Web Application'
        },
        json:true

      }

      needle.get('https://graph.facebook.com/me?fields=id,name,locale,email,timezone,gender,picture&access_token='+accessToken, options, function(err, resp) {
        logger.serverLog(TAG, 'error from graph api needle: ');
        logger.serverLog(TAG, JSON.stringify(err));
        logger.serverLog(TAG, 'resp from graph api needle: ');
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
            // logger.serverLog(TAG, JSON.stringify(user.get({
            //   plain: true
            // })));
            logger.serverLog(TAG, 'User created: ' + created);

            return done(err, user);

            /*
             findOrCreate returns an array containing the object that was found
             or created and a boolean that will be true if a new object was
             created and false if not, like so:

             [ {
             username: 'sdepold',
             job: 'Technical Lead JavaScript',
             id: 1,
             createdAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET),
             updatedAt: Fri Mar 22 2013 21: 28: 34 GMT + 0100(CET)
             },
             true ]

             In the example above, the "spread" on line 39 divides
             the array into its 2 parts and passes them as arguments
             to the callback function defined beginning at line 39,
             which treats them as "user" and "created" in this case.
             (So "user" will be the object from index 0 of
             the returned array and "created" will equal "true".)
             */

          })
      });
    }
  ));
};
