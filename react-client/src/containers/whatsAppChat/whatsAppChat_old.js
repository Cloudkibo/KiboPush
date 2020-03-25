import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import { Link } from 'react-router-dom'
// actions
import {
  fetchOpenSessions,
  fetchCloseSessions,
  fetchChat,
  markRead,
  changeStatus,
  updatePendingResponse,
  unSubscribe,
  assignToAgent,
  sendNotifications,
  setCustomFieldValue,
  clearSearchResult,
  fetchTeamAgents,
  assignToTeam,
  resetSocket
} from '../../redux/actions/whatsAppChat.actions'
import AlertContainer from 'react-alert'
import INFO from '../../components/LiveChat/info.js'
import { RingLoader } from 'halogenium'
import { loadCustomFields, getCustomFieldValue } from '../../redux/actions/customFields.actions'
import { loadTeamsList } from '../../redux/actions/teams.actions'
import { loadMembersList } from '../../redux/actions/members.actions'
// Components
//import SESSIONSAREA from './sessionsArea.js'
import SESSIONSAREA from '../../components/LiveChat/sessionsArea.js'
import PROFILEAREA from '../../components/LiveChat/profileArea.js'
import CHATAREA from './chatArea.js'
import SEARCHAREA from './searchArea.js'
import { scroller } from 'react-scroll'

const CHATMODULE= 'WHATSAPP'

