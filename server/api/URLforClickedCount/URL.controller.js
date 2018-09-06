const URL = require('./URL.model')
const AutopostingMessages = require('./../autoposting_messages/autoposting_messages.model')
const Broadcasts = require('./../broadcasts/broadcasts.model')
const SequenceMessages = require('./../sequenceMessaging/message.model')
const Subscribers = require('../subscribers/Subscribers.model')
const {getAllMessagesOfSequencesSubscribers, getSentSequenceMessages, findMessageToBeScheduled} = require('./../broadcasts/broadcasts.controller')
const logger = require('../../components/logger')

exports.index = function (req, res) {
  URL.findOne({_id: req.params.id}, (err, URLObject) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    AutopostingMessages.update({_id: URLObject.module.id}, {$inc: {clicked: 1}}, (err, updatedData) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }

      res.writeHead(301, {Location: URLObject.originalURL})
      res.end()
    })
  })
}

exports.broadcast = function (req, res) {
  URL.findOne({_id: req.params.id}, (err, URLObject) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (URLObject) {
      Broadcasts.update({_id: URLObject.module.id}, {$inc: {clicks: 1}}, (err, updatedData) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        res.writeHead(301, {Location: URLObject.originalURL.startsWith('http') ? URLObject.originalURL : `https://${URLObject.originalURL}`})
        res.end()
      })
    } else {
      res.status(400).json({
        status: 'failed',
        description: 'No URL found with id ' + req.params.id
      })
    }
  })
}

exports.sequence = function (req, res) {
  logger.serverLog(`Sequence Click Count ${JSON.stringify(req.params.id)}`)
  URL.findOne({_id: req.params.id}, (err, URLObject) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    if (URLObject) {
      logger.serverLog(`Sequence Click Count ${JSON.stringify(URLObject)}`)
      SequenceMessages.update({_id: URLObject.module.id}, {$inc: {clicks: 1}}, (err, updatedData) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        
        // get subscriber using senderId
        Subscribers.findOne({senderId: req.sender.id}, (err, subscriber) => {
          if (err) {
            return logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
          }
          if (subscriber) {
            let messagesOfllSequences = getAllMessagesOfSequencesSubscribers(subscriber)
            let sentSequenceMessages = getSentSequenceMessages(subscriber)
            findMessageToBeScheduled(messagesOfllSequences, sentSequenceMessages, subscriber)
          }
        })

        res.writeHead(301, {Location: URLObject.originalURL.startsWith('http') ? URLObject.originalURL : `https://${URLObject.originalURL}`})
        res.end()
      })
    } else {
      return res.status(400).json({
        status: 'failed',
        description: 'No URL found with id ' + req.params.id
      })
    }
  })
}
