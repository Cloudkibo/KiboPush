/**
 * Created by sojharo on 14/11/2017.
 */
 'use strict'

 // Development specific configuration
 // ==================================
 module.exports = {
   // MongoDB connection options
   mongo: {
     // uri: 'mongodb://kibopush2:0UFA1pWgmo1k3lvlrY0Ta3y2WDjdT51i1FxnSsjRgWMORJsRnftZiJgVu6jn59dk3xcwovFLI74Lyjk0y2QYmA==@kibopush2.documents.azure.com:10255/kibopush?ssl=true'
     uri: 'mongodb://localhost/kibopush-staging'
   },
   seedDB: false,

   facebook: {
     clientID: process.env.FACEBOOK_ID,
     clientSecret: process.env.FACEBOOK_SECRET,
     callbackURL: `${process.env.DOMAIN}/auth/facebook/callback`
   }
 }
