/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Migrations = require('./migrations.model')
const TAG = 'api/migrations/migrations.controller.js'
const Users = require('./../user/Users.model')
const Page = require('./../pages/Pages.model')

const crypto = require('crypto')
const path = require('path')
const config = require('../../config/environment/index')
const _ = require('lodash')

exports.createLinks = function (req, res) {
  Migrations.remove({}, (err, count) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    Users.find({}, (err, users) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(200).json({
        status: 'success',
        payload: users
      })
      users.forEach((user) => {
        let today = new Date()
        let uid = crypto.randomBytes(5).toString('hex')
        let tokenString = 'f' + uid + '' + today.getFullYear() + '' +
          (today.getMonth() + 1) + '' + today.getDate() + '' +
          today.getHours() + '' + today.getMinutes() + '' +
          today.getSeconds() + '' + crypto.randomBytes(5).toString('hex')
        let migration = new Migrations({
          userId: user._id,
          userName: user.name,
          link: tokenString
        })
        migration.save((err, saved) => {
          if (err) {
            return logger.serverLog(TAG, 'internal server error on migration save ' + JSON.stringify(err))
          }
          logger.serverLog(TAG, 'migration created ' + JSON.stringify(saved))
        })
      })
    })
  })
}

exports.migrate = function (req, res) {
  Migrations.findOne({link: req.params.id}, function (err, migration) {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!migration) {
      return res.redirect('/')
    } else {
      res.cookie('name', migration.userName, { expires: new Date(Date.now() + 900000) })
      return res.sendFile(path.join(config.root, 'client/pages/migration_login.html'))
    }
  })
}

exports.start = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'email')) parametersMissing = true
  if (!_.has(req.body, 'password')) parametersMissing = true
  if (!_.has(req.body, 'name')) parametersMissing = true
  if (!_.has(req.body, 'token')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
    .json({status: 'failed', description: 'Parameters are missing'})
  }
  Migrations.findOne({link: req.body.token}, function (err, migration) {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!migration) {
      return res.redirect('/')
    } else {
      res.clearCookie('name')
      return res.sendFile(path.join(config.root, 'client/pages/migration_started.html'))
    }
  })
}
