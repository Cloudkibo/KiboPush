const crypto = require('crypto')
const config = require('../../config/environment/index')

exports.twitterwebhook = function (req, res) {
  return res.status(200).json({status: 'success', description: 'got the data.'})
}

exports.twitterverify = function (req, res) {
  const hmac = crypto.createHmac('sha256', config.twitter.consumerSecret)

  hmac.on('readable', () => {
    const data = hmac.read()
    if (data) {
      return res.status(200).json({
        response_token: `sha256=${data.toString('hex')}`
      })
    }
  })

  hmac.write(req.params.crc_token)
  hmac.end()
}
