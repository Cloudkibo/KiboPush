/**
 * Created by sojharo on 24/07/2017.
 */
'use strict'

const config = require('../config/environment')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const compose = require('composable-middleware')
const Users = require('../api/user/Users.model')
const Plans = require('../api/permissions_plan/permissions_plan.model')
const Permissions = require('../api/permissions/permissions.model')
const ApiSettings = require('../api/api_settings/api_settings.model')
const validateJwt = expressJwt({secret: config.secrets.session})
const needle = require('needle')
const Pages = require('../api/pages/Pages.model')
const CompanyUsers = require('../api/companyuser/companyuser.model')
const _ = require('lodash')

const PassportFacebookExtension = require('passport-facebook-extension')
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
        logger.serverLog(TAG, `User authenticated: ${JSON.stringify(user)}`)

        if (user.facebookInfo && user.facebookInfo.fbId && user.facebookInfo.fbToken) {
          let FBExtension = new PassportFacebookExtension(config.facebook.clientID,
            config.facebook.clientSecret)

          // todo do this for permissions error
          FBExtension.permissionsGiven(user.facebookInfo.fbId, user.facebookInfo.fbToken)
            .then(permissions => {
              logger.serverLog(TAG,
                `Permissions given: ${JSON.stringify(permissions)}`)
              req.user = user
              next()
            })
            .fail(e => {
              logger.serverLog(TAG, `Permissions check error: ${JSON.stringify(e)}`)
              user.permissionsRevoked = true
              req.user = user
              next()
            })
        } else {
          req.user = user
          next()
        }
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
 * Note: maybe we don't use it
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

function hasRequiredPlan (planRequired) {
  if (!planRequired) throw new Error('Required plan needs to be set')
  if (!(typeof planRequired === 'object' &&
    planRequired.length)) throw new Error('Required plan must be of type array')

  return compose().use(function meetsRequirements (req, res, next) {
    if (planRequired.indexOf(req.user.plan) > -1) {
      next()
    } else {
      res.send(403)
    }
  })
}

function doesPlanPermitsThisAction (action) {
  if (!action) throw new Error('Action needs to be set')

  return compose().use(function meetsRequirements (req, res, next) {
    Plans.findOne({}, (err, plan) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!plan) {
        return res.status(500)
          .json({
            status: 'failed',
            description: 'Fatal Error. Plan not set. Please contact support.'
          })
      }
      if (!req.user) {
        res.status(403)
            .json({
              status: 'failed',
              description: 'Permissions Error'
            })
      } else if (plan[req.user.plan][action]) {
        next()
      } else {
        res.status(403)
          .json({
            status: 'failed',
            description: 'Your current plan does not support this action. Please upgrade or contact support.'
          })
      }
    })
  })
}

