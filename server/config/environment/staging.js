/**
 * Created by sojharo on 14/11/2017.
 */
 'use strict'

 // Development specific configuration
 // ==================================
 module.exports = {
   // MongoDB connection options
   mongo: {
     uri: 'mongodb://localhost/kibopush-staging'
   },
   seedDB: false,

   facebook: {
     clientID: process.env.FACEBOOK_ID,
     clientSecret: process.env.FACEBOOK_SECRET,
     callbackURL: `${process.env.DOMAIN}`
   }
 }
