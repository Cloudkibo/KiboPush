/**
 * Created by sojharo on 24/07/2017.
 */
'use strict'

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    //uri: 'mongodb://kibopush:4Pf8D9uXqNcan8Ymp0u9tRD3pHhmJ3xa9RHIC6g4GRG2QmgrGd7X8ghN6fgAb488l3Y6ymZelAjV8Lf3FWPWVw==@kibopush.documents.azure.com:10255/kibopush?ssl=true'
    uri: 'mongodb://localhost/kibopush-dev'
  },
  seedDB: false,

  facebook: {
    clientID: process.env.FACEBOOK_ID || '159385484629940',
    clientSecret: process.env.FACEBOOK_SECRET || '67527aa04570a034b6ff67335d95e91c',
    callbackURL: `${process.env.DOMAIN || 'https://kibopush-sojharo.ngrok.io'}/auth/facebook/callback`
  }
}
