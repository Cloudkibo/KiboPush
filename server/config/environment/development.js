/**
 * Created by sojharo on 24/07/2017.
 */
'use strict'

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    // uri: 'mongodb://kibopush2:0UFA1pWgmo1k3lvlrY0Ta3y2WDjdT51i1FxnSsjRgWMORJsRnftZiJgVu6jn59dk3xcwovFLI74Lyjk0y2QYmA==@kibopush2.documents.azure.com:10255/kibopush?ssl=true'
    uri: 'mongodb://localhost/kibopush-dev(1)'
  },
  seedDB: false,

  facebook: {
    clientID: process.env.FACEBOOK_ID || '159385484629940',
    clientSecret: process.env.FACEBOOK_SECRET || '67527aa04570a034b6ff67335d95e91c',
    callbackURL: `${process.env.DOMAIN || 'https://kibopush-sojharo.ngrok.io'}/auth/facebook/callback`
  }
}
