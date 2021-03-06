import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { RingLoader } from 'halogenium'
import { getZoomIntegrations, createZoomMeeting, loadcannedResponses, getWhatsAppMessageTemplates } from '../../redux/actions/settings.actions'
import NEWMESSAGEBUTTON from './newMessageButton'
import MESSAGETEMPLATE from '../../components/WhatsApp/messageTemplate'
import MESSAGETEMPLATEMOBILE from '../../components/WhatsApp/messageTemplateMobile'

// actions
import {
  searchChat,
  updateWhatsappChatInfo,
  sendChatMessage,
  fetchOpenSessions,
  fetchCloseSessions,
  fetchUserChats,
  markRead,
  changeStatus,
  updatePendingResponse,
  assignToAgent,
  sendNotifications,
  clearSearchResult,
  fetchTeamAgents,
  assignToTeam,
  uploadAttachment,
  sendAttachment,
  deletefile,
  createNewContact,
  updatePauseChatbot
} from '../../redux/actions/whatsAppChat.actions'
import { saveNotificationSessionId } from '../../redux/actions/livechat.actions'
import { updatePicture } from '../../redux/actions/subscribers.actions'
import { loadTeamsList } from '../../redux/actions/teams.actions'
import { loadMembersList } from '../../redux/actions/members.actions'
import { urlMetaData, uploadFile } from '../../redux/actions/convos.actions'
import { handleSocketEventWhatsapp } from './socket'
import { clearSocketDataWhatsapp } from '../../redux/actions/socket.actions'
import { editSubscriberWhatsApp } from '../../redux/actions/uploadContacts.actions'
import { setCompanyPreferences } from '../../redux/actions/settings.actions'

import { cloneDeep } from 'lodash'

// components
import HELPWIDGET from '../../components/extras/helpWidget'
import { SESSIONS, PROFILE, CHAT, SEARCHAREA } from '../../components/LiveChat'


const alertOptions = {
  offset: 14,
  position: 'top right',
  theme: 'dark',
  time: 5000,
  transition: 'scale'
}