function doesRolePermitsThisAction (action) {
  if (!action) throw new Error('Action needs to be set')

  return compose().use(function meetsRequirements (req, res, next) {
    Permissions.findOne({userId: req.user._id}, (err, plan) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!plan) {
        return res.status(500)
          .json({
            status: 'failed',
            description: 'Fatal Error. Permissions not set. Please contact support.'
          })
      }
      if (plan[action]) {
        next()
      } else {
        res.status(403)
          .json({
            status: 'failed',
            description: 'You do not have permissions for this action. Please contact admin.'
          })
      }
    })
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
          Users.findOne({_id: setting.company_id, role: 'buyer'},
            (err, user) => {
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

/**
 * Set token cookie directly for oAuth strategies
 */
function fbConnectDone (req, res) {
  let fbPayload = req.user
  let userid = req.cookies.userid
  if (!req.user) {
    return res.status(404).json({
      status: 'failed',
      description: 'Something went wrong, please try again.'
    })
  }

  Users.findOne({_id: userid}, (err, user) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!user) {
      return res.status(401)
        .json({status: 'failed', description: 'Unauthorized'})
    }

    req.user = user
    user.facebookInfo = fbPayload
    user.save((err) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      fetchPages(`https://graph.facebook.com/v2.10/${
        fbPayload.fbId}/accounts?access_token=${
        fbPayload.fbToken}`, user)
      res.cookie('next', 'addPages', {expires: new Date(Date.now() + 60000)})
      res.redirect('/')
    })
  })
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
exports.hasRequiredPlan = hasRequiredPlan
exports.doesPlanPermitsThisAction = doesPlanPermitsThisAction
exports.doesRolePermitsThisAction = doesRolePermitsThisAction
exports.fbConnectDone = fbConnectDone
exports.fetchPages = fetchPages
// This functionality will be exposed in later stages
// exports.isAuthorizedWebHookTrigger = isAuthorizedWebHookTrigger;

function fetchPages (url, user) {
  const options = {
    headers: {
      'X-Custom-Header': 'CloudKibo Web Application'
    },
    json: true

  }
  needle.get(url, options, (err, resp) => {
    if (err !== null) {
      logger.serverLog(TAG, 'error from graph api to get pages list data: ')
      logger.serverLog(TAG, JSON.stringify(err))
      return
    }
    // logger.serverLog(TAG, 'resp from graph api to get pages list data: ')
    // logger.serverLogF(TAG, JSON.stringify(resp.body))

    const data = resp.body.data
    const cursor = resp.body.paging
    if (data) {
      data.forEach((item) => {
        // logger.serverLog(TAG,
        //   `foreach ${JSON.stringify(item.name)}`)
        //  createMenuForPage(item)
        const options2 = {
          url: `https://graph.facebook.com/v2.10/${item.id}/?fields=fan_count,username&access_token=${item.access_token}`,
          qs: {access_token: item.access_token},
          method: 'GET'
        }
        needle.get(options2.url, options2, (error, fanCount) => {
          if (error !== null) {
            return logger.serverLog(TAG, `Error occurred ${error}`)
          } else {
            // logger.serverLog(TAG, `Data by fb for page likes ${JSON.stringify(
            //   fanCount.body.fan_count)}`)
            CompanyUsers.findOne({domain_email: user.domain_email},
              (err, companyUser) => {
                if (err) {
                  return logger.serverLog(TAG, {
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }
                if (!companyUser) {
                  return logger.serverLog(TAG, {
                    status: 'failed',
                    description: 'The user account does not belong to any company. Please contact support'
                  })
                }
                Pages.findOne({
                  pageId: item.id,
                  userId: user._id,
                  companyId: companyUser.companyId
                }, (err, page) => {
                  if (err) {
                    logger.serverLog(TAG,
                      `Internal Server Error ${JSON.stringify(err)}`)
                  }
                  if (!page) {
                    let payloadPage = {
                      pageId: item.id,
                      pageName: item.name,
                      accessToken: item.access_token,
                      userId: user._id,
                      companyId: companyUser.companyId,
                      likes: fanCount.body.fan_count,
                      pagePic: `https://graph.facebook.com/v2.10/${item.id}/picture`,
                      connected: false
                    }
                    if (fanCount.body.username) {
                      payloadPage = _.merge(payloadPage,
                        {pageUserName: fanCount.body.username})
                    }
                    var pageItem = new Pages(payloadPage)
                    // save model to MongoDB
                    pageItem.save((err, page) => {
                      if (err) {
                        logger.serverLog(TAG, `Error occurred ${err}`)
                      }
                      logger.serverLog(TAG,
                        `Page ${item.name} created with id ${page.pageId}`)
                    })
                  } else {
                    page.likes = fanCount.body.fan_count
                    page.pagePic = `https://graph.facebook.com/v2.10/${item.id}/picture`
                    page.accessToken = item.access_token
                    if (fanCount.body.username) page.pageUserName = fanCount.body.username
                    page.save((err) => {
                      if (err) {
                        logger.serverLog(TAG,
                          `Internal Server Error ${JSON.stringify(err)}`)
                      }
                      // logger.serverLog(TAG, `Likes updated for ${page.pageName}`)
                    })
                  }
                })
              })
          }
        })
      })
    } else {
      logger.serverLog(TAG, 'Empty response from graph API to get pages list data')
    }
    if (cursor && cursor.next) {
      fetchPages(cursor.next, user)
    } else {
      logger.serverLog(TAG, 'Undefined Cursor from graph API')
    }
  })
}
