import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { RingLoader } from 'halogenium'
import {
  getZoomIntegrations,
  createZoomMeeting,
  loadcannedResponses
} from '../../redux/actions/settings.actions'
import { setCompanyPreferences } from '../../redux/actions/settings.actions'
import { cloneDeep } from 'lodash'

// actions
import {
  fetchOpenSessions,
  fetchCloseSessions,
  fetchUserChats,
  fetchTeamAgents,
  changeStatus,
  unSubscribe,
  getCustomers,
  appendSubscriber,
  assignToTeam,
  assignToAgent,
  sendNotifications,
  updatePendingResponse,
  sendChatMessage,
  uploadAttachment,
  sendAttachment,
  uploadRecording,
  searchChat,
  markRead,
  updateLiveChatInfo,
  deletefile,
  clearSearchResult,
  getSMPStatus,
  updateSessionProfilePicture,
  setUserChat,
  saveNotificationSessionId,
  resetSocket,
  fetchSingleSession,
  updatePauseChatbot
} from '../../redux/actions/livechat.actions'
import { fetchChatbots } from '../../redux/actions/chatbotAutomation.actions'
import { updatePicture } from '../../redux/actions/subscribers.actions'
import { loadTeamsList } from '../../redux/actions/teams.actions'
import { loadMembersList } from '../../redux/actions/members.actions'
import { urlMetaData } from '../../redux/actions/convos.actions'
import {
  getSubscriberTags,
  unassignTags,
  createTag,
  assignTags,
  loadTags
} from '../../redux/actions/tags.actions'
import {
  setCustomFieldValue,
  loadCustomFields,
  getCustomFieldValue
} from '../../redux/actions/customFields.actions'
import { handleSocketEvent } from './socket'
import { clearSocketData } from '../../redux/actions/socket.actions'

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

