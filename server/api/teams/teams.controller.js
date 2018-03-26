const Teams = require('./teams.model')
const TeamAgents = require('./team_agents.model')
const TeamPages = require('./team_pages.model')
const CompanyUsers = require('./../companyuser/companyuser.model')

exports.index = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
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
    Teams.find({companyId: companyUser.companyId}, (err, teams) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      TeamAgents.find({companyId: companyUser.companyId}, (err, teamAgents) => {
        if (err) {
          return res.status(500).json({
            status: 'failed',
            description: `Internal Server Error ${JSON.stringify(err)}`
          })
        }
        TeamPages.find({companyId: companyUser.companyId}, (err, teamPages) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
          return res.status(201).json({status: 'success', payload: {teams: teams, teamAgents: teamAgents, teamPages: teamPages}})
        })
      })
    })
  })
}

exports.createTeam = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
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
    let teamPayload = {
      name: req.body.name,
      description: req.body.description,
      created_by: req.user._id,
      companyId: companyUser.companyId
    }
    const team = new Teams(teamPayload)

    Teams.create(team, (err, newTeam) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      req.body.agentIds.forEach(agentId => {
        let teamAgentsPayload = {
          teamId: newTeam._id,
          companyId: companyUser.companyId,
          agentId: agentId
        }
        const teamAgent = new TeamAgents(teamAgentsPayload)

        TeamAgents.create(teamAgent, (err, newTeamAgent) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
        })
      })
      req.body.pageIds.forEach(pageId => {
        let teamPagesPayload = {
          teamId: newTeam._id,
          pageId: pageId,
          companyId: companyUser.companyId
        }
        const teamPage = new TeamPages(teamPagesPayload)

        TeamPages.create(teamPage, (err, newTeamPage) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              description: `Internal Server Error ${JSON.stringify(err)}`
            })
          }
        })
      })
      return res.status(201).json({status: 'success', payload: newTeam})
    })
  })
}

exports.updateTeam = function (req, res) {
  Teams.findById(req.body._id, (err, team) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!team) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    team.name = req.body.name
    team.description = req.body.description
    team.save((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'Poll update failed'})
      }
      res.status(201).json({status: 'success', payload: team})
    })
  })
}
exports.deleteTeam = function (req, res) {
  Teams.findById(req.params.id, (err, team) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!team) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    team.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'poll update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
exports.addAgent = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
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
    let teamAgentsPayload = {
      teamId: req.body.teamId,
      companyId: companyUser.companyId,
      agentId: req.body.agentId
    }
    const teamAgent = new TeamAgents(teamAgentsPayload)

    TeamAgents.create(teamAgent, (err, newTeamAgent) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.status(201).json({status: 'success', payload: newTeamAgent})
    })
  })
}
exports.addPage = function (req, res) {
  CompanyUsers.findOne({domain_email: req.user.domain_email}, (err, companyUser) => {
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
    let teamPagesPayload = {
      teamId: req.body.teamId,
      companyId: companyUser.companyId,
      agentId: req.body.pageId
    }
    const teamPage = new TeamPages(teamPagesPayload)

    TeamPages.create(teamPage, (err, newTeamPage) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          description: `Internal Server Error ${JSON.stringify(err)}`
        })
      }
      return res.status(201).json({status: 'success', payload: newTeamPage})
    })
  })
}
exports.removeAgent = function (req, res) {
  TeamAgents.find({agentId: req.body.agentId, teamId: req.body.teamId}, (err, teamAgent) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!teamAgent) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    teamAgent.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'poll update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
exports.removePage = function (req, res) {
  TeamPages.find({agentId: req.body.pageId, teamId: req.body.teamId}, (err, teamPage) => {
    if (err) {
      return res.status(500)
        .json({status: 'failed', description: 'Internal Server Error'})
    }
    if (!teamPage) {
      return res.status(404)
        .json({status: 'failed', description: 'Record not found'})
    }
    teamPage.remove((err2) => {
      if (err2) {
        return res.status(500)
          .json({status: 'failed', description: 'poll update failed'})
      }
      return res.status(200)
      .json({status: 'success'})
    })
  })
}
