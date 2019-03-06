/**
 * Created by sojharo on 27/07/2017.
 */

const Users = require('./Users.model')
const CompanyProfile = require('./../companyprofile/companyprofile.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const CompanyUsage = require('./../featureUsage/companyUsage.model')
const VerificationToken = require(
  './../verificationtoken/verificationtoken.model')
const inviteagenttoken = require('./../inviteagenttoken/inviteagenttoken.model')
const Invitations = require('./../invitations/invitations.model')
const Permissions = require('./../permissions/permissions.model')
const PlanFeatures = require('./../permissions_plan/permissions_plan.model')
const Plans = require('./../plans/plans.model')
const auth = require('./../../../auth/auth.service')
const config = require('./../../../config/environment/index')
const _ = require('lodash')
let crypto = require('crypto')
const logger = require('../../../components/logger')
// const mongoose = require('mongoose')
const MailChimp = require('mailchimp-api-v3')
const moment = require('moment')
const needle = require('needle')

// const PassportFacebookExtension = require('passport-facebook-extension')

const TAG = 'api/user/user.controller.js'

exports.addAccountType = function (req, res) {
  Users.find({}, (err, users) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'Error at find all users: ' + JSON.stringify(err)
      })
    }
    users.forEach((user, index) => {
      CompanyUsers.findOne({domain_email: user.domain_email}, (err, cu) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: 'Error at find company user: ' + JSON.stringify(err)
          })
        }
        CompanyProfile.findOne({_id: cu.companyId}).populate('planId').exec((err, cp) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: 'Error at updating company profile: ' + JSON.stringify(err)
            })
          }
          if (cp.planId.unique_ID === 'plan_A' || cp.planId.unique_ID === 'plan_B') {
            user.accountType = 'individual'
          } else if (cp.planId.unique_ID === 'plan_C' || cp.planId.unique_ID === 'plan_D') {
            user.accountType = 'team'
          }
          user.save((err) => {
            if (err) {
              return res.status(500)
                .json({status: 'failed', description: 'Internal Server Error'})
            }
          })
        })
      })
      if (index === (users.length - 1)) {
        return res.status(200).json({
          status: 'success',
          description: 'Successfuly added!'
        })
      }
    })
  })
}

exports.index = function (req, res) {
  Users.findOne({_id: req.user._id}, (err, user) => {
    if (err) {
      logger.serverLog(TAG,
        'user object sent to client failed ' + JSON.stringify(err))
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    if (!user) {
      return res.status(404)
        .json({status: 'failed', description: 'User not found'})
    }

    CompanyUsers.findOne({userId: req.user._id}, (err, companyUser) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      CompanyProfile.findOne({_id: companyUser.companyId}).populate('planId').exec((err, company) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        if (!companyUser) {
          return res.status(404).json({
            status: 'failed',
            description: 'The user account does not belong to any company. Please contact support'
          })
        }
        Permissions.findOne({userId: req.user._id}, (err, permissions) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          if (!permissions) {
            return res.status(404).json({
              status: 'failed',
              description: 'Permissions not set for this user. Please contact support'
            })
          }
          PlanFeatures.findOne({plan_id: company.planId._id}, (err, plan) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            if (!plan) {
              return res.status(404).json({
                status: 'failed',
                description: 'Fatal Error, plan not set for this user. Please contact support'
              })
            }

            // if (user.facebookInfo && user.facebookInfo.fbId && user.facebookInfo.fbToken) {
            //   let FBExtension = new PassportFacebookExtension(config.facebook.clientID,
            // config.facebook.clientSecret)

            //   FBExtension.permissionsGiven(user.facebookInfo.fbId, user.facebookInfo.fbToken)
            // .then(permissions => {
            //   logger.serverLog(TAG, `Permissions given: ${JSON.stringify(permissions)}`)
            // })
            // .fail(e => {
            //   logger.serverLog(TAG, `Permissions check error: ${JSON.stringify(e)}`)
            //   user.permissionsRevoked = true
            // })
            // }

            user = user.toObject()
            user.companyId = companyUser.companyId
            user.permissions = permissions
            user.currentPlan = company.planId
            user.last4 = company.stripe.last4
            user.plan = plan
            user.uiMode = config.uiModes[user.uiMode]
            res.status(200).json({status: 'success', payload: user})
          })
        })
      })
    })
  })
}

exports.changeMode = function (req, res) {
  Users.update({_id: req.user._id}, {uiMode: req.body.mode}, (err, updatedUser) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    res.status(200).json({
      status: 'success',
      payload: config.uiModes[req.body.mode]
    })
  })
}

