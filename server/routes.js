/**
 * Created by sojharo on 20/07/2017.
 */

/**
 * Main application routes
 */

'use strict';

module.exports = function(app) {

  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

};
