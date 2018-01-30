'use strict'

const _ = require('lodash')
const Companyprofile = require('./companyprofile.model')
const CompanyUsers = require('./../companyuser/companyuser.model')
const Invitations = require('./../invitations/invitations.model')
const Permissions = require('./../permissions/permissions.model')
const Users = require('./../user/Users.model')
const inviteagenttoken = require('./../inviteagenttoken/inviteagenttoken.model')
const config = require('./../../config/environment/index')

const logger = require('../../components/logger')
const TAG = 'api/companyprofile/companyprofile.controller.js'

exports.index = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
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
      Companyprofile.findOne({_id: companyUser.companyId},
        function (err, company) {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          res.status(200).json({status: 'success', payload: company})
        })
    })
}

exports.invite = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'email')) parametersMissing = true
  if (!_.has(req.body, 'name')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }
  CompanyUsers.findOne({domain_email: req.user.domain_email})
    .populate('companyId')
    .exec((err, companyUser) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      if (!companyUser) {
        return res.status(404).json({
          status: 'failed',
          description: 'The user account logged in does not belong to any company. Please contact support'
        })
      }
      Invitations.count(
        {email: req.body.email, companyId: companyUser.companyId._id},
        function (err, gotCount) {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }

          if (gotCount > 0) {
            return res.status(200).json({
              status: 'failed',
              description: `${req.body.name} is already invited.`
            })
          } else {
            Users.count({email: req.body.email},
              function (err, gotCountAgentWithEmail) {
                if (err) {
                  return res.status(500).json({
                    status: 'failed',
                    description: `Internal Server Error ${JSON.stringify(err)}`
                  })
                }

                if (gotCountAgentWithEmail > 0) {
                  return res.status(200).json({
                    status: 'failed',
                    description: `${req.body.name} is already on KiboPush.`
                  })
                } else {
                  Users.count({email: req.body.email, domain: req.user.domain},
                    function (err, gotCountAgent) {
                      if (err) {
                        return res.status(500).json({
                          status: 'failed',
                          description: `Internal Server Error ${JSON.stringify(err)}`
                        })
                      }

                      if (gotCountAgent > 0) {
                        return res.status(200).json({
                          status: 'failed',
                          description: `${req.body.name} is already a member.`
                        })
                      } else {
                        let today = new Date()
                        let uid = Math.random().toString(36).substring(7)
                        let uniqueToken_id = 'k' + uid + '' + today.getFullYear() +
                          '' + (today.getMonth() + 1) + '' + today.getDate() + '' +
                          today.getHours() + '' + today.getMinutes() + '' +
                          today.getSeconds()

                        let inviteeData = new inviteagenttoken({
                          email: req.body.email,
                          token: uniqueToken_id,
                          companyId: companyUser.companyId._id,
                          domain: req.user.domain,
                          companyName: companyUser.companyId.companyName,
                          role: req.body.role
                        })

                        inviteeData.save(function (err) {
                          if (err) {
                            logger.serverLog(TAG,
                              `At invite token save ${err}`)
                          }
                        })

                        let inviteeTempData = new Invitations({
                          name: req.body.name,
                          email: req.body.email,
                          companyId: companyUser.companyId._id
                        })

                        inviteeTempData.save(function (err) {
                          if (err) {
                            logger.serverLog(TAG,
                              `At invitation data save ${err}`)
                          }
                        })

                        let sendgrid = require('sendgrid')(config.sendgrid.username,
                          config.sendgrid.password)

                        var email = new sendgrid.Email({
                          to: req.body.email,
                          from: 'support@cloudkibo.com',
                          subject: 'KiboPush: Invitation',
                          text: 'Welcome to KiboPush'
                        })
                        email.setHtml(
                          '<body style="min-width: 80%;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;margin: 0;padding: 0;direction: ltr;background: #f6f8f1;width: 80% !important;"><table class="body", style="width:100%"> ' +
                          '<tr> <td class="center" align="center" valign="top"> <!-- BEGIN: Header --> <table class="page-header" align="center" style="width: 100%;background: #1f1f1f;"> <tr> <td class="center" align="center"> ' +
                          '<!-- BEGIN: Header Container --> <table class="container" align="center"> <tr> <td> <table class="row "> <tr>  </tr> </table> <!-- END: Logo --> </td> <td class="wrapper vertical-middle last" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;"> <!-- BEGIN: Social Icons --> <table class="six columns"> ' +
                          '<tr> <td> <table class="wrapper social-icons" align="right" style="float: right;"> <tr> <td class="vertical-middle" style="padding-top: 0;padding-bottom: 0;vertical-align: middle;padding: 0 2px !important;width: auto !important;"> ' +
                          '<p style="color: #ffffff">Inviting you as support agent</p> </td></tr> </table> </td> </tr> </table> ' +
                          '<!-- END: Social Icons --> </td> </tr> </table> </td> </tr> </table> ' +
                          '<!-- END: Header Container --> </td> </tr> </table> <!-- END: Header --> <!-- BEGIN: Content --> <table class="container content" align="center"> <tr> <td> <table class="row note"> ' +
                          '<tr> <td class="wrapper last"> <p> Hello, <br> ' +
                          req.user.name + ' has invited you to join ' +
                          companyUser.companyId.companyName +
                          ' as a Support Agent.</p> <p> <ul> <li>Company Name: ' +
                          companyUser.companyId.companyName + '</li> ' +
                          '<li>Workspace name: ' + req.user.domain +
                          ' </li> </ul> </p> <p>To accept invitation please click the following URL to activate your account:</p> <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                          '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="' + config.domain + '/api/invite_verification/verify/' +
                          uniqueToken_id +
                          '">' + config.domain + '/api/invite_verification/verify/' +
                          uniqueToken_id +
                          '</a> </td> <td class="expander"> </td> </tr> </table> <p> If clicking the URL above does not work, copy and paste the URL into a browser window. </p> <!-- END: Note Panel --> </td> </tr> </table><span class="devider" style="border-bottom: 1px solid #eee;margin: 15px -15px;display: block;"></span> <!-- END: Disscount Content --> </td> </tr> </table> </td> </tr> </table> <!-- END: Content --> <!-- BEGIN: Footer --> <table class="page-footer" align="center" style="width: 100%;background: #2f2f2f;"> <tr> <td class="center" align="center" style="vertical-align: middle;color: #fff;"> <table class="container" align="center"> <tr> <td style="vertical-align: middle;color: #fff;"> <!-- BEGIN: Unsubscribet --> <table class="row"> <tr> <td class="wrapper last" style="vertical-align: middle;color: #fff;"><span style="font-size:12px;"><i>This is a system generated email and reply is not required.</i></span> </td> </tr> </table> <!-- END: Unsubscribe --> ' +
                          '<!-- END: Footer Panel List --> </td> </tr> </table> </td> </tr> </table> <!-- END: Footer --> </td> </tr></table></body>')
                        sendgrid.send(email, function (err, json) {
                          if (err) {
                            return logger.serverLog(TAG,
                              `At sending email ${JSON.stringify(err)}`)
                          }

                          return res.status(200).json(
                            {status: 'success', description: 'Email has been sent'})
                        })
                      }
                    })
                }
              })
          }
        })
    })
}

