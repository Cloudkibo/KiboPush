const shopifyWebhook = require('./../shopify/webhook.controller')

exports.shopify = function (req, res) {
  shopifyWebhook.handleNewSubscriber(req.body.entry[0].messaging[0])
}
