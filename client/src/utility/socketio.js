/**
 * Created by sojharo on 20/08/2017.
 */
import io from 'socket.io-client'
import { setSocketStatus } from './../redux/actions/basicinfo.actions'
import { socketUpdate } from './../redux/actions/livechat.actions'
const socket = io('')
let store

var joined = false

var callbacks = {
  new_chat: false,
  new_broadcast: false,
  autoposting_created: false,
  autoposting_updated: false,
  autoposting_removed: false,
  menu_update: false,
  page_connect: false,
  page_disconnect: false,
  poll_created: false,
  survey_created: false,
  workflow_created: false,
  workflow_updated: false,
}

export function registerAction(callback){
  callbacks[callback.event] = callback.action;
}

export function initiateSocket (storeObj) {
  store = storeObj
  socket.connect()
}

socket.on('connect', () => {
  store.dispatch(setSocketStatus(true))
})

socket.on('disconnect', () => {
  joined = false
  store.dispatch(setSocketStatus(false))
})

socket.on('new_chat', (data) => {
  console.log('new chat received ', data)

  store.dispatch(socketUpdate(data))
})

socket.on('message', (data) => {
  console.log('New socket event occured ', data)
  if(callbacks[data.action]){
    callbacks[data.action]();
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
  if (joined) {
    return
  }
  socket.emit('message', {
    action: 'join_room'
    room_id: data
  })
  joined = true
}
