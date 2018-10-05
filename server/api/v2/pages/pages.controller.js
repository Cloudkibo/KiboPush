const logicLayer = require('./pages.logiclayer')
const utility = require('../utility')
const needle = require('needle')
const logger = require('../../../components/logger')
const TAG = 'api/v2/pages/pages.controller.js'

exports.index = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    utility.callApi(`page/generic`, 'post', {companyId: companyuser.companyId}) // fetch all pages of company
    .then(pages => {
      let pagesToSend = logicLayer.removeDuplicates(pages)
      return res.status(200).json({
        status: 'success',
        payload: pagesToSend
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch pages ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}

exports.connectedPages = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    let criterias = logicLayer.getCriterias(req.body, companyuser)
    utility.callApi(`page/pagination/`, 'post', criterias.countCriteria) // fetch connected pages count
    .then(count => {
      utility.callApi(`page/pagination`, 'post', criterias.fetchCriteria) // fetch connected pages
      .then(pages => {
        res.status(200).json({
          status: 'success',
          payload: {pages: pages, count: count.length > 0 ? count[0].count : 0}
        })
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch connected pages ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch connected pages count ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company user ${JSON.stringify(error)}`
    })
  })
}

exports.enable = function (req, res) {
  utility.callApi(`companyprofile/query`, 'post', {ownerId: req.user._id})
  .then(companyProfile => {
    utility.callApi(`usage/planGeneric`, 'post', {planId: companyProfile.planId})
    .then(planUsage => {
      utility.callApi(`usage/companyGeneric`, 'post', {companyId: companyProfile._id})
      .then(companyUsage => {
        if (planUsage.facebook_pages !== -1 && companyUsage.facebook_pages >= planUsage.facebook_pages) {
          return res.status(500).json({
            status: 'failed',
            description: `Your pages limit has reached. Please upgrade your plan to premium in order to connect more pages.`
          })
        }
        utility.callApi(`page/${req.body._id}`) // fetch page
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
                  payload: 'Page is not published.'
                })
              } else {
                utility.callApi(`page/connect/${page.pageId}`) // fetch connected page
                .then(pageConnected => {
                  if (pageConnected !== {}) {
                    utility.callApi(`page/${req.body._id}`, 'put', {connected: true}) // connect page
                    .then(res => {
                      utility.callApi(`updateCompany/`, 'put', {
                        query: {companyId: req.body.companyId},
                        newPayload: { $inc: { facebook_pages: 1 } }
                      })
                      .then(updated => {
                      })
                      .catch(error => {
                        return res.status(500).json({
                          status: 'failed',
                          payload: `Failed to update company usage ${JSON.stringify(error)}`
                        })
                      })
                      utility.callApi(`subscribers/${page._id}`, 'put', {isEnabledByPage: true}) // update subscribers
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
                              payload: JSON.stringify(error)
                            })
                          }
                          require('./../../../config/socketio').sendMessageToClient({
                            room_id: req.body.companyId,
                            body: {
                              action: 'page_connect',
                              payload: {
                                page_id: page.pageId,
                                user_id: req.user._id,
                                user_name: req.user.name,
                                company_id: req.body.companyId
                              }
                            }
                          })
                          return res.status(200).json({
                            status: 'success',
                            payload: 'Page connected successfully!'
                          })
                        })
                      })
                      .catch(error => {
                        return res.status(500).json({
                          status: 'failed',
                          payload: `Failed to update subscriber ${JSON.stringify(error)}`
                        })
                      })
                    })
                    .catch(error => {
                      return res.status(500).json({
                        status: 'failed',
                        payload: `Failed to connect page ${JSON.stringify(error)}`
                      })
                    })
                  } else {
                    res.status(400).json({
                      status: 'failed',
                      payload: `Page is already connected by ${pageConnected.userId.facebookInfo.name}. In order to manage this page please ask ${pageConnected.userId.facebookInfo.name} to create a team account and invite you.`
                    })
                  }
                })
                .catch(error => {
                  return res.status(500).json({
                    status: 'failed',
                    payload: `Failed to fetch connected page ${JSON.stringify(error)}`
                  })
                })
              }
            })
        })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to fetch page ${JSON.stringify(error)}`
          })
        })
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch company usage ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch plan usage ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company profile ${JSON.stringify(error)}`
    })
  })
}

exports.disable = function (req, res) {
  utility.callApi(`page/${req.body._id}`, 'put', {connected: false}) // disconnect page
  .then(res => {
    utility.callApi(`subscribers/${req.body._id}`, 'put', {isEnabledByPage: false}) // update subscribers
    .then(res => {
      utility.callApi(`updateCompany/`, 'put', {
        query: {companyId: req.body.companyId},
        newPayload: { $inc: { facebook_pages: -1 } }
      })
      .then(updated => {
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to update company usage ${JSON.stringify(error)}`
        })
      })
      const options = {
        url: `https://graph.facebook.com/v2.6/${req.body.pageId}/subscribed_apps?access_token=${req.body.accessToken}`,
        qs: {access_token: req.body.accessToken},
        method: 'DELETE'
      }
      needle.delete(options.url, options, (error, response) => {
        if (error) {
          return res.status(500).json({
            status: 'failed',
            payload: JSON.stringify(error)
          })
        }
        require('./../../../config/socketio').sendMessageToClient({
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
          payload: 'Page disconnected successfully!'
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to update subscribers ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch page ${JSON.stringify(error)}`
    })
  })
}

exports.createWelcomeMessage = function (req, res) {
  utility.callApi(`page/${req.body._id}`, 'put', {welcomeMessage: req.body.welcomeMessage})
  .then(res => {
    return res.status(200).json({
      status: 'success',
      payload: 'Welcome Message updated successfully!'
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to update welcome message ${JSON.stringify(error)}`
    })
  })
}

exports.enableDisableWelcomeMessage = function (req, res) {
  utility.callApi(`page/${req.body._id}`, 'put', {isWelcomeMessageEnabled: req.body.isWelcomeMessageEnabled})
  .then(res => {
    return res.status(200).json({
      status: 'success',
      payload: 'Operation completed successfully!'
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to update welcome message ${JSON.stringify(error)}`
    })
  })
}

exports.saveGreetingText = function (req, res) {
  const pageId = req.body.pageId
  const greetingText = req.body.greetingText

  utility.callApi(`page/${pageId}/greetingText`, 'put', {greetingText: greetingText})
  .then(res => {
    utility.callApi(`page/query`, 'post', {_id: pageId})
    .then(res => {
      if (res.status === 'success') {
        const pageToken = res.payload && res.payload.length && res.payload[0].accessToken
        if (pageToken) {
          const requesturl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${pageToken}`
          var valueForMenu = {
            'greeting': [
              {
                'locale': 'default',
                'text': greetingText
              }]
          }

          needle.request('post', requesturl, valueForMenu, {json: true},
            function (err, resp) {
              if (!err) {
                return res.status(200).json({
                  status: 'success',
                  payload: 'Operation completed successfully!'
                })
              }
              if (err) {
                logger.serverLog(TAG,
                  `Internal Server Error ${JSON.stringify(err)}`)
              }
            })
        } else {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to find page access token to update greeting text message`
          })
        }
      } else {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to update greeting text message`
        })
      }
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to update greeting text message ${JSON.stringify(error)}`
    })
  })
}
