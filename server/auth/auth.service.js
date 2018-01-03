/**
 * Created by sojharo on 24/07/2017.
 */
'use strict'

const config = require('../config/environment')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const compose = require('composable-middleware')
const Users = require('../api/user/Users.model')
const ApiSettings = require('../api/api_settings/api_settings.model')
const validateJwt = expressJwt({secret: config.secrets.session})

const logger = require('../components/logger')

const TAG = 'auth/auth.service.js'

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated () {
  return compose()
  // Validate jwt or api keys
    .use((req, res, next) => {
      if (req.headers.hasOwnProperty('app_id')) {
        validateApiKeys(req, res, next)
      } else {
        // allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty('access_token')) {
          req.headers.authorization = `Bearer ${req.query.access_token}`
        }
        validateJwt(req, res, next)
      }
    })
    // Attach user to request
    .use((req, res, next) => {
      Users.findOne({_id: req.user._id}, (err, user) => {
        if (err) {
          return res.status(500)
            .json({status: 'failed', description: 'Internal Server Error'})
        }
        if (!user) {
          return res.status(401)
            .json({status: 'failed', description: 'Unauthorized'})
        }

        req.user = user
        next()
      })
    })
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function isAuthorizedSuperUser () {
  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements (req, res, next) {
      if (req.user.isSuperUser) {
        next()
      } else {
        res.send(403)
      }
    })
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole (roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set')

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements (req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >=
        config.userRoles.indexOf(roleRequired)) {
        next()
      } else {
        res.send(403)
      }
    })
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken (id) {
  return jwt.sign({_id: id}, config.secrets.session,
    {expiresIn: 60 * 60 * 24 * 4})
}

function validateApiKeys (req, res, next) {
  if (req.headers.hasOwnProperty('app_secret')) {
    ApiSettings.findOne({
      app_id: req.headers['app_id'],
      app_secret: req.headers['app_secret'],
      enabled: true
    },
      (err, setting) => {
        if (err) return next(err)
        if (setting) {
          // todo this is for now buyer user id but it should be company id as thought
          Users.findOne({_id: setting.company_id}, (err, user) => {
            if (err) {
              return res.status(500)
                .json({status: 'failed', description: 'Internal Server Error'})
            }
            if (!user) {
              return res.status(401).json({
                status: 'failed',
                description: 'User not found for the API keys'
              })
            }
            req.user = {_id: user._id}
            next()
          })
        } else {
          return res.status(401).json({
            status: 'failed',
            description: 'Unauthorized. No such API credentials found.'
          })
        }
      })
  } else {
    return res.status(401).json({
      status: 'failed',
      description: 'Unauthorized. Please provide both app_id and app_secret in headers.'
    })
  }
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
  const token = signToken(req.user._id)
  res.cookie('token', token)
  res.redirect('/')
}

// eslint-disable-next-line no-unused-vars
function isAuthorizedWebHookTrigger () {
  return compose().use((req, res, next) => {
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
exports.isAuthorizedSuperUser = isAuthorizedSuperUser
exports.hasRole = hasRole
// This functionality will be exposed in later stages
// exports.isAuthorizedWebHookTrigger = isAuthorizedWebHookTrigger;
