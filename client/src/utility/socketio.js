/**
 * Created by sojharo on 20/08/2017.
 */
import io from 'socket.io-client'
import { setSocketStatus } from './../redux/actions/basicinfo.actions'
import { socketUpdate, fetchSessions, fetchUserChats, setActiveSession } from './../redux/actions/livechat.actions'
import { loadAutopostingList } from './../redux/actions/autoposting.actions'
import { loadMyPagesList } from './../redux/actions/pages.actions'
import { loadWorkFlowList } from './../redux/actions/workflows.actions'
import { fetchAllSequence } from './../redux/actions/sequence.action'
import { loadDashboardData, sentVsSeen } from './../redux/actions/dashboard.actions'
import { loadBroadcastsList } from './../redux/actions/broadcast.actions'
import { loadPollsList } from './../redux/actions/poll.actions'
import { loadSurveysList } from './../redux/actions/surveys.actions'
import { loadTags } from './../redux/actions/tags.actions'
import { loadSubscribersList } from './../redux/actions/subscribers.actions'
import { fetchNotifications } from './../redux/actions/notifications.actions'

const socket = io('')
let store

var joined = false
var myId = ''

var callbacks = {
  new_chat: false,
  new_broadcast: false,
  autoposting_created: false,
  autoposting_updated: false,
  autoposting_removed: false,
  menu_updated: false,
  page_connect: false,
  page_disconnect: false,
  poll_created: false,
  survey_created: false,
  workflow_created: false,
  workflow_updated: false,
  new_subscriber: false,
  dashboard_updated: false,
  sequence_create: false,
  sequence_update: false,
  sequence_delete: false,
  message_seen: false
}

export function registerAction (callback) {
  callbacks[callback.event] = callback.action
}

export function initiateSocket (storeObj) {
  store = storeObj
  socket.connect()
}

socket.on('connect', () => {
  console.log('Setting Socket Status to true')
  if (myId !== '') {
    joinRoom(myId)
  }
  store.dispatch(setSocketStatus(true))
})

socket.on('disconnect', () => {
  joined = false
  store.dispatch(setSocketStatus(false))
})

socket.on('new_chat', (data) => {
  store.dispatch(socketUpdate(data))
})

socket.on('message', (data) => {
  if (data.action === 'new_chat' || data.action === 'message_seen') {
    store.dispatch(socketUpdate(data.payload))
    store.dispatch(loadDashboardData())
  } else if (data.action === 'autoposting_updated' || data.action === 'autoposting_removed') {
    store.dispatch(loadAutopostingList())
  } else if (data.action === 'page_disconnect' || data.action === 'page_connect') {
    store.dispatch(loadMyPagesList())
    store.dispatch(loadDashboardData())
  } else if (data.action === 'workflow_updated') {
    store.dispatch(loadWorkFlowList())
  } else if (data.action === 'new_broadcast') {
    store.dispatch(loadBroadcastsList())
    store.dispatch(sentVsSeen())
  } else if (data.action === 'poll_created') {
    store.dispatch(loadPollsList())
    store.dispatch(sentVsSeen())
  } else if (data.action === 'survey_created') {
    store.dispatch(loadSurveysList())
    store.dispatch(sentVsSeen())
  } else if (['new_tag', 'tag_rename', 'tag_remove'].indexOf(data.action) > -1) {
    store.dispatch(loadTags())
  } else if (['tag_assign', 'tag_unassign'].indexOf(data.action) > -1) {
    store.dispatch(loadSubscribersList())
  } else if (['session_assign', 'session_status', 'unsubscribe'].indexOf(data.action) !== -1) {
    store.dispatch(fetchSessions())
    store.dispatch(setActiveSession(data.payload.session_id))
    store.dispatch(fetchNotifications())
  } else if (data.action === 'agent_replied') {
    store.dispatch(fetchSessions())
    store.dispatch(setActiveSession(data.payload.session_id))
    store.dispatch(fetchUserChats(data.payload.session_id))
  } else if (['sequence_create', 'sequence_update', 'sequence_delete'].indexOf(data.action) > -1) {
    store.dispatch(fetchAllSequence())
  }

  if (callbacks[data.action]) {
    callbacks[data.action](data.payload)
  }
})

export function log (tag, data) {
  console.log(`${tag}: ${data}`)
  socket.emit('logClient', {
    tag,
    data
  })
}

export function joinRoom (data) {
  console.log('Trying to join room socket', data)
  myId = data
  if (joined) {
    return
  }
  socket.emit('message', {
    action: 'join_room',
    room_id: data
  })
  joined = true
}
