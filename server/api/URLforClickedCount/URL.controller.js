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

    AutopostingMessages.update({_id: URLObject.module.id}, {clicked: {$inc: 1}}, (err, URLObject) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.redirect(`/${URLObject.originalURL}`)
    })
  })
}