exports.fbAppId = function (req, res) {
  res.status(200).json({status: 'success', payload: config.facebook.clientID})
}
exports.updateSkipConnect = function (req, res) {
  Users.update({_id: req.user._id}, {skippedFacebookConnect: true}, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: 'internal server error' + JSON.stringify(err)
      })
    }
    return res.status(200).json({status: 'success', payload: user})
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

    if (req.body.getStartedSeen) user.getStartedSeen = req.body.getStartedSeen
    if (req.body.dashboardTourSeen) user.dashboardTourSeen = req.body.dashboardTourSeen
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
    if (req.body.wizardSeen) user.wizardSeen = req.body.wizardSeen

    user.save((err) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      return res.status(200).json({status: 'success', payload: user})
    })
  })
}

exports.updateMode = function (req, res) {
  Users.findOne({_id: req.body._id}, (err, user) => {
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

    user.advancedMode = req.body.advancedMode
    user.save((err) => {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      CompanyUsers.findOne({userId: req.body._id}, (err, companyUser) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        if (!companyUser) {
          return res.status(404).json({
            status: 'failed',
            description: 'The user account does not belong to any company. Please contact support'
          })
        }
        CompanyProfile.findOne({_id: companyUser.companyId}).populate('planId').exec((err, company) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }

          Permissions.findOne({userId: req.body._id}, (err, permissions) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            if (!permissions) {
              return res.status(404).json({
                status: 'failed',
                description: 'Permissions not set for this user. Please contact support'
              })
            }
            PlanFeatures.findOne({plan_id: company.planId._id}, (err, plan) => {
              if (err) {
                return res.status(500).json({
                  status: 'failed',
                  description: `Internal Server Error ${JSON.stringify(err)}`
                })
              }
              if (!plan) {
                return res.status(404).json({
                  status: 'failed',
                  description: 'Fatal Error, plan not set for this user. Please contact support'
                })
              }
              user = user.toObject()
              user.companyId = companyUser.companyId
              user.permissions = permissions
              user.currentPlan = company.planId
              user.plan = plan
              res.status(200).json({status: 'success', payload: user})
            })
          })
        })
      })
    })
  })
}

/**
 * Creates a new user
 */
