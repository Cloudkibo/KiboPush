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
          description: 'This domain is not registered with us or your account does not belong to this domain'
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
      })(req, res, next)
    })
  } else {
    passport.authenticate('local', function (err, user, info) {
      let error = err || info
      if (error) return res.status(401).json(error)
      if (!user) {
        return res.status(404).json({status: 'failed', description: 'Something went wrong, please try again.'})
      }

      let token = auth.signToken(user._id)
      res.json({token: token})
    })(req, res, next)g
  }
})

module.exports = router