class LiveChat extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: true,
      fetchingChat: false,
      loadingChat: true,
      sessionsLoading: false,
      loadingMoreSession: false,
      tabValue: 'open',
      numberOfRecords: 25,
      filterSort: -1,
      filterPage: '',
      filterSearch: '',
      filterPending: '',
      filterUnread: '',
      sessions: [],
      sessionsCount: 0,
      activeSession: {},
      teamAgents: [],
      userChat: [],
      showSearch: false,
      customFieldOptions: [],
      showingCustomFieldPopover: false,
      smpStatus: [],
      selected: [],
      showingBulkActions: false,
      allSelected: false,
      cannedResponses: [],
      showChat: !this.props.isMobile
    }

    this.fetchSessions = this.fetchSessions.bind(this)
    this.updateState = this.updateState.bind(this)
    this.changeActiveSession = this.changeActiveSession.bind(this)
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
    this.saveCustomField = this.saveCustomField.bind(this)
    this.handleCustomFieldResponse = this.handleCustomFieldResponse.bind(this)
    this.hideSearch = this.hideSearch.bind(this)
    this.loadActiveSession = this.loadActiveSession.bind(this)
    this.showFetchingChat = this.showFetchingChat.bind(this)
    this.clearSearchResults = this.clearSearchResults.bind(this)
    this.handleSMPStatus = this.handleSMPStatus.bind(this)
    this.isSMPApproved = this.isSMPApproved.bind(this)
    this.setMessageData = this.setMessageData.bind(this)
    this.markSessionsRead = this.markSessionsRead.bind(this)
    this.backToSessions = this.backToSessions.bind(this)
    this.updateMessageStatus = this.updateMessageStatus.bind(this)
    this.setActiveSession = this.setActiveSession.bind(this)
    this.checkParams = this.checkParams.bind(this)
    this.updateDefaultZoom = this.updateDefaultZoom.bind(this)

    this.props.loadcannedResponses()
    this.fetchSessions(true, 'none', true)
    props.getSMPStatus(this.handleSMPStatus)
    props.loadMembersList()
    props.loadTags()
    props.loadCustomFields()
    props.getZoomIntegrations()
    props.fetchChatbots()
    if (props.socketData) {
      props.clearSocketData()
    }
  }

  componentDidMount() {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Live Chat`
  }

  updateDefaultZoom (defaultZoom) {
    let companyPreferences = cloneDeep(this.props.companyPreferences)
    companyPreferences.defaultZoomConfiguration = defaultZoom
    this.props.setCompanyPreferences(companyPreferences)
  }

  checkParams(props, sessions) {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id &&
      this.state.activeSession.constructor === Object &&
      Object.keys(this.state.activeSession).length === 0
    ) {
      const params = this.props.match.params.id.split('-')
      if (params.length === 3) {
        const psid = params[2]
        const session = sessions.find((item) => item.senderId === psid)
        if (session) {
          this.changeActiveSession(session, null, false)
        } else {
          this.props.fetchSingleSession(psid, this.setActiveSession)
        }
      } else {
        this.props.history.push({
          pathname: '/liveChat'
        })
      }
    }
  }

  setActiveSession(res) {
    if (res.status === 'success') {
      const session = res.payload
      this.changeActiveSession(session, null, false)
    } else {
      window.history.replaceState(null, null, '/liveChat')
    }
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

  handleSMPStatus(res) {
    if (res.status === 'success') {
      this.setState({ smpStatus: res.payload })
    }
  }

  isSMPApproved() {
    const page = this.state.smpStatus.find(
      (item) => item.pageId === this.state.activeSession.pageId._id
    )
    if (page && page.smpStatus === 'approved') {
      return true
    } else {
      return false
    }
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
      let message = res.description
        ? res.description
        : value
        ? 'Failed to remove pending flag'
        : 'Failed to mark session as pending'
      console.log('message', message)
      this.alertMsg.error(message)
    }
  }

  handlePendingResponse(session, value) {
    this.props.updatePendingResponse({ id: session._id, pendingResponse: value }, (res) =>
      this.updatePendingStatus(res, value, session._id)
    )
  }

  setMessageData(session, payload) {
    const data = {
      _id: new Date().getTime(),
      sender_id: session.pageId._id,
      recipient_id: session._id,
      sender_fb_id: session.pageId.pageId,
      recipient_fb_id: session.senderId,
      subscriber_id: session._id,
      company_id: session.companyId,
      payload: payload,
      url_meta: this.state.urlmeta,
      datetime: new Date().toString(),
      status: 'unseen',
      seen: false,
      delivered: false,
      replied_by: {
        type: 'agent',
        id: this.props.user._id,
        name: this.props.user.name
      }
    }
    return data
  }

  handleAgents(teamAgents, type) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId._id !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId._id)
      }
    }
    if (agentIds.length > 0) {
      let message =
        type && type === 'assigned'
          ? `Session of subscriber ${
              this.state.activeSession.firstName + ' ' + this.state.activeSession.lastName
            } has been assigned to your team ${teamAgents[0].teamId.name}`
          : `Session of subscriber ${
              this.state.activeSession.firstName + ' ' + this.state.activeSession.lastName
            } has been unassigned from your team ${teamAgents[0].teamId.name}`
      let notificationsData = {
        message: message,
        category: { type: 'chat_session', id: this.state.activeSession._id },
        agentIds: agentIds,
        companyId: this.state.activeSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  fetchTeamAgents(id, type) {
    this.props.fetchTeamAgents(id, this.handleAgents, type)
  }

  showFetchingChat(fetchingChat) {
    this.setState({ fetchingChat })
  }

  changeTab(value) {
    this.setState({
      sessions: value === 'open' ? this.props.openSessions : this.props.closeSessions,
      sessionsCount: value === 'open' ? this.props.openCount : this.props.closeCount,
      tabValue: value,
      userChat: [],
      activeSession: {}
    })
  }

  getChatPreview(message, repliedBy, subscriberName) {
    let chatPreview = ''
    if (message.componentType) {
      // agent
      chatPreview = !repliedBy || repliedBy.id === this.props.user._id ? `You` : `${repliedBy.name}`
      if (message.componentType === 'text') {
        chatPreview = `${chatPreview}: ${message.text}`
      } else {
        chatPreview = `${chatPreview} shared ${message.componentType}`
      }
    } else {
      // subscriber
      chatPreview = `${subscriberName}`
      if (message.attachments) {
        if (
          message.attachments[0].type === 'template' &&
          message.attachments[0].payload.template_type === 'generic'
        ) {
          chatPreview =
            message.attachments[0].payload.elements.length > 1
              ? `${chatPreview} sent a gallery`
              : `${chatPreview} sent a card`
        } else if (
          message.attachments[0].type === 'template' &&
          message.attachments[0].payload.template_type === 'media'
        ) {
          chatPreview = `${chatPreview} sent a media`
        } else if (
          ['image', 'audio', 'location', 'video', 'file'].includes(message.attachments[0].type)
        ) {
          chatPreview = `${chatPreview} shared ${message.attachments[0].type}`
        } else {
          chatPreview = `${chatPreview}: ${message.text}`
        }
      } else {
        chatPreview = `${chatPreview}: ${message.text ? message.text : message.link}`
      }
    }
    return chatPreview
  }

  updateState(state, callback) {
    if (state.reducer) {
      const allChatMessages = this.props.allChatMessages
      allChatMessages[this.state.activeSession._id] = state.userChat
      const data = {
        userChat: state.userChat,
        allChatMessages,
        openSessions: this.state.tabValue === 'open' ? state.sessions : this.props.openSessions,
        closeSessions: this.state.tabValue === 'close' ? state.sessions : this.props.closeSessions
      }
      this.props.updateLiveChatInfo(data)
    } else {
      this.setState(state, () => {
        if (callback) callback()
      })
    }
  }

  handleStatusChange(session, status, res) {
    if (res.status === 'success') {
      console.log('in handleStatusChange', session)
      const message =
        status === 'resolved'
          ? 'Session has been marked as resolved successfully'
          : 'Session has been reopened successfully'
      this.setState({
        userChat: [],
        activeSession: session._id === this.state.activeSession._id ? {} : this.state.activeSession,
        showChat: !this.props.isMobile
      })
      this.alertMsg.success(message)
      let notificationMessage =
        status === 'resolved'
          ? `Session of subscriber ${
              session.firstName + ' ' + session.lastName
            } has been marked as resolved by ${this.props.user.name}`
          : `Session of subscriber ${
              session.firstName + ' ' + session.lastName
            } has been reopened by ${this.props.user.name}`
      if (!session.assigned_to || !session.is_assigned) {
        let notificationsData = {
          message: notificationMessage,
          category: { type: 'session_status', id: session._id },
          agentIds:
            this.props.members.length > 0
              ? this.props.members
                  .filter((a) => a.userId._id !== this.props.user._id)
                  .map((b) => b.userId._id)
              : [],
          companyId: session.companyId
        }
        this.props.sendNotifications(notificationsData)
      } else if (session.assigned_to && session.assigned_to.type === 'team') {
        // this.props.fetchTeamAgents(session.assigned_to.id, (teamAgents) => {
        let agentIds = []
        let teamAgents = this.state.teamAgents
        for (let i = 0; i < teamAgents.length; i++) {
          if (teamAgents[i].agentId._id !== this.props.user._id) {
            agentIds.push(teamAgents[i].agentId._id)
          }
        }
        if (agentIds.length > 0) {
          let notificationsData = {
            message: notificationMessage,
            category: { type: 'session_status', id: session._id },
            agentIds: agentIds,
            companyId: session.companyId
          }
          this.props.sendNotifications(notificationsData)
        }
        // })
      }
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
        // this.fetchTeamAgents(session._id, (teamAgents) => {
        const agentIds = this.state.teamAgents.map((agent) => agent.agentId._id)
        if (!agentIds.includes(this.props.user._id)) {
          isAllowed = false
          errorMsg = `Only agents who are part of assigned team can ${errorMsg}`
        }
        // })
      }
    }
    errorMsg = `You can not perform this action. ${errorMsg}`
    return { isAllowed, errorMsg }
  }

  changeStatus(status, session) {
    let errorMsg = status === 'resolved' ? 'mark this session as resolved' : 'reopen this session'
    const data = this.performAction(errorMsg, session)
    if (data.isAllowed) {
      this.props.changeStatus({ _id: session._id, status: status }, (res) =>
        this.handleStatusChange(session, status, res)
      )
    } else {
      this.alertMsg.error(data.errorMsg)
    }
  }

  profilePicError(e, subscriber) {
    e.persist()
    this.props.updatePicture({ subscriber }, (newProfilePic) => {
      if (newProfilePic) {
        this.props.updateSessionProfilePicture(subscriber, newProfilePic)
        // e.target.src = newProfilePic
      }
    })
  }

  saveCustomField(data) {
    this.props.setCustomFieldValue(data, this.handleCustomFieldResponse)
  }

  handleCustomFieldResponse(res, body) {
    if (res.status === 'success') {
      this.alertMsg.success('Value set successfully')
    } else {
      if (res.status === 'failed') {
        this.alertMsg.error(`Unable to set Custom field value. ${res.description}`)
      } else {
        let errorMsg = res.description || 'Unable to set Custom Field value'
        this.alertMsg.error(errorMsg)
      }
    }
  }

  changeActiveSession(session, e, updateRoute = true) {
    if (e && e.target.type === 'checkbox') {
      return
    }
    if (updateRoute) {
      const path = `/liveChat/${session.firstName}-${session.lastName}-${session.senderId}`
      window.history.replaceState(null, null, path)
    }
    if (session._id !== this.state.activeSession._id) {
      this.setState(
        {
          activeSession: session,
          customFieldOptions: [],
          userChat: [],
          subscriberTags: null,
          searchChatMsgs: null,
          loadingChat: true,
          showSearch: false,
          showChat: true
        },
        () => {
          this.loadActiveSession({ ...session })
        }
      )
    }
  }

  loadActiveSession(session) {
    console.log('loadActiveSession', session)
    if (session.unreadCount && session.unreadCount > 0) {
      session.unreadCount = 0
      this.props.markRead(session._id)
    }
    this.props.clearSearchResult()
    if (this.props.allChatMessages[session._id]) {
      this.props.setUserChat(session._id, session.messagesCount)
    } else {
      this.props.fetchUserChats(session._id, { page: 'first', number: 25 }, session.messagesCount)
    }
    this.props.getSubscriberTags(session._id, this.alertMsg)
    this.props.getCustomFieldValue(session._id)
    if (session.is_assigned && session.assigned_to.type === 'team') {
      this.props.fetchTeamAgents(session.assigned_to.id, this.handleTeamAgents)
    }
    if (
      this.props.user.currentPlan.unique_ID === 'plan_C' ||
      this.props.user.currentPlan.unique_ID === 'plan_D'
    ) {
      this.props.loadTeamsList({ pageId: session.pageId._id })
    }
    const sessions = this.state.sessions
    const index = sessions.findIndex((item) => item._id === session._id)
    sessions[index] = session
    this.setState({ activeSession: session, sessions })
  }

  markSessionsRead(selectedSessions) {
    let sessions = this.state.sessions
    for (let i = 0; i < selectedSessions.length; i++) {
      let session = selectedSessions[i]
      let sessionIndex = sessions.findIndex((s) => s._id === session._id)
      if (session.unreadCount > 0) {
        sessions[sessionIndex].unreadCount = 0
        this.props.markRead(session._id)
      }
    }
    this.setState({ sessions })
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
    if (firstPage) {
      let sessions = this.state.sessions
      for (let i = 0; i < sessions.length; i++) {
        sessions[i].selected = false
      }
      this.setState({
        sessions,
        allSelected: false,
        selected: [],
        showingBulkActions: false,
        loadingMoreSession: true
      })
    } else {
      this.setState({ allSelected: false, loadingMoreSession: true })
    }
  }

  getAgents(members) {
    let agents = members.filter((a) => !a.userId.disableMember).map((m) => m.userId)
    return agents
  }

  backToSessions() {
    this.setState({
      showChat: false,
      activeSession: {}
    })
  }

  updateMessageStatus(chatMessages, event) {
    if (event === 'seen') {
      var unseenChats = chatMessages.filter((chat) => !chat.seen)
      for (var i = 0; i < unseenChats.length; i++) {
        unseenChats[i].seen = true
        unseenChats[i].status = 'seen'
      }
    } else if (event === 'delivered') {
      var undeliveredChats = chatMessages.filter((chat) => !chat.delivered)
      undeliveredChats.map((undeliveredChat, i) => (undeliveredChat.delivered = true))
    }
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
      state.loadingMoreSession = false
      let sessions =
        this.state.tabValue === 'open' ? nextProps.openSessions : nextProps.closeSessions
      sessions = sessions || []
      let index = sessions.findIndex((session) => session._id === this.state.activeSession._id)
      if (index === -1) {
        state.activeSession = this.state.activeSession
        state.userChat = []
      } else {
        state.activeSession = sessions[index]
      }
      state.sessions = sessions
      state.sessionsCount =
        this.state.tabValue === 'open' ? nextProps.openCount : nextProps.closeCount
      this.checkParams(nextProps, sessions)
    }

    if (nextProps.redirectToSession && nextProps.redirectToSession.sessionId) {
      if (nextProps.openSessions && nextProps.closeSessions) {
        nextProps.saveNotificationSessionId({ sessionId: null })
        let openSessions = nextProps.openSessions
        let closeSessions = nextProps.closeSessions
        let openIndex = openSessions.findIndex(
          (session) => session._id === nextProps.redirectToSession.sessionId
        )
        let closeIndex = closeSessions.findIndex(
          (session) => session._id === nextProps.redirectToSession.sessionId
        )
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
          let assignedFields = nextProps.customFieldValues.customFields.map(
            (cv) => cv.customFieldId._id
          )
          let index = assignedFields.indexOf(nextProps.customFields[a]._id)
          if (index !== -1) {
            fieldOptions.push({
              default: nextProps.customFields[a].default,
              _id: nextProps.customFields[a]._id,
              label: nextProps.customFields[a].name,
              type: nextProps.customFields[a].type,
              value: nextProps.customFieldValues.customFields[index].value
            })
          } else {
            fieldOptions.push({
              default: nextProps.customFields[a].default,
              _id: nextProps.customFields[a]._id,
              label: nextProps.customFields[a].name,
              type: nextProps.customFields[a].type,
              value: ''
            })
          }
        } else {
          fieldOptions.push({
            default: nextProps.customFields[a].default,
            _id: nextProps.customFields[a]._id,
            label: nextProps.customFields[a].name,
            type: nextProps.customFields[a].type,
            value: ''
          })
        }
      }
      state.customFieldOptions = fieldOptions
    }

    if (nextProps.userChat) {
      if (
        nextProps.userChat.length > 0 &&
        nextProps.userChat[0].subscriber_id === this.state.activeSession._id
      ) {
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
      handleSocketEvent(
        nextProps.socketData,
        newState,
        nextProps,
        nextProps.updateLiveChatInfo,
        nextProps.user,
        nextProps.clearSocketData
      )
    }
    if (
      nextProps.socketMessageStatus &&
      nextProps.socketMessageStatus.sessionInfo &&
      this.state.activeSession
    ) {
      if (nextProps.socketMessageStatus.sessionInfo._id === this.state.activeSession._id) {
        this.updateMessageStatus(nextProps.userChat, nextProps.socketMessageStatus.event)
      } else {
        var chatMessages = this.props.allChatMessages[nextProps.socketMessageStatus.sessionInfo._id]
        if (chatMessages && chatMessages.length > 0) {
          this.updateMessageStatus(chatMessages, nextProps.socketMessageStatus.event)
        }
      }
      nextProps.resetSocket()
    }
  }

  render() {
    return (
      <div
        id='mainLiveChat'
        className='m-grid__item m-grid__item--fluid m-wrapper'
        style={{ marginBottom: 0, overflow: 'hidden' }}
      >
        <AlertContainer
          ref={(a) => {
            this.alertMsg = a
          }}
          {...alertOptions}
        />
        {this.state.loading ? (
          <div
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
            <center>
              <RingLoader color='#716aca' />
            </center>
          </div>
        ) : (
          <div style={{ padding: '10px 30px' }} className='m-content'>
            {this.state.fetchingChat && (
              <div
                style={{
                  width: '100vw',
                  height: '100vh',
                  background: 'rgba(33, 37, 41, 0.6)',
                  position: 'fixed',
                  zIndex: '99999',
                  top: '0',
                  left: '0'
                }}
              >
                <div
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
                  <center>
                    <RingLoader color='#716aca' />
                    Fetching chat...
                  </center>
                </div>
              </div>
            )}
            {!this.props.isMobile && (
              <HELPWIDGET
                documentation={{ visibility: true, link: 'http://kibopush.com/livechat/' }}
                videoTutorial={{ visibility: true, videoId: 'bLotpQLvsfE' }}
              />
            )}
            <div className='row'>
              {((this.props.isMobile && !this.state.showChat) || !this.props.isMobile) && (
                <SESSIONS
                  pages={this.props.pages}
                  loading={this.state.sessionsLoading}
                  loadingMoreSession={this.state.loadingMoreSession}
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
                  markSessionsRead={this.markSessionsRead}
                  superUser={this.props.superUser}
                  alertMsg={this.alertMsg}
                  selected={this.state.selected}
                  showingBulkActions={this.state.showingBulkActions}
                  showBulkActions={true}
                  allSelected={this.state.allSelected}
                />
              )}
              {this.state.showChat &&
                this.state.activeSession.constructor === Object &&
                Object.keys(this.state.activeSession).length > 0 && (
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
                    uploadAttachment={this.props.uploadAttachment}
                    sendAttachment={this.props.sendAttachment}
                    uploadRecording={this.props.uploadRecording}
                    loadingChat={this.state.loadingChat}
                    fetchUserChats={this.props.fetchUserChats}
                    markRead={this.props.markRead}
                    deletefile={this.props.deletefile}
                    fetchUrlMeta={this.props.urlMetaData}
                    isSMPApproved={this.isSMPApproved()}
                    showUploadAttachment={true}
                    showRecordAudio={true}
                    showSticker={true}
                    showEmoji={true}
                    showGif={true}
                    showThumbsUp={true}
                    showZoom={
                      this.props.user
                        ? this.props.zoomIntegrations.length === 0
                          ? this.props.user.role === 'admin' || this.props.user.role === 'buyer'
                            ? true
                            : false
                          : true
                        : false
                    }
                    setMessageData={this.setMessageData}
                    filesAccepted={'image/*, audio/*, video/*, application/*, text/*'}
                    showAgentName={this.props.showAgentName}
                    history={this.props.history}
                    zoomIntegrations={this.props.zoomIntegrations}
                    defaultZoom={this.props.companyPreferences ? this.props.companyPreferences.defaultZoomConfiguration : null }
                    createZoomMeeting={this.props.createZoomMeeting}
                    showSubscriberNameOnMessage={true}
                    isMobile={this.props.isMobile}
                    backToSessions={this.backToSessions}
                    showGetContactInfo={true}
                    updateDefaultZoom= {this.updateDefaultZoom}
                    connectedPageChatbot = { this.props.chatbots.find((chatbot) => { return chatbot.published && chatbot.pageId._id === this.state.activeSession.pageId._id}) ? true : false}
                  />
                )}
              {!this.props.isMobile &&
                this.state.activeSession.constructor === Object &&
                Object.keys(this.state.activeSession).length > 0 &&
                !this.state.showSearch && (
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
                    unSubscribe={this.props.unSubscribe}
                    customers={this.props.customers}
                    getCustomers={this.props.getCustomers}
                    fetchTeamAgents={this.fetchTeamAgents}
                    assignToTeam={this.props.assignToTeam}
                    appendSubscriber={this.props.appendSubscriber}
                    sendNotifications={this.props.sendNotifications}
                    assignToAgent={this.props.assignToAgent}
                    assignTags={this.props.assignTags}
                    unassignTags={this.props.unassignTags}
                    createTag={this.props.createTag}
                    customFieldOptions={this.state.customFieldOptions}
                    setCustomFieldValue={this.saveCustomField}
                    showTags={true}
                    showCustomFields={true}
                    showUnsubscribe={true}
                    pauseChatbot = {this.props.updatePauseChatbot}
                    chatbots = {this.props.chatbots}
                    connectedPageChatbot = { this.props.chatbots.find((chatbot) => { return chatbot.published && chatbot.pageId._id === this.state.activeSession.pageId._id}) ? true : false}
                    sessions = {this.state.sessions}
                  />
                )}
              {!this.props.isMobile &&
                Object.keys(this.state.activeSession).length > 0 &&
                this.state.activeSession.constructor === Object &&
                this.state.showSearch && (
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
                )}
              {!this.props.isMobile &&
                this.state.activeSession.constructor === Object &&
                Object.keys(this.state.activeSession).length === 0 && (
                  <div
                    style={{
                      border: '1px solid #F2F3F8',
                      marginBottom: '0px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    className='col-xl-8 m-portlet'
                  >
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <p>Please select a session to view its chat.</p>
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
  console.log('mapStateToProps in live chat', state)
  return {
    openSessions: state.liveChat.openSessions,
    openCount: state.liveChat.openCount,
    closeCount: state.liveChat.closeCount,
    closeSessions: state.liveChat.closeSessions,
    userChat: state.liveChat.userChat,
    allChatMessages: state.liveChat.allChatMessages,
    chatCount: state.liveChat.chatCount,
    pages: state.pagesInfo.pages,
    user: state.basicInfo.user,
    isMobile: state.basicInfo.isMobile,
    customers: state.liveChat.customers,
    members: state.membersInfo.members,
    teams: state.teamsInfo.teams,
    subscriberTags: state.tagsInfo.subscriberTags,
    tags: state.tagsInfo.tags,
    customFieldValues: state.customFieldInfo.customFieldSubscriber,
    customFields: state.customFieldInfo.customFields,
    searchChatMsgs: state.liveChat.searchChat,
    socketData: state.socketInfo.socketData,
    zoomIntegrations: state.settingsInfo.zoomIntegrations,
    cannedResponses: state.settingsInfo.cannedResponses,
    superUser: state.basicInfo.superUser,
    redirectToSession: state.liveChat.redirectToSession,
    socketMessageStatus: state.liveChat.socketMessageStatus,
    companyPreferences: (state.settingsInfo.companyPreferences),
    chatbots: (state.chatbotAutomationInfo.chatbots)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      unSubscribe,
      fetchOpenSessions,
      fetchCloseSessions,
      updatePicture,
      fetchTeamAgents,
      assignToTeam,
      changeStatus,
      getCustomers,
      appendSubscriber,
      loadTeamsList,
      sendNotifications,
      loadMembersList,
      assignToAgent,
      getSubscriberTags,
      loadTags,
      assignTags,
      createTag,
      unassignTags,
      updatePendingResponse,
      loadCustomFields,
      getCustomFieldValue,
      setCustomFieldValue,
      sendChatMessage,
      uploadAttachment,
      sendAttachment,
      uploadRecording,
      searchChat,
      fetchUserChats,
      markRead,
      clearSocketData,
      updateLiveChatInfo,
      deletefile,
      clearSearchResult,
      urlMetaData,
      getSMPStatus,
      updateSessionProfilePicture,
      getZoomIntegrations,
      createZoomMeeting,
      setUserChat,
      loadcannedResponses,
      saveNotificationSessionId,
      resetSocket,
      fetchSingleSession,
      setCompanyPreferences,
      updatePauseChatbot,
      fetchChatbots
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChat)
