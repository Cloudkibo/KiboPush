export function handleSocketEvent (data, state, props, updateLiveChatInfo, user, clearSocketData) {
  console.log('live chat socket event came', data)
  switch (data.action) {
    case 'new_chat':
      handleIncomingMessage(data.payload, state, props, updateLiveChatInfo, clearSocketData)
      break
    case 'agent_replied':
      handleAgentReply(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'session_pending_response':
      handlePendingResponse(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    case 'unsubscribe':
      handleUnsubscribe(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
      break
    default:
  }
}

const handleIncomingMessage = (payload, state, props, updateLiveChatInfo, clearSocketData) => {
  let sessions = state.sessions
  let session = payload.subscriber
  let data = {}
  const index = sessions.findIndex((s) => s._id === payload.subscriber._id)
  console.log('handleIncomingMessage index', index)
  console.log('handleIncomingMessage state', state)
  console.log('handleIncomingMessage payload', payload)
  console.log('handleIncomingMessage props', props)
  if (state.activeSession._id === payload.subscriber._id) {
    let userChat = state.userChat
    userChat.push(payload.message)
    session = sessions.splice(index, 1)[0]
    session.unreadCount = session.unreadCount ? session.unreadCount + 1 : 1
    session.lastPayload = payload.message.payload
    session.last_activity_time = new Date()
    session.lastMessagedAt = new Date()
    session.pendingResponse = true
    if (state.tabValue === 'open') {
      sessions = [session, ...sessions]
    } else {
      session.status = 'new'
    }
    data = {
      userChat,
      chatCount: props.chatCount + 1,
      openSessions: state.tabValue === 'open' ? sessions : [session, ...props.openSessions],
      closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
      closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
    }
  } else if (index >= 0) {
    session = sessions.splice(index, 1)[0]
    session.unreadCount = session.unreadCount ? session.unreadCount + 1 : 1
    session.lastPayload = payload.message.payload
    session.last_activity_time = new Date()
    session.lastMessagedAt = new Date()
    session.pendingResponse = true
    session.status = 'new'
    if (state.tabValue === 'open') sessions = [session, ...sessions]
    data = {
      openSessions: state.tabValue === 'open' ? sessions : [session, ...props.openSessions],
      closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
      closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
    }
  } else if (index === -1 && state.tabValue === 'open') {
    let closeSessions = props.closeSessions
    let closeCount = props.closeCount
    let sessionIndex = closeSessions.findIndex((s) => s._id === session._id)
    if (sessionIndex > -1) {
      closeSessions.splice(sessionIndex, 1)
      closeCount -= 1
    }
    session.name = `${session.firstName} ${session.lastName}`
    session.lastPayload = payload.message.payload
    session.last_activity_time = new Date()
    session.lastMessagedAt = new Date()
    session.pendingResponse = true
    session.status = 'new'
    sessions = [session, ...sessions]
    data = {
      openSessions: sessions,
      openCount: props.openCount + 1,
      closeSessions,
      closeCount
    }
  }
  updateLiveChatInfo(data)
  clearSocketData()
}

const handleAgentReply = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
  if (user._id !== payload.user_id) {
    let data = {}
    let sessions = state.sessions
    let session = sessions.find((s) => s._id === payload.subscriber_id)
    const index = sessions.findIndex((s) => s._id === payload.subscriber_id)
    if (state.activeSession._id === payload.subscriber_id) {
      let userChat = state.userChat
      payload.message.format = 'convos'
      userChat.push(payload.message)
      session = sessions.splice(index, 1)[0]
      session.lastPayload = payload.message.payload
      session.last_activity_time = new Date()
      session.pendingResponse = false
      session.lastRepliedBy = payload.message.replied_by
      if (state.tabValue === 'open') sessions = [session, ...sessions]
      data = {
        userChat,
        chatCount: props.chatCount + 1,
        openSessions: state.tabValue === 'open' ? sessions : props.openSessions,
        closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
        closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
      }
    } else if (index >= 0) {
      session = sessions.splice(index, 1)[0]
      session.lastPayload = payload.message.payload
      session.last_activity_time = new Date()
      session.pendingResponse = false
      session.lastRepliedBy = payload.message.replied_by
      if (state.tabValue === 'open') sessions = [session, ...sessions]
      data = {
        openSessions: state.tabValue === 'open' ? sessions : props.openSessions,
        closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
        closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
      }
    }
    updateLiveChatInfo(data)
    clearSocketData()
  } else {
    clearSocketData()
  }
}

const handleUnsubscribe = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
  let data = {}
  let sessions = state.sessions
  const index = sessions.findIndex((s) => s._id === payload.subscriber_id)
  if (index >= 0) {
    sessions.splice(index, 1)
    data = {
      openSessions: state.tabValue === 'open' ? sessions : props.openSessions,
      openCount: state.tabValue === 'open' ? props.openCount - 1 : props.openCount,
      closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
      closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
    }
    updateLiveChatInfo(data)
  }
  clearSocketData()
}

const handlePendingResponse = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
  if (user._id !== payload.user_id) {
    let sessions = state.sessions
    const index = sessions.findIndex((s) => s._id === payload.session_id)
    sessions[index].pendingResponse = payload.pendingResponse
    const data = {
      openSessions: state.tabValue === 'open' ? sessions : props.openSessions,
      closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions
    }
    updateLiveChatInfo(data)
    clearSocketData()
  } else {
    clearSocketData()
  }
}
