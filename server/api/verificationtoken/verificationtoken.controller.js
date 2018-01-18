'use strict'

let Verificationtoken = require('./verificationtoken.model')
let User = require('./../user/Users.model')
let config = require('./../../config/environment/index')
let path = require('path')

const logger = require('../../components/logger')

const TAG = 'api/verificationtoken/verificationtoken.controller.js'

let crypto = require('crypto')

// Get a single verificationtoken
exports.verify = function (req, res) {
  logger.serverLog(TAG, req.params)
  Verificationtoken.findOne({token: req.params.id}, function (err, verificationtoken) {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    logger.serverLog(TAG, verificationtoken)
    if (!verificationtoken) {
      return res.sendFile(path.join(config.root, 'client/pages/verification_failed.html'))
    }

    User.findOne({_id: verificationtoken.userId}, function (err, user) {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!user) {
        return res.sendFile(path.join(config.root, 'client/pages/verification_failed.html'))
      } else {
        user['emailVerified'] = 'Yes'

        let sendgrid = require('sendgrid')(config.sendgrid.username, config.sendgrid.password)

        let emailConfirm = new sendgrid.Email({
          to: user.email,
          from: 'support@cloudkibo.com',
          subject: 'KiboPush: Account verified ' + user.domain,
          text: 'Welcome to KiboPush',
          bcc: 'accounts@cloudibo.com'
        })

        if (user.role === 'buyer') {
          emailConfirm.setHtml('<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
            '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
            '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
            '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
            '<p style="color: #ffffff">Welcome to KiboPush</p> </td></tr> </table> </td> </tr> </table> ' +
            '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
            '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
            '<tr> <td class="wrapper last"> <p> Hello, <br> ' + user.name + '<br> Thank you for signing up with KiboPush, your account has been verified. Following is you account information:' +
            '<p> <ul> <li>Name: ' + user.name + '</li> ' +
            '<li>Company Domain: ' + user.domain + ' </li>' +
            ' <li>Email Address: ' + user.email + '</li></ul> </p> ' +
            '<br><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table>' +
            '<!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
            '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
        } else {
          emailConfirm.setHtml('<h1>KiboPush</h1><br><br>Welcome to KiboPush ' + user.name +
            '<br>' +
            '<br><h4></h4> Your account has been verified. Thank you for joining us. Following is your account information ' +
            '<br>' +
            '<br> Name:   ' + user.name +
            '<br> Domain:   ' + user.domain +
            '<br> Email Address:   ' + user.email +
            '<br>' +
            '</b><br><br>')

          emailConfirm.setHtml('<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
            '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
            '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
            '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
            '<p style="color: #ffffff">Welcome to KiboPush</p> </td></tr> </table> </td> </tr> </table> ' +
            '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
            '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
            '<tr> <td class="wrapper last"> <p> Hello <br> ' + user.name + ',<br> Thank you for joining us, your account has been verified. Following is your account information:' +
            '<p> <ul> <li>Name: ' + user.name + '</li> ' +
            '<li>Company Domain: ' + user.domain + ' </li>' +
            ' <li>Email Address: ' + user.email + '</li><</ul> </p> ' +
            '<br><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table>' +
            '<!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
            '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
        }

        sendgrid.send(emailConfirm, function (err, json) {
          if (err) logger.serverLog(TAG, {status: 'failed', description: 'Internal Server Error'})
        })

        user.save(function (err) {
          return res.sendFile(path.join(config.root, 'client/pages/verification_success.html'))
        })
      }
    })
  })
}

exports.resend = function (req, res) {
  var today = new Date()
  var uid = crypto.randomBytes(5).toString('hex')
  let tokenString = 'f' + uid + '' + today.getFullYear() + '' +
    (today.getMonth() + 1) + '' + today.getDate() + '' +
    today.getHours() + '' + today.getMinutes() + '' +
    today.getSeconds()

  let newToken = new Verificationtoken({
    userId: req.user._id,
    token: tokenString
  })

  newToken.save(function (err) {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error ' + err})
    }

    let sendgrid = require('sendgrid')(config.sendgrid.username, config.sendgrid.password)

    let email = new sendgrid.Email({
      to: req.user.email,
      from: 'support@cloudkibo.com',
      subject: 'KiboPush: Account Verification',
      text: 'Welcome to KiboPush'
    })

    email.setHtml('<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
      '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
      '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
      '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
      '<p style="color: #ffffff">Verify your account</p> </td></tr> </table> </td> </tr> </table> ' +
      '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
      '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
      '<tr> <td class="wrapper last"> <p> Hello, <br> Thank you for joining KiboPush. <br>Use the following link to verify your account <br>  </p> <p>To accept invitation please click the following URL to activate your account:</p> <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
      '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="' + config.domain + '/api/email_verification/verify/' + tokenString + '"> ' + config.domain + '/api/email_verification/verify/' + tokenString + '</a> </td> <td class="expander"> </td> </tr> </table> <p> If clicking the URL above does not work, copy and paste the URL into a browser window. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
      '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

    // email.setHtml('<h1>KiboPush</h1><br><br>Use the following link to verify your account <br><br> <a href="https://app.kibopush.com/api/email_verification/verify/' + tokenString + '"> https://app.kibopush.com/api/email_verification/verify/' + tokenString + '</a>')

    sendgrid.send(email, function (err) {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error ' + err})
      }
      res.status(201).json({ status: 'success', description: 'Verification email has been sent' })
    })
  })
}
