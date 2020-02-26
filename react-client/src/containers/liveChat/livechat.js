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
  changeStatus,
  unSubscribe,
  getCustomers,
  appendSubscriber
} from '../../redux/actions/livechat.actions'
import { updatePicture } from '../../redux/actions/subscribers.actions'

// components
import HELPWIDGET from '../../components/extras/helpWidget'
import { SESSIONS, PROFILE } from '../../components/LiveChat'

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
      activeSession: {},
      teamAgents: [],
      userChat: []
    }

    this.fetchSessions = this.fetchSessions.bind(this)
    this.updateState = this.updateState.bind(this)
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.setDefaultPicture = this.setDefaultPicture.bind(this)
    this.profilePicError = this.profilePicError.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.performAction = this.performAction.bind(this)
    this.handleTeamAgents = this.handleTeamAgents.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.getChatPreview = this.getChatPreview.bind(this)

    this.fetchSessions(true, 'none', true)
  }

  getChatPreview (message, repliedBy, subscriberName) {
    let chatPreview = ''
    if (message.componentType) {
      // agent
      chatPreview = (!repliedBy || (repliedBy.id === this.props.user._id)) ? `You` : `${repliedBy.name}`
      if (message.componentType === 'text') {
        chatPreview = `${chatPreview}: ${message.text.length > 15 ? message.text.substring(0, 15) + '...' : message.text}`
      } else {
        chatPreview = `${chatPreview} shared ${message.componentType}`
      }
    } else {
      // subscriber
      chatPreview = `${subscriberName}`
      if (message.attachments) {
        if (message.attachments[0].type === 'template' &&
          message.attachments[0].payload.template_type === 'generic'
        ) {
          chatPreview = message.attachments[0].payload.elements.length > 1 ? `${chatPreview} sent a gallery` : `${chatPreview} sent a card`
        } else if (message.attachments[0].type === 'template' &&
          message.attachments[0].payload.template_type === 'media'
        ) {
          chatPreview = `${chatPreview} sent a media`
        } else if (['image', 'audio', 'location', 'video', 'file'].includes(message.attachments[0].type)) {
          chatPreview = `${chatPreview} shared ${message.attachments[0].type}`
        } else {
          chatPreview = `${chatPreview}: ${message.text.length > 20 ? message.text.substring(0, 20) + '...' : message.text}`
        }
      } else {
        chatPreview = `${chatPreview}: ${message.text.length > 20 ? message.text.substring(0, 20) + '...' : message.text}`
      }
    }
    return chatPreview
  }

  updateState (state, callback) {
    this.setState(state, () => {
      callback()
    })
  }

  handleStatusChange (session, status) {
    const message = (status === 'resolved') ? 'Session has been marked as resoleved successfully' : 'Session has been reopened successfully'
    this.setState({
      userChat: [],
      activeSession: (session._id === this.state.activeSession._id) ? {} : this.state.activeSession
    })
    this.alertMsg.success(message)
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
      this.props.changeStatus({_id: session._id, status: status}, () => this.handleStatusChange(session, status))
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
    if (session._id !== this.state.activeSession._id) {
      this.setState({activeSession: session})
      if (session.is_assigned && session.assigned_to.type === 'team') {
        this.props.fetchTeamAgents(session.assigned_to.id, this.handleTeamAgents)
      }
    }
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
    if (this.state.tabValue === 'open' && nextProps.openSessions) {
      this.setState({loading: false, sessionsLoading: false})
      let index = nextProps.openSessions.findIndex((session) => session._id === this.state.activeSession._id)
      if (index === -1) {
        this.setState({activeSession: {}, userChat: []})
      }
      this.setState({sessions: nextProps.openSessions, sessionsCount: nextProps.openCount})
    } else if (this.state.tabValue === 'close' && nextProps.closeSessions) {
      this.setState({loading: false, sessionsLoading: false})
      let index = nextProps.closeSessions.findIndex((session) => session._id === this.state.activeSession._id)
      if (index === -1) {
        this.setState({activeSession: {}, userChat: []})
      }
      this.setState({sessions: nextProps.closeSessions, sessionsCount: nextProps.closeCount})
    }
  }

  render () {
    console.log('render in live chat')
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper' style={{marginBottom: 0, overflow: 'hidden'}}>
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
            <HELPWIDGET
              documentation={{link: 'http://kibopush.com/livechat/'}}
              videoTutorial={{videoId: 'XUXc2ZD_lQY'}}
            />
              <div className='row'>
                <SESSIONS
                  pages={this.props.pages}
                  loading={this.state.sessionsLoading}
                  tabValue={this.state.tabValue}
                  sessions={this.state.sessions}
                  sessionsCount={this.state.sessionsCount}
                  filterSort={this.state.filterSort}
                  filterPage={this.state.filterPage}
                  filterSearch={this.state.filterSearch}
                  filterPending={this.state.filterPending}
                  filterUnread={this.state.filterUnread}
                  activeSession={this.state.activeSession}
                  changeActiveSession={this.changeActiveSession}
                  profilePicError={this.profilePicError}
                  changeStatus={this.changeStatus}
                  updateState={this.updateState}
                  fetchSessions={this.fetchSessions}
                  getChatPreview={this.getChatPreview}
                />
                {
                   Object.keys(this.state.activeSession).length > 0 &&
                   <PROFILE
                      activeSession={this.state.activeSession}
                      user={this.props.user}
                      profilePicError={this.profilePicError}
                      changeActiveSession={this.changeActiveSession}
                      msg={this.alertMsg}
                      unSubscribe={this.props.unSubscribe}
                      customers={this.props.customers}
                      getCustomers={this.props.getCustomers}
                    />
                }
                {
                  Object.keys(this.state.activeSession).length === 0 && this.state.activeSession.constructor === Object &&
                  <div style={{border: '1px solid #F2F3F8',
                    marginBottom: '0px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'}} className='col-xl-8 m-portlet'>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <p>Please select a session to view its chat.</p>
                    </div>
                  </div>
                }
              </div>
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
    user: (state.basicInfo.user),
    customers: (state.liveChat.customers)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    unSubscribe,
    fetchOpenSessions,
    fetchCloseSessions,
    updatePicture,
    fetchTeamAgents,
    changeStatus,
    getCustomers,
    appendSubscriber
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
