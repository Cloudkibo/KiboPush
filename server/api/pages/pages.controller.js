/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Pages = require('./Pages.model')
const TAG = 'api/pages/pages.controller.js'
const Users = require('../user/Users.model')
const needle = require('needle')

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Get pages API called')
  Pages.find({connected: true, userId: req.user._id}, (err, pages) => {
    if (err) {
      logger.serverLog(TAG, `Error: ${err}`)
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({status: 'success', payload: pages})
  })
}

exports.enable = function (req, res) {
  logger.serverLog(TAG, `Enable page API called ${JSON.stringify(req.body)}`)

  Pages.update({_id: req.body._id},
    {connected: true}, (err) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          error: err,
          description: 'Failed to update record'
        })
      } else {
        Pages.find({connected: false, userId: req.user._id}, (err2, pages) => {
          if (err2) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error${JSON.stringify(err)}`
            })
          }
          const options = {
            url: `https://graph.facebook.com/v2.6/${req.body.pageId}/subscribed_apps?access_token=${req.body.accessToken}`,
            qs: {access_token: req.body.accessToken},
            method: 'POST'

          }

          needle.post(options.url, options, (error, response) => {
            if (error) {
              return res.status(500)
              .json({status: 'failed', description: JSON.stringify(error)})
            }
            res.status(200).json({status: 'success', payload: pages})
          })
        })
      }
    })
}

exports.disable = function (req, res) {
  logger.serverLog(TAG, `disable page API called ${JSON.stringify(req.body)}`)

  Pages.update({_id: req.body._id},
    {connected: false}, (err) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          error: err,
          description: 'Failed to update record'
        })
      } else {
        Pages.find({connected: true, userId: req.user._id}, (err2, pages) => {
          if (err2) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error${JSON.stringify(err)}`
            })
          }
          const options = {
            url: `https://graph.facebook.com/v2.6/${req.body.pageId}/subscribed_apps?access_token=${req.body.accessToken}`,
            qs: {access_token: req.body.accessToken},
            method: 'DELETE'

          }

          needle.delete(options.url, options, (error, response) => {
            if (error) {
              return res.status(500)
              .json({status: 'failed', description: JSON.stringify(error)})
            }
            res.status(200).json({status: 'success', payload: pages})
          })
        })
      }
    })
}

exports.otherPages = function (req, res) {
  Pages.find({connected: false, userId: req.user._id}, (err, pages) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(
          err)}`
      })
    }
    logger.serverLog(TAG, pages)
    return res.status(200).json({status: 'success', payload: pages})
  })
}

exports.addPages = function (req, res) {
  logger.serverLog(TAG, 'Add Pages called ')
  Users.findOne({fbId: req.user.fbId}, (err, user) => {
    if (err) {
      return res.status(500).json({status: 'failed', description: err})
    }
    if (req.user.provider === 'local') {
      res.status(200).json({status: 'success', payload: []})
    } else {
      fetchPages(`https://graph.facebook.com/v2.10/${
      user.fbId}/accounts?access_token=${
      user.fbToken}`, user)
      Pages.find({userId: req.user._id, connected: false}, (err, pages) => {
        if (err) {
          return res.status(500).json({status: 'failed', description: err})
        }
        logger.serverLog(TAG, `Pages returned ${JSON.stringify(pages)}`)
        res.status(201).json({status: 'success', payload: pages})
      })
    }
    //  return res.status(200).json({ status: 'success', payload: user});
  })
}

// TODO use this after testing
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
    logger.serverLog(TAG, 'resp from graph api to get pages list data: ')
    logger.serverLog(TAG, JSON.stringify(resp.body))

    const data = resp.body.data
    const cursor = resp.body.paging

    data.forEach((item) => {
      Pages.findOne({pageId: item.id, userId: user._id}, (err, page) => {
        if (err) {
          logger.serverLog(TAG, `Internal Server Error ${JSON.stringify(err)}`)
        }
        if (!page) {
          logger.serverLog(TAG, `Page ${item.name} not found. Creating a page`)
          var pageItem = new Pages({
            pageId: item.id,
            pageName: item.name,
            accessToken: item.access_token,
            userId: user._id,
            connected: false
          })
          // save model to MongoDB
          pageItem.save((err, page) => {
            if (err) {
              logger.serverLog(TAG, `Error occured ${err}`)
            }
            logger.serverLog(TAG, `Page ${item.name} created`)
          })
        }
      })
    })
    if (cursor.next) {
      fetchPages(cursor.next, user)
    }
  })
}
