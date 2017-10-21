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
    callbackURL: `${process.env.DOMAIN || 'https://kibopush-sojharo.ngrok.io'}/auth/facebook/callback`
  },

  pubsubhubbub: {
    callbackUrl: `${process.env.DOMAIN || 'https://app.kibopush.com'}/api/broadcasts/pubsub/webhook`
  },

  twitter: {
    consumerKey: process.env.TWITTER_CONSUMER_KEY || '7aIqEjxEBPqzBOqWTiF7uosVl',
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'zxbH46wrUyUoJk9cG9s3OqV0B5xAAjM9puAtrLSwnf9L7Utx9h',
    token: process.env.TWITTER_TOKEN || '2616186000-sxO4PtLZVrOqG0QtrtWzrUx9BzdG0KyFY2SOmhR',
    tokenSecret: process.env.TWITTER_TOKEN_SECRET || 'N5K1Myf8wsKSWKpAK5amLpBK81ips0z8KUKvS7tsxhIqD'
  }
}

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {})
