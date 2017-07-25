/**
 * Created by sojharo on 24/07/2017.
 */

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var logger = require('../../components/logger');
const TAG = 'api/auth/facebook/passport';

exports.setup = function (User, config) {
  passport.use(new FacebookStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
      callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      logger.serverLog(TAG, 'facebook access token: ');
      logger.serverLog(TAG, accessToken);
      logger.serverLog(TAG, 'facebook refresh token: ');
      logger.serverLog(TAG, refreshToken);
      logger.serverLog(TAG, 'facebook done: ');
      logger.serverLog(TAG, profile);

      /*User.findOne({
          'facebook.id': profile.id
        },
        function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {

            User.count({$or: [{username: profile.username}, {email: profile.emails[0].value}]}, function(err, count){
              if(count > 0) {
                user = new User({
                  firstname : profile.name.givenName,
                  lastname : profile.name.familyName,
                  role: 'user',
                  provider: 'facebook',
                  fb_photo: 'https://graph.facebook.com/'+ profile.id +'/picture?width=140&height=110',
                  facebook: profile._json
                });
              }
              else {
                user = new User({
                  firstname : profile.name.givenName,
                  lastname : profile.name.familyName,
                  email: profile.emails[0].value,
                  role: 'user',
                  username: profile.username,
                  provider: 'facebook',
                  fb_photo: 'https://graph.facebook.com/'+ profile.id +'/picture?width=140&height=110',
                  facebook: profile._json
                });
              }

              user.save(function(err) {
                if (err) done(err);
                return done(err, user);
              });

            });
          } else {
            return done(err, user);
          }
        })*/

    }
  ));
};
