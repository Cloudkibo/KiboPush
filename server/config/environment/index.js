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
    clientID: process.env.FACEBOOK_ID || '456637644436523',
    clientSecret: process.env.FACEBOOK_SECRET || 'f46495b908b408bc8e4f5b259b18e952',
    callbackURL: `${process.env.DOMAIN || 'https://app.kibopush.com'}/auth/facebook/callback`
  },

  pubsubhubbub: {
    secret: process.env.SESSION_SECRET || 'f83b0cd6ccb20142185616dsf54dsf4',
    callbackUrl: `${process.env.DOMAIN || 'https://app.kibopush.com'}:1337`
  }
}

module.exports = _.merge(
  all,
  require(`./${process.env.NODE_ENV}.js`) || {})
