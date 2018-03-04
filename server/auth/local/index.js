'use strict'

let express = require('express')
let passport = require('passport')
let auth = require('../auth.service')
let User = require('./../../api/user/Users.model.js')

let router = express.Router()

router.post('/', function (req, res, next) {
  if (req.body.domain) {
    User.findOne({
      domain: req.body.domain.toLowerCase(),
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
          description: 'This workspace name is not registered with us or your account does not belong to this domain'
        })
      }
      if (['plan_C', 'plan_D'].indexOf(user.plan) < 0) {
        return res.status(401)
        .json({
          status: 'failed',
          description: 'Given account information does not match any team account in our records'
        })
      }

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
  } else {
    User.findOne({
      email: req.body.email.toLowerCase()
    }, (err, user) => {
      if (err) {
        return res.status(501).
          json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!user) {
        return res.status(401).json({
          status: 'failed',
          description: 'No account found with this email address.'
        })
      }
      if (['plan_A', 'plan_B'].indexOf(user.plan) < 0) {
        return res.status(401).json({
          status: 'failed',
          description: 'Given account information does not match any individual account in our records'
        })
      }

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
  }
})

module.exports = router
