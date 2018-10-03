const logger = require('../../../components/logger')
const needle = require('needle')
const TAG = 'api/v2/companyProfile.controller.js'
const utility = require('../utility')

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
    .then(companyuser => {
      utility.callApi(`companyProfile/generic`, 'post', { email: req.body.email, companyId: companyuser.companyId }) // get invitation count
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
                          }
                          else {
                              
                          }
                        })
                        .catch(error => {
                          logger.serverLog(TAG, `Error while fetching companyProfile  `)
                          return res.status(500).json({
                            status: 'failed',
                            payload: `Failed to fetch pages ${JSON.stringify(error)}`
                          })
                        })
                    }
                  })
                  .catch(error => {
                    logger.serverLog(TAG, `Error while fetching companyProfile  `)
                    return res.status(500).json({
                      status: 'failed',
                      payload: `Failed to fetch pages ${JSON.stringify(error)}`
                    })
                  })
              }
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
