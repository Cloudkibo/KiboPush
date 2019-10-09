import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'

// import { Link } from 'react-router'
import Halogen from 'halogen'

// actions
import {
  fetchOpenSessions,
  fetchCloseSessions,
  unSubscribe,
  fetchSingleSession,
  fetchUserChats,
  sendNotifications,
  fetchTeamAgents,
  assignToTeam,
  assignToAgent,
  resetSocket,
  resetUnreadSession,
  updateUserChat,
  clearSearchResult,
  markRead,
  updatePendingResponse
} from '../../redux/actions/livechat.actions'
import {
  getSubscriberTags,
  unassignTags,
  createTag,
  assignTags,
  loadTags
} from '../../redux/actions/tags.actions'
import { setCustomFieldValue, loadCustomFields, getCustomFieldValue } from '../../redux/actions/customFields.actions'
import { loadTeamsList } from '../../redux/actions/teams.actions'
import { loadMembersList } from '../../redux/actions/members.actions'
import { updatePicture } from '../../redux/actions/subscribers.actions'
// Components
import INFO from '../../components/LiveChat/info.js'
import SESSIONSAREA from '../../components/LiveChat/sessionsArea.js'
import PROFILEAREA from '../../components/LiveChat/profileArea.js'
import CHATAREA from './chatbox.js'
import SEARCHAREA from './search'
import customfields from '../../components/customFields/customfields';

