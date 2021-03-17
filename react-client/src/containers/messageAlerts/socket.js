export function handleSocketEvent (data, state, props, updateState) {
  console.log('message alerts socket event came', data)
  switch (data.type) {
    case 'subscribed':
      handleSubscription(data, state, updateState)
      break
    case 'unsubscribed':
      handleUnsubscribe(data, state, updateState)
      break
    default:
  }
  props.setSocketData(null)
}

function handleSubscription (data, state, updateState) {
  let channels = JSON.parse(JSON.stringify(state.channels))
  let subscriptions = JSON.parse(JSON.stringify(state.subscriptions))
  subscriptions.push(data.subscription)
  channels[data.subscription.alertChannel.toLowerCase()].enabled = true
  updateState({subscriptions, channels})
}

function handleUnsubscribe (data, state, updateState) {
  const subscription = data.subscription
  let channels = JSON.parse(JSON.stringify(state.channels))
  let subscriptions = JSON.parse(JSON.stringify(state.subscriptions))
  const index = subscriptions.findIndex((item) => item._id === subscription._id)
  if (index >= 0) {
    subscriptions.splice(index, 1)
  }
  if (subscriptions.length === 0) {
    channels[subscription.alertChannel.toLowerCase()].enabled = false
  }
  updateState({subscriptions, channels})
}
