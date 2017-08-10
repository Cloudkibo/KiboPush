const logger = require('../../components/logger')
const Polls = require('./Polls.model')
const PollResponse = require('./pollresponse.model')
const Subscribers = require('../subscribers/Subscribers.model')
const needle = require('needle')
const Pages = require('../pages/Pages.model')

const TAG = 'api/polls/polls.controller.js'

exports.index = function (req, res) {
  logger.serverLog(TAG, 'Poll get api is working')
  Polls.find({ userId: req.user._id }, (err, polls) => {
    logger.serverLog(TAG, polls)
    logger.serverLog(TAG, `Error: ${err}`)
    res.status(200).json({ status: 'success', payload: polls })
  })
}

exports.create = function (req, res) {
  const poll = new Polls({
    platform: 'facebook',
    statement: req.body.statement,
    options: req.body.options,
    sent: 0,
    userId: req.user._id
  })

  // save model to MongoDB
  poll.save((err) => {
    if (err) {
      res.status(500).json({ status: 'Failed', error: err, description: 'Failed to insert record' })
    } else {
      res.status(200).json({ status: 'Success' })
    }
  })
}

exports.submitresponses = function (req, res) {
  logger.serverLog(TAG, `Inside submitresponses of Poll ${JSON.stringify(req.body)}`)
  /*
   Expected body
   {
   response:String,//response submitted by subscriber
   pollId: _id of Poll,
   subscriberId: _id of subscriber,
   }
   */

  PollResponse.create(req.body, (err, pollresponse) => {
    if (err) {
      return res.status(404).json({ status: 'failed', description: 'Poll response not created' })
    }
    return res.status(200).json({ status: 'success', payload: pollresponse })
  })
}

exports.getresponses = function (req, res) {
  logger.serverLog(TAG, 'Inside getresponses of Poll')

  PollResponse.find({ pollId: req.params.id }).populate('pollId subscriberId').exec((err, pollresponses) => {
    if (err) {
      return res.status(404).json({ status: 'failed', description: 'Poll responses not found' })
    }

    return res.status(200).json({ status: 'success', payload: pollresponses })
  })
}
exports.report = function (req, res) {

}

exports.send = function (req, res) {
  logger.serverLog(TAG, `Inside sendpoll ${JSON.stringify(req.body)}`)
  /*
   Expected request body
   { platform: 'facebook',statement: req.body.statement,options: req.body.options,sent: 0 });
   */

  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: req.body.statement,
        buttons: [
          {
            type: 'postback',
            title: req.body.options[0],
            payload: JSON.stringify({ poll_id: req.body._id, option: req.body.options[0] })
          },
          {
            type: 'postback',
            title: req.body.options[1],
            payload: JSON.stringify({ poll_id: req.body._id, option: req.body.options[1] })
          },
          {
            type: 'postback',
            title: req.body.options[2],
            payload: JSON.stringify({ poll_id: req.body._id, option: req.body.options[2] })
          }
        ]
      }
    }
  }
  logger.serverLog(TAG, `Poll to be sent ${JSON.stringify(messageData)}`)
  Pages.find({ userId: req.user._id, connected: true }, (err, pages) => {
    if (err) {
      logger.serverLog(TAG, `Error ${JSON.stringify(err)}`)
      return res.status(404).json({ status: 'failed', description: 'Pages not found' })
    }
    logger.serverLog(TAG, `Page at Z ${JSON.stringify(pages)}`)
    for (let z = 0; z < pages.length; z++) // todo this for loop doesn't work with async code
    {
      logger.serverLog(TAG, `Page at Z ${JSON.stringify(pages[z])}`)
      Subscribers.find({ pageId: pages[z]._id }, (err, subscribers) => {
        if (subscribers.length > 0) {
          logger.serverLog(TAG, `Subscribers of page ${JSON.stringify(subscribers)}`)
          logger.serverLog(TAG, `Page at Z ${JSON.stringify(pages[z])}`)
          if (err) {
            return logger.serverLog(TAG, `error : ${JSON.stringify(err)}`)
          }
          // get accesstoken of page
          // TODO can't we get access token from the page table???
          // -- Page tokens get expired therefore we need to fetch it from Graph api
          needle.get(`https://graph.facebook.com/v2.10/${pages[z].pageId}?fields=access_token&access_token=${req.user.fbToken}`, (err, resp) => {
            if (err) {
              logger.serverLog(TAG, `Page accesstoken from graph api Error${JSON.stringify(err)}`)
            }

            logger.serverLog(TAG, `Page accesstoken from graph api ${JSON.stringify(resp.body)}`)

            for (let j = 0; j < subscribers.length; j++) { // TODO again for loop is not good option
              logger.serverLog(TAG, `At Subscriber fetched ${JSON.stringify(subscribers[j])}`)
              logger.serverLog(TAG, `At Pages Token ${resp.body.access_token}`)

              const data = {
                recipient: { id: subscribers[j].senderId }, // this is the subscriber id
                message: messageData
              }

              needle.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${resp.body.access_token}`, data, (err, resp) => {
                logger.serverLog(TAG, `Sending poll to subscriber response ${JSON.stringify(resp.body)}`)
                if (err) {
                  // TODO this will do problem, res should not be in loop
                  // return res.status(404).json({ status: 'failed', description: err });
                  logger.serverLog(TAG, err)
                  logger.serverLog(TAG, `ERror occured at subscriber :${JSON.stringify(subscribers[j])}`)
                }

                // return res.status(200).json({ status: 'success', payload: resp.body });
              })
            }
          })
        }
      })
    }
    return res.status(200).json({ status: 'success', payload: 'Poll sent successfully.' })
  })
}
