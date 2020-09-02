export function handleSocketEvent (data, props, updateLiveChatInfo, user, clearSocketData) {
  console.log('live chat socket event came', data)
  switch (data.action) {
    case 'new_chat':
      handleIncomingMessage(data.payload, props, updateLiveChatInfo, clearSocketData)
      break
    case 'agent_replied':
      handleAgentReply(data.payload, props, updateLiveChatInfo, clearSocketData, user)
      break
    default:
  }
}

const handleIncomingMessage = (payload, props, updateLiveChatInfo, clearSocketData) => {
  let allChatMessages = props.allChatMessages
  if (allChatMessages[payload.subscriber._id]) {
    allChatMessages[payload.subscriber._id] = [...allChatMessages[payload.subscriber._id], payload.message]
  }
  updateLiveChatInfo({allChatMessages})
  clearSocketData()
}

const handleAgentReply = (payload, props, updateLiveChatInfo, clearSocketData, user) => {
  if (user._id !== payload.user_id) {
    payload.message.format = 'convos'
    let allChatMessages = props.allChatMessages
    if (allChatMessages[payload.subscriber_id]) {
      allChatMessages[payload.subscriber_id] = [...allChatMessages[payload.subscriber_id], payload.message]
    }
    updateLiveChatInfo({allChatMessages})
    clearSocketData()
  } else {
    clearSocketData()
  }
}
