/**
 * Created by sojharo on 20/08/2017.
 */

/**
 * Socket.io configuration
 */

'use strict'

const logger = require('./../components/logger')
// const TAG = 'config/socketio.js'

// When the user disconnects.. perform this
function onDisconnect (io2, socket) {
}

// When the user connects.. perform this
function onConnect (io2, socket) {
  socket.on('logClient', function (data) {
    logger.clientLog(data.tag, data.data)
  })

  // Insert sockets below
  // require('../api/inviteagenttoken/inviteagenttoken.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.connectedAt = new Date()

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socketio, socket)
      // logger.serverLog(TAG, `SOCKET ${socket.id} DISCONNECTED AT ${new Date()}`)
    })

    // Call onConnect.
    onConnect(socketio, socket)
    // logger.serverLog(TAG, `SOCKET ${socket.id} CONNECTED at ${socket.connectedAt}`)
  })
}