const CHATMODULE= 'KIBOCHAT'
class LiveChat extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: true,
      activeSession: {},
      scroll: true,
      tagOptions: [],
      showSearch: false,
      customFieldOptions: {},
      tabValue: 'open'
    }
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.updatePendingSession = this.updatePendingSession.bind(this)
    this.fetchSessions = this.fetchSessions.bind(this)
    this.profilePicError = this.profilePicError.bind(this)
    this.fetchTeamAgents = this.fetchTeamAgents.bind(this)
    this.handleSaveTags = this.handleSaveTags.bind(this)
    this.unassignTags = this.unassignTags.bind(this)
    this.assignTags = this.assignTags.bind(this)
    this.showSearch = this.showSearch.bind(this)
    this.hideSearch = this.hideSearch.bind(this)
    this.disableScroll = this.disableScroll.bind(this)
    this.changeActiveSessionFromChatbox = this.changeActiveSessionFromChatbox.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.saveCustomField = this.saveCustomField.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.getAgents = this.getAgents.bind(this)
    this.removePending = this.removePending.bind(this)
    this.setDefaultPicture = this.setDefaultPicture.bind(this)
  }

  getAgents (members) {
    let agents = members.map(m => m.userId)
    return agents
  }

  saveCustomField (data) {
    this.props.setCustomFieldValue(data, this.handleResponse)
  }

  handleResponse (res, body) {
    console.log("res",res)
    if (res.status === 'success') {
      this.msg.success('Value set successfully')
      let customFields = this.state.customFieldOptions
      let temp = this.props.customFields.map((cf) => cf._id)
      let index = temp.indexOf(body.customFieldId)
      customFields[index].value = body.value
      this.setState({customFieldOptions: customFields})
      // this.state.subscriber.customFields.forEach((field, i) => {
      //   if (this.state.selectedField._id === field._id) {
      //     temp.customFields[i].value = this.state.selectedField.value
      //     this.setState({subscriber: temp, setFieldIndex: false})
      //   }
      // })
    } else {
      if (res.status === 'failed') {
        this.msg.error(`Unable to set Custom field value. ${res.description}`)
      } else {
        this.msg.error('Unable to set Custom Field value')
      }
    }
  }

  changeActiveSessionFromChatbox() {
    this.setState({ activeSession: {} })
  }

  disableScroll() {
    this.setState({ scroll: false })
  }

  changeActiveSession(session) {
    session.unreadCount = 0
    this.setState({ activeSession: session, scroll: true })
    if (Object.keys(session).length > 0 && session.constructor === Object) {
      if (this.state.tabValue === 'open') {
        var temp = this.props.openSessions
        for (var i = 0; i < temp.length; i++) {
          if (temp[i]._id === session._id && temp[i].unreadCount) {
            temp[i].unreadCount = 0
          }
        }
      } else {
        var tempClose = this.props.closeSessions
        for (var j = 0; j < tempClose.length; j++) {
          if (tempClose[j]._id === session._id && tempClose[j].unreadCount) {
            tempClose[j].unreadCount = 0
          }
        }
      }
      this.props.fetchUserChats(session._id, { page: 'first', number: 25 })
      this.props.markRead(session._id)
      this.props.getSubscriberTags(session._id, this.msg)
      this.props.getCustomFieldValue(session._id)
    }
  }

  updatePendingSession(session, value) {
    session.pendingResponse = value
    if (Object.keys(session).length > 0 && session.constructor === Object) {
      if (this.state.tabValue === 'open') {
        var temp = this.props.openSessions
        for (var i = 0; i < temp.length; i++) {
          if (temp[i]._id === session._id) {
            temp[i].pendingResponse = value
          }
        }
      } else {
        var tempClose = this.props.closeSessions
        for (var j = 0; j < tempClose.length; j++) {
          if (tempClose[j]._id === session._id) {
            tempClose[j].pendingResponse = value
          }
        }
      }
    }
  }

  removePending (session, value) {
    this.props.updatePendingResponse({id: session._id, pendingResponse: value})
    this.updatePendingSession(session, value)
  }

  fetchSessions(data, type) {
    if (type === 'open') {
      this.props.fetchOpenSessions(data)
    } else if (type === 'close') {
      this.props.fetchCloseSessions(data)
    } else {
      this.props.fetchOpenSessions(data)
      this.props.fetchCloseSessions(data)
    }
  }

  handleAgents(teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId)
      }
    }
    if (agentIds.length > 0) {
      let notificationsData = {
        message: `Session of subscriber ${this.state.activeSession.firstName + ' ' + this.state.activeSession.lastName} has been assigned to your team.`,
        category: { type: 'chat_session', id: this.state.activeSession._id },
        agentIds: agentIds,
        companyId: this.state.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  fetchTeamAgents(id) {
    this.props.fetchTeamAgents(id, this.handleAgents)
  }

  handleSaveTags() {
    var subscriberId = this.state.activeSession._id
    this.props.getSubscriberTags(subscriberId)
  }

  unassignTags(payload, msg) {
    this.props.unassignTags(payload, this.handleSaveTags, msg)
  }

  assignTags(payload, msg) {
    this.props.assignTags(payload, this.handleSaveTags, msg)
  }

  showSearch() {
    this.setState({ showSearch: true })
  }

  hideSearch() {
    this.setState({ showSearch: false })
    this.props.clearSearchResult()
  }

  componentWillMount() {
    this.fetchSessions({ first_page: true, last_id: 'none', number_of_records: 10, filter: false, filter_criteria: { sort_value: -1, page_value: '', search_value: '' } })
    this.props.loadTags()
    this.props.loadCustomFields()
    if (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') {
      this.props.loadTeamsList()
      this.props.loadMembersList()
    }
  }

  componentDidMount() {
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

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps called', nextProps)
    if (nextProps.openSessions && nextProps.closeSessions) {
      this.setState({ loading: false })
      if (this.props.location.state && Object.keys(this.state.activeSession).length === 0 && this.state.activeSession.constructor === Object) {
        let newSessions = nextProps.openSessions.filter(session => session._id === this.props.location.state.id)
        let oldSessions = nextProps.closeSessions.filter(session => session._id === this.props.location.state.id)
        this.setState({ activeSession: newSessions.length > 0 ? newSessions[0] : oldSessions.length > 0 ? oldSessions[0] : '' })
        if (newSessions.length > 0 && newSessions[0].status === 'new') {
          this.setState({ tabValue: 'open' })
        } else if (oldSessions.length > 0 && oldSessions[0].status === 'resolved') {
          this.setState({ tabValue: 'closed' })
        }
      } else if (this.state.activeSession === '') {
        if (this.state.tabValue === 'open') {
          this.setState({ activeSession: nextProps.openSessions.length > 0 ? nextProps.openSessions[0] : '' })
        } else {
          this.setState({ activeSession: nextProps.closeSessions.length > 0 ? nextProps.closeSessions[0] : '' })
        }
      }
      if (!nextProps.subscriberTags) {
        if (nextProps.openSessions[0] && nextProps.openSessions[0]._id) {
          this.props.getSubscriberTags(nextProps.openSessions[0]._id)
        } else if (nextProps.closeSessions[0] && nextProps.closeSessions[0]._id) {
          this.props.getSubscriberTags(nextProps.closeSessions[0]._id)
        }
      }
      if (this.props.location.state && this.props.location.state.subscriberToRespond) {
        console.log('Subscriber To Respond', this.props.location.state.subscriberToRespond)
        var sessions = nextProps.openSessions
        var subscriber = this.props.location.state.subscriberToRespond
        for (let j = 0; j < sessions.length; j++) {
          if (sessions[j]._id === subscriber._id) {
            this.setState({ activeSession: sessions[j] })
            break
          }
        }
      }
      if (nextProps.userChat && this.props.userChat && nextProps.userChat.length > this.props.userChat.length) {
        var sess = this.props.openSessions
        for (var j = 0; j < sess.length; j++) {
          if (sess[j]._id === nextProps.userChat[0].subscriber_id) {
            sess[j] = {
              companyId: sess[j].companyId,
              last_activity_time: sess[j].last_activity_time,
              pageId: sess[j].pageId,
              request_time: sess[j].request_time,
              status: sess[j].status,
              subscriber_id: sess[j]._id,
              _id: sess[j]._id,
              lastPayload: nextProps.userChat[0].lastPayload,
              lastDateTime: nextProps.userChat[0].lastDateTime,
              lastRepliedBy: nextProps.userChat[0].lastRepliedBy
            }
          }
        }
      }
    }
    if (nextProps.tags) {
      var tagOptions = []
      for (var i = 0; i < nextProps.tags.length; i++) {
        tagOptions.push({ 'value': nextProps.tags[i]._id, 'label': nextProps.tags[i].tag })
      }
      this.setState({
        tagOptions: tagOptions
      })
    }
    if (nextProps.customFields && nextProps.customFieldValues ) {
      var fieldOptions = []
      for (let a = 0; a < nextProps.customFields.length; a++) {
        if (nextProps.customFieldValues.length > 0) {
          let assignedFields = nextProps.customFieldValues.map((cv) => cv.customFieldId._id)
          let index = assignedFields.indexOf(nextProps.customFields[a]._id)
          if (index !== -1) {
            fieldOptions.push({ '_id': nextProps.customFields[a]._id, 'label': nextProps.customFields[a].name, 'type': nextProps.customFields[a].type, 'value': nextProps.customFieldValues[index].value })
          } else {
            fieldOptions.push({ '_id': nextProps.customFields[a]._id, 'label': nextProps.customFields[a].name, 'type': nextProps.customFields[a].type, 'value': '' })
          }
        } else {
          fieldOptions.push({ '_id': nextProps.customFields[a]._id, 'label': nextProps.customFields[a].name, 'type': nextProps.customFields[a].type, 'value': '' })
        }
      }
      this.setState({
        customFieldOptions: fieldOptions
      })
    }
    if (nextProps.unreadSession && nextProps.openSessions.length > 0) {
      if (
        ((nextProps.socketData.action === 'agent_replied' && this.props.user._id !== nextProps.socketData.user_id) ||
        (!nextProps.socketData.action === 'agent_replied')) || (!nextProps.socketData.action)
      ) {
        var temp = nextProps.openSessions
        for (var z = 0; z < temp.length; z++) {
          if (temp[z]._id === nextProps.unreadSession) {
            if (nextProps.socketMessage && nextProps.socketMessage.format === 'facebook') {
              temp[z].pendingResponse = true
              temp[z].unreadCount = temp[z].unreadCount + 1
            }
          }
        }
        this.props.resetUnreadSession()
      }
    }
    if (nextProps.socketSession && nextProps.socketSession !== '') {
      if (
        ((nextProps.socketData.action === 'agent_replied' && this.props.user._id !== nextProps.socketData.user_id) ||
        (!nextProps.socketData.action === 'agent_replied')) || (!nextProps.socketData.action)
      ) {
        let sessionIds = nextProps.openSessions.map((s) => s._id)
        if (Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object && this.state.activeSession._id === nextProps.socketSession) {
          this.props.updateUserChat(nextProps.socketMessage)
          this.props.resetSocket()
        } else if (sessionIds.indexOf(nextProps.socketSession) === -1) {
          this.props.fetchSingleSession(nextProps.socketSession, { appendTo: 'open', deleteFrom: 'close' })
          this.props.resetSocket()
        } else {
          this.props.resetSocket()
        }
      }
    }
  }

  profilePicError(e, subscriber) {
    e.persist()
    console.log('profile picture error', subscriber)
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

  render() {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('State in live chat', this.state)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
      <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.loading
            ? <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
              className='align-center'>
              <center><Halogen.RingLoader color='#716aca' /></center>
            </div>
            : <div className='m-content'>
              <INFO module={CHATMODULE} />
              {
                this.props.subscribers && this.props.subscribers.length > 0
                  ? <div className='row'>
                    <SESSIONSAREA
                      profilePicError={this.profilePicError}
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
                          <div style={{ textAlign: 'center' }} className='m-portlet__body'>
                            <p>Please select a session to view its chat.</p>
                          </div>
                        </div>
                      </div>
                    }
                    {
                      Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object &&
                      <CHATAREA
                        scroll={this.state.scroll}
                        disableScroll={this.disableScroll}
                        showSearch={this.showSearch}
                        currentSession={this.state.activeSession}
                        changeActiveSessionFromChatbox={this.changeActiveSessionFromChatbox}
                        updatePendingSession={this.updatePendingSession}
                        removePending={this.removePending}
                      />
                    }
                    {
                      Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object && !this.state.showSearch &&
                      <PROFILEAREA
                        teams={this.props.teams ? this.props.teams : []}
                        agents={this.props.members ? this.getAgents(this.props.members) : []}
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
                        tagOptions={this.state.tagOptions}
                        members={this.props.members ? this.props.members : []}
                        customFields={this.props.customFields}
                        customFieldOptions={this.state.customFieldOptions}
                        setCustomFieldValue={this.saveCustomField}
                        msg={this.msg}
                      />
                    }
                    {
                      Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object && this.state.showSearch &&
                      <SEARCHAREA
                        currentSession={this.state.activeSession}
                        hideSearch={this.hideSearch}
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

function mapStateToProps(state) {
  console.log('props in live chat', state)
  return {
    openSessions: (state.liveChat.openSessions),
    openCount: (state.liveChat.openCount),
    closeCount: (state.liveChat.closeCount),
    closeSessions: (state.liveChat.closeSessions),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    socketSession: (state.liveChat.socketSession),
    socketData: (state.liveChat.socketData),
    unreadSession: (state.liveChat.unreadSession),
    tags: (state.tagsInfo.tags),
    teamUniqueAgents: (state.teamsInfo.teamUniqueAgents),
    teams: (state.teamsInfo.teams),
    subscriberTags: (state.tagsInfo.subscriberTags),
    socketMessage: (state.liveChat.socketMessage),
    subscribers: (state.subscribersInfo.subscribers),
    members: (state.membersInfo.members),
    customFieldValues: (state.customFieldInfo.customFieldSubscriber),
    customFields: (state.customFieldInfo.customFields)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updatePicture,
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
    loadTeamsList,
    clearSearchResult,
    fetchSingleSession,
    resetSocket,
    resetUnreadSession,
    updateUserChat,
    loadMembersList,
    getCustomFieldValue,
    loadCustomFields,
    setCustomFieldValue,
    updatePendingResponse
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
