/**
 * Created by sojharo on 20/07/2017.
 */

const path = require('path')
const _ = require('lodash')

const all = {

  env: process.env.NODE_ENV,

  // Project root path
  root: path.normalize(`${__dirname}/../../..`),

  // Server port
  port: process.env.PORT || 3000,

  // Secure Server port
  secure_port: process.env.SECURE_PORT || 8443,

  // pubsubhubbub port
  pubsub_port: process.env.PUBSUB_PORT || 1337,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SESSION_SECRET || 'f83b0cd6ccb20142185616dsf54dsf4'
  },

  ip: process.env.OPENSHIFT_NODEJS_IP ||
  process.env.IP ||
  undefined,

  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '159385484629940',
    clientSecret: process.env.FACEBOOK_SECRET || '67527aa04570a034b6ff67335d95e91c',
    callbackURL: `${process.env.DOMAIN || 'https://staging.kibopush.com'}/auth/facebook/callback`
  },

  pubsubhubbub: {
    secret: process.env.SESSION_SECRET || 'f83b0cd6ccb20142185616dsf54dsf4',
    callbackUrl: `${process.env.DOMAIN || 'https://staging.kibopush.com'}/api/autoposting/pubsub/webhook`
  },

  twitter: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY || 'SPyt40d2i8IfIFoYtW5LtYnG8',
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET || 'L00OE6SIGOMjI0ZDe5n3ncnFdaxHaAco6wzkR2jdzLXJnXYoID',
    consumer_token: process.env.TWITTER_TOKEN || '2616186000-dAaH7yuQsBGNcbvnCiHweB8rFm54pF2YOC0hOtP',
    consumer_token_secret: process.env.TWITTER_TOKEN_SECRET || '6hWNxP6qwjPEjEfLwT8uK9JpPVFzwA3BxBeCSU7J6rylT',
    callbackUrl: `${process.env.DOMAIN || 'https://staging.kibopush.com'}/api/autoposting/twitter`
  }
}

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {})
