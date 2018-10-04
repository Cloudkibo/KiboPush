'use strict'

let express = require('express')
let passport = require('passport')
let auth = require('../auth.service')
let User = require('./../../api/v1/user/Users.model.js')
let CompanyProfile = require('./../../api/v1/companyprofile/companyprofile.model')
let CompanyUsers = require('./../../api/v1/companyuser/companyuser.model')

const config = require('./../../config/environment/index')
const logger = require('../../components/logger')

const PassportFacebookExtension = require('passport-facebook-extension')
const TAG = 'api/user/user.controller.js'
let router = express.Router()

router.post('/', function (req, res, next) {
  if (req.body.domain) {
    User.findOne({
      email: req.body.email.toLowerCase()
    }, (err, user) => {
      if (err) {
        return res.status(501)
        .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!user) {
        return res.status(401)
        .json({
          status: 'failed',
          description: 'No account found with this email address.'
        })
      }
      user = user.toObject()
      if (user.domain !== req.body.domain.toLowerCase()) {
        return res.status(401)
        .json({
          status: 'failed',
          description: 'This workspace name is not registered with us or your account does not belong to this domain'
        })
      }
      if (user.domain === req.body.domain.toLowerCase() && user.email !== req.body.email.toLowerCase()) {
        return res.status(401)
        .json({
          status: 'failed',
          description: 'No account found with this email address.'
        })
      }
      logger.serverLog(TAG, `User in login: ${JSON.stringify(user)}`)
      CompanyUsers.findOne({domain_email: user.domain_email}, (err, companyuser) => {
        if (err) {
          return res.status(501)
          .json({status: 'failed', description: 'Internal Server Error'})
        }

        CompanyProfile.findOne({_id: companyuser.companyId}).populate('planId').exec((err, company) => {
          if (err) {
            return res.status(501)
            .json({status: 'failed', description: 'Internal Server Error'})
          }
          if (['plan_C', 'plan_D'].indexOf(company.planId.unique_ID) < 0) {
            return res.status(401)
            .json({
              status: 'failed',
              description: 'Given account information does not match any team account in our records'
            })
          }

          if (user.facebookInfo && user.facebookInfo.fbId && user.facebookInfo.fbToken) {
            let FBExtension = new PassportFacebookExtension(config.facebook.clientID,
          config.facebook.clientSecret)

            FBExtension.permissionsGiven(user.facebookInfo.fbId, user.facebookInfo.fbToken)
          .then(permissions => {
            logger.serverLog(TAG, `Permissions given: ${JSON.stringify(permissions)}`)
            passport.authenticate('local', function (err, user, info) {
              let error = err || info
              if (error) return res.status(401).json(error)
              if (!user) {
                return res.status(404).json({status: 'failed', description: 'Something went wrong, please try again.'})
              }

              let token = auth.signToken(user._id)
              res.json({token: token})
              if (user.facebookInfo) {
                auth.fetchPages(`https://graph.facebook.com/v2.10/${
                    user.facebookInfo.fbId}/accounts?access_token=${
                    user.facebookInfo.fbToken}`, user)
              }
            })(req, res, next)
          })
          .fail(e => {
            logger.serverLog(TAG, `Permissions check error: ${JSON.stringify(e)}`)
            // User.update({'facebookInfo.fbId': user.facebookInfo.fbId}, {permissionsRevoked: true}, {multi: true}, (err, resp) => {
            //   if (err) {
            //     logger.serverLog(TAG, `Error in updated permsissionsRevoked field ${JSON.stringify(err)}`)
            //   }
            passport.authenticate('local', function (err, user, info) {
              let error = err || info
              if (error) return res.status(401).json(error)
              if (!user) {
                return res.status(404).json({status: 'failed', description: 'Something went wrong, please try again.'})
              }

              let token = auth.signToken(user._id)
              res.json({token: token})
              if (user.facebookInfo) {
                auth.fetchPages(`https://graph.facebook.com/v2.10/${
                    user.facebookInfo.fbId}/accounts?access_token=${
                    user.facebookInfo.fbToken}`, user)
              }
            })(req, res, next)
          })
          // })
          } else {
            passport.authenticate('local', function (err, user, info) {
              let error = err || info
              if (error) return res.status(401).json(error)
              if (!user) {
                return res.status(404).json({status: 'failed', description: 'Something went wrong, please try again.'})
              }

              let token = auth.signToken(user._id)
              res.json({token: token})
              if (user.facebookInfo) {
                auth.fetchPages(`https://graph.facebook.com/v2.10/${
                    user.facebookInfo.fbId}/accounts?access_token=${
                    user.facebookInfo.fbToken}`, user)
              }
            })(req, res, next)
          }
        })
      })
    })
  } else {
    User.findOne({
      email: req.body.email.toLowerCase()
    }, (err, user) => {
      if (err) {
        return res.status(501)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!user) {
        return res.status(401).json({
          status: 'failed',
          description: 'No account found with this email address.'
        })
      }

      CompanyUsers.findOne({domain_email: user.domain_email}, (err, companyuser) => {
        if (err) {
          return res.status(501)
          .json({status: 'failed', description: 'Internal Server Error'})
        }

        CompanyProfile.findOne({_id: companyuser.companyId}).populate('planId').exec((err, company) => {
          if (err) {
            return res.status(501)
            .json({status: 'failed', description: 'Internal Server Error'})
          }
          if (['plan_A', 'plan_B'].indexOf(company.planId.unique_ID) < 0) {
            return res.status(401).json({
              status: 'failed',
              description: 'Given account information does not match any individual account in our records'
            })
          }
          if (user.facebookInfo && user.facebookInfo.fbId && user.facebookInfo.fbToken) {
            let FBExtension = new PassportFacebookExtension(config.facebook.clientID,
            config.facebook.clientSecret)

            FBExtension.permissionsGiven(user.facebookInfo.fbId, user.facebookInfo.fbToken)
            .then(permissions => {
              logger.serverLog(TAG, `Permissions given: ${JSON.stringify(permissions)}`)
              passport.authenticate('local', function (err, user, info) {
                let error = err || info
                if (error) return res.status(401).json(error)
                if (!user) {
                  return res.status(404).json({status: 'failed', description: 'Something went wrong, please try again.'})
                }

                let token = auth.signToken(user._id)
                res.json({token: token})
                if (user.facebookInfo) {
                  auth.fetchPages(`https://graph.facebook.com/v2.10/${
                    user.facebookInfo.fbId}/accounts?access_token=${
                    user.facebookInfo.fbToken}`, user)
                }
              })(req, res, next)
            })
            .fail(e => {
              logger.serverLog(TAG, `Permissions check error: ${JSON.stringify(e)}`)
              // User.update({'facebookInfo.fbId': user.facebookInfo.fbId}, {permissionsRevoked: true}, {multi: true}, (err, resp) => {
              //   if (err) {
              //     logger.serverLog(TAG, `Error in updated permsissionsRevoked field ${JSON.stringify(err)}`)
              //   }
              passport.authenticate('local', function (err, user, info) {
                let error = err || info
                if (error) return res.status(401).json(error)
                if (!user) {
                  return res.status(404).json({status: 'failed', description: 'Something went wrong, please try again.'})
                }

                let token = auth.signToken(user._id)
                res.json({token: token})
                if (user.facebookInfo) {
                  auth.fetchPages(`https://graph.facebook.com/v2.10/${
                      user.facebookInfo.fbId}/accounts?access_token=${
                      user.facebookInfo.fbToken}`, user)
                }
              })(req, res, next)
            })
            // })
          } else {
            passport.authenticate('local', function (err, user, info) {
              let error = err || info
              if (error) return res.status(401).json(error)
              if (!user) {
                return res.status(404).json({status: 'failed', description: 'Something went wrong, please try again.'})
              }

              let token = auth.signToken(user._id)
              res.json({token: token})
              if (user.facebookInfo) {
                auth.fetchPages(`https://graph.facebook.com/v2.10/${
                    user.facebookInfo.fbId}/accounts?access_token=${
                    user.facebookInfo.fbToken}`, user)
              }
            })(req, res, next)
          }
        })
      })
    })
  }
})

module.exports = router
