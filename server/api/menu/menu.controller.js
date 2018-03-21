/**
 * Created by sojharo on 23/10/2017.
 */
const logger = require('../../components/logger')
const TAG = 'api/menu/menu.controller.js'
const Pages = require('../../api/pages/Pages.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
let Menu = require('./menu.model')
const needle = require('needle')
const _ = require('lodash')

// Get list of menu items
exports.index = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Menu.find({companyId: companyUser.companyId}, (err, menus) => {
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
  })
}

exports.indexByPage = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Menu.find({companyId: companyUser.companyId, pageId: req.body.pageId}, (err, menus) => {
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
  })
}

exports.create = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'pageId')) parametersMissing = true
  if (!_.has(req.body, 'userId')) parametersMissing = true
  if (!_.has(req.body, 'jsonStructure')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (!companyUser) {
      return res.status(404).json({
        status: 'failed',
        description: 'The user account does not belong to any company. Please contact support'
      })
    }
    Pages.findOne({pageId: req.body.pageId, companyId: companyUser.companyId}, (err, page) => {
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
      Menu.findOne({pageId: req.body.pageId}, (err, info) => {
        if (err) {
          logger.serverLog(TAG,
            `Internal Server Error ${JSON.stringify(err)}`)
          return res.status(500).json({
            status: 'failed',
            description: 'Failed to find menu. Internal Server Error'
          })
        }
        if (!info) {
          const menu = new Menu({
            pageId: req.body.pageId,
            userId: req.body.userId,
            companyId: companyUser.companyId,
            jsonStructure: req.body.jsonStructure
          })

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
              require('./../../config/socketio').sendMessageToClient({
                room_id: companyUser.companyId,
                body: {
                  action: 'menu_updated',
                  payload: {
                    page_id: req.body.pageId,
                    user_id: req.user._id,
                    user_name: req.user.name,
                    payload: savedMenu
                  }
                }
              })
              const requestUrl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${page.accessToken}`

              needle.request('post', requestUrl, req.body.payload, {json: true},
                (err, resp) => {
                  if (err) {
                    logger.serverLog(TAG,
                      `Internal Server Error ${JSON.stringify(err)}`)
                  }
                  if (!err) {
                  }
                  if (JSON.stringify(resp.body.error)) {
                    return res.status(404).json({
                      status: 'error',
                      description: JSON.stringify(resp.body.error)
                    })
                  } else {
                    res.status(201).json({status: 'success', payload: savedMenu})
                  }
                })
            }
          })
        } else {
          Menu.update({pageId: req.body.pageId}, {jsonStructure: req.body.jsonStructure}, (err, updated) => {
            if (err) {
              logger.serverLog(TAG,
                `Error occurred in finding subscriber${JSON.stringify(
                  err)}`)
            } else {
              const requestUrl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${page.accessToken}`

              require('./../../config/socketio').sendMessageToClient({
                room_id: companyUser.companyId,
                body: {
                  action: 'menu_updated',
                  payload: {
                    page_id: req.body.pageId,
                    user_id: req.user._id,
                    user_name: req.user.name,
                    payload: updated
                  }
                }
              })

              needle.request('post', requestUrl, req.body.payload, {json: true},
                (err, resp) => {
                  if (!err) {
                  }
                  if (err) {
                    logger.serverLog(TAG,
                      `Internal Server Error ${JSON.stringify(err)}`)
                  }
                  if (JSON.stringify(resp.body.error)) {
                    return res.status(404).json({
                      status: 'error',
                      description: JSON.stringify(resp.body.error)
                    })
                  } else {
                    Menu.findOne({pageId: req.body.pageId}, (err, info1) => {
                      if (err) {
                        logger.serverLog(TAG,
                          `Internal Server Error ${JSON.stringify(err)}`)
                        return res.status(500).json({
                          status: 'failed',
                          description: 'Failed to find menu. Internal Server Error'
                        })
                      }
                      res.status(201).json({status: 'success', payload: info1})
                    })
                  }
                })
            }
          })
        }
      })
    })
  })
}
