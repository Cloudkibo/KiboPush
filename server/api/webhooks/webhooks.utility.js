const Notifications = require('./../notifications/notifications.model')
const Webhooks = require('./../webhooks/webhooks.model')
const config = require('./../../config/environment/index')
function saveNotification (webhook) {
  const notification = new Notifications({
    message: `The server at the URL "${webhook.webhook_url}" is not live`,
    category: {type: 'webhookFailed', id: webhook.userId},
    agentId: webhook.userId,
    companyId: webhook.companyId
  })

  notification.save((err, savedNotification) => {
    if (err) {
    }
  })
  Webhooks.update({_id: webhook._id}, {
    isEnabled: false, error_message: 'URL not live'
  }, (err2, webhookUpdated) => {
    if (err2) {
    }
  })
  let sendgrid = require('sendgrid')(config.sendgrid.username,
    config.sendgrid.password)

  let email = new sendgrid.Email({
    to: webhook.userId.email,
    from: 'support@cloudkibo.com',
    subject: 'KiboPush: Webhook failed',
    text: 'Welcome to KiboPush'
  })
  var emailText = `The server at your given URL "${webhook.webhook_url}" is not live.`
  email.setHtml(
            '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
            '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
            '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
            '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
            '<p style="color: #ffffff">Delete Confirmation</p> </td></tr> </table> </td> </tr> </table> ' +
            '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
            '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> ' +
            '<!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
           '<tr> <td class="wrapper last"> <p> Hello, <br> ' +
           emailText +
           '<!-- END: Content -->' +
           '<!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
           '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

  sendgrid.send(email, function (err, json) {
    if (err) {
    }
  })

  // email.setHtml('<h1>KiboPush</h1><br><br>Use the following link to verify your account <br><br> <a href="https://app.kibopush.com/api/email_verification/verify/' + tokenString + '"> https://app.kibopush.com/api/email_verification/verify/' + tokenString + '</a>')

  sendgrid.send(email, function (err, json) {
    if (err) {
    }
  })
}
exports.saveNotification = saveNotification
