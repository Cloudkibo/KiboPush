const logicLayer = require('./pages.logiclayer')
const utility = require('../utility')
const needle = require('needle')
const logger = require('../../../components/logger')
const TAG = 'api/v2/pages/pages.controller.js'

exports.enable = function (req, res) {
  utility.callApi(`company/${req.body.companyId}`)
  .then(company => {
    utility.callApi(`planUsage/${company.planId}`)
    .then(planUsage => {
      utility.callApi(`companyUsage/${company._id}`)
      .then(companyUsage => {
        if (logicLayer.isUsageLimitReached(planUsage, companyUsage)) {
          return res.status(500).json({
            status: 'failed',
            description: `Your pages limit has reached. Please upgrade your plan to premium in order to connect more pages.`
          })
        } else {
          utility.callApi(`page/${req.body._id}`)
          .then(page => {
            needle.get(
              `https://graph.facebook.com/v2.10/${page.pageId}?fields=is_published&access_token=${page.userId.facebookInfo.fbToken}`,
              (err, resp) => {
                if (err) {
                  logger.serverLog(TAG,
                    `Graph api error at getting page publish status ${JSON.stringify(err)}`)
                }
                if (resp.body.is_published === false) {
                  return res.status(404).json({
                    status: 'failed',
                    description: 'Page is not published.'
                  })
                } else {
                  utility.callApi(`page/connect/${page.pageId}`)
                  .then(pageConnected => {
                    if (pageConnected !== {}) {
                      utility.callApi(`page/${req.body._id}`, 'put', {connected: true})
                      .then(res => {
                        utility.callApi(`companyUsage/${company._id}`, 'put', { $inc: { facebook_pages: 1 } })
                        .then(res => {
                          utility.callApi(`subscribers/${page._id}`, 'put', {isEnabledByPage: true})
                          .then(res => {
                            const options = {
                              url: `https://graph.facebook.com/v2.6/${page.pageId}/subscribed_apps?access_token=${page.accessToken}`,
                              qs: {access_token: page.accessToken},
                              method: 'POST'
                            }
                            needle.post(options.url, options, (error, response) => {
                              if (error) {
                                return res.status(500).json({
                                  status: 'failed',
                                  description: JSON.stringify(error)
                                })
                              }
                              require('./../../config/socketio').sendMessageToClient({
                                room_id: company._id,
                                body: {
                                  action: 'page_connect',
                                  payload: {
                                    page_id: page.pageId,
                                    user_id: req.user._id,
                                    user_name: req.user.name,
                                    company_id: company._id
                                  }
                                }
                              })
                              return res.status(200).json({
                                status: 'success',
                                description: 'Page connected successfully!'
                              })
                            })
                          })
                          .catch(error => {
                            return res.status(500).json({
                              status: 'failed',
                              description: error
                            })
                          })
                        })
                        .catch(error => {
                          return res.status(500).json({
                            status: 'failed',
                            description: error
                          })
                        })
                      })
                      .catch(error => {
                        return res.status(500).json({
                          status: 'failed',
                          description: error
                        })
                      })
                    } else {
                      res.status(400).json({
                        status: 'failed',
                        description: `Page is already connected by ${pageConnected.userId.facebookInfo.name}. In order to manage this page please ask ${pageConnected.userId.facebookInfo.name} to create a team account and invite you.`
                      })
                    }
                  })
                  .catch(error => {
                    return res.status(500).json({
                      status: 'failed',
                      description: error
                    })
                  })
                }
              })
          })
          .catch(error => {
            return res.status(500).json({
              status: 'failed',
              description: error
            })
          })
        }
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          description: error
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        description: error
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      description: error
    })
  })
}

exports.disable = function (req, res) {
  utility.callApi(`page/${req.body._id}`, 'put', {connected: false})
  .then(res => {
    utility.callApi(`companyUsage/${req.body.companyId}`, 'put', { $inc: { facebook_pages: -1 } })
    .then(res => {
      utility.callApi(`subscribers/${req.body._id}`, 'put', {isEnabledByPage: false})
      .then(res => {
        const options = {
          url: `https://graph.facebook.com/v2.6/${req.body.pageId}/subscribed_apps?access_token=${req.body.accessToken}`,
          qs: {access_token: req.body.accessToken},
          method: 'DELETE'
        }
        needle.delete(options.url, options, (error, response) => {
          if (error) {
            return res.status(500).json({
              status: 'failed',
              description: JSON.stringify(error)
            })
          }
          require('./../../config/socketio').sendMessageToClient({
            room_id: req.body.companyId,
            body: {
              action: 'page_disconnect',
              payload: {
                page_id: req.body.pageId,
                user_id: req.user._id,
                user_name: req.user.name,
                company_id: req.body.companyId
              }
            }
          })
          return res.status(200).json({
            status: 'success',
            description: 'Page disconnected successfully!'
          })
        })
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          description: error
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        description: error
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      description: error
    })
  })
}
