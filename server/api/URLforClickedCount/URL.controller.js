const URL = require('./URL.model')
const AutopostingMessages = require('./../autoposting_messages/autoposting_messages.model')

exports.index = function (req, res) {
  URL.findOne({_id: req.params.id}, (err, URLObject) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }

    console.log('got this url object', URLObject)

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
