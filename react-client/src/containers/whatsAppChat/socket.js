export function handleSocketEventWhatsapp (data, state, props, updateLiveChatInfo, user, clearSocketData) {
    console.log('whatsapp chat socket event came', data)
    switch (data.action) {
      case 'new_chat_whatsapp':
        handleIncomingMessage(data.payload, state, props, updateLiveChatInfo, clearSocketData)
        break
      case 'agent_replied_whatsapp':
        handleAgentReply(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
        break
      case 'session_pending_response_whatsapp':
        handlePendingResponse(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
        break
      case 'unsubscribe_whatsapp':
        handleUnsubscribe(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
        break
      case 'session_status_whatsapp':
        handleStatus(data.payload, state, props, updateLiveChatInfo, clearSocketData, user)
        break
      default:
    }
  }

  const handleIncomingMessage = (payload, state, props, updateLiveChatInfo, clearSocketData) => {
    let sessions = state.sessions
    let session = payload.subscriber
    session.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    session.firstName = payload.subscriber.name
    let data = {}
    const index = sessions.findIndex((s) => s._id === payload.subscriber._id)
    if (state.activeSession._id === payload.subscriber._id) {
      let userChat = state.userChat
      userChat.push(payload.message)
      session = sessions.splice(index, 1)[0]
      session.unreadCount = session.unreadCount ? session.unreadCount + 1 : 1
      session.lastPayload = payload.message.payload
      session.last_activity_time = new Date()
      session.lastMessagedAt = new Date()
      session.pendingResponse = true
      data = {
        userChat,
        chatCount: props.chatCount + 1,
        openSessions: state.tabValue === 'open' ? [session, ...sessions] : [session, ...props.openSessions],
        openCount: state.tabValue === 'close' ? props.openCount + 1 : props.openCount,
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
      data = {
        openSessions: state.tabValue === 'open' ? [session, ...sessions] : [session, ...props.openSessions],
        openCount: state.tabValue === 'close' ? props.openCount + 1 : props.openCount,
        closeSessions: state.tabValue === 'close' ? sessions : props.closeSessions,
        closeCount: state.tabValue === 'close' ? props.closeCount - 1 : props.closeCount
      }
    } else if (index === -1 && state.tabValue === 'open') {
      session.unreadCount = session.unreadCount ? session.unreadCount + 1 : 1
      session.lastPayload = payload.message.payload
      session.last_activity_time = new Date()
      session.lastMessagedAt = new Date()
      session.pendingResponse = true
      session.status = 'new'
      sessions = [session, ...sessions]
      data = {
        openSessions: sessions,
        openCount: props.openCount + 1
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
        session.lastRepliedBy = payload.message.repliedBy
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
        session.lastRepliedBy = payload.message.repliedBy
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
      let openSessions = props.openSessions
      let closeSessions = props.closeSessions
      const openIndex = props.openSessions.findIndex((s) => s._id === payload.session_id)
      const closeIndex = props.closeSessions.findIndex((s) => s._id === payload.session_id)
      if (openIndex > -1) {
        openSessions[openIndex].pendingResponse = payload.pendingResponse
      }
      if (closeIndex > -1) {
        closeSessions[closeIndex].pendingResponse = payload.pendingResponse
      }
      const data = {
        openSessions: openSessions,
        closeSessions: closeSessions
      }
      updateLiveChatInfo(data)
      clearSocketData()
    } else {
      clearSocketData()
    }
  }
  const handleStatus = (payload, state, props, updateLiveChatInfo, clearSocketData, user) => {
    let openCount = props.openCount
    let closeCount = props.closeCount
    let openSessions = props.openSessions
    let closeSessions = props.closeSessions
    let session = payload.session
    session.profilePic = 'https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg'
    session.firstName = payload.session.name
    let data = {}
    const openIndex = openSessions.findIndex((s) => s._id === session._id)
    const closeIndex = closeSessions.findIndex((s) => s._id === session._id)
    if (payload.status === 'new') {
      if (openIndex === -1) {
        openSessions = [session, ...openSessions]
        openCount = openCount + 1
      }
      if (closeIndex > -1) {
        closeSessions.splice(closeIndex, 1)
        closeCount = closeCount - 1
      }
    } else if (payload.status === 'resolved') {
      if (openIndex > -1) {
        openSessions.splice(openIndex, 1)
        openCount = openCount - 1
      }
      if (closeIndex === -1) {
        closeSessions = [session, ...closeSessions]
        closeCount = closeCount + 1
      }
    }

    openSessions = openSessions.sort(function (a, b) {
      return new Date(b.last_activity_time) - new Date(a.last_activity_time)
    })
    closeSessions = closeSessions.sort(function (a, b) {
      return new Date(b.last_activity_time) - new Date(a.last_activity_time)
    })

    data = {
      openSessions: openSessions,
      closeSessions: closeSessions,
      openCount: openCount,
      closeCount: closeCount
    }
    updateLiveChatInfo(data)
    clearSocketData()
  }