class WhatsAppChat extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: true,
      fetchingChat: false,
      loadingChat: true,
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
      userChat: [],
      showSearch: false,
      customFieldOptions: [],
      showingCustomFieldPopover: false,
      sendingToNewNumber: false,
      cannedResponses: [],
      showChat: !this.props.isMobile,
      showMessageTemplateMobile: false
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
    this.changeTab = this.changeTab.bind(this)
    this.getChatPreview = this.getChatPreview.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.fetchTeamAgents = this.fetchTeamAgents.bind(this)
    this.getAgents = this.getAgents.bind(this)
    this.handlePendingResponse = this.handlePendingResponse.bind(this)
    this.updatePendingStatus = this.updatePendingStatus.bind(this)
    this.showSearch = this.showSearch.bind(this)
    this.handleCustomFieldResponse = this.handleCustomFieldResponse.bind(this)
    this.hideSearch = this.hideSearch.bind(this)
    this.loadActiveSession = this.loadActiveSession.bind(this)
    this.showFetchingChat = this.showFetchingChat.bind(this)
    this.clearSearchResults = this.clearSearchResults.bind(this)
    this.setMessageData = this.setMessageData.bind(this)
    this.sendingToNewNumber = this.sendingToNewNumber.bind(this)
    this.backToSessions = this.backToSessions.bind(this)
    this.showMessageTemplateMobile = this.showMessageTemplateMobile.bind(this)
    this.updateDefaultZoom = this.updateDefaultZoom.bind(this)

    this.props.loadcannedResponses()
    this.fetchSessions(true, 'none', true)
    props.loadMembersList()
    props.getZoomIntegrations()
    if (props.socketData) {
      props.clearSocketDataWhatsapp()
    }
    props.getWhatsAppMessageTemplates()
  }


  updateDefaultZoom (defaultZoom) {
    let companyPreferences = cloneDeep(this.props.companyPreferences)
    companyPreferences.defaultZoomConfiguration = defaultZoom
    this.props.setCompanyPreferences(companyPreferences)
  }

  sendingToNewNumber(sendingToNewNumber) {
    this.setState({ sendingToNewNumber })
  }

  clearSearchResults() {
    this.setState({ searchChatMsgs: null })
  }

  hideSearch() {
    this.setState({ showSearch: false, searchChatMsgs: null })
  }

  showSearch() {
    this.setState({ showSearch: !this.state.showSearch })
  }

  updatePendingStatus(res, value, sessionId) {
    if (res.status === 'success') {
      let sessions = this.state.sessions
      let activeSession = this.state.activeSession
      let index = sessions.findIndex((session) => session._id === sessionId)
      sessions[index].pendingResponse = value
      activeSession.pendingResponse = value
      this.setState({ sessions, activeSession })
    } else {
      const message = res.description ? res.description : value ? 'Failed to remove pending flag' : 'Failed to mark session as pending'
      this.alertMsg.error(message)
    }
  }

  handlePendingResponse(session, value) {
    this.props.updatePendingResponse(
      { id: session._id, pendingResponse: value },
      (res) => this.updatePendingStatus(res, value, session._id)
    )
  }

  handleAgents(teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId && teamAgents[i].agentId._id !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId._id)
      }
    }
    if (agentIds.length > 0) {
      let {firstName, lastName} = this.state.activeSession
      lastName = lastName ? ` ${lastName}` : ''
      let name = `${firstName}${lastName}`
      let notificationsData = {
        message: `Session of subscriber ${name} has been assigned to your team.`,
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

  showFetchingChat(fetchingChat) {
    this.setState({ fetchingChat })
  }

  changeTab(value) {
    this.setState({
      tabValue: value,
      sessions: value === 'open' ? this.props.openSessions : this.props.closeSessions,
      sessionsCount: value === 'open' ? this.props.openCount : this.props.closeCount,
      userChat: [],
      activeSession: {}
    })
  }

  getChatPreview(message, repliedBy, subscriberName) {
    let chatPreview = ''
    if (message.format === 'whatsApp') {
      // subscriber
      chatPreview = `${subscriberName}`
      if (message.componentType !== 'text') {
        chatPreview = `${chatPreview} shared ${message.componentType}`
      } else {
        chatPreview = `${chatPreview}: ${message.text}`
      }
    } else {
      // agent
      chatPreview = (!repliedBy || (repliedBy.id === this.props.user._id)) ? `You` : `${repliedBy.name}`
      if (message.componentType === 'text') {
        chatPreview = `${chatPreview}: ${message.text}`
      } else {
        chatPreview = `${chatPreview} shared ${message.componentType}`
      }
    }
    return chatPreview
  }

  updateState(state, callback) {
    if (state.reducer) {
      const data = {
        chat: state.userChat,
        openSessions: this.state.tabValue === 'open' ? state.sessions : this.props.openSessions,
        closeSessions: this.state.tabValue === 'close' ? state.sessions : this.props.closeSessions
      }
      this.props.updateWhatsappChatInfo(data)
    } else {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  handleStatusChange(session, status, res) {
    if (res.status === 'success') {
      const message = (status === 'resolved') ? 'Session has been marked as resoleved successfully' : 'Session has been reopened successfully'
      this.setState({
        userChat: [],
        activeSession: (session._id === this.state.activeSession._id) ? {} : this.state.activeSession
      })
      this.alertMsg.success(message)
    } else {
      let errorMsg = res.description || res.payload
      this.alertMsg.error(errorMsg)
    }
  }

  handleTeamAgents(agents) {
    this.setState({ teamAgents: agents })
  }

  performAction(errorMsg, session) {
    let isAllowed = true
    if (session.is_assigned) {
      if (session.assigned_to.type === 'agent' && session.assigned_to.id !== this.props.user._id) {
        isAllowed = false
        errorMsg = `Only assigned agent can ${errorMsg}`
      } else if (session.assigned_to.type === 'team') {
        this.fetchTeamAgents(session._id, (teamAgents) => {
          const agentIds = teamAgents.map((agent) => agent.agentId._id)
          if (!agentIds.includes(this.props.user._id)) {
            isAllowed = false
            errorMsg = `Only agents who are part of assigned team can ${errorMsg}`
          }
        })
      }
    }
    errorMsg = `You can not perform this action. ${errorMsg}`
    return { isAllowed, errorMsg }
  }

  changeStatus(status, session) {
    let errorMsg = (status === 'resolved') ? 'mark this session as resolved' : 'reopen this session'
    const data = this.performAction(errorMsg, session)
    if (data.isAllowed) {
      this.props.changeStatus({ _id: session._id, status: status }, (res) => this.handleStatusChange(session, status, res))
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

  setDefaultPicture(e, subscriber) {
    if (subscriber.gender === 'female') {
      e.target.src = 'https://i.pinimg.com/236x/50/28/b5/5028b59b7c35b9ea1d12496c0cfe9e4d.jpg'
    } else {
      e.target.src = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    }
  }

  handleCustomFieldResponse(res, body) {
    console.log("res", res)
    if (res.status === 'success') {
      this.alertMsg.success('Value set successfully')
    } else {
      if (res.status === 'failed') {
        this.alertMsg.error(`Unable to set Custom field value. ${res.description}`)
      } else {
        this.alertMsg.error('Unable to set Custom Field value')
      }
    }
  }

  setMessageData(session, payload, urlMeta) {
    const data = {
      _id : new Date().getTime(),
      senderNumber: this.props.automated_options.whatsApp.number,
      recipientNumber: this.state.activeSession.number,
      contactId: session._id,
      payload,
      datetime: new Date().toString(),
      repliedBy: {
        id: this.props.user._id,
        name: this.props.user.name,
        type: 'agent'
      },
      url_meta: urlMeta
    }
    return data
  }

  changeActiveSession(session, e, callback) {
    console.log('changeActiveSession', session)
    if (session._id !== this.state.activeSession._id) {
      session.firstName = session.name
      this.setState({
        activeSession: session,
        customFieldOptions: [],
        userChat: [],
        subscriberTags: null,
        searchChatMsgs: null,
        loadingChat: true,
        showSearch: false,
        showChat: true
      }, () => {
        if (callback) {
          callback()
        }
        this.loadActiveSession({ ...session })
      })
    } else {
      if (callback) {
        callback()
      }
    }
  }

  loadActiveSession(session) {
    console.log('loadActiveSession', session)
    if (session.unreadCount && session.unreadCount > 0) {
      session.unreadCount = 0
      this.props.markRead(session._id)
    }
    this.props.clearSearchResult()
    this.props.fetchUserChats(session._id, { page: 'first', number: 25 })
    if (session.is_assigned && session.assigned_to.type === 'team') {
      this.props.fetchTeamAgents(session.assigned_to.id, this.handleTeamAgents)
    }
    if (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') {
      this.props.loadTeamsList({ platform: 'whatsapp' })
    }
    this.setState({ activeSession: session })
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

  getAgents(members) {
    let agents = members.map(m => m.userId)
    return agents
  }

  backToSessions () {
    this.setState({
      showChat: false,
      showMessageTemplateMobile: false,
      activeSession: {}
    })
  }

  showMessageTemplateMobile () {
    this.setState({showMessageTemplateMobile: true}, () => {
      this.sendingToNewNumber(true)
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillMount called in live chat', nextProps)
    let state = {}
    if (nextProps.cannedResponses !== this.props.cannedResponses) {
      this.setState({ cannedResponses: nextProps.cannedResponses })
    }
    if (nextProps.openSessions || nextProps.closeSessions) {
      state.loading = false
      state.sessionsLoading = false
      let sessions = this.state.tabValue === 'open' ? nextProps.openSessions : nextProps.closeSessions
      sessions = sessions || []
      let index = sessions.findIndex((session) => session._id === this.state.activeSession._id)
      if (index === -1) {
        state.activeSession = {}
        state.userChat = []
      } else {
        state.activeSession = sessions[index]
      }
      state.sessions = sessions
      state.sessionsCount = this.state.tabValue === 'open' ? nextProps.openCount : nextProps.closeCount
    }

    if (nextProps.redirectToSession && nextProps.redirectToSession.sessionId) {
      if (nextProps.openSessions && nextProps.closeSessions) {
        nextProps.saveNotificationSessionId({sessionId: null})
        let openSessions = nextProps.openSessions
        let closeSessions =nextProps.closeSessions
        let openIndex = openSessions.findIndex((session) => session._id === nextProps.redirectToSession.sessionId)
        let closeIndex = closeSessions.findIndex((session) => session._id === nextProps.redirectToSession.sessionId)
        if (openIndex !== -1) {
          state.activeSession = openSessions[openIndex]
          this.changeActiveSession(openSessions[openIndex])
          this.changeTab('open')
        } else if (closeIndex !== -1) {
          state.activeSession = closeSessions[closeIndex]
          this.changeActiveSession(closeSessions[closeIndex])
          this.changeTab('close')
        } else {
          state.activeSession = {}
        }
      }
    }

    if (nextProps.customFields && nextProps.customFieldValues) {
      let fieldOptions = []
      for (let a = 0; a < nextProps.customFields.length; a++) {
        if (nextProps.customFieldValues.customFields.length > 0) {
          let assignedFields = nextProps.customFieldValues.customFields.map((cv) => cv.customFieldId._id)
          let index = assignedFields.indexOf(nextProps.customFields[a]._id)
          if (index !== -1) {
            fieldOptions.push({ 'default': nextProps.customFields[a].default, '_id': nextProps.customFields[a]._id, 'label': nextProps.customFields[a].name, 'type': nextProps.customFields[a].type, 'value': nextProps.customFieldValues.customFields[index].value })
          } else {
            fieldOptions.push({ 'default': nextProps.customFields[a].default, '_id': nextProps.customFields[a]._id, 'label': nextProps.customFields[a].name, 'type': nextProps.customFields[a].type, 'value': '' })
          }
        } else {
          fieldOptions.push({ 'default': nextProps.customFields[a].default, '_id': nextProps.customFields[a]._id, 'label': nextProps.customFields[a].name, 'type': nextProps.customFields[a].type, 'value': '' })
        }
      }
      state.customFieldOptions = fieldOptions
    }

    if (nextProps.userChat) {
      if (nextProps.userChat.length > 0 && nextProps.userChat[0].contactId === this.state.activeSession._id) {
        state.userChat = nextProps.userChat
        state.loadingChat = false
      } else if (nextProps.userChat.length === 0) {
        state.loadingChat = false
      }
    }

    this.setState({
      ...state,
      tags: nextProps.tags,
      searchChatMsgs: nextProps.searchChatMsgs,
      subscriberTags: nextProps.subscriberTags
    })

    let newState = Object.assign(this.state, state)

    if (nextProps.socketData) {
      handleSocketEventWhatsapp(
        nextProps.socketData,
        newState,
        nextProps,
        nextProps.updateWhatsappChatInfo,
        nextProps.user,
        nextProps.clearSocketDataWhatsapp
      )
    }
  }

  render() {
    console.log('render in live chat')
    return (
      <div id='mainLiveChat' className='m-grid__item m-grid__item--fluid m-wrapper' style={{ marginBottom: 0, overflow: 'hidden' }}>
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
            : <div style={{ padding: '10px 30px' }} className='m-content'>
              {
                this.state.fetchingChat &&
                <div style={{ width: '100vw', height: '100vh', background: 'rgba(33, 37, 41, 0.6)', position: 'fixed', zIndex: '99999', top: '0', left: '0' }}>
                  <div style={{ position: 'fixed', top: '50%', left: '50%', width: '30em', height: '18em', marginLeft: '-10em' }}
                    className='align-center'>
                    <center><RingLoader color='#716aca' />Fetching chat...</center>
                  </div>
                </div>
              }
              {
                !this.props.isMobile &&
                <HELPWIDGET
                  documentation={{ visibility: true, link: 'https://kibopush.com/livechat-whatsapp/' }}
                  videoTutorial={{ visibility: true, videoId: 'I3rS_AXT7tw' }}
                />
              }
              <div style={{marginTop: this.props.isMobile ? '20px' : '0px'}} className='row'>
                {
                  ((this.props.isMobile && (!this.state.showChat && !this.state.showMessageTemplateMobile)) || !this.props.isMobile) &&
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
                    changeTab={this.changeTab}
                    updateState={this.updateState}
                    fetchSessions={this.fetchSessions}
                    getChatPreview={this.getChatPreview}
                    showPageInfo={false}
                  />
                }
                {
                  this.state.showChat && this.state.activeSession.constructor === Object && Object.keys(this.state.activeSession).length > 0 &&
                  <CHAT
                    cannedResponses={this.state.cannedResponses}
                    userChat={this.state.userChat}
                    chatCount={this.props.chatCount}
                    sessions={this.state.sessions}
                    activeSession={this.state.activeSession}
                    changeStatus={this.changeStatus}
                    updateState={this.updateState}
                    getChatPreview={this.getChatPreview}
                    handlePendingResponse={this.handlePendingResponse}
                    showSearch={this.showSearch}
                    performAction={this.performAction}
                    alertMsg={this.alertMsg}
                    user={this.props.user}
                    sendChatMessage={this.props.sendChatMessage}
                    loadingChat={this.state.loadingChat}
                    fetchUserChats={this.props.fetchUserChats}
                    markRead={this.props.markRead}
                    fetchUrlMeta={this.props.urlMetaData}
                    isSMPApproved={false}
                    showUploadAttachment={true}
                    showRecordAudio={false}
                    showSticker={true}
                    showEmoji={true}
                    showGif={false}
                    showThumbsUp={false}
                    setMessageData={this.setMessageData}
                    uploadAttachment={this.props.uploadAttachment}
                    sendAttachment={this.props.sendAttachment}
                    deletefile={this.props.deletefile}
                    showTemplates={true}
                    filesAccepted={'image/*, audio/*, video/mp4, application/pdf'}
                    showZoom={this.props.user.isSuperUser ? (this.props.zoomIntegrations.length === 0 ? (this.props.user.role === 'admin' || this.props.user.role === 'buyer') ? true : false : true) : false}
                    history={this.props.history}
                    zoomIntegrations={this.props.zoomIntegrations}
                    defaultZoom={this.props.companyPreferences ? this.props.companyPreferences.defaultZoomConfiguration : null }
                    createZoomMeeting={this.props.createZoomMeeting}
                    showCaption={true}
                    showSubscriberNameOnMessage={false}
                    whatsAppMessageTemplates={this.props.whatsAppMessageTemplates}
                    isMobile={this.props.isMobile}
                    backToSessions={this.backToSessions}
                    updateDefaultZoom= {this.updateDefaultZoom}
                    uploadFile={this.props.uploadFile}
                  />
                }
                {
                  !this.props.isMobile && this.state.activeSession.constructor === Object && Object.keys(this.state.activeSession).length > 0 && !this.state.showSearch &&
                  <PROFILE
                    updateState={this.updateState}
                    teams={this.props.teams ? this.props.teams : []}
                    tags={this.state.tags ? this.state.tags : []}
                    agents={this.props.members ? this.getAgents(this.props.members) : []}
                    subscriberTags={this.state.subscriberTags}
                    activeSession={this.state.activeSession}
                    user={this.props.user}
                    profilePicError={this.profilePicError}
                    alertMsg={this.alertMsg}
                    customers={this.props.customers}
                    fetchTeamAgents={this.fetchTeamAgents}
                    assignToTeam={this.props.assignToTeam}
                    sendNotifications={this.props.sendNotifications}
                    assignToAgent={this.props.assignToAgent}
                    customFieldOptions={this.state.customFieldOptions}
                    showTags={false}
                    showCustomFields={false}
                    showUnsubscribe={false}
                    editSubscriberWhatsApp={this.props.editSubscriberWhatsApp}
                    connectedPageChatbot = {this.props.automated_options.whatsApp && this.props.automated_options.whatsApp.activeWhatsappBot && this.props.automated_options.whatsApp.activeWhatsappBot !== ''}
                    pauseChatbot = {this.props.updatePauseChatbot}
                    sessions = {this.props.sessions}
                  />
                }
                {
                  !this.props.isMobile && Object.keys(this.state.activeSession).length > 0 && this.state.activeSession.constructor === Object && this.state.showSearch &&
                  <SEARCHAREA
                    clearSearchResults={this.clearSearchResults}
                    activeSession={this.state.activeSession}
                    hideSearch={this.hideSearch}
                    searchChatMsgs={this.state.searchChatMsgs}
                    userChat={this.state.userChat}
                    searchChat={this.props.searchChat}
                    fetchUserChats={this.props.fetchUserChats}
                    showFetchingChat={this.showFetchingChat}
                  />
                }
                {
                  !this.props.isMobile && this.state.activeSession.constructor === Object && Object.keys(this.state.activeSession).length === 0 &&
                  <div style={{
                    border: '1px solid #F2F3F8',
                    marginBottom: '0px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }} className='col-xl-8 m-portlet'>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <p>Please select a session to view its chat.</p>
                    </div>
                  </div>
                }
                {
                  this.props.isMobile && this.state.showMessageTemplateMobile &&
                  <MESSAGETEMPLATEMOBILE
                    sendChatMessage={this.props.sendChatMessage}
                    setMessageData={this.setMessageData}
                    activeSession={this.state.activeSession}
                    updateState={this.updateState}
                    userChat={this.state.userChat}
                    sessions={this.state.sessions}
                    alertMsg={this.alertMsg}
                    id='messageTemplateNewNumber'
                    sendingToNewNumber={this.state.sendingToNewNumber}
                    heading={'Send Message Template'}
                    createNewContact={this.props.createNewContact}
                    changeActiveSession={this.changeActiveSession}
                    templates={this.props.whatsAppMessageTemplates}
                    backToSessions={this.backToSessions}
                  />
                }
              </div>
            </div>
        }
        {
          !this.props.isMobile &&
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id='messageTemplateNewNumber' tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <MESSAGETEMPLATE
                sendChatMessage={this.props.sendChatMessage}
                setMessageData={this.setMessageData}
                activeSession={this.state.activeSession}
                updateState={this.updateState}
                userChat={this.state.userChat}
                sessions={this.state.sessions}
                alertMsg={this.alertMsg}
                id='messageTemplateNewNumber'
                sendingToNewNumber={this.state.sendingToNewNumber}
                heading={'Send Message Template to WhatsApp Number'}
                createNewContact={this.props.createNewContact}
                changeActiveSession={this.changeActiveSession}
                templates={this.props.whatsAppMessageTemplates}
                uploadFile={this.props.uploadFile}
              />
            </div>
          </div>
        }
        {
          !this.props.isMobile &&
          <NEWMESSAGEBUTTON
            dataToggle='modal'
            dataTarget='#messageTemplateNewNumber'
            onClick={() => this.sendingToNewNumber(true)}
          />
        }
        {
          this.props.isMobile && (!this.state.showChat && !this.state.showMessageTemplateMobile) &&
          <NEWMESSAGEBUTTON
            onClick={this.showMessageTemplateMobile}
          />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('mapStateToProps in whatsapp chat', state)
  return {
    openSessions: (state.whatsAppChatInfo.openSessions),
    openCount: (state.whatsAppChatInfo.openCount),
    closeCount: (state.whatsAppChatInfo.closeCount),
    closeSessions: (state.whatsAppChatInfo.closeSessions),
    userChat: (state.whatsAppChatInfo.chat),
    chatCount: (state.whatsAppChatInfo.chatCount),
    user: (state.basicInfo.user),
    isMobile: (state.basicInfo.isMobile),
    members: (state.membersInfo.members),
    teams: (state.teamsInfo.teams),
    searchChatMsgs: (state.whatsAppChatInfo.searchChat),
    socketData: (state.socketInfo.socketDataWhatsapp),
    automated_options: (state.basicInfo.automated_options),
    zoomIntegrations: (state.settingsInfo.zoomIntegrations),
    cannedResponses: (state.settingsInfo.cannedResponses),
    whatsAppMessageTemplates: (state.settingsInfo.whatsAppMessageTemplates),
    redirectToSession: state.liveChat.redirectToSession,
    companyPreferences: (state.settingsInfo.companyPreferences)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    
    fetchOpenSessions,
    fetchCloseSessions,
    updatePicture,
    fetchTeamAgents,
    assignToTeam,
    changeStatus,
    loadTeamsList,
    sendNotifications,
    loadMembersList,
    assignToAgent,
    updatePendingResponse,
    sendChatMessage,
    searchChat,
    fetchUserChats,
    markRead,
    updateWhatsappChatInfo,
    clearSocketDataWhatsapp,
    clearSearchResult,
    urlMetaData,
    uploadAttachment,
    sendAttachment,
    deletefile,
    getZoomIntegrations,
    createZoomMeeting,
    createNewContact,
    editSubscriberWhatsApp,
    loadcannedResponses,
    getWhatsAppMessageTemplates,
    saveNotificationSessionId,
    setCompanyPreferences,
    uploadFile,
    updatePauseChatbot
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppChat)
