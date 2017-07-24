/**
 * Created by sojharo on 24/07/2017.
 */


// Production specific configuration
// ==================================
module.exports = {
  // MySQL connection options
  db: {
    mysql: {
      credentials: {
        schema: process.env.DB_SCHEMA,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      },
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    }
  },
  seedDB: false
};
