/**
 * Created by sojharo on 27/07/2017.
 */

const logger = require('../../components/logger')
const Pages = require('./Pages.model')
const TAG = 'api/pages/pages.controller.js'
const Users = require('../user/Users.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const needle = require('needle')
const Subscribers = require('../subscribers/Subscribers.model')

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
    Pages.find({connected: true, companyId: companyUser.companyId}, (err, pages) => {
      if (err) {
        logger.serverLog(TAG, `Error: ${err}`)
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      res.status(200).json({status: 'success', payload: pages})
    })
  })
}
exports.allpages = function (req, res) {
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
    Pages.find({connected: true, companyId: companyUser.companyId}, (err, pages) => {
      if (err) {
        return res.status(404).json({
          status: 'failed',
          description: `Error in getting pages ${JSON.stringify(err)}`
        })
      }
      Subscribers.aggregate([{
        $group: {
          _id: {pageId: '$pageId'},
          count: {$sum: 1}
        }
      }], (err2, gotSubscribersCount) => {
        if (err2) {
          return res.status(404).json({
            status: 'failed',
            description: `Error in getting pages subscriber count ${JSON.stringify(err2)}`
          })
        }
        let pagesPayload = []
        for (let i = 0; i < pages.length; i++) {
          pagesPayload.push({
            _id: pages[i]._id,
            pageId: pages[i].pageId,
            pageName: pages[i].pageName,
            userId: pages[i].userId,
            pagePic: pages[i].pagePic,
            connected: pages[i].connected,
            pageUserName: pages[i].pageUserName,
            likes: pages[i].likes,
            isWelcomeMessageEnabled: pages[i].isWelcomeMessageEnabled,
            welcomeMessage: pages[i].welcomeMessage,
            subscribers: 0
          })
        }
        for (let i = 0; i < pagesPayload.length; i++) {
          for (let j = 0; j < gotSubscribersCount.length; j++) {
            if (pagesPayload[i]._id.toString() === gotSubscribersCount[j]._id.pageId.toString()) {
              pagesPayload[i].subscribers = gotSubscribersCount[j].count
            }
          }
        }
        res.status(200).json({
          status: 'success',
          payload: pagesPayload
        })
      })
    })
  })
}