class LiveChat extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      activeSession: {},
      scroll: true,
      tagOptions: [],
      loading: false,
      status: 'Unresolved',
      customFieldOptions: {},
      showSearch: false,
      tabValue: 'open'
    }
    this.changeActiveSession = this.changeActiveSession.bind(this)
    this.fetchSessions = this.fetchSessions.bind(this)
    this.disableScroll = this.disableScroll.bind(this)
    this.updateUnreadCount = this.updateUnreadCount.bind(this)
    this.showSearch = this.showSearch.bind(this)
    this.hideSearch = this.hideSearch.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.resetActiveSession = this.resetActiveSession.bind(this)
    this.removePending = this.removePending.bind(this)
    this.resetSessions = this.resetSessions.bind(this)
    this.getAgents = this.getAgents.bind(this)
    this.handleResponse = this.handleResponse.bind(this)
    this.saveCustomField= this.saveCustomField.bind(this)
    this.updatePendingSession = this.updatePendingSession.bind(this)
    this.assignToAgent = this.assignToAgent.bind(this)
    this.assignToTeam = this.assignToTeam.bind(this)
    this.changeTab = this.changeTab.bind(this)
    this.fetchTeamAgents = this.fetchTeamAgents.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.scrollToMessage = this.scrollToMessage.bind(this)
    this.updateActiveSessionFromChatBox = this.updateActiveSessionFromChatBox.bind(this)
  }

  handleAgents(teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId)
      }
    }
  }

  scrollToMessage (messageId) {
    console.log('scrollToMessage called')
    // check if message exists
    let counter = 0
    for (let i = 0; i < this.props.chat.length; i++) {
      if (this.props.chat[i]._id === messageId) {
        counter = 1
        break
      }
    }

    if (counter === 1) {
      scroller.scrollTo(messageId, {delay: 8000, containerId: 'whatsappchat-container'})
    } else {
      this.props.fetchChat(this.state.activeSession._id, {page: 'next', number: 25, last_id: this.props.chat[0]._id}, messageId,this.scrollToMessage)
    }
  }

  fetchTeamAgents(id) {
    this.props.fetchTeamAgents(id, this.handleAgents)
  }

  changeTab (value) {
    if (value === 'open') {
      this.setState({tabValue: 'open'})
    } else {
      this.setState({tabValue: 'closed'})
    }
  }

  saveCustomField (data) {
    this.props.setCustomFieldValue(data, this.handleResponse)
  }

  assignToAgent (data) {
    let activeSession = this.state.activeSession
    activeSession.is_assigned = data.isAssigned
    this.setState({activeSession: activeSession})
    this.props.assignToAgent(data)
  }

  assignToTeam (data) {
    let activeSession = this.state.activeSession
    activeSession.is_assigned = data.isAssigned
    this.setState({activeSession: activeSession})
    this.props.assignToTeam(data)
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

  getAgents (members) {
    let agents = members.filter(m => !!m.userId).map(m => m.userId)
    return agents
  }

  UNSAFE_componentWillMount () {
    this.fetchSessions({first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter_criteria: {sort_value: -1, search_value: '', pendingResponse: false, unreadCount: false}
    })
    this.props.loadCustomFields()
    if (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') {
      this.props.loadMembersList()
      this.props.loadTeamsList()
    }
  }

  showSearch() {
    this.setState({ showSearch: true })
  }

  hideSearch() {
    this.setState({ showSearch: false })
    this.props.clearSearchResult()
  }

  resetSessions () {
    this.fetchSessions({first_page: true,
      last_id: 'none',
      number_of_records: 10,
      filter_criteria: {sort_value: -1, search_value: '', pendingResponse: false, unreadCount: false}
    })
    this.changeActiveSession(this.state.activeSession)
  }
  resetActiveSession () {
    this.setState({
      activeSession: {}
    })
    this.resetSessions()
  }

  changeStatus (e, status, id) {
    this.props.changeStatus({_id: id, status: status}, this.resetActiveSession)
  }
  disableScroll () {
    this.setState({scroll: false})
  }

  changeActiveSession (session) {
    console.log('in changeActiveSession', session)
    this.setState({activeSession: session, scroll: true})
    this.props.fetchChat(session._id, {page: 'first', number: 25}, null, this.scrollToMessage)
    this.props.markRead(session._id, this.props.sessions)
    this.props.getCustomFieldValue(session._id)
  }
  removePending (session, value) {
    this.props.updatePendingResponse({id: session._id, pendingResponse: value}, this.resetSessions)
    this.updatePendingSession(session, value)
  }
  updatePendingSession(session, value) {
    session.pendingResponse = value
    var temp = this.props.openSessions
    for (var i = 0; i < temp.length; i++) {
      if (temp[i]._id === session._id) {
        temp[i].pendingResponse = value
      }
    }
    var tempClose = this.props.closeSessions
    for (var j = 0; j < tempClose.length; j++) {
      if (tempClose[j]._id === session._id) {
        tempClose[j].pendingResponse = value
      }
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

  updateActiveSessionFromChatBox () {
    let activeSession = this.state.activeSession
    activeSession.pendingResponse = false
    this.setState({activeSession: activeSession})
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

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('in UNSAFE_componentWillReceiveProps of whatsAppChat', nextProps)

    if (nextProps.sessions && nextProps.sessions.length > 0 && Object.keys(this.state.activeSession).length === 0 && this.state.activeSession.constructor === Object) {
      this.setState({loading: false, activeSession: nextProps.sessions[0]})
    }
    if (nextProps.customFields && nextProps.customFieldValues) {
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
    if (nextProps.socketSession) {
      console.log('Socket Message', nextProps.socketSession)
      this.fetchSessions({first_page: true,
        last_id: 'none',
        number_of_records: 10,
        filter_criteria: {sort_value: -1, search_value: '', pendingResponse: false, unreadCount: false}})
        if (nextProps.socketSession && nextProps.socketSession.contactId === this.state.activeSession._id) {
          let activeSession = this.state.activeSession
          activeSession.pendingResponse = true
          activeSession.status = 'new'
          this.setState({activeSession: activeSession})
        }
      if (!(Object.keys(this.state.activeSession).length > 0) || this.state.activeSession.constructor !== Object) {
        nextProps.resetSocket()
      }
    }
  }

  updateUnreadCount () {
     console.log('out unread count mark', this.props.sessions)
     for (let a = 0; a < this.props.openSessions.length; a++) {
       let session = this.props.openSessions[a]
       if (session._id === this.state.activeSession._id) {
         delete session.unreadCount
         console.log('unread count mark', this.props.sessions)
         this.forceUpdate()
       }
     }
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('State in WhatsApp chat', this.state)
    return (
    <div className='m-grid__item m-grid__item--fluid m-wrapper'>
      <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.loading
            ? <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
              className='align-center'>
              <center><RingLoader color='#716aca' /></center>
            </div>
            : <div className='m-content'>
              <INFO module={CHATMODULE} />
              {
                (this.props.contacts && this.props.contacts.length > 0) /*|| (Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object)*/
                ? <div className='row'>
                  <SESSIONSAREA
                    openSessions={this.props.openSessions ? this.props.openSessions: []}
                    closeSessions={this.props.closeSessions ? this.props.closeSessions: []}
                    openCount={this.props.openCount ? this.props.openCount: 0}
                    closeCount={this.props.closeCount ? this.props.closeCount: 0}
                    pages={this.props.pages ? this.props.pages: []}
                    fetchSessions={this.fetchSessions}
                    user={this.props.user}
                    activeSession={this.state.activeSession}
                    changeActiveSession={this.changeActiveSession}
                    module={CHATMODULE}
                    tabValue={this.state.tabValue}
                    changeTab={this.changeTab}
                    fetchTeamAgents={this.fetchTeamAgents}
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
                      activeSession={this.state.activeSession}
                      fetchTeamAgents={this.fetchTeamAgents}
                      user={this.props.user}
                      sessions={this.props.sessions ? this.props.sessions: []}
                      disableScroll={this.disableScroll}
                      showSearch={this.showSearch}
                      changeStatus={this.changeStatus}
                      changeActiveSession={this.changeActiveSession}
                      updateUnreadCount={this.updateUnreadCount}
                      removePending={this.removePending}
                      scrollToMessage={this.scrollToMessage}
                      updateActiveSessionFromChatBox={this.updateActiveSessionFromChatBox}
                    />
                  }
                  {
                    Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object && !this.state.showSearch &&
                    <PROFILEAREA
                      teams={this.props.teams ? this.props.teams : []}
                      agents={this.props.members ? this.getAgents(this.props.members) : []}
                      activeSession={this.state.activeSession}
                      changeActiveSession={this.changeActiveSession}
                      unSubscribe={this.props.unSubscribe}
                      user={this.props.user}
                      fetchTeamAgents={this.fetchTeamAgents}
                      assignToTeam={this.assignToTeam}
                      assignToAgent={this.assignToAgent}
                      sendNotifications={this.props.sendNotifications}
                      members={this.props.members ? this.props.members : []}
                      customFields={this.props.customFields}
                      customFieldOptions={this.state.customFieldOptions}
                      setCustomFieldValue={this.saveCustomField}
                      subscriberTags={this.props.subscriberTags? this.props.subscriberTags: []}
                      msg={this.msg}
                      module={CHATMODULE}
                    />
                }
                {
                  Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object && this.state.showSearch &&
                  <SEARCHAREA
                    scrollToMessage = {this.scrollToMessage}
                    currentSession={this.state.activeSession}
                    hideSearch={this.hideSearch}
                    clearSearchResult={this.props.clearSearchResult}
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
    updateSessionTimeStamp: (state.whatsAppChatInfo.updateSessionTimeStamp),
    openSessions: (state.whatsAppChatInfo.openSessions),
    openCount: (state.whatsAppChatInfo.openCount),
    closeCount: (state.whatsAppChatInfo.closeCount),
    closeSessions: (state.whatsAppChatInfo.closeSessions),
    chat: (state.whatsAppChatInfo.chat),
    chatCount: (state.whatsAppChatInfo.chatCount),
    user: (state.basicInfo.user),
    contacts: (state.contactsInfo.contacts),
    members: (state.membersInfo.members),
    customFieldValues: (state.customFieldInfo.customFieldSubscriber),
    customFields: (state.customFieldInfo.customFields),
    socketSession: (state.whatsAppChatInfo.socketMessage),
    teamUniqueAgents: (state.teamsInfo.teamUniqueAgents),
    teams: (state.teamsInfo.teams)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchOpenSessions,
    fetchChat,
    markRead,
    fetchCloseSessions,
    changeStatus,
    updatePendingResponse,
    unSubscribe,
    assignToAgent,
    loadMembersList,
    getCustomFieldValue,
    loadCustomFields,
    setCustomFieldValue,
    sendNotifications,
    clearSearchResult,
    fetchTeamAgents,
    assignToTeam,
    loadTeamsList,
    resetSocket
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
