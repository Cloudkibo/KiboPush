const URL = require('./URL.model')
const AutopostingMessages = require('./../autoposting_messages/autoposting_messages.model')
const Broadcasts = require('./../broadcasts/broadcasts.model')
const SequenceMessages = require('./../sequenceMessaging/message.model')
const logger = require('../../../components/logger')
const sequenceUtility = require('./../sequenceMessaging/utility')

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
        let seqMessageId = URLObject.module.id
        SequenceMessages.find({_id: seqMessageId}, (err, seqMessage) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          if (seqMessage) {
            // get sequenceId of the message
            let sequenceId = seqMessage.sequenceId
            // find the all the messages of this sequence
            SequenceMessages.find({sequenceId: sequenceId}, (err, seqMessages) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              if (seqMessages && seqMessages.length > 0) {
                 // iterate through all the messages of this sequence.
                for (let message of seqMessages) {
                // check if this message is in the trigger of any message of this sequence then add it to queue.
                  if (message.trigger.value !== '') {
                    if (message.trigger.value === seqMessageId) {
                      // add this message to queue.
                      sequenceUtility.addToMessageQueue(message.sequenceId, message.schedule.date, message._id)
                    }
                  }
                }
              }
            })
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