exports.updateRole = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'domain_email')) parametersMissing = true
  if (!_.has(req.body, 'role')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  if (config.userRoles.indexOf(req.user.role) > 1) {
    return res.status(401).json(
      {status: 'failed', description: 'Unauthorised to perform this action.'})
  }

  if (config.userRoles.indexOf(req.body.role) < 0) {
    return res.status(404)
      .json({status: 'failed', description: 'Invalid role.'})
  }

  CompanyUsers.findOne({domain_email: req.body.domain_email},
    (err, userCompany) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      userCompany.role = req.body.role
      userCompany.save((err, savedUserCompany) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        Users.findOne({domain_email: req.body.domain_email}, (err, user) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          user.role = req.body.role
          user.save((err, savedUser) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                description: `Internal Server Error ${JSON.stringify(err)}`
              })
            }
            Permissions.update(
              {userId: user._id},
              config.permissions[req.body.role],
              {multi: true}, (err, updated) => {
                if (err) {
                  logger.serverLog(TAG, `ERROR ${JSON.stringify(err)}`)
                }
                return res.status(200)
                .json({status: 'success', payload: {savedUser, savedUserCompany}})
              })
          })
        })
      })
    })
}

exports.removeMember = function (req, res) {
  let parametersMissing = false

  if (!_.has(req.body, 'domain_email')) parametersMissing = true

  if (parametersMissing) {
    return res.status(400)
      .json({status: 'failed', description: 'Parameters are missing'})
  }

  if (config.userRoles.indexOf(req.user.role) > 1) {
    return res.status(401).json(
      {status: 'failed', description: 'Unauthorised to perform this action.'})
  }

  CompanyUsers.remove({domain_email: req.body.domain_email}, (err) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        description: `Internal Server Error ${JSON.stringify(err)}`
      })
    }
    Users.remove({domain_email: req.body.domain_email}, (err) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.status(200)
        .json({status: 'success', description: 'Account removed.'})
    })
  })
}

exports.members = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email},
    (err, companyUser) => {
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
      CompanyUsers.find({companyId: companyUser.companyId})
        .populate('userId')
        .exec((err, members) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          res.status(200).json({status: 'success', payload: members})
        })
    })
}
