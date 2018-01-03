/**
 * Created by sojharo on 27/07/2017.
 */

const Users = require('./Users.model')
const CompanyProfile = require('./../companyprofile/companyprofile.model')
const VerificationToken = require('./../verificationtoken/verificationtoken.model')
const auth = require('./../../auth/auth.service')
const config = require('./../../config/environment/index')
const _ = require('lodash')
let crypto = require('crypto')

const logger = require('../../components/logger')

const TAG = 'api/user/user.controller.js'

exports.index = function (req, res) {
  Users.findOne({_id: req.user._id}, (err, user) => {
    if (err) {
      logger.serverLog(TAG, 'user object sent to client failed ' + JSON.stringify(err))
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!user) {
      return res.status(404)
        .json({status: 'failed', description: 'User not found'})
    }
    res.status(200).json({status: 'success', payload: user})
  })
}

exports.updateChecks = function (req, res) {
  Users.findOne({_id: req.user._id}, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!user) {
      return res.status(404)
        .json({status: 'failed', description: 'User not found'})
    }
    logger.serverLog(TAG, `user object being update with : ${JSON.stringify(
      req.body)}`)

    if (req.body.getStartedSeen) user.getStartedSeen = req.body.getStartedSeen
    if (req.body.dashboardTourSeen) user.dashboardTourSeen = req.body.dashboardTourSeen
    if (req.body.workFlowsTourSeen) user.workFlowsTourSeen = req.body.workFlowsTourSeen
    if (req.body.surveyTourSeen) user.surveyTourSeen = req.body.surveyTourSeen
    if (req.body.convoTourSeen) user.convoTourSeen = req.body.convoTourSeen
    if (req.body.pollTourSeen) user.pollTourSeen = req.body.pollTourSeen
    if (req.body.growthToolsTourSeen) user.growthToolsTourSeen = req.body.growthToolsTourSeen
    if (req.body.subscriberTourSeen) user.subscriberTourSeen = req.body.subscriberTourSeen
    if (req.body.liveChatTourSeen) user.liveChatTourSeen = req.body.liveChatTourSeen
    if (req.body.autoPostingTourSeen) user.autoPostingTourSeen = req.body.autoPostingTourSeen
    if (req.body.mainMenuTourSeen) user.mainMenuTourSeen = req.body.mainMenuTourSeen
    if (req.body.subscribeToMessengerTourSeen) user.subscribeToMessengerTourSeen = req.body.subscribeToMessengerTourSeen
    if (req.body.pagesTourSeen) user.pagesTourSeen = req.body.pagesTourSeen

    user.save((err) => {
      if (err) {
        return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
      }
      return res.status(200).json({status: 'success', payload: user})
    })
  })
}

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {

  let parametersMissing = false

  if (!_.has(req.body, 'email')) parametersMissing = true
  if (!_.has(req.body, 'password')) parametersMissing = true
  if (!_.has(req.body, 'name')) parametersMissing = true
  if (!_.has(req.body, 'domain')) parametersMissing = true
  if (!_.has(req.body, 'company_description')) parametersMissing = true
  if (!_.has(req.body, 'company_name')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
    .json({status: 'failed', description: 'Parameters are missing'})
  }

  let accountData = new User({
    name: req.body.name,
    email: req.body.email,
    domain: req.body.domain,
    password: req.body.password,
    domain_email: req.body.domain + '' + req.body.email,
    role: 'buyer'
  })

  // console.log(req.body)
  accountData.save(function (err, user) {
    if (err) {
      return res.status(422).json({
        status: 'failed',
        description: 'validation error: ' + JSON.stringify(err)
      })
    }

    let companyprofileData = new CompanyProfile({
      companyName: req.body.company_name,
      companyDescription: req.body.company_description,
      ownerId: user._id
    })

    companyprofileData.save(function (err) {
      if (err) {
        return res.status(422).json({
          status: 'failed',
          description: 'validation error: ' + JSON.stringify(err)
        })
      }

      let token = auth.signToken(user._id)
      res.status(201).json({ status: 'success', token: token })

      let tokenString = crypto.randomBytes(16).toString('base64')

      let newToken = new VerificationToken({
        user: user._id,
        token: tokenString
      })

      newToken.save(function (err) {
        if (err) return console.log(err)
      })

      let sendgrid = require('sendgrid')(config.sendgrid.username, config.sendgrid.password)

      let email = new sendgrid.Email({
        to: req.body.email,
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
        '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="https://app.kibopush.com/verification/' + tokenString + '"> https://app.kibopush.com/verification/' + tokenString + '</a> </td> <td class="expander"> </td> </tr> </table> <p> If clicking the URL above does not work, copy and paste the URL into a browser window. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
        '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

      email.setHtml('<h1>KiboPush</h1><br><br>Use the following link to verify your account <br><br> <a href="https://app.kibopush.com/verification/' + tokenString + '"> https://app.kibopush.com/verification/' + tokenString + '</a>')

      sendgrid.send(email, function (err, json) {
        if (err) { return console.log(err) }
        // console.log(json);
      })

      var email2 = new sendgrid.Email({
        to: 'sojharo@gmail.com',
        from: 'support@cloudkibo.com',
        subject: 'KiboPush: Account created by ' + req.body.domain,
        text: 'Welcome to KiboPush'
      })

      // email2.setHtml('<h1>KiboSupport</h1><br><br>The following domain has created an account with KiboSupport. <br><br> <b>Domain Name: </b>'+ req.body.website);

      email2.setHtml('<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
        '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
        '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
        '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
        '<p style="color: #ffffff"> New account created on KiboPush. </p> </td></tr> </table> </td> </tr> </table> ' +
        '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
        '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
        '<tr> <td class="wrapper last"> <p> Hello, <br> This is to inform you that following domain has created an account with KiboPush  </p> <p> <ul> <li>Domain Name: ' + req.body.domain.toLowerCase() + '</li> ' +
        '<li>Name: ' + req.body.name + '</li><li>Company Name: ' + req.body.company_name + ' </li> </ul> </p>  <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
        '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> </td> <td class="expander"> </td> </tr> </table> <p> Login now on KiboSupport to see account details. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
        '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

      sendgrid.send(email2, function (err, json) {
        if (err) { return console.log(err) }
        // console.log(json);
      })
    })
  })
}
