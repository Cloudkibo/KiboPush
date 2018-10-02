const logicLayer = require('./teams.logiclayer')
const utility = require('../utility')
const logger = require('../../../components/logger')
const TAG = 'api/v2/pages/teams.controller.js'

exports.index = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    utility.callApi(`team/query`, 'post', {companyId: companyuser.companyId}) // fetch all teams of company
    .then(teams => {
      utility.callApi(`team/agents/query/distinct`, 'post', {companyId: companyuser.companyId}) // fetch distinct team agents
      .then(agentIds => {
        utility.callApi(`user/query`, 'post', {_id: {$in: agentIds}}) // fetch unique agents info
        .then(uniqueAgents => {
          utility.callApi(`team/pages/query/distinct`, 'post', {companyId: companyuser.companyId}) // fetch distinct team pages
          .then(pageIds => {
            utility.callApi(`page/query`, 'post', {_id: {$in: pageIds}}) // fetch unique pages info
            .then(uniquePages => {
              return res.status(200).json({
                status: 'success',
                payload: {teams: teams, teamUniqueAgents: uniqueAgents, teamUniquePages: uniquePages}
              })
            })
          })
          .catch(error => {
            return res.status(500).json({
              status: 'failed',
              payload: `Failed to fetch distinct team pages ${JSON.stringify(error)}`
            })
          })
        })
        .catch(error => {
          return res.status(500).json({
            status: 'failed',
            payload: `Failed to fetch unique team agents ${JSON.stringify(error)}`
          })
        })
      })
      .catch(error => {
        return res.status(500).json({
          status: 'failed',
          payload: `Failed to fetch distinct team agents ${JSON.stringify(error)}`
        })
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch teams ${JSON.stringify(error)}`
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

exports.createTeam = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    let teamPayload = logicLayer.getTeamPayload(req, companyuser)
    let agentIds = req.body.agentIds
    let pageIds = req.body.pageIds
    utility.callApi(`team`, 'post', teamPayload) // create team
    .then(createdTeam => {
      agentIds.forEach(agentId => {
        let teamAgentsPayload = logicLayer.getTeamAgentsPayload(createdTeam, companyuser, agentId)
        utility.callApi(`team/agents`, 'post', teamAgentsPayload) // create team agent
        .then(createdAgent => {
          logger.serverLog(TAG, 'Team agent created successfully!')
        })
        .catch(error => {
          logger.serverLog(TAG, `Failed to create agent ${JSON.stringify(error)}`)
        })
      })
      pageIds.forEach(pageId => {
        let teamPagesPayload = logicLayer.getTeamPagesPayload(createdTeam, companyuser, pageId)
        utility.callApi(`team/pages`, 'post', teamPagesPayload) // create team page
        .then(createdPage => {
          logger.serverLog(TAG, 'Team page created successfully!')
        })
        .catch(error => {
          logger.serverLog(TAG, `Failed to create page ${JSON.stringify(error)}`)
        })
      })
      return res.status(200).json({
        status: 'success',
        payload: 'Team created successfully!'
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to create team ${JSON.stringify(error)}`
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

exports.updateTeam = function (req, res) {
  let teamPayload = logicLayer.getUpdateTeamPayload(req.body)
  utility.callApi(`team/${req.body._id}`, 'put', teamPayload) // update team
  .then(team => {
    return res.status(200).json({
      status: 'success',
      payload: team
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to update team ${JSON.stringify(error)}`
    })
  })
}

exports.deleteTeam = function (req, res) {
  utility.callApi(`team/${req.params.id}`, 'delete') // delete team
  .then(deletedTeam => {
    return res.status(200).json({
      status: 'success',
      payload: 'Team deleted successfully!'
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to delete team ${JSON.stringify(error)}`
    })
  })
}

exports.addAgent = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    let agentPayload = logicLayer.getTeamAgentsPayload({_id: req.body.teamId}, companyuser, req.body.agentId)
    utility.callApi(`team/agents`, 'post', agentPayload) // add agent
    .then(craetedAgent => {
      return res.status(200).json({
        status: 'success',
        payload: 'Agent added successfully!'
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to create team agent ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company User ${JSON.stringify(error)}`
    })
  })
}

exports.addPage = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    let pagePayload = logicLayer.getTeamPagesPayload({_id: req.body.teamId}, companyuser, req.body.pageId)
    utility.callApi(`team/pages`, 'post', pagePayload) // add page
    .then(craetedPage => {
      return res.status(200).json({
        status: 'success',
        payload: 'Page added successfully!'
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to create team page ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company User ${JSON.stringify(error)}`
    })
  })
}

exports.removeAgent = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    let agentPayload = logicLayer.getTeamAgentsPayload({_id: req.body.teamId}, companyuser, req.body.agentId)
    utility.callApi(`team/agents`, 'delete', agentPayload) // delete agent
    .then(deletedAgent => {
      return res.status(200).json({
        status: 'success',
        payload: 'Agent deleted successfully!'
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to delete team agent ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company User ${JSON.stringify(error)}`
    })
  })
}

exports.removePage = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    let pagePayload = logicLayer.getTeamPagesPayload({_id: req.body.teamId}, companyuser, req.body.pageId)
    utility.callApi(`team/pages`, 'delete', pagePayload) // delete page
    .then(craetedPage => {
      return res.status(200).json({
        status: 'success',
        payload: 'Page deleted successfully!'
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to delete team page ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company User ${JSON.stringify(error)}`
    })
  })
}

exports.fetchAgents = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    utility.callApi(`team/agents/query`, 'post', {teamId: req.params.id, companyId: companyuser.companyId}) // fetch agents
    .then(agents => {
      return res.status(200).json({
        status: 'success',
        payload: agents
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch team agents ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company User ${JSON.stringify(error)}`
    })
  })
}

exports.fetchPages = function (req, res) {
  utility.callApi(`companyUser/${req.user.domain_email}`) // fetch company user
  .then(companyuser => {
    utility.callApi(`team/pages/query`, 'post', {teamId: req.params.id, companyId: companyuser.companyId}) // fetch pages
    .then(agents => {
      return res.status(200).json({
        status: 'success',
        payload: agents
      })
    })
    .catch(error => {
      return res.status(500).json({
        status: 'failed',
        payload: `Failed to fetch team pages ${JSON.stringify(error)}`
      })
    })
  })
  .catch(error => {
    return res.status(500).json({
      status: 'failed',
      payload: `Failed to fetch company User ${JSON.stringify(error)}`
    })
  })
}
