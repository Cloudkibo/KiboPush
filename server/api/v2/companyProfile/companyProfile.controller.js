const logger = require('../../../components/logger')
const needle = require('needle')
const TAG = 'api/v2/companyProfile.controller.js'
const utility = require('../utility')
const logicLayer = './companyprofile.logicLayer.js'

exports.index = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
        .then(companyuser => {
          utility.callApi(`companyProfile/generic`, 'post', { companyId: companyuser.companyId }) // fetch company profile
                .then(companyProfile => {
                  return res.status(200).json({
                    status: 'success',
                    payload: companyProfile
                  })
                })
                .catch(error => {
                  logger.serverLog(TAG, `Error while fetching companyProfile  `)
                  return res.status(500).json({
                    status: 'failed',
                    payload: `Failed to fetch pages ${JSON.stringify(error)}`
                  })
                })
        })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to fetch company user ${JSON.stringify(error)}`
          })
        })
}

exports.invite = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
    .then(companyUser => {
      utility.callApi(`companyProfile/generic`, 'post', { email: req.body.email, companyId: companyUser.companyId }) // get invitation count
            .then(invitationCount => {
              if (invitationCount > 0) {
                return res.status(200).json({
                  status: 'failed',
                  description: `${req.body.name} is already invited.`
                })
              } else {
                  // get Users count
                utility.callApi(`companyProfile/generic`, 'post', {email: req.body.email})
                  .then(countAgentWithEmail => {
                    if (countAgentWithEmail > 0) {
                      return res.status(200).json({
                        status: 'failed',
                        description: `${req.body.name} is already on KiboPush.`
                      })
                    } else {
                      utility.callApi(`companyProfile/generic`, 'post', {email: req.body.email, domain: req.user.domain})
                        .then(countAgent => {
                          if (countAgent > 0) {
                            return res.status(200).json({
                              status: 'failed',
                              description: `${req.body.name} is already a member.`
                            })
                          } else {
                            let uniqueTokenId = logicLayer.createUniqueId()
                            utility.callApi('/inviteagenttoken/', 'post',
                              {
                                email: req.body.email,
                                token: uniqueTokenId,
                                companyId: companyUser.companyId._id,
                                domain: req.user.domain,
                                companyName: companyUser.companyId.companyName,
                                role: req.body.role
                              }).then(inviteAgentTokenCreated => {
                                return res.status(201).json({status: 'success', payload: inviteAgentTokenCreated})
                              }).catch(error => {
                                logger.serverLog(TAG, `Error while Creating inviteAgentToken ${JSON.stringify(error)``}  `)
                                return res.status(500).json({
                                  status: 'failed',
                                  payload: `Failed to create invite agent token ${JSON.stringify(error)}`
                                })
                              })
                            utility.callApi('invitations/', 'post', {
                              name: req.body.name,
                              email: req.body.email,
                              companyId: companyUser.companyId._id
                            }).then(invitationCreated => {
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
                                companyUser.companyName +
                                ' as a Support Agent.</p> <p> <ul> <li>Company Name: ' +
                                companyUser.companyId.companyName + '</li> ' +
                                '<li>Workspace name: ' + req.user.domain +
                                ' </li> </ul> </p> <p>To accept invitation please click the following URL to activate your account:</p> <!-- BEGIN: Note Panel --> <table class="twelve columns" style="margin-bottom: 10px"> ' +
                                '<tr> <td class="panel" style="background: #ECF8FF;border: 0;padding: 10px !important;"> <a href="' + config.domain + '/api/invite_verification/verify/' +
                                uniqueTokenId +
                                '">' + config.domain + '/api/invite_verification/verify/' +
                                uniqueTokenId +
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
                              return res.status(201).json({status: 'success', payload: invitationCreated})
                            }).catch(error => {
                              logger.serverLog(TAG, `Error while creating invittaion ${JSON.stringify(error)}`)
                              return res.status(500).json({
                                status: 'failed',
                                payload: `Failed to create invitation ${JSON.stringify(error)}`
                              })
                            })
                          }
                        })
                        .catch(error => {
                          logger.serverLog(TAG, `Error while fetching agent count ${JSON.stringify(error)}`)
                          return res.status(500).json({
                            status: 'failed',
                            payload: `Failed to fetch agent count ${JSON.stringify(error)}`
                          })
                        })
                    }
                  })
                  .catch(error => {
                    logger.serverLog(TAG, `Error while fetching agent count with email ${JSON.stringify(error)}`)
                    return res.status(500).json({
                      status: 'failed',
                      payload: `Failed to agent count withe email ${JSON.stringify(error)}`
                    })
                  })
              }
            })
            .catch(error => {
              logger.serverLog(TAG, `Error while fetching company Profile ${JSON.stringify(error)}`)
              return res.status(500).json({
                status: 'failed',
                payload: `Failed to fetch companyProfile ${JSON.stringify(error)}`
              })
            })
    })
    .catch(error => {
      logger.serverLog(TAG, `Error while fetching company User ${JSON.stringify(error)}`)
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch company user ${JSON.stringify(error)}`
      })
    })
}

