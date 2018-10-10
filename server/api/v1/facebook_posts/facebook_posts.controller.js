const logger = require('../../../components/logger')
const FacebookPosts = require('./facebook_posts.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Pages = require('../pages/Pages.model')
const Users = require('./../user/Users.model')
const needle = require('needle')
const TAG = 'api/facebook_posts/facebook_posts.controller.js'
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
    FacebookPosts.find({companyId: companyUser.companyId}, (err, posts) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error${JSON.stringify(err)}`
        })
      }
      res.status(200).json({
        status: 'success',
        payload: posts
      })
    })
  })
}

exports.viewPost = function (req, res) {
  FacebookPosts.findOne({_id: req.params.id}, (err, post) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error${JSON.stringify(err)}`
      })
    }
    res.status(200).json({
      status: 'success',
      payload: post
    })
  })
}

exports.create = function (req, res) {
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
    let postPayload = {
      pageId: req.body.pageId,
      companyId: companyUser.companyId,
      userId: req.user._id,
      payload: req.body.payload,
      reply: req.body.reply,
      includedKeywords: req.body.includedKeywords,
      excludedKeywords: req.body.excludedKeywords
    }
    const post = new FacebookPosts(postPayload)

    // save model to MongoDB
    post.save((err, postCreated) => {
      if (err) {
        res.status(500).json({
          status: 'Failed',
          error: err,
          description: 'Failed to insert record'
        })
      } else {
        require('./../../../config/socketio').sendMessageToClient({
          room_id: companyUser.companyId,
          body: {
            action: 'post_created',
            payload: {
              poll_id: postCreated._id,
              user_id: req.user._id,
              user_name: req.user.name,
              company_id: companyUser.companyId
            }
          }
        })
        Pages.findOne({_id: req.body.pageId}, (err, userPage) => {
          if (err) {
            logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          Users.findOne({_id: userPage.userId}, (err, connectedUser) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            var currentUser
            if (req.user.facebookInfo) {
              currentUser = req.user
            } else {
              currentUser = connectedUser
            }
            needle.get(
            `https://graph.facebook.com/v2.10/${userPage.pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
            (err, resp) => {
              if (err) {
                logger.serverLog(TAG,
                `Page accesstoken from graph api Error${JSON.stringify(err)}`)
              }
              logger.serverLog(TAG,
              `post request ${JSON.stringify(req.body.payload)}`)
              // const messageData = {
              //   message: req.body.payload
              // }
              let messageData = {}
              req.body.payload.map(payloadItem => {
                if (payloadItem.componentType === 'text') {
                  messageData.message = payloadItem.text
                } else if (payloadItem.componentType === 'image') {
                  messageData.image = true
                  messageData.url = payloadItem.url
                } else if (payloadItem.componentType === 'video') {
                  //  let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
                  //  let dir = path.resolve(__dirname, '../../../broadcastFiles/userfiles')
                  //  let fileReaderStream = fs.createReadStream(dir + '/' + payloadItem.id)
                  //  let url = payloadItem.url + '&f=filename.mov'
                  //  let fileReaderStream = fs.createReadStream(url)
                  messageData.description = messageData.message
                  messageData.video = true
                  messageData.file_url = payloadItem.url
                }
              })
              // var form = new FormData()
              // form.append('source', messageData.url)
              // needle.post(
              //   `https://graph.facebook.com/${userPage.pageId}/feed?access_token=${resp.body.access_token}`,
              //   form, (err, resp) => {
              //     if (err) {
              //       logger.serverLog(TAG, err)
              //     }
              //     logger.serverLog(TAG,
              //     `response from post on facebook ${JSON.stringify(resp.body)}`)
              //     //  res.status(201).json({status: 'success', payload: postCreated})
              //   })
              logger.serverLog(TAG,
              `messageData ${JSON.stringify(messageData)}`)
              if (messageData.image) {
                needle.post(
                  `https://graph.facebook.com/${userPage.pageId}/photos?access_token=${resp.body.access_token}`,
                  messageData, (err, resp) => {
                    if (err) {
                      logger.serverLog(TAG, err)
                    }
                    logger.serverLog(TAG,
                    `response from post on facebook ${JSON.stringify(resp.body)}`)
                    let postId = resp.body.post_id ? resp.body.post_id : resp.body.id
                    FacebookPosts.update(
                      {_id: postCreated._id}, {post_id: postId}, (err2, updated) => {
                        if (err) {
                        }
                        res.status(201).json({status: 'success', payload: postCreated})
                      })
                  })
              } else if (messageData.video) {
                needle.post(
                  `https://graph.facebook.com/${userPage.pageId}/videos?access_token=${resp.body.access_token}`,
                  messageData, (err, resp) => {
                    if (err) {
                      logger.serverLog(TAG, err)
                    }
                    logger.serverLog(TAG,
                    `response from post on facebook ${JSON.stringify(resp.body)}`)
                    let postId = resp.body.post_id ? resp.body.post_id : resp.body.id
                    FacebookPosts.update(
                      {_id: postCreated._id}, {post_id: postId}, (err2, updated) => {
                        if (err) {
                        }
                        res.status(201).json({status: 'success', payload: postCreated})
                      })
                  })
              } else {
                needle.post(
                  `https://graph.facebook.com/${userPage.pageId}/feed?access_token=${resp.body.access_token}`,
                  messageData, (err, resp) => {
                    if (err) {
                      logger.serverLog(TAG, err)
                    }
                    logger.serverLog(TAG,
                    `response from post on facebook ${JSON.stringify(resp.body)}`)
                    let postId = resp.body.post_id ? resp.body.post_id : resp.body.id
                    FacebookPosts.update(
                      {_id: postCreated._id}, {post_id: postId}, (err2, updated) => {
                        if (err) {
                        }
                        res.status(201).json({status: 'success', payload: postCreated})
                      })
                  })
              }
              //  let messageData = utility.prepareSendAPIPayload(req.body.payload[1])
              // needle.post(
              //   `https://graph.facebook.com/${userPage.pageId}/photos?access_token=${resp.body.access_token}`,
              //   messageData, (err, resp) => {
              //     if (err) {
              //       logger.serverLog(TAG, err)
              //     }
              //     logger.serverLog(TAG,
              //     `response from post on facebook ${JSON.stringify(resp.body)}`)
              //     res.status(201).json({status: 'success', payload: postCreated})
              //   })
            })
          })
        })
      }
    })
  })
}

exports.edit = function (req, res) {
  FacebookPosts.findById(req.body.postId, (err, post) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!post) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    post.includedKeywords = req.body.includedKeywords
    post.excludedKeywords = req.body.excludedKeywords
    post.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'post update failed'})
      }
      res.status(201).json({status: 'success', payload: post})
    })
  })
}

exports.delete = function (req, res) {
  FacebookPosts.findById(req.params.id, (err, post) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!post) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    post.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'post update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
