/**
 * Created by sojharo on 23/10/2017.
 */
const logger = require('../../components/logger')
const TAG = 'api/menu/menu.controller.js'
const Pages = require('../../api/pages/Pages.model')
let Menu = require('./menu.model')
const needle = require('needle')
const _ = require('lodash')

// Get list of menu items
exports.index = function (req, res) {
  Menu.find({userId: req.user._id}, (err, menus) => {
    if (err) {
      logger.serverLog(TAG, `Internal Server Error on fetch ${err}`)
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    return res.status(200).json({
      status: 'success',
      payload: menus
    })
  })
}

exports.indexByPage = function (req, res) {
  Menu.find({userId: req.user._id, pageId: req.body.pageId}, (err, menus) => {
    if (err) {
      logger.serverLog(TAG, `Internal Server Error on fetch ${err}`)
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    return res.status(200).json({
      status: 'success',
      payload: menus
    })
  })
}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'pageId')) parametersMissing = true
  if (!_.has(req.body, 'userId')) parametersMissing = true
  if (!_.has(req.body, 'payload')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  Pages.findOne({pageId: req.body.pageId, userId: req.body.userId}, (err, page) => {
    if (err) {
      logger.serverLog(TAG,
        `Internal Server Error ${JSON.stringify(err)}`)
      return res.status(500).json({
        status: 'failed',
        description: 'Failed to find page. Internal Server Error'
      })
    }
    if (!page) {
      return res.status(404).json({
        status: 'failed',
        description: 'Page not found'
      })
    }
    const menu = new Menu(req.body)

    // save model to MongoDB
    menu.save((err, savedMenu) => {
      if (err) {
        res.status(500).json({
          status: 'failed',
          error: err,
          description: 'Failed to insert record'
        })
        logger.serverLog(TAG, JSON.stringify(err))
      } else {
        const requestUrl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${page.access_token}`

        needle.request('post', requestUrl, req.body.payload, {json: true},
          (err, resp) => {
            if (!err) {
              logger.serverLog(TAG,
                `Menu added to page ${page.pageName}`)
            }
            if (err) {
              logger.serverLog(TAG,
                `Internal Server Error ${JSON.stringify(err)}`)
            }
          })

        res.status(201).json({status: 'success', payload: savedMenu})
      }
    })
  })
}
