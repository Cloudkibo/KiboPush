const TAG = 'api/pages/pages.controller.js'
const Messages = require('./../sequenceMessaging/message.model')

exports.allMessages = function (req, res) {
  Messages.find({SequenceId: req.params.id},
    (err, messages) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      res.status(200).json({status: 'success', payload: messages})
    })
}
exports.createMessage = function (req, res) {
  let messagePayload = {
    schedule: req.body.schedule,
    sequenceId: req.body.sequenceId,
    payload: req.body.payload,
    title: req.body.title
  }
  const message = new Messages(messagePayload)

  // save model to MongoDB
  message.save((err, messageCreated) => {
    if (err) {
      res.status(500).json({
        status: 'Failed',
        description: 'Failed to insert record'
      })
    } else {
      res.status(201).json({status: 'success', payload: messageCreated})
    }
  })
}
