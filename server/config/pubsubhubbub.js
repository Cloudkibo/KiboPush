/**
 * Created by sojharo on 15/09/2017.
 */

const pubSubHubbub = require('pubsubhubbub')
const config = require('./environment/index')

const logger = require('./../components/logger')
const TAG = 'config/pubsubhubbub.js'

const topic = 'https://www.youtube.com/xml/feeds/videos.xml?channel_id=UCEYCUNLsn0_plxHQl0fFBuA'
const hub = 'http://pubsubhubbub.appspot.com/'

let pubsub

module.exports = function () {
  logger.serverLog(TAG, JSON.stringify(config.pubsubhubbub))
  pubsub = pubSubHubbub.createServer(config.pubsubhubbub)

  pubsub.listen(config.pubsub_port)

  pubsub.on('denied', data => {
    logger.serverLog(TAG, 'Denied')
    logger.serverLog(TAG, JSON.stringify(data))
  })

  pubsub.on('subscribe', data => {
    logger.serverLog(TAG, 'Subscribe')
    logger.serverLog(TAG, JSON.stringify(data))
    logger.serverLog(TAG, 'Subscribed ' + topic + ' to ' + hub)
  })

  pubsub.on('unsubscribe', data => {
    logger.serverLog(TAG, 'Unsubscribed')
    logger.serverLog(TAG, JSON.stringify(data))
    logger.serverLog(TAG, 'Unsubscribed ' + topic + ' to ' + hub)
  })

  pubsub.on('error', error => {
    logger.serverLog(TAG, 'Error')
    logger.serverLog(TAG, JSON.stringify(error))
  })

  pubsub.on('feed', data => {
    logger.serverLog(TAG, JSON.stringify(data))
    logger.serverLog(TAG, data.feed.toString())
    // pubsub.unsubscribe(topic, hub)
  })

  pubsub.on('listen', () => {
    logger.serverLog(TAG, `Server listening on port ${pubsub.port}`)
    pubsub.subscribe(topic, hub, err => {
      if (err) {
        logger.serverLog(TAG, 'Error in subscribing to pubsubhubbub')
        logger.serverLog(TAG, JSON.stringify(err))
      }
    })
  })
}
