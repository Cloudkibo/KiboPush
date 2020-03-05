export function handleSocketEvent (data, state, props, updateLiveChatInfo, user, clearSocketData) {
  console.log('live chat socket event came', data)
  switch (data.action) {
    case 'new_chat':
      handleIncomingMessage(data.payload, state, props, updateLiveChatInfo, clearSocketData)
      break;
    default:
  }
}

const handleIncomingMessage = (payload, state, props, updateLiveChatInfo, clearSocketData) => {
  let sessions = state.sessions
  let session = payload.subscriber
  let data = {}
  const index = sessions.findIndex((s) => s._id === payload.subscriber._id)
  if (state.activeSession._id === payload.subscriber._id) {
    let userChat = state.userChat
    userChat.push(payload.message)
    session = sessions.splice(index, 1)[0]
    session.unreadCount = session.unreadCount ? session.unreadCount + 1 : 1
    session.lastPayload = payload.message.payload
    if (state.tabValue === 'open') sessions = [session, ...sessions]
    data = {
      userChat,
      chatCount: props.chatCount + 1,
      openSessions: state.tabValue === 'open' && sessions,
      closeSessions: state.tabValue === 'close' && sessions,
      closeCount: state.tabValue === 'close' && props.closeCount - 1
    }
  } else if (index >= 0) {
    session = sessions.splice(index, 1)[0]
    session.unreadCount = session.unreadCount ? session.unreadCount + 1 : 1
    session.lastPayload = payload.message.payload
    if (state.tabValue === 'open') sessions = [session, ...sessions]
    data = {
      openSessions: state.tabValue === 'open' && sessions,
      closeSessions: state.tabValue === 'close' && sessions,
      closeCount: state.tabValue === 'close' && props.closeCount - 1
    }
  } else if (index === -1 && state.tabValue === 'open') {
    session.name = `${session.firstName} ${session.lastName}`
    session.lastPayload = payload.message.payload
    sessions = [session, ...sessions]
    data = {
      openSessions: sessions,
      openCount: props.openCount + 1
    }
  }
  updateLiveChatInfo(data)
  clearSocketData()
}