exports.create = function (req, res) {
  logger.serverLog(TAG, 'Creating new user')
  let parametersMissing = false

  if (!_.has(req.body, 'email')) parametersMissing = true
  if (!_.has(req.body, 'password')) parametersMissing = true
  if (!_.has(req.body, 'name')) parametersMissing = true
  if (!_.has(req.body, 'uiMode')) parametersMissing = true
  // if (!_.has(req.body, 'domain')) parametersMissing = true
  // if (!_.has(req.body, 'company_description')) parametersMissing = true
  // if (!_.has(req.body, 'company_name')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }
  if (req.body.domain) {
    // using regex+domain to filter used email is logically wrong -- discussed with sojharo -- asad
    Users.findOne({email: req.body.email}, (err, emailUsed) => {
      if (err) {
        return res.status(422).json({
          status: 'failed',
          description: 'Internal Server Error: ' + JSON.stringify(err)
        })
      }

      if (emailUsed) {
        return res.status(422).json({
          status: 'failed',
          description: 'This email address already has an account on KiboPush. Contact support for more information.'
        })
      } else {
        Users.findOne({domain: req.body.domain}, (err, domainUsed) => {
          if (err) {
            return res.status(422).json({
              status: 'failed',
              description: 'Internal Server Error: ' + JSON.stringify(err)
            })
          }

          if (domainUsed) {
            return res.status(422).json({
              status: 'failed',
              description: 'This workspace name already has an account on KiboPush. Contact support for more information.'
            })
          } else {
            let accountData = new Users({
              name: req.body.name,
              email: req.body.email.toLowerCase(),
              domain: req.body.domain.toLowerCase(),
              password: req.body.password,
              domain_email: req.body.domain.toLowerCase() + '' + req.body.email.toLowerCase(),
              accountType: 'team',
              role: 'buyer',
              uiMode: req.body.uiMode
            })

            accountData.save(function (err, user) {
              if (err) {
                return res.status(422).json({
                  status: 'failed',
                  description: 'validation error: ' + JSON.stringify(err)
                })
              }

              Plans.findOne({unique_ID: 'plan_D'}, (err, defaultPlan) => {
                if (err) {
                  return res.status(422).json({
                    status: 'failed',
                    description: 'Internal Server Error: ' + JSON.stringify(err)
                  })
                }

                let companyprofileData = new CompanyProfile({
                  companyName: req.body.company_name,
                  companyDetail: req.body.company_description,
                  ownerId: user._id,
                  planId: defaultPlan._id
                })

                companyprofileData.save(function (err, companySaved) {
                  if (err) {
                    return res.status(422).json({
                      status: 'failed',
                      description: 'profile save error: ' + JSON.stringify(err)
                    })
                  }

                  // Populate company usage
                  let companyUsageData = {
                    companyId: companySaved._id,
                    broadcasts: 0,
                    surveys: 0,
                    polls: 0,
                    broadcast_templates: 0,
                    survey_templates: 0,
                    polls_templates: 0,
                    sessions: 0,
                    chat_messages: 0,
                    facebook_pages: 0,
                    bots: 0,
                    subscribers: 0,
                    labels: 0,
                    phone_invitation: 0,
                    facebook_autoposting: 0,
                    twitter_autoposting: 0,
                    wordpress_autoposting: 0,
                    broadcast_sequences: 0,
                    messages_per_sequence: 0,
                    segmentation_lists: 0
                  }
                  let companyUsage = new CompanyUsage(companyUsageData)
                  companyUsage.save((err) => {
                    if (err) {
                      return res.status(500)
                        .json({status: 'failed', description: 'Failed to insert record'})
                    }
                  })

                  // Create customer on stripe
                  companySaved.createCustomer(req.body.email, req.body.name, function (err) {
                    if (err) {
                      logger.serverLog(TAG, `Failed to add customer on stripe : ${JSON.stringify(
                        err)}`)
                    }
                  })

                  let companyUserData = new CompanyUsers({
                    companyId: companySaved._id,
                    userId: user._id,
                    domain_email: user.domain_email,
                    role: 'buyer'
                  })

                  companyUserData.save(function (err, companyUserSaved) {
                    if (err) {
                      return res.status(422).json({
                        status: 'failed',
                        description: 'profile user save error: ' + JSON.stringify(err)
                      })
                    }
                    let permissions = new Permissions({
                      companyId: companySaved._id,
                      userId: user._id
                    })

                    permissions.save(function (err, permissionSaved) {
                      if (err) {
                        return res.status(422).json({
                          status: 'failed',
                          description: 'profile user save error: ' + JSON.stringify(err)
                        })
                      }
                      let token = auth.signToken(user._id)
                      res.status(201)
                      .json({status: 'success', token: token, userid: user._id, type: 'company'})
                    })
                  })

                  var today = new Date()
                  var uid = crypto.randomBytes(5).toString('hex')
                  let tokenString = 'f' + uid + '' + today.getFullYear() + '' +
                    (today.getMonth() + 1) + '' + today.getDate() + '' +
                    today.getHours() + '' + today.getMinutes() + '' +
                    today.getSeconds()

                  let newToken = new VerificationToken({
                    userId: user._id,
                    token: tokenString
                  })

                  newToken.save(function (err) {
                    if (err) {
                      logger.serverLog(TAG, `New Token save : ${JSON.stringify(
                        err)}`)
                    }
                  })

                  let mailchimp = new MailChimp('2d154e5f15ca18180d52c40ad6e5971e-us12')

                  mailchimp.post({
                    path: '/lists/5a4e866849/members',
                    body: {
                      email_address: req.body.email,
                      merge_fields: {
                        FNAME: req.body.name
                      },
                      status: 'subscribed'
                    }
                  }, function (err, result) {
                    if (err) {
                      logger.serverLog(TAG, `welcome email error: ${JSON.stringify(err)}`)
                    } else {
                      logger.serverLog(TAG, `welcome email successfuly sent: ${JSON.stringify(result)}`)
                    }
                  })

                  let sendgrid = require('sendgrid')(config.sendgrid.username,
                    config.sendgrid.password)

                  let email = new sendgrid.Email({
                    to: req.body.email,
                    from: 'support@cloudkibo.com',
                    subject: 'KiboPush: Account Verification',
                    text: 'Welcome to KiboPush'
                  })

                  email.setHtml(
                    '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                    '<p style="color: #ffffff">Verify your account</p> </td></tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                    '<tr> <td class="wrapper last"> <p> Hello, <br> Thank you for joining KiboPush. <br>Use the following link to verify your account <br>  </p> <p>To accept invitation please click the following URL to activate your account:</p> <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                    '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="' +
                    config.domain + '/api/email_verification/verify/' +
                    tokenString +
                    '"> ' + config.domain + '/api/email_verification/verify/' +
                    tokenString +
                    '</a> </td> <td class="expander"> </td> </tr> </table> <p> If clicking the URL above does not work, copy and paste the URL into a browser window. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                    '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

                  // email.setHtml('<h1>KiboPush</h1><br><br>Use the following link to verify your account <br><br> <a href="https://app.kibopush.com/api/email_verification/verify/' + tokenString + '"> https://app.kibopush.com/api/email_verification/verify/' + tokenString + '</a>')

                  sendgrid.send(email, function (err, json) {
                    if (err) {
                      logger.serverLog(TAG,
                        `Internal Server Error on sending email : ${JSON.stringify(
                          err)}`)
                    }
                  })

                  var email2 = new sendgrid.Email({
                    to: ['sojharo@gmail.com', 'sojharo@live.com', 'jawaid@cloudkibo.com', 'jekram@hotmail.com', 'dayem@cloudkibo.com', 'surendar@cloudkibo.com'],
                    from: 'support@cloudkibo.com',
                    subject: 'KiboPush: Account created by ' + req.body.name,
                    text: 'Welcome to KiboPush',
                    cc: 'sojharo@live.com'
                  })

                  // email2.setHtml('<h1>KiboSupport</h1><br><br>The following domain has created an account with KiboSupport. <br><br> <b>Domain Name: </b>'+ req.body.website);

                  email2.setHtml(
                    '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                    '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                    '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                    '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                    '<p style="color: #ffffff"> New account created on KiboPush. </p> </td></tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                    '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                    '<tr> <td class="wrapper last"> <p> Hello, <br> This is to inform you that following domain has created an account with KiboPush  </p> <p> <ul> <li>Domain Name: ' +
                    req.body.domain.toLowerCase() + '</li> ' +
                    '<li>Name: ' + req.body.name + '</li><li>Company Name: ' +
                    req.body.company_name + '</li><li>Email Address: ' + req.body.email +
                    ' </li> </ul> </p>  <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                    '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> </td> <td class="expander"> </td> </tr> </table> <p> Login now on KiboPush to see account details. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                    '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

                  if (config.env === 'production') {
                    sendgrid.send(email2, function (err, json) {
                      if (err) {
                        logger.serverLog(TAG,
                          `Internal Server Error on sending email : ${err}`)
                      }
                    })
                  }
                })
              })
            })
          }
        })
      }
    })
  } else {
    Users.findOne({email: req.body.email}, (err, emailUsed) => {
      if (err) {
        return res.status(422).json({
          status: 'failed',
          description: 'Internal Server Error: ' + JSON.stringify(err)
        })
      }

      if (emailUsed) {
        return res.status(422).json({
          status: 'failed',
          description: 'This email address already has an account on KiboPush. Contact support for more information.'
        })
      } else {
        let today = new Date()
        let uid = crypto.randomBytes(8).toString('hex')
        let domain = 'f' + uid + '' + today.getFullYear() + '' +
          (today.getMonth() + 1) + '' + today.getDate() + '' +
          today.getHours() + '' + today.getMinutes() + '' +
          today.getSeconds()
        let accountData = new Users({
          name: req.body.name,
          email: req.body.email.toLowerCase(),
          domain: domain,
          password: req.body.password,
          domain_email: domain + '' + req.body.email.toLowerCase(),
          accountType: 'individual',
          role: 'buyer',
          uiMode: req.body.uiMode
        })

        accountData.save(function (err, user) {
          if (err) {
            return res.status(422).json({
              status: 'failed',
              description: 'validation error: ' + JSON.stringify(err)
            })
          }

          Plans.findOne({unique_ID: 'plan_B'}, (err, defaultPlan) => {
            if (err) {
              return res.status(422).json({
                status: 'failed',
                description: 'Internal Server Error: ' + JSON.stringify(err)
              })
            }

            let companyprofileData = new CompanyProfile({
              companyName: 'Pending ' + domain,
              companyDetail: 'Pending ' + domain,
              ownerId: user._id,
              planId: defaultPlan._id
            })

            companyprofileData.save(function (err, companySaved) {
              if (err) {
                return res.status(422).json({
                  status: 'failed',
                  description: 'profile save error: ' + JSON.stringify(err)
                })
              }

              // Populate company usage
              let companyUsageData = {
                companyId: companySaved._id,
                broadcasts: 0,
                surveys: 0,
                polls: 0,
                broadcast_templates: 0,
                survey_templates: 0,
                polls_templates: 0,
                sessions: 0,
                chat_messages: 0,
                facebook_pages: 0,
                bots: 0,
                subscribers: 0,
                labels: 0,
                phone_invitation: 0,
                facebook_autoposting: 0,
                twitter_autoposting: 0,
                wordpress_autoposting: 0,
                broadcast_sequences: 0,
                messages_per_sequence: 0,
                segmentation_lists: 0
              }
              let companyUsage = new CompanyUsage(companyUsageData)
              companyUsage.save((err) => {
                if (err) {
                  return res.status(500)
                    .json({status: 'failed', description: 'Failed to insert record'})
                }
              })

              // Create customer on stripe
              companySaved.createCustomer(req.body.email, req.body.name, function (err) {
                if (err) {
                  logger.serverLog(TAG, `Failed to add customer on stripe : ${JSON.stringify(
                    err)}`)
                }
              })

              let companyUserData = new CompanyUsers({
                companyId: companySaved._id,
                userId: user._id,
                domain_email: user.domain_email,
                role: 'buyer'
              })

              companyUserData.save(function (err, companyUserSaved) {
                if (err) {
                  return res.status(422).json({
                    status: 'failed',
                    description: 'profile user save error: ' + JSON.stringify(err)
                  })
                }
                let permissions = new Permissions({
                  companyId: companySaved._id,
                  userId: user._id
                })

                permissions.save(function (err, permissionSaved) {
                  if (err) {
                    return res.status(422).json({
                      status: 'failed',
                      description: 'profile user save error: ' + JSON.stringify(err)
                    })
                  }
                  let token = auth.signToken(user._id)
                  res.status(201)
                  .json({status: 'success', token: token, userid: user._id, type: 'individual'})
                })
              })

              var today = new Date()
              var uid = crypto.randomBytes(5).toString('hex')
              let tokenString = 'f' + uid + '' + today.getFullYear() + '' +
                (today.getMonth() + 1) + '' + today.getDate() + '' +
                today.getHours() + '' + today.getMinutes() + '' +
                today.getSeconds()

              let newToken = new VerificationToken({
                userId: user._id,
                token: tokenString
              })

              newToken.save(function (err) {
                if (err) {
                  logger.serverLog(TAG, `New Token save : ${JSON.stringify(
                    err)}`)
                }
              })

              let sendgrid = require('sendgrid')(config.sendgrid.username,
                config.sendgrid.password)

              let email = new sendgrid.Email({
                to: req.body.email,
                from: 'support@cloudkibo.com',
                subject: 'KiboPush: Account Verification',
                text: 'Welcome to KiboPush'
              })

              email.setHtml(
                '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                '<p style="color: #ffffff">Verify your account</p> </td></tr> </table> </td> </tr> </table> ' +
                '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                '<tr> <td class="wrapper last"> <p> Hello ' + req.body.name + ', <br> Thank you for joining KiboPush. <br>Use the following link to verify your account <br>  </p> <p>To accept invitation please click the following URL to activate your account:</p> <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="' +
                config.domain + '/api/email_verification/verify/' +
                tokenString +
                '"> ' + config.domain + '/api/email_verification/verify/' +
                tokenString +
                '</a> </td> <td class="expander"> </td> </tr> </table> <p> If clicking the URL above does not work, copy and paste the URL into a browser window. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

              // email.setHtml('<h1>KiboPush</h1><br><br>Use the following link to verify your account <br><br> <a href="https://app.kibopush.com/api/email_verification/verify/' + tokenString + '"> https://app.kibopush.com/api/email_verification/verify/' + tokenString + '</a>')

              sendgrid.send(email, function (err, json) {
                if (err) {
                  logger.serverLog(TAG,
                    `Internal Server Error on sending email : ${JSON.stringify(
                      err)}`)
                }
              })

              var email2 = new sendgrid.Email({
                to: ['sojharo@gmail.com', 'sojharo@live.com', 'jawaid@cloudkibo.com', 'jekram@hotmail.com', 'dayem@cloudkibo.com', 'surendar@cloudkibo.com'],
                from: 'support@cloudkibo.com',
                subject: 'KiboPush: Account created by ' + req.body.name,
                text: 'Welcome to KiboPush'
              })

              // email2.setHtml('<h1>KiboSupport</h1><br><br>The following domain has created an account with KiboSupport. <br><br> <b>Domain Name: </b>'+ req.body.website);

              email2.setHtml(
                '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                '<p style="color: #ffffff"> New account created on KiboPush. </p> </td></tr> </table> </td> </tr> </table> ' +
                '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                '<tr> <td class="wrapper last"> <p> Hello, <br> This is to inform you that following individual has created an account with KiboPush  </p> <p> <ul>' +
                '<li>Name: ' + req.body.name + '</li><li>Email: ' + req.body.email +
                ' </li> </ul> </p>  <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> </td> <td class="expander"> </td> </tr> </table> <p> Login now on KiboPush to see account details. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

              if (config.env === 'production') {
                sendgrid.send(email2, function (err, json) {
                  if (err) {
                    logger.serverLog(TAG,
                      `Internal Server Error on sending email : ${err}`)
                  }
                })
              }
            })
          })
        })
      }
    })
  }
}

exports.joinCompany = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'email')) parametersMissing = true
  if (!_.has(req.body, 'password')) parametersMissing = true
  if (!_.has(req.body, 'name')) parametersMissing = true
  if (!_.has(req.body, 'token')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  inviteagenttoken.findOne({token: req.body.token},
    function (err, invitationToken) {
      if (err) {
        return res.status(500)
          .json({status: 'failed', description: 'Internal Server Error'})
      }
      if (!invitationToken) {
        return res.status(404).json({
          status: 'failed',
          description: 'Invitation token invalid or expired. Please contact admin to invite you again.'
        })
      }
      // adding this code because in a Team account the UI mode of buyers should get applied to agents/memebers.
      CompanyUsers.findOne({companyId: invitationToken.companyId, role: 'buyer'}, (err, companyUser) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        if (companyUser) {
          Users.findOne({_id: companyUser.userId}, (err, user) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            if (user) {
              logger.serverLog(TAG, `UserData : ${JSON.stringify(user)}`)
              let role = invitationToken.role
              let accountData = new Users({
                name: req.body.name,
                email: req.body.email,
                domain: invitationToken.domain,
                password: req.body.password,
                domain_email: invitationToken.domain + '' + req.body.email,
                accountType: 'team',
                role: role,
                uiMode: user.uiMode
              })
              accountData.save(function (err, user) {
                if (err) {
                  return res.status(422).json({
                    status: 'failed',
                    description: 'validation error: ' + JSON.stringify(err)
                  })
                }
                let companyUserData = new CompanyUsers({
                  companyId: invitationToken.companyId,
                  userId: user._id,
                  domain_email: user.domain_email,
                  role: role
                })
                companyUserData.save(function (err, companyUserSaved) {
                  if (err) {
                    return res.status(422).json({
                      status: 'failed',
                      description: 'profile user save error: ' + JSON.stringify(err)
                    })
                  }
                  let permissionsPayload = {
                    companyId: invitationToken.companyId,
                    userId: user._id
                  }
                  let permissions = new Permissions(
                    _.merge(permissionsPayload, config.permissions[role] || {}))
                  permissions.save(function (err, permissionSaved) {
                    if (err) {
                      return res.status(422).json({
                        status: 'failed',
                        description: 'profile user save error: ' + JSON.stringify(err)
                      })
                    }
                    let token = auth.signToken(user._id)
                    res.clearCookie('email')
                    res.clearCookie('companyId')
                    res.clearCookie('companyName')
                    res.clearCookie('domain')
                    res.clearCookie('name')
                    res.cookie('token', token)
                    res.cookie('userid', user._id)
                    res.status(201).json({status: 'success', token: token})
                  })
                })
                var today = new Date()
                var uid = crypto.randomBytes(5).toString('hex')
                let tokenString = 'f' + uid + '' + today.getFullYear() + '' +
                  (today.getMonth() + 1) + '' + today.getDate() + '' +
                  today.getHours() + '' + today.getMinutes() + '' +
                  today.getSeconds()
                let newToken = new VerificationToken({
                  userId: user._id,
                  token: tokenString
                })
                newToken.save(function (err) {
                  if (err) {
                    logger.serverLog(TAG, `New Token save : ${JSON.stringify(
                      err)}`)
                  }
                })
                Invitations.remove(
                  {email: req.body.email, companyId: invitationToken.companyId},
                  function (err) {
                    if (err) {
                      logger.serverLog(TAG, `New Token save : ${JSON.stringify(
                        err)}`)
                    }
                  })
                inviteagenttoken.remove({token: req.body.token}, function (err) {
                  if (err) {
                    logger.serverLog(TAG, `New Token save : ${JSON.stringify(
                      err)}`)
                  }
                })
                let sendgrid = require('sendgrid')(config.sendgrid.username,
                  config.sendgrid.password)
                let email = new sendgrid.Email({
                  to: req.body.email,
                  from: 'support@cloudkibo.com',
                  subject: 'KiboPush: Account Verification',
                  text: 'Welcome to KiboPush'
                })
                email.setHtml(
                  '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                  '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                  '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                  '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                  '<p style="color: #ffffff">Verify your account</p> </td></tr> </table> </td> </tr> </table> ' +
                  '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                  '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                  '<tr> <td class="wrapper last"> <p> Hello, <br> Thank you for joining KiboPush. <br>Use the following link to verify your account <br>  </p> <p>To accept invitation please click the following URL to activate your account:</p> <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                  '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="' +
                  config.domain + '/api/email_verification/verify/' +
                  tokenString +
                  '"> ' + config.domain + '/api/email_verification/verify/' +
                  tokenString +
                  '</a> </td> <td class="expander"> </td> </tr> </table> <p> If clicking the URL above does not work, copy and paste the URL into a browser window. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                  '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
                // email.setHtml('<h1>KiboPush</h1><br><br>Use the following link to verify your account <br><br> <a href="https://app.kibopush.com/api/email_verification/verify/' + tokenString + '"> https://app.kibopush.com/api/email_verification/verify/' + tokenString + '</a>')
                sendgrid.send(email, function (err, json) {
                  if (err) {
                    logger.serverLog(TAG,
                      `Internal Server Error on sending email : ${JSON.stringify(
                        err)}`)
                  }
                })
                var email2 = new sendgrid.Email({
                  to: 'sojharo@gmail.com',
                  from: 'support@cloudkibo.com',
                  subject: 'KiboPush: Agent Account created by ' +
                  invitationToken.domain,
                  text: 'Welcome to KiboPush',
                  cc: 'jawaid@cloudkibo.com'
                })
                // email2.setHtml('<h1>KiboSupport</h1><br><br>The following domain has created an account with KiboSupport. <br><br> <b>Domain Name: </b>'+ req.body.website);
                email2.setHtml(
                  '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                  '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                  '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                  '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                  '<p style="color: #ffffff"> New account created on KiboPush. </p> </td></tr> </table> </td> </tr> </table> ' +
                  '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                  '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                  '<tr> <td class="wrapper last"> <p> Hello, <br> This is to inform you that following agent has joined a company with KiboPush  </p> <p> <ul> <li>Domain Name: ' +
                  invitationToken.domain + '</li> ' +
                  '<li>Name: ' + req.body.name + '</li><li>Company Name: ' +
                  invitationToken.companyName +
                  ' </li> </ul> </p>  <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                  '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> </td> <td class="expander"> </td> </tr> </table> <p> Login now on KiboPush to see account details. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                  '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
                sendgrid.send(email2, function (err, json) {
                  if (err) {
                    logger.serverLog(TAG,
                      `Internal Server Error on sending email : ${JSON.stringify(
                        err)}`)
                  }
                })
              })
            }
          })
        }
      })
    })
}

exports.authenticatePassword = function (req, res) {
  var parametersMissing = false
  if (!_.has(req.body, 'email')) {
    parametersMissing = true
  }
  if (!_.has(req.body, 'password')) {
    parametersMissing = true
  }
  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }
  Users.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!user) {
      return res.status(500)
      .json({status: 'failed', description: 'Internal Server Error'})
    }
    logger.serverLog(TAG,
      'req.body ' + JSON.stringify(req.body))
    if (!user.authenticate(req.body.password)) {
      return res.status(200)
      .json({status: 'failed', description: 'Incorrect password'})
    } else {
      return res.status(200)
      .json({status: 'success', description: 'Authenticated'})
    }
  })
}
exports.enableDelete = function (req, res) {
  var parametersMissing = false
  if (!_.has(req.body, 'delete_option')) {
    parametersMissing = true
  }
  if (!_.has(req.body, 'deletion_date')) {
    parametersMissing = true
  }
  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  Users.findOne({_id: req.user._id}, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    var emailText = ''
    var deletionDate = moment(req.body.deletion_date).format('dddd, MMMM Do YYYY')
    if (req.body.delete_option === 'DEL_ACCOUNT') {
      emailText = `You have requested deleting your account. Your request will be served in 14 days time, after which you will not be able to reactivate or retrieve any of the information. Your account and entire data will be deleted by ${deletionDate}`
    } else if (req.body.delete_option === 'DEL_CHAT') {
      emailText = `You have requested deleting your live chat data from KiboPush. Your request will be served in 14 days time, after which you will not be able to retrieve your information back. Your live chat data will be deleted by ${deletionDate}`
    } else if (req.body.delete_option === 'DEL_SUBSCRIBER') {
      emailText = `You have requested deleting your subscribers information from Kibopush. Your request will served in 14 days time, after whcih you will not be able to retrieve your information back. Your subscribers data will be deleted by ${deletionDate}`
    }
    user.deleteInformation = {delete_option: req.body.delete_option, deletion_date: req.body.deletion_date}
    user.save((err, updatedUser) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      } else {
        let sendgrid = require('sendgrid')(config.sendgrid.username,
          config.sendgrid.password)

        let email = new sendgrid.Email({
          to: req.user.email,
          from: 'support@cloudkibo.com',
          subject: 'KiboPush: Delete Confirmation',
          text: ' Delete Confirmation'
        })

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
            return logger.serverLog(TAG,
              `Internal Server Error on sending email : ${JSON.stringify(
                err)}`)
          }
        })

        let emailAdmin = new sendgrid.Email({
          to: 'sojharo@cloudkibo.com',
          from: 'support@cloudkibo.com',
          subject: 'KiboPush: Delete User Information',
          text: 'Delete User Information',
          cc: 'jekram@cloudkibo.com'
        })

        emailAdmin.setHtml(
          '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
          '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
          '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
          '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
          '<p style="color: #ffffff">Delete User Information</p> </td></tr> </table> </td> </tr> </table> ' +
          '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
          '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> ' +
          '<!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
         '<tr> <td class="wrapper last"> <p> Hello, <br> ' +
          req.user.name + ' has requested to delete his/her information from KiboPush. The information type to be deleted is: ' +
          req.body.delete_option + '. Data will be deleted by ' + deletionDate + '. ' +
          'Following are the user details:' +
          '<ul>' +
            '<li>' + req.user._id + '</li>' +
            '<li>' + req.user.email + '</li>' +
            '<li>' + req.user.role + '</li>' +
            '<li>' + req.user.plan.unique_ID + '</li>' +
          '</ul>' +
         '<!-- END: Content -->' +
        '<!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
        '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

        sendgrid.send(emailAdmin, function (err, json) {
          if (err) {
            return logger.serverLog(TAG,
              `Internal Server Error on sending email to Admin : ${JSON.stringify(
                err)}`)
          }
        })

        return res.status(200).json({status: 'success', payload: updatedUser})
      }
    })
  })
}

