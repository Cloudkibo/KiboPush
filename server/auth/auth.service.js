/**
 * Created by sojharo on 24/07/2017.
 */
'use strict'

const passport = require('passport')
const config = require('../config/environment')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const compose = require('composable-middleware')
const Users = require('../api/user/Users.model')
const validateJwt = expressJwt({ secret: config.secrets.session })

const logger = require('../components/logger')

const TAG = 'auth/auth.service.js'

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated () {
  return compose()
  // Validate jwt
    .use((req, res, next) => {
      // allow access_token to be passed through query parameter as well
      if (req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = `Bearer ${req.query.access_token}`
      }
      validateJwt(req, res, next)
    })
    // Attach user to request
    .use((req, res, next) => {
      logger.serverLog(TAG, `Here is user object ${JSON.stringify(req.user)}`)

      Users.findOne({ fbId: req.user._id }, (err, user) => {
        if (!user) return res.status(401).json({ status: 'failed', description: 'Unauthorized' })

        req.user = user
        next()
      })
    })
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken (id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresIn: 60 * 60 * 24 * 4 })
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie (req, res) {
  if (!req.user) {
    return res.status(404).json({
      status: 'failed',
      description: 'Something went wrong, please try again.'
    })
  }
  const token = signToken(req.user.fbId)
  logger.serverLog(TAG, `Here is the signed token: ${token}`)
  res.cookie('token', token)
  res.redirect('/')
}

function isAuthorizedWebHookTrigger () {
  return compose()
    .use((req, res, next) => {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
        req.socket.remoteAddress || req.connection.socket.remoteAddress
      logger.serverLog(TAG, req.ip)
      logger.serverLog(TAG, ip)
      logger.serverLog(TAG, 'This is middleware')
      logger.serverLog(TAG, req.body)
      if (ip === '162.243.215.177') next()
      else res.send(403)
    })
}

exports.isAuthenticated = isAuthenticated
exports.signToken = signToken
exports.setTokenCookie = setTokenCookie
// This functionality will be exposed in later stages
// exports.isAuthorizedWebHookTrigger = isAuthorizedWebHookTrigger;
