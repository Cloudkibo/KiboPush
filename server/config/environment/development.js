/**
 * Created by sojharo on 24/07/2017.
 */
'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  db: {
    mysql: {
      credentials: {
        schema: process.env.DB_SCHEMA || 'kibopush',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'kibo4321'
      },
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
    }
  },
  seedDB: false
};
