/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Pages = require('./Pages.model')
const TAG = 'api/pages/pages.controller.js'
const Users = require('../user/Users.model')
const needle = require('needle')
const Subscribers = require('../subscribers/Subscribers.model')

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
  // check if page is already connected by some other user
  // short term solution for issue Subscribers list is not updating (multi user issue) #307
  Pages.find({pageId: req.body.pageId, connected: true, userId: { $ne: req.user._id }}, (err, pagesbyOther) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        error: err,
        description: 'Failed to update record'
      })
    }
    logger.serverLog(TAG, `Page connected by other user ${JSON.stringify(pagesbyOther)}`)
    if (pagesbyOther.length === 0) {
      Pages.update({_id: req.body._id},
    {connected: true}, (err) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          error: err,
          description: 'Failed to update record'
        })
      } else {
        Pages.find({userId: req.user._id}, (err2, pages) => {
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
            res.status(200).json({status: 'success', payload: {pages: pages}})
          })
        })
      }
    })
    } else {
      // page is already connected by someone else
      Pages.find({userId: req.user._id}, (err2, pages) => {
        if (err2) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error${JSON.stringify(err)}`
          })
        }
        res.status(200).json({status: 'success', payload: {pages: pages, msg: 'Page is already connected by another user'}})
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
        // remove subscribers of the page
        Subscribers.remove({pageId: req.body._id}, function () {
          Pages.find({userId: req.user._id}, (err2, pages) => {
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
    } else { // todo this should be called from passportjs
      // fetchPages(`https://graph.facebook.com/v2.10/${
      //   user.fbId}/accounts?access_token=${
      //   user.fbToken}`, user)
      Pages.find({userId: req.user._id}, (err, pages) => {
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
