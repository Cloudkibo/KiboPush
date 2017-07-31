/**
 * Created by sojharo on 24/07/2017.
 */
'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MySQL connection options
  db: {
    mysql: {
      credentials: {
        schema: 'kibopush',
        user: 'root',
        password: 'kibo4321',
        
      },
      host: 'localhost',
      port: 3306
    }
  },
  seedDB: false
};
