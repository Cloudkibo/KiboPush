const URL = require('./URL.model')
const AutopostingMessages = require('./../autoposting_messages/autoposting_messages.model')
const Broadcasts = require('./../broadcasts/broadcasts.model')

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
  })
}
