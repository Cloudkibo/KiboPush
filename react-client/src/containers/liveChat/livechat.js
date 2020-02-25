import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { RingLoader } from 'halogenium'

// actions
import {
  fetchOpenSessions,
  fetchCloseSessions,
  fetchTeamAgents,
  changeStatus
} from '../../redux/actions/livechat.actions'
import { updatePicture } from '../../redux/actions/subscribers.actions'

// components
import { INFO, SESSIONS } from '../../components/LiveChat'

const alertOptions = {
  offset: 14,
  position: 'top right',
  theme: 'dark',
  time: 5000,
  transition: 'scale'
}

class LiveChat extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: true,
      sessionsLoading: false,
      tabValue: 'open',
      numberOfRecords: 25,
      filterSort: -1,
      filterPage: '',
      filterSearch: '',
      filterPending: false,
      filterUnread: false,
      sessions: [],
      sessionsCount: 0,
      activeSession: {_id: ''},
      teamAgents: [],
      userChat: []
    }

    this.fetchSessions = this.fetchSessions.bind(this)
    this.updateFilterPage = this.updateFilterPage.bind(this)
    this.updateFilterSort = this.updateFilterSort.bind(this)
    this.updateFilterSearch = this.updateFilterSearch.bind(this)
    this.updateFilterPending = this.updateFilterPending.bind(this)
    this.updateFilterUnread = this.updateFilterUnread.bind(this)
    this.removeFilters = this.removeFilters.bind(this)
    this.changeTab = this.changeTab.bind(this)
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.setDefaultPicture = this.setDefaultPicture.bind(this)
    this.profilePicError = this.profilePicError.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.performAction = this.performAction.bind(this)
    this.handleTeamAgents = this.handleTeamAgents.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)

    this.fetchSessions(true, 'none', true)
  }

  removeFilters () {
    this.setState({
      filterPage: '',
      filterSearch: '',
      filterPending: false,
      filterUnread: false,
      sessionsLoading: true
    }, () => {
      this.fetchSessions(true, 'none')
    })
  }

  updateFilterPage (filterPage) {
    this.setState({filterPage, sessionsLoading: true}, () => {
      this.fetchSessions(true, 'none')
    })
  }

  updateFilterSort (filterSort) {
    this.setState({filterSort, sessionsLoading: true}, () => {
      this.fetchSessions(true, 'none')
    })
  }

  updateFilterSearch (value) {
    this.setState({filterSearch: value, sessionsLoading: true}, () => {
      this.fetchSessions(true, 'none')
    })
  }

  updateFilterPending (filterPending) {
    this.setState({filterPending, sessionsLoading: true}, () => {
      this.fetchSessions(true, 'none')
    })
  }

  updateFilterUnread (filterUnread) {
    this.setState({filterUnread, sessionsLoading: true}, () => {
      this.fetchSessions(true, 'none')
    })
  }

  handleStatusChange () {
    this.setState({userChat: [], activeSession: {_id: ''}})
  }

  handleTeamAgents (agents) {
    this.setState({teamAgents: agents})
  }

  performAction (errorMsg, session) {
    let isAllowed = true
    if (session.is_assigned) {
      if (session.assigned_to.type === 'agent' && session.assigned_to.id !== this.props.user._id) {
        isAllowed = false
        errorMsg = `Only assigned agent can ${errorMsg}`
      } else if (this.props.session.assigned_to.type === 'team') {
        const agentIds = this.state.teamAgents.map((agent) => agent.agentId._id)
        if (!agentIds.includes(this.props.user._id)) {
          isAllowed = false
          errorMsg = `Only agents who are part of assigned team can ${errorMsg}`
        }
      }
    }
    errorMsg = `You can not perform this action. ${errorMsg}`
    return {isAllowed, errorMsg}
  }

  changeStatus (status, session) {
    let errorMsg = (status === 'resolved') ? 'mark this session as resolved' : 'reopen this session'
    const data = this.performAction(errorMsg, session)
    if (data.isAllowed) {
      this.props.changeStatus({_id: session._id, status: status}, this.handleStatusChange)
    } else {
      this.alertMsg.error(data.errorMsg)
    }
  }

  profilePicError(e, subscriber) {
    e.persist()
    this.setDefaultPicture(e, subscriber)
    this.props.updatePicture({ subscriber }, (newProfilePic) => {
      if (newProfilePic) {
        e.target.src = newProfilePic
      } else {
        this.setDefaultPicture(e, subscriber)
      }
    })
  }

  setDefaultPicture (e, subscriber) {
    if (subscriber.gender === 'female') {
      e.target.src = 'https://i.pinimg.com/236x/50/28/b5/5028b59b7c35b9ea1d12496c0cfe9e4d.jpg'
    } else {
      e.target.src = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    }
  }

  changeActiveSession (session) {
    this.setState({activeSession: session})
    if (session.is_assigned && session.assigned_to.type === 'team') {
      this.props.fetchTeamAgents(session.assigned_to.id, this.handleTeamAgents)
    }
  }

  changeTab (value) {
    this.setState({
      tabValue: 'open',
      sessions: value === 'open' ? this.props.openSessions : this.props.closeSessions,
      sessionsCount: value === 'open' ? this.props.openCount : this.props.closeCount
    })
  }

  fetchSessions(firstPage, lastId, fetchBoth) {
    const data = {
      first_page: firstPage,
      last_id: lastId,
      number_of_records: this.state.numberOfRecords,
      filter: false,
      filter_criteria: {
        sort_value: this.state.filterSort,
        page_value: this.state.filterPage,
        search_value: this.state.filterSearch,
        pendingResponse: this.state.filterPending,
        unreadMessages: this.state.filterUnread
      }
    }
    if (fetchBoth) {
      this.props.fetchOpenSessions(data)
      this.props.fetchCloseSessions(data)
    } else if (this.state.tabValue === 'open') {
      this.props.fetchOpenSessions(data)
    } else if (this.state.tabValue === 'close') {
      this.props.fetchCloseSessions(data)
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('UNSAFE_componentWillMount called in live chat')
    if (nextProps.openSessions || nextProps.closeSessions) {
      this.setState({loading: false, sessionsLoading: false})
      if (this.state.tabValue === 'open') {
        this.setState({sessions: nextProps.openSessions, sessionsCount: nextProps.openCount})
      } else if (this.state.tabValue === 'close') {
        this.setState({sessions: nextProps.closeSessions, sessionsCount: nextProps.closeCount})
      }
    }
  }

  render () {
    console.log('render in live chat')
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.alertMsg = a }} {...alertOptions} />
        {
          this.state.loading
          ? <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              width: '30em',
              height: '18em',
              marginLeft: '-10em'
            }}
            className='align-center'
          >
            <center><RingLoader color='#716aca' /></center>
          </div>
          : <div style={{padding: '15px 30px'}} className='m-content'>
            <INFO
              videoId='XUXc2ZD_lQY'
              showGuideline={true}
              clickHereLink='http://kibopush.com/livechat/'
            />
            {
              this.props.openCount > 0 || this.props.closeCount > 0
              ? <div className='row'>
                <SESSIONS
                  pages={this.props.pages}
                  loading={this.state.sessionsLoading}
                  tabValue={this.state.tabValue}
                  sessions={this.state.sessions}
                  sessionsCount={this.state.sessionsCount}
                  removeFilters={this.removeFilters}
                  updateFilterSort={this.updateFilterSort}
                  updateFilterPage={this.updateFilterPage}
                  updateFilterSearch={this.updateFilterSearch}
                  updateFilterPending={this.updateFilterPending}
                  updateFilterUnread={this.updateFilterUnread}
                  filterSort={this.state.filterSort}
                  filterPage={this.state.filterPage}
                  filterSearch={this.state.filterSearch}
                  filterPending={this.state.filterPending}
                  filterUnread={this.state.filterUnread}
                  changeTab={this.changeTab}
                  activeSession={this.state.activeSession}
                  changeActiveSession={this.changeActiveSession}
                  profilePicError={this.profilePicError}
                  changeStatus={this.changeStatus}
                />
              </div>
              : <p>No data to display</p>
            }
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('mapStateToProps in live chat', state)
  return {
    openSessions: (state.liveChat.openSessions),
    openCount: (state.liveChat.openCount),
    closeCount: (state.liveChat.closeCount),
    closeSessions: (state.liveChat.closeSessions),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchOpenSessions,
    fetchCloseSessions,
    updatePicture,
    fetchTeamAgents,
    changeStatus
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