exports.removeMember = function (req, res) {
  utility.callApi('/companyuser/remove', 'post', {domain_email: req.body.domain_email})
  .then(
    utility.callApi('users/remove', 'post', {domain_email: req.body.domain_email})
    .then(accountRemoved => {
      return res.status(200)
      .json({status: 'success', description: 'Account removed.'})
    }).catch(error => {
      logger.serverLog(TAG, `Error while removing user ${JSON.stringify(error)}`)
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to remove user ${JSON.stringify(error)}`
      })
    })
    ).catch(error => {
      logger.serverLog(TAG, `Error while removing company User ${JSON.stringify(error)}`)
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to remove company user ${JSON.stringify(error)}`
      })
    })
}
// to Do thk se
exports.updateRole = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyUser => {
  }).catch(error => {
    logger.serverLog(TAG, `Error while fetching company User ${JSON.stringify(error)}`)
    return res.status(500).json({
      status: 'failed',
      payload: `The user account does not belong to any company. Please contact support ${JSON.stringify(error)}`
    })
  })
}
exports.updateAutomatedOptions = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
    .then(companyUser => {
      utility.callApi(`companyProfile/${companyUser.companyId}`) // fetch company profile
        .then(companyProfile => {
          companyProfile.automated_options = req.body.automated_options
          utility.callApi('/companyProfile/update/', 'post', companyProfile)// update profile
            .then(updatedProfile => {
              return res.status(200).json({ status: 'success', payload: updatedProfile })
            }).catch(error => {
              logger.serverLog(TAG, `Error while fetching company profile ${JSON.stringify(error)}`)
              return res.status(500).json({
                status: 'failed',
                payload: `Failed to fetch company profile ${JSON.stringify(error)}`
              })
            })
        }).catch(error => {
          logger.serverLog(TAG, `Error while fetching company profile ${JSON.stringify(error)}`)
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to fetch company profile ${JSON.stringify(error)}`
          })
        })
    }).catch(error => {
      logger.serverLog(TAG, `Error while fetching company User ${JSON.stringify(error)}`)
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch company user ${JSON.stringify(error)}`
      })
    })
}

exports.getAutomatedOptions = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyUser => {
   //fetch company profile
   utility.callApi(`companyProfile/${companyUser.companyId}`)
   .then(companyProfile=>{
    res.status(200).json({status: 'success', payload: company})
   }).catch(error => {
    logger.serverLog(TAG, `Error while fetching company User ${JSON.stringify(error)}`)
    return res.status(500).json({
      status: 'failed',
      payload: `Error while fetching company profile.${JSON.stringify(error)}`
    })
  }).catch(error => {
    logger.serverLog(TAG, `Error while fetching company User ${JSON.stringify(error)}`)
    return res.status(500).json({
      status: 'failed',
      payload: `The user account does not belong to any company. Please contact support.`
    })
  })
}


