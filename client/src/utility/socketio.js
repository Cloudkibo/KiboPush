/**
 * Created by sojharo on 20/08/2017.
 */
import io from 'socket.io-client'
import { setSocketStatus } from './../redux/actions/basicinfo.actions'
import { socketUpdate } from './../redux/actions/livechat.actions'
const socket = io('')
let store

var joined = false

export function initiateSocket (storeObj) {
  store = storeObj
  socket.connect()
}

socket.on('connect', () => {
  store.dispatch(setSocketStatus(true))
})

socket.on('disconnect', () => {
  store.dispatch(setSocketStatus(false))
})

socket.on('new_chat', (data) => {
  console.log('new chat received ' + data)

  store.dispatch(socketUpdate(data))
})

export function log (tag, data) {
  console.log(`${tag}: ${data}`)
  socket.emit('logClient', {
    tag,
    data
  })
}

export function joinRoom (data) {
  if(joined){
    return
  }
  socket.emit('join', {
    _id: data
  })
  joined = true
}
