import * as ActionTypes from '../constants/constants'

const initialState = {
  chat: [{
      userInfo: {
          name: 'Imran Shoukat',
          profileLink: '',
          profilePic: '',
          gender: 'Male',
          language: 'English',
          userid: '1'
      },
      messages:[{
          senderId: '1',
          receiverId: '2',
          type: 'text',
          message: 'Hello',
          timestamp: 'Yesterday at 8:10pm',
      },
      {
          senderId: '2',
          receiverId: '1',
          type: 'text',
          message: 'Hi',
          timestamp: '',
      },
      {
          senderId: '1',
          receiverId: '2',
          type: 'text',
          message: 'How are you',
          timestamp: '',
      }], 
  }],

}

export function liveChat (state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_CHAT:
      return Object.assign({}, state, {
        chat: action.chat
      })

    default:
      return state
  }
}
