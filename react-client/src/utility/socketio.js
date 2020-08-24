/**
 * Created by sojharo on 20/08/2017.
 */
import io from 'socket.io-client'
import { setSocketStatus } from './../redux/actions/basicinfo.actions'
import { socketUpdate, socketUpdateSeen, fetchSingleSession, updateSessions } from './../redux/actions/livechat.actions'
import { loadAutopostingList } from './../redux/actions/autoposting.actions'
import { loadMyPagesList } from './../redux/actions/pages.actions'
import { fetchAllSequence } from './../redux/actions/sequence.action'
import { loadDashboardData, sentVsSeen } from './../redux/actions/dashboard.actions'
// import { allBroadcasts } from './../redux/actions/broadcast.actions'
import { loadPollsListNew } from './../redux/actions/poll.actions'
import { loadSurveysListNew } from './../redux/actions/surveys.actions'
import {updateCustomFieldValue, addCustomField, removeCustomField, updateSingleCustomField} from './../redux/actions/customFields.actions'
import { addTag, removeTag, updateTag, assignTag, unassignTag } from './../redux/actions/tags.actions'
import { loadAllSubscribersListNew, updateCustomFieldForSubscriber } from './../redux/actions/subscribers.actions'
import { fetchNotifications, setMessageAlert } from './../redux/actions/notifications.actions'
import { handleSocketEvent, handleSocketEventSms, handleSocketEventWhatsapp } from '../redux/actions/socket.actions'
import { addToSponsoredMessages, updateSponsoredMessagesListItemStatus } from './../redux/actions/sponsoredMessaging.actions'
import { removeZoomIntegration } from './../redux/actions/settings.actions'
const whatsAppActions = require('./../redux/actions/whatsAppChat.actions')
const smsActions = require('./../redux/actions/smsChat.actions')

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
  new_subscriber: false,
  dashboard_updated: false,
  sequence_create: false,
  sequence_update: false,
  sequence_delete: false,
  message_seen: false,
  new_chat_sms: false,
  new_chat_whatsapp: false
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
  console.log('socket called', data)
  if (['new_chat', 'agent_replied', 'session_pending_response', 'unsubscribe'].includes(data.action)) {
    if (data.action === 'new_chat') data.showNotification = true
    store.dispatch(handleSocketEvent(data))
  }
  if (['new_chat_sms', 'agent_replied_sms', 'session_pending_response_sms', 'unsubscribe_sms', 'session_status_sms'].includes(data.action)) {
    if (data.action === 'new_chat_sms') data.showNotification = true
    store.dispatch(handleSocketEventSms(data))
  }
  if (['new_chat_whatsapp', 'agent_replied_whatsapp', 'session_pending_response_whatsapp', 'unsubscribe_whatsapp', 'session_status_whatsapp', 'new_session_created_whatsapp', 'message_delivered_whatsApp', 'message_seen_whatsApp'].includes(data.action)) {
    if (data.action === 'new_chat_whatsapp') data.showNotification = true
    store.dispatch(handleSocketEventWhatsapp(data))
  }
  if (['new_notification'].includes(data.action)) {
    if (data.payload) {
      store.dispatch(setMessageAlert(data.payload))
    }
    store.dispatch(fetchNotifications())
  }
  if (data.action === 'whatsapp_message_seen') {
    store.dispatch(whatsAppActions.socketUpdateWhatsAppSeen(data.payload))
  } else if (data.action === 'message_seen') {
    store.dispatch(socketUpdateSeen(data.payload))
  } else if (data.action === 'autoposting_updated' || data.action === 'autoposting_removed') {
    store.dispatch(loadAutopostingList())
  } else if (data.action === 'page_disconnect' || data.action === 'page_connect') {
    store.dispatch(loadMyPagesList())
    store.dispatch(loadDashboardData())
  } else if (data.action === 'new_broadcast') {
    // store.dispatch(loadBroadcastsList())
    store.dispatch(sentVsSeen())
  } else if (data.action === 'poll_created') {
    store.dispatch(loadPollsListNew({last_id: 'none', number_of_records: 10, first_page: true, days: '0'}))
    store.dispatch(sentVsSeen())
  } else if (data.action === 'poll_send') {
    console.log('poll send function called')
    store.dispatch(loadPollsListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: '0'}))
    // store.dispatch(sentVsSeen())
  } else if (data.action === 'survey_created') {
    store.dispatch(loadSurveysListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: '0'}))
    store.dispatch(sentVsSeen())
  } else if (data.action === 'survey_send') {
    console.log('survey send function called')
    store.dispatch(loadSurveysListNew({last_id: 'none', number_of_records: 10, first_page: 'first', days: '0'}))
    // store.dispatch(sentVsSeen())
  } else if (['new_tag', 'tag_rename', 'tag_remove'].indexOf(data.action) > -1) {
    //store.dispatch(loadTags())
    if (data.action === 'new_tag') {
      store.dispatch(addTag(data.payload))
    } else if (data.action === 'tag_remove') {
      store.dispatch(removeTag(data.payload))
    } else if (data.action === 'tag_rename') {
      store.dispatch(updateTag(data.payload))
    }
  } else if (['tag_assign', 'tag_unassign'].indexOf(data.action) > -1) {
    if (data.action === 'tag_assign') {
      if (data.payload.subscriber_ids.length === 1) {
        store.dispatch(assignTag({
          subscriberId: data.payload.subscriber_ids[0],
          tagId: data.payload.tagId
        }))
      }
    } else if (data.action === 'tag_unassign') {
      if (data.payload.subscriber_ids.length === 1) {
        store.dispatch(unassignTag({
          subscriberId: data.payload.subscriber_ids[0],
          tagId: data.payload.tagId
        }))
      }
    }
    store.dispatch(loadAllSubscribersListNew({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: '', gender_value: '', page_value: '', locale_value: '', tag_value: '', status_value: ''}}))
  } else if (data.action === 'session_assign') {
    store.dispatch(updateSessions(data.payload.data))
  } else if (data.action === 'session_assign_sms') {
    store.dispatch(smsActions.updateSessions(data.payload.data))
  } else if (data.action === 'session_assign_whatsapp') {
    store.dispatch(whatsAppActions.updateSessions(data.payload.data))
  } else if (data.action === 'session_status') {
    if (data.payload.status === 'new') {
      store.dispatch(fetchSingleSession(data.payload.session_id, {appendTo: 'open', deleteFrom: 'close'}))
    } else {
      store.dispatch(fetchSingleSession(data.payload.session_id, {appendTo: 'close', deleteFrom: 'open'}))
    }
    store.dispatch(fetchNotifications())
  } else if (['sequence_create', 'sequence_update', 'sequence_delete'].indexOf(data.action) > -1) {
    store.dispatch(fetchAllSequence())
  } else if (data.action === 'set_custom_field_value') {
    console.log('socket.io custom field set', data)
    store.dispatch(updateCustomFieldValue(data.payload.setCustomField))
    store.dispatch(updateCustomFieldForSubscriber(data.payload.setCustomField))
  } else if (data.action === 'new_custom_field') {
    store.dispatch(addCustomField(data.payload.newCustomField))
  } else if (data.action === 'custom_field_remove') {
    store.dispatch(removeCustomField(data.payload.customFieldId))
  } else if (data.action === 'custom_field_update') {
    store.dispatch(updateSingleCustomField(data.payload))
  } else if (data.action === 'sponsoredMessaging_newCreated') {
    console.log('created new sponsored by admin', data)
    store.dispatch(addToSponsoredMessages(data.payload))
  } else if (data.action === 'sponsoredMessaging_statusChanged') {
    console.log('update status of new sponsored message')
    store.dispatch(updateSponsoredMessagesListItemStatus(data.payload))
  } else if (data.action === 'zoom_uninstall') {
    store.dispatch(removeZoomIntegration(data.payload))
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