exports.enable = function (req, res) {
  logger.serverLog(TAG, `Enable page API called ${JSON.stringify(req.body)}`)
  // check if page is already connected by some other user
  // short term solution for issue Subscribers list is not updating (multi user issue) #307
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
    Pages.find(
      {pageId: req.body.pageId, connected: true},
      (err, pagesbyOther) => {
        if (err) {
          res.status(500).json({
            status: 'Failed',
            description: 'Failed to update record'
          })
        }
        logger.serverLog(TAG,
          `Page connected by other user ${JSON.stringify(pagesbyOther)}`)
        if (pagesbyOther.length === 0) {
          Pages.update({_id: req.body._id},
            {connected: true}, {multi: true}, (err) => {
              if (err) {
                res.status(500).json({
                  status: 'Failed',
                  error: err,
                  description: 'Failed to update record'
                })
              } else {
                Subscribers.update({pageId: req.body._id}, {isEnabledByPage: true}, {multi: true}, function (err) {
                  if (err) {
                    res.status(500).json({
                      status: 'Failed',
                      description: 'Failed to update record'
                    })
                  }
                  Pages.find({userId: req.user._id, companyId: companyUser.companyId}, (err2, pages) => {
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
                    var valueForMenu = {
                      'get_started': {
                        'payload': '<GET_STARTED_PAYLOAD>'
                      }
                    }
                    const requesturl = `https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${req.body.accessToken}`

                    needle.request('post', requesturl, valueForMenu, {json: true}, function (err, resp) {
                      if (!err) {
                        logger.serverLog(TAG,
                          `Menu added to page ${req.body.pageName}`)
                      }
                      if (err) {
                        logger.serverLog(TAG,
                          `Internal Server Error ${JSON.stringify(err)}`)
                      }
                    })
                    needle.post(options.url, options, (error, response) => {
                      if (error) {
                        return res.status(500)
                        .json(
                          {status: 'failed', description: JSON.stringify(error)})
                      }
                      require('./../../config/socketio').sendMessageToClient({
                        room_id: companyUser.companyId,
                        body: {
                          action: 'page_connect',
                          payload: {
                            page_id: req.body.pageId,
                            user_id: req.user._id,
                            user_name: req.user.name,
                            company_id: companyUser.companyId
                          }
                        }
                      })
                      res.status(200)
                      .json({status: 'success', payload: {pages: pages}})
                    })
                  })
                })
              }
            })
        } else {
          // page is already connected by someone else
          Pages.find({userId: req.user._id, companyId: companyUser.companyId}, (err2, pages) => {
            if (err2) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error${JSON.stringify(err)}`
              })
            }
            res.status(200)
            .json({
              status: 'success',
              payload: {
                pages: pages,
                msg: 'Page is already connected by another user'
              }
            })
          })
        }
      })
  })
}

exports.disable = function (req, res) {
  logger.serverLog(TAG, `disable page API called ${JSON.stringify(req.body)}`)

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
    Pages.update({_id: req.body._id},
      {connected: false}, {multi: true}, (err) => {
        if (err) {
          res.status(500).json({
            status: 'Failed',
            error: err,
            description: 'Failed to update record'
          })
        } else {
          // remove subscribers of the page
          logger.serverLog(TAG, `pageId coming: ${req.body._id}`)
          Subscribers.update({pageId: req.body._id}, {isEnabledByPage: false}, {multi: true}, (err) => {
            Subscribers.find({ pageId: req.body._id }, (err, subscribers) => {
              if (err) {
                logger.serverLog(TAG, `Error on fetching subscribers: ${err}`)
                return res.status(404)
                .json({status: 'failed', description: 'Subscribers not found'})
              }
              logger.serverLog(TAG, `fetching subscribers: ${subscribers}`)
            })
            Pages.find({userId: req.user._id, companyId: companyUser.companyId}, (err2, pages) => {
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
                require('./../../config/socketio').sendMessageToClient({
                  room_id: companyUser.companyId,
                  body: {
                    action: 'page_disconnect',
                    payload: {
                      page_id: req.body.pageId,
                      user_id: req.user._id,
                      user_name: req.user.name,
                      company_id: companyUser.companyId
                    }
                  }
                })
                Subscribers.aggregate([{
                  $group: {
                    _id: {pageId: '$pageId'},
                    count: {$sum: 1}
                  }
                }], (err2, gotSubscribersCount) => {
                  if (err2) {
                    return res.status(404).json({
                      status: 'failed',
                      description: `Error in getting pages subscriber count ${JSON.stringify(err2)}`
                    })
                  }
                  let pagesPayload = []
                  for (let i = 0; i < pages.length; i++) {
                    pagesPayload.push({
                      _id: pages[i]._id,
                      pageId: pages[i].pageId,
                      pageName: pages[i].pageName,
                      userId: pages[i].userId,
                      pagePic: pages[i].pagePic,
                      connected: pages[i].connected,
                      pageUserName: pages[i].pageUserName,
                      likes: pages[i].likes,
                      subscribers: 0
                    })
                  }
                  for (let i = 0; i < pagesPayload.length; i++) {
                    for (let j = 0; j < gotSubscribersCount.length; j++) {
                      if (pagesPayload[i]._id.toString() === gotSubscribersCount[j]._id.pageId.toString()) {
                        pagesPayload[i].subscribers = gotSubscribersCount[j].count
                      }
                    }
                  }
                  res.status(200).json({
                    status: 'success',
                    payload: pagesPayload
                  })
                })
                //  res.status(200).json({status: 'success', payload: pages})
              })
            })
          })
        }
      })
  })
}

exports.otherPages = function (req, res) {
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
    Pages.find({connected: false, userId: req.user._id, companyId: companyUser.companyId}, (err, pages) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(
            err)}`
        })
      }
      return res.status(200).json({status: 'success', payload: pages})
    })
  })
}

exports.addPages = function (req, res) {
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
    Users.findOne({fbId: req.user.fbId}, (err, user) => {
      if (err) {
        return res.status(500).json({status: 'failed', description: err})
      }
      Pages.find({userId: req.user._id}, (err, pages) => {
        if (err) {
          return res.status(500).json({status: 'failed', description: err})
        }
        logger.serverLog(TAG, `Pages returned ${JSON.stringify(pages)}`)
        res.status(201).json({status: 'success', payload: pages})
      })
      //  return res.status(200).json({ status: 'success', payload: user});
    })
  })
}
exports.createWelcomeMessage = function (req, res) {
  Pages.update({_id: req.body._id, connected: true},
    {welcomeMessage: req.body.welcomeMessage}, (err) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          error: err,
          description: 'Failed to update record'
        })
      }
      res.status(201).json({status: 'success', payload: req.body})
    })
}
exports.isWelcomeMessageEnabled = function (req, res) {
  Pages.update({_id: req.body._id, connected: true},
    {isWelcomeMessageEnabled: req.body.isWelcomeMessageEnabled}, (err) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          error: err,
          description: 'Failed to update record'
        })
      }
      res.status(201).json({status: 'success', payload: req.body})
    })
}
