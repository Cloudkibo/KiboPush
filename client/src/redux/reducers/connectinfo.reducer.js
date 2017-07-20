import * as ActionTypes from '../constants/constants';

const initialState = {
  number: '',
  id: '',
  mobileId: '',
  isConnected: false,
  isSocketConnected: false,
  image: './public/img/android.png' // todo remove this, only for testing
};

export function connectInfo(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_PHONE_NUMBER:
      return Object.assign({}, state, {
        number: action.data
      });

    case ActionTypes.LOAD_ID:
      return Object.assign({}, state, {
        id: action.data
      });

    case ActionTypes.LOAD_PHONE_ID:
      return Object.assign({}, state, {
        mobileId: action.data
      });

    case ActionTypes.UPDATE_CONNECTION_STATE:
      return Object.assign({}, state, {
        isConnected: action.data
      });

    case ActionTypes.UPDATE_SOCKET_STATE:
      return Object.assign({}, state, {
        isSocketConnected: action.data
      });

    case ActionTypes.ADD_IMAGE:
      return Object.assign({}, state, {
        image: action.data
      });

    default:
      return state;
  }
}