exports.cancelDeletion = function (req, res) {
  Users.findOne({domain_email: req.user.domain_email}, (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    user.deleteInformation = {delete_option: 'NONE', deletion_date: ''}
    user.save((err, updatedUser) => {
      logger.serverLog(TAG,
        `Inside SaveUser user : ${JSON.stringify(
          updatedUser)}`)
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      } else {
        let sendgrid = require('sendgrid')(config.sendgrid.username,
          config.sendgrid.password)

        let email = new sendgrid.Email({
          to: req.user.email,
          from: 'support@cloudkibo.com',
          subject: 'KiboPush: Cancel Deletion Process',
          text: 'Cancel Deletion Process'
        })

        email.setHtml(
          '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
          '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
          '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
          '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
          '<p style="color: #ffffff">Cancel Deletion Process</p> </td></tr> </table> </td> </tr> </table> ' +
          '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
          '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> ' +
          '<!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
         '<tr> <td class="wrapper last"> <p> Hello, <br> ' +
         '<p> You have requested to cancel the deletion process. Request has been sent to admin.</p>' +
         '<!-- END: Content -->' +
        '<!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
          '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

        sendgrid.send(email, function (err, json) {
          if (err) {
            return logger.serverLog(TAG,
              `Internal Server Error on sending email : ${JSON.stringify(
                err)}`)
          }
        })

        let emailAdmin = new sendgrid.Email({
          to: 'sojharo@cloudkibo.com',
          from: 'support@cloudkibo.com',
          subject: 'KiboPush: Cancel Deletion Process',
          text: 'Cancel Deletion Process',
          cc: 'jekram@cloudkibo.com'
        })

        emailAdmin.setHtml(
          '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
          '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
          '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
          '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
          '<p style="color: #ffffff">Delete User Informatio</p> </td></tr> </table> </td> </tr> </table> ' +
          '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
          '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> ' +
          '<!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
         '<tr> <td class="wrapper last"> <p> Hello, <br> ' +
          req.user.name + ' has requested to stop his/her deletion process. ' +
          'Following are the user details:' +
          '<ul>' +
            '<li>' + req.user._id + '</li>' +
            '<li>' + req.user.email + '</li>' +
            '<li>' + req.user.role + '</li>' +
            '<li>' + req.user.plan.unique_ID + '</li>' +
          '</ul>' +
         '<!-- END: Content -->' +
        '<!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This ia a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
          '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')

        sendgrid.send(emailAdmin, function (err, json) {
          if (err) {
            return logger.serverLog(TAG,
              `Internal Server Error on sending email to Admin : ${JSON.stringify(
                err)}`)
          }
        })

        return res.status(200).json({status: 'success', payload: updatedUser})
      }
    })
  })
}

exports.validateUserAccessToken = (req, res) => {
  console.log('user ', JSON.stringify(req.user))
  if (req.user.facebookInfo) {
    needle.get(`https://graph.facebook.com/v2.6/me?access_token=${req.user.facebookInfo.fbToken}`, (err, response) => {
      if (err) {
        res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
      } else if (response.body.error) {
        res.status(500).json({status: 'failed', payload: JSON.stringify(err)})
      } else {
        res.status(200).json({status: 'success', payload: 'User Access Token validated successfully!'})
      }
    })
  } else {
    res.status(200).json({status: 'success', payload: 'Facebook account is not connected.'})
  }
}
