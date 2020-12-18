import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import Select from 'react-select'

import { loadTeamsList } from '../../redux/actions/teams.actions'
import { loadMembersList } from '../../redux/actions/members.actions'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadSLADashboardData } from '../../redux/actions/dashboard.actions'

import SLAStats from './sla_stats'
import SLAGraph from './sla_graph'

class SLADashboard extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      pageOptions: [],
      agentOptions: [],
      teamOptions: [],
      days: 30,
      page: null,
      team: null,
      agent: null,
      error: ''
    }
    this.handleDaysChange = this.handleDaysChange.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleAgentChange = this.handleAgentChange.bind(this)
    this.handleTeamChange = this.handleTeamChange.bind(this)
    this.fetchData = this.fetchData.bind(this)

    if (!props.pages) {
      props.loadMyPagesList()
    }
    if (!props.members) {
      props.loadMembersList()
    }
    this.fetchTimer = null
  }

  fetchData() {
    const query = {
      pageId: this.state.page._id,
      days: this.state.days
    }
    if (this.state.team) {
      query.teamId = this.state.team._id
    } else if (this.state.agent) {
      query.agentId = this.state.agent._id
    }
    this.props.loadSLADashboardData(query)
  }

  handleDaysChange(days) {
    this.setState({ days }, () => {
      clearTimeout(this.fetchTimer)
      this.fetchTimer = setTimeout(this.fetchData, 1000)
    })
  }

  handlePageChange(page) {
    this.props.loadTeamsList({ pageId: page.value })
    this.setState({ page, team: null, teamOptions: [] }, () => {
      this.fetchData()
    })
  }

  handleAgentChange(agent) {
    this.setState({ team: null, agent }, () => {
      this.fetchData()
    })
  }

  handleTeamChange(team) {
    this.setState({ agent: null, team }, () => {
      this.fetchData()
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {}
    if (!prevState.page && nextProps.pages) {
      const pageOptions = nextProps.pages.map((page) => {
        return {
          label: page.pageName,
          value: page._id
        }
      })
      newState.pageOptions = pageOptions
      newState.page = pageOptions[0]
      if (pageOptions[0]) {
        nextProps.loadTeamsList({ pageId: pageOptions[0]._id })
        nextProps.loadSLADashboardData({ pageId: pageOptions[0]._id, days: prevState.days })
      } else {
        newState.error = 'No pages are connected'
      }
    }
    if (nextProps.members) {
      const agentOptions = nextProps.members.map((member) => {
        return {
          label: member.userId.name,
          value: member._id
        }
      })
      newState.agentOptions = agentOptions
    }
    if (nextProps.teams) {
      const teamOptions = nextProps.teams.map((team) => {
        return {
          label: team.name,
          value: team._id
        }
      })
      newState.teamOptions = teamOptions
    }
    if (nextProps.slaDashboardError) {
      newState.error = nextProps.slaDashboardError
    }
    return newState
  }

  render() {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <>
        <AlertContainer
          ref={(a) => {
            this.msg = a
          }}
          {...alertOptions}
        />
        <div className='col-12'>
          <div className='m-portlet'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>SLA Dashboard</h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <div style={{ display: 'flex', float: 'right' }}>
                  <span htmlFor='example-text-input' className='col-form-label'>
                    Show records for last:&nbsp;&nbsp;
                  </span>
                  <div style={{ width: '100px' }}>
                    <input
                      disabled={this.props.fetchingSLAData || this.state.error}
                      placeholder='days'
                      type='number'
                      min='1'
                      step='1'
                      value={this.state.days}
                      className='form-control'
                      onChange={(e) => this.handleDaysChange(e.target.value)}
                    />
                  </div>
                  <span htmlFor='example-text-input' className='col-form-label'>
                    &nbsp;&nbsp;days
                  </span>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div
                className='row'
                style={{
                  marginBottom: '35px',
                  paddingBottom: '35px',
                  borderBottom: '2px solid lightgray',
                  borderBottomStyle: 'dotted'
                }}
              >
                <div className='col-4'>
                  <h6>Select Page:</h6>
                  <Select
                    isDisabled={this.props.fetchingSLAData || this.state.error}
                    isSearchable
                    options={this.state.pageOptions}
                    onChange={this.handlePageChange}
                    value={this.state.page}
                    placeholder={'No Page Selected'}
                  />
                </div>
                <div className='col-4'>
                  <h6>Select Agent:</h6>
                  <Select
                    isDisabled={this.props.fetchingSLAData || this.state.error}
                    isClearable
                    isSearchable
                    options={this.state.agentOptions}
                    onChange={this.handleAgentChange}
                    value={this.state.agent}
                    placeholder={'No Agent Selected'}
                  />
                </div>
                <div className='col-4'>
                  <h6>Select Team:</h6>
                  <Select
                    isDisabled={this.props.fetchingSLAData || this.state.error}
                    isClearable
                    isSearchable
                    options={this.state.teamOptions}
                    onChange={this.handleTeamChange}
                    value={this.state.team}
                    placeholder={'No Team Selected'}
                  />
                </div>
              </div>
              {this.props.fetchingSLAData && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <div className='m-loader m-loader--brand' style={{ width: '50px', height: '50px' }}></div>
                  <span className='m--font-brand'>Loading...Please wait</span>
                </div>
              )}
              {this.state.error && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <i
                    className='la la-exclamation-triangle m--font-danger'
                    style={{ marginRight: '5px', fontSize: '1.5rem' }}
                  />
                  <span className='m--font-danger'>{this.state.error}</span>
                </div>
              )}
              {!this.props.fetchingSLAData && !this.state.error && this.props.slaDashboard && (
                <>
                  <SLAStats
                    totalSessions={this.props.slaDashboard.sessions.total}
                    resolvedSessions={this.props.slaDashboard.sessions.resolved}
                    pendingSessions={this.props.slaDashboard.sessions.pending}
                    openSessions={this.props.slaDashboard.sessions.open}
                    messagesReceived={this.props.slaDashboard.messages.received}
                    messagesSent={this.props.slaDashboard.messages.sent}
                  />

                  <SLAGraph
                    graphData={this.props.slaDashboard.graphData}
                    resolveTime={this.props.slaDashboard.resolveTime}
                    responseTime={this.props.slaDashboard.responseTime}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  }
}

function mapStateToProps(state) {
  return {
    slaDashboard: state.dashboardInfo.slaDashboard,
    slaDashboardError: state.dashboardInfo.slaDashboardError,
    fetchingSLAData: state.dashboardInfo.fetchingSLADashboard,
    pages: state.pagesInfo.pages,
    user: state.basicInfo.user,
    superUser: state.basicInfo.superUser,
    members: state.membersInfo.members,
    teams: state.teamsInfo.teams
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadMyPagesList,
      loadMembersList,
      loadTeamsList,
      loadSLADashboardData
    },
    dispatch
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(SLADashboard)
