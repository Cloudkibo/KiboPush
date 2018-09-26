const logger = require('../../components/logger')
const TAG = 'api/facebookEvents/comment.controller.js'
const needle = require('needle')
const FacebookPosts = require('./../facebook_posts/facebook_posts.model')

exports.sendCommentReply = function (req, res) {
  let send = true
  let postId = req.body.entry[0].changes[0].value.post_id
  FacebookPosts.findOne({
    post_id: postId
  }).populate('pageId userId').exec((err, post) => {
    if (err) {
    }
    FacebookPosts.update({ post_id: postId }, { $inc: { count: 1 } }, (err, updated) => {
      if (err) {
      }
      logger.serverLog(TAG,
        `updated value ${JSON.stringify(updated)}`)
      logger.serverLog(TAG,
        `response from comment on facebook ${JSON.stringify(post)}`)
      if (post && post.pageId) {
        if (req.body.entry[0].changes[0].value.message) {
          if (post.includedKeywords && post.includedKeywords.length > 0) {
            send = false
            for (let i = 0; i < post.includedKeywords.length; i++) {
              if (req.body.entry[0].changes[0].value.message.toLowerCase().includes(post.includedKeywords[i].toLowerCase())) {
                logger.serverLog(TAG,
                  `inside if send value ${JSON.stringify(send)}`)
                send = true
                break
              }
            }
          }
          if (post.excludedKeywords && post.excludedKeywords.length > 0) {
            send = true
            for (let i = 0; i < post.excludedKeywords.length; i++) {
              if (req.body.entry[0].changes[0].value.message.toLowerCase().includes(post.excludedKeywords[i].toLowerCase())) {
                send = false
                break
              }
            }
          }
        }
        logger.serverLog(TAG,
          `send value ${JSON.stringify(send)}`)
        if (send) {
          needle.get(
            `https://graph.facebook.com/v2.10/${post.pageId.pageId}?fields=access_token&access_token=${post.userId.facebookInfo.fbToken}`,
            (err, resp) => {
              if (err) {
                logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
              }
              let messageData = { message: post.reply }
              needle.post(
                `https://graph.facebook.com/${req.body.entry[0].changes[0].value.comment_id}/private_replies?access_token=${resp.body.access_token}`,
                messageData, (err, resp) => {
                  if (err) {
                    logger.serverLog(TAG, err)
                  }
                  logger.serverLog(TAG,
                    `response from comment on facebook 2 ${JSON.stringify(resp.body)}`)
                })
              // needle.post(
              //   `https://graph.facebook.com/${body.entry[0].changes[0].value.comment_id}/comments?access_token=${resp.body.access_token}`,
              //   messageData, (err, resp) => {
              //     if (err) {
              //       logger.serverLog(TAG, err)
              //     }
              //     logger.serverLog(TAG,
              //       `response from comment on facebook 3 ${JSON.stringify(resp.body)}`)
              //   })
            })
        }
      }
    })
  })
}
