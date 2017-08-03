/**
 * Created by sojharo on 24/07/2017.
 */


// Production specific configuration
// ==================================
module.exports = {
  // MySQL connection options
  mongo: {
    uri:    process.env.MONGO_URI || 'mongodb://localhost/kibopush'
    //'mongodb://root:a345rq98efw@localhost/kibopush'
  },
  seedDB: false
};
