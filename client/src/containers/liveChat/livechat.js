import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { Link } from 'react-router'
import Halogen from 'halogen'

// actions
import {
  fetchOpenSessions,
  fetchCloseSessions,
  unSubscribe,
  // fetchSingleSession,
  fetchUserChats,
  sendNotifications,
  fetchTeamAgents,
  assignToTeam,
  assignToAgent,
  // resetSocket,
  // resetUnreadSession,
  // showChatSessions,
  // updateUserChat,
  // clearSearchResult,
  markRead
} from '../../redux/actions/livechat.actions'
import {
  getSubscriberTags,
  unassignTags,
  createTag,
  assignTags,
  loadTags
} from '../../redux/actions/tags.actions'
import { loadTeamsList } from '../../redux/actions/teams.actions'

// Components
import INFO from '../../components/LiveChat/info.js'
import SESSIONSAREA from '../../components/LiveChat/sessionsArea.js'
import PROFILEAREA from '../../components/LiveChat/profileArea.js'
import CHATAREA from '../../components/LiveChat/chatArea.js'

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      activeSession: {},
      scroll: true,
      tagOptions: []
    }
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.fetchSessions = this.fetchSessions.bind(this)
    this.fetchTeamAgents = this.fetchTeamAgents.bind(this)
    this.handleSaveTags = this.handleSaveTags.bind(this)
    this.unassignTags = this.unassignTags.bind(this)
    this.assignTags = this.assignTags.bind(this)
  }

  changeActiveSession (session) {
    this.setState({activeSession: session, scroll: true})
    if (session !== {}) {
      if (this.state.tabValue === 'open') {
        var temp = this.props.openSessions
        for (var i = 0; i < temp.length; i++) {
          if (temp[i]._id === session._id && temp[i].unreadCount) {
            delete temp[i].unreadCount
          }
        }
      } else {
        var tempClose = this.props.closeSessions
        for (var j = 0; j < tempClose.length; j++) {
          if (tempClose[j]._id === session._id && tempClose[j].unreadCount) {
            delete tempClose[j].unreadCount
          }
        }
      }
      this.props.fetchUserChats(session._id, {page: 'first', number: 25})
      this.props.markRead(session._id)
      this.props.getSubscriberTags(session._id, this.msg)
    }
  }

  fetchSessions (data, type) {
    if (type === 'open') {
      this.props.fetchOpenSessions(data)
    } else if (type === 'close') {
      this.props.fetchCloseSessions(data)
    } else {
      this.props.fetchOpenSessions(data)
      this.props.fetchCloseSessions(data)
    }
  }

  handleAgents (teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId)
      }
    }
    if (agentIds.length > 0) {
      let notificationsData = {
        message: `Session of subscriber ${this.state.activeSession.firstName + ' ' + this.props.activeSession.lastName} has been assigned to your team ${this.state.teamObject.name}.`,
        category: {type: 'chat_session', id: this.props.activeSession._id},
        agentIds: agentIds,
        companyId: this.props.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  fetchTeamAgents (id) {
    this.props.fetchTeamAgents(id, this.handleAgents)
  }

  handleSaveTags () {
    var subscriberId = this.props.activeSession._id
    this.props.getSubscriberTags(subscriberId)
  }

  unassignTags (payload, msg) {
    this.props.unassignTags(payload, this.handleSaveTags, msg)
  }

  assignTags (payload, msg) {
    this.props.assignTags(payload, this.handleSaveTags, msg)
  }

  componentWillMount () {
    this.fetchSessions({first_page: true, last_id: 'none', number_of_records: 10, filter: false, filter_criteria: {sort_value: -1, page_value: '', search_value: ''}})
    this.props.loadTags()
    this.props.loadTeamsList()
  }

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)

    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Live Chat`
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.openSessions && nextProps.closeSessions) {
      this.setState({loading: false})
      if (nextProps.openSessions && nextProps.closeSessions) {
        console.log('open sessions', nextProps.openSessions)
        console.log('close sessions', nextProps.closeSessions)
        console.log(nextProps.openCount + ' : ' + nextProps.closeCount)
        if (this.state.loading) {
          this.setState({loading: false})
        }
        if (this.props.location.state && Object.keys(this.state.activeSession).length === 0 && this.state.activeSession.constructor === Object) {
          let newSessions = nextProps.openSessions.filter(session => session._id === this.props.location.state.id)
          let oldSessions = nextProps.closeSessions.filter(session => session._id === this.props.location.state.id)
          this.setState({activeSession: newSessions.length > 0 ? newSessions[0] : oldSessions.length > 0 ? oldSessions[0] : ''})
          if (newSessions.length > 0 && newSessions[0].status === 'new') {
            this.setState({tabValue: 'open'})
          } else if (oldSessions.length > 0 && oldSessions[0].status === 'resolved') {
            this.setState({tabValue: 'closed'})
          }
        } else if (this.state.activeSession === '') {
          if (this.state.tabValue === 'open') {
            this.setState({activeSession: nextProps.openSessions.length > 0 ? nextProps.openSessions[0] : ''})
          } else {
            this.setState({activeSession: nextProps.closeSessions.length > 0 ? nextProps.closeSessions[0] : ''})
          }
        }
      }
      if (!nextProps.subscriberTags) {
        if (nextProps.openSessions[0] && nextProps.openSessions[0]._id) {
          this.props.getSubscriberTags(nextProps.openSessions[0]._id)
        } else if (nextProps.closeSessions[0] && nextProps.closeSessions[0]._id) {
          this.props.getSubscriberTags(nextProps.closeSessions[0]._id)
        }
      }
    }
    if (nextProps.tags) {
      var tagOptions = []
      for (var i = 0; i < nextProps.tags.length; i++) {
        tagOptions.push({'value': nextProps.tags[i]._id, 'label': nextProps.tags[i].tag})
      }
      this.setState({
        tagOptions: tagOptions
      })
    }
  }

  render () {
    console.log('State in live chat', this.state)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {
          this.state.loading
          ? <div style={{position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em'}}
            className='align-center'>
            <center><Halogen.RingLoader color='#716aca' /></center>
          </div>
          : <div className='m-content'>
            <INFO />
            {
              this.props.openCount > 0 || this.props.closeCount > 0
              ? <div className='row'>
                <SESSIONSAREA
                  openSessions={this.props.openSessions}
                  closeSessions={this.props.closeSessions}
                  openCount={this.props.openCount}
                  closeCount={this.props.closeCount}
                  pages={this.props.pages}
                  fetchSessions={this.fetchSessions}
                  user={this.props.user}
                  activeSession={this.state.activeSession}
                  changeActiveSession={this.changeActiveSession}
                />
                {
                  Object.keys(this.state.activeSession).length === 0 && this.state.activeSession.constructor === Object &&
                  <div className='col-xl-8'>
                    <div className='m-portlet m-portlet--full-height'>
                      <div style={{textAlign: 'center'}} className='m-portlet__body'>
                        <p>Please select a session to view its chat.</p>
                      </div>
                    </div>
                  </div>
                }
                {
                  Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object &&
                  <CHATAREA
                  />
                }
                {
                  Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object &&
                  <PROFILEAREA
                    teams={this.props.teams ? this.props.teams : []}
                    agents={this.props.teamUniqueAgents ? this.props.teamUniqueAgents : []}
                    subscriberTags={this.props.subscriberTags ? this.props.subscriberTags : []}
                    activeSession={this.state.activeSession}
                    changeActiveSession={this.changeActiveSession}
                    unSubscribe={this.props.unSubscribe}
                    user={this.props.user}
                    fetchTeamAgents={this.fetchTeamAgents}
                    assignToTeam={this.props.assignToTeam}
                    assignToAgent={this.props.assignToAgent}
                    sendNotifications={this.props.sendNotifications}
                    unassignTags={this.unassignTags}
                    tags={this.props.tags}
                    createTag={this.props.createTag}
                    assignTags={this.assignTags}
                  />
                }
              </div>
              : <p>No data to display</p>
            }
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('props in live chat', state)
  return {
    openSessions: (state.liveChat.openSessions),
    openCount: (state.liveChat.openCount),
    closeCount: (state.liveChat.closeCount),
    closeSessions: (state.liveChat.closeSessions),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    tags: (state.tagsInfo.tags),
    teamUniqueAgents: (state.teamsInfo.teamUniqueAgents),
    teams: (state.teamsInfo.teams),
    subscriberTags: (state.tagsInfo.subscriberTags)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchOpenSessions,
    fetchCloseSessions,
    fetchUserChats,
    markRead,
    getSubscriberTags,
    sendNotifications,
    fetchTeamAgents,
    assignToTeam,
    assignToAgent,
    unassignTags,
    createTag,
    assignTags,
    unSubscribe,
    loadTags,
    loadTeamsList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
