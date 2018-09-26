const logger = require('../../../components/logger')
const needle = require('needle')
const TAG = 'api/facebook_posts/facebook_posts.controller.js'
const utility = require('../utility')

exports.index = function (req, res) {
  utility.callApi(`commentCapture/`)
  .then(posts => {
    res.status(200).json({
      status: 'success',
      payload: posts
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      description: error
    })
  })
}

exports.viewPost = function (req, res) {
  utility.callApi(`commentCapture/${req.params.id}`)
  .then(post => {
    res.status(200).json({
      status: 'success',
      payload: post
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      description: error
    })
  })
}

exports.create = function (req, res) {
  // utility.callApi(`companyUser/${req.user.domain_email}`)
  // .then(companyUser => {
  //   utility.callApi(`commentCapture`, 'post', {
  //     pageId: req.body.pageId,
  //     companyId: companyUser.companyId,
  //     user: req.user._id,
  //     reply: req.body.reply,
  //     payload: req.body.payload,
  //     includeKeywords: req.body.includeKeywords,
  //     excludedKeywords: req.body.excludedKeywords
  //   })
  //   .then(postCreated => {
  //     require('./../../config/socketio').sendMessageToClient({
  //       room_id: companyUser.companyId,
  //       body: {
  //         action: 'post_created',
  //         payload: {
  //           poll_id: postCreated._id,
  //           user_id: req.user._id,
  //           user_name: req.user.name,
  //           company_id: companyUser.companyId
  //         }
  //       }
  //     })
  //     utility.callApi(`page/${req.body.pageId}`)
  //     .then(page => {
  //       let currentUser
  //       if (req.user.facebookInfo) {
  //         currentUser = req.user
  //       } else {
  //         currentUser = page.userId
  //       }
  //       needle.get(
  //       `https://graph.facebook.com/v2.10/${page.pageId}?fields=access_token&access_token=${currentUser.facebookInfo.fbToken}`,
  //       (err, resp) => {
  //         if (err) {
  //           logger.serverLog(TAG,
  //           `Page accesstoken from graph api Error${JSON.stringify(err)}`)
  //         }
  //         logger.serverLog(TAG,
  //         `post request ${JSON.stringify(req.body.payload)}`)
  //         let messageData = {}
  //         req.body.payload.map(payloadItem => {
  //           if (payloadItem.componentType === 'text') {
  //             messageData.message = payloadItem.text
  //           } else if (payloadItem.componentType === 'image') {
  //             messageData.image = true
  //             messageData.url = payloadItem.url
  //           } else if (payloadItem.componentType === 'video') {
  //             messageData.description = messageData.message
  //             messageData.video = true
  //             messageData.file_url = payloadItem.url
  //           }
  //         })
  //         logger.serverLog(TAG,
  //         `messageData ${JSON.stringify(messageData)}`)
  //         if (messageData.image) {
  //           needle.post(
  //             `https://graph.facebook.com/${page.pageId}/photos?access_token=${resp.body.access_token}`,
  //             messageData, (err, resp) => {
  //               if (err) {
  //                 logger.serverLog(TAG, err)
  //               }
  //               logger.serverLog(TAG,
  //               `response from post on facebook ${JSON.stringify(resp.body)}`)
  //               let postId = resp.body.post_id ? resp.body.post_id : resp.body.id
  //               utility.callApi(`commentCapture/${postCreated._id}`, 'put', {post_id: postId})
  //               .then(result => {
  //                 res.status(201).json({status: 'success', payload: postCreated})
  //               })
  //               .catch(error => {
  //                 return res.status(500).json({
  //                   status: 'failed',
  //                   description: error
  //                 })
  //               })
  //             })
  //         } else if (messageData.video) {
  //           needle.post(
  //             `https://graph.facebook.com/${page.pageId}/videos?access_token=${resp.body.access_token}`,
  //             messageData, (err, resp) => {
  //               if (err) {
  //                 logger.serverLog(TAG, err)
  //               }
  //               logger.serverLog(TAG,
  //               `response from post on facebook ${JSON.stringify(resp.body)}`)
  //               let postId = resp.body.post_id ? resp.body.post_id : resp.body.id
  //               utility.callApi(`commentCapture/${postCreated._id}`, 'put', {post_id: postId})
  //               .then(result => {
  //                 res.status(201).json({status: 'success', payload: postCreated})
  //               })
  //               .catch(error => {
  //                 return res.status(500).json({
  //                   status: 'failed',
  //                   description: error
  //                 })
  //               })
  //             })
  //         } else {
  //           needle.post(
  //             `https://graph.facebook.com/${userPage.pageId}/feed?access_token=${resp.body.access_token}`,
  //             messageData, (err, resp) => {
  //               if (err) {
  //                 logger.serverLog(TAG, err)
  //               }
  //               logger.serverLog(TAG,
  //               `response from post on facebook ${JSON.stringify(resp.body)}`)
  //               let postId = resp.body.post_id ? resp.body.post_id : resp.body.id
  //               FacebookPosts.update(
  //                 {_id: postCreated._id}, {post_id: postId}, (err2, updated) => {
  //                   if (err) {
  //                   }
  //                   res.status(201).json({status: 'success', payload: postCreated})
  //                 })
  //             })
  //         }
  //         //  let messageData = utility.prepareSendAPIPayload(req.body.payload[1])
  //         // needle.post(
  //         //   `https://graph.facebook.com/${userPage.pageId}/photos?access_token=${resp.body.access_token}`,
  //         //   messageData, (err, resp) => {
  //         //     if (err) {
  //         //       logger.serverLog(TAG, err)
  //         //     }
  //         //     logger.serverLog(TAG,
  //         //     `response from post on facebook ${JSON.stringify(resp.body)}`)
  //         //     res.status(201).json({status: 'success', payload: postCreated})
  //         //   })
  //       })
  //     })
  //     .catch(error => {
  //       return res.status(500).json({
  //         status: 'failed',
  //         description: error
  //       })
  //     })
  //     res.status(200).json({
  //       status: 'success',
  //       payload: postCreated
  //     })
  //   })
  //   .catch(error => {
  //     return res.status(500).json({
  //       status: 'failed',
  //       description: error
  //     })
  //   })
  // })
  // .catch(error => {
  //   return res.status(500).json({
  //     status: 'failed',
  //     description: error
  //   })
  // })
}
