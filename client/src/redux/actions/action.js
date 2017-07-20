import * as ActionTypes from '../constants/constants';

export function setPhoneNumber(data) {
  return {
    type: ActionTypes.LOAD_PHONE_NUMBER,
    data
  };
}

export function setId(data) {
  return {
    type: ActionTypes.LOAD_ID,
    data
  };
}

export function setPhoneId(data) {
  return {
    type: ActionTypes.LOAD_PHONE_ID,
    data
  };
}

export function setConnectionStatus(data) {
  return {
    type: ActionTypes.UPDATE_CONNECTION_STATE,
    data
  };
}

export function setSocketStatus(data) {
  return {
    type: ActionTypes.UPDATE_SOCKET_STATE,
    data
  };
}

export function loadChatList(data) {
  return {
    type: ActionTypes.LOAD_CHATLIST,
    data
  };
}

export function loadGroupChatList(data) {
  return {
    type: ActionTypes.LOAD_GROUP_CHATLIST,
    data
  };
}

export function loadArchiveChatList(data) {
  return {
    type: ActionTypes.LOAD_ARCHIVELIST,
    data
  };
}

export function loadContactList(data) {
  return {
    type: ActionTypes.LOAD_CONTACTLIST,
    data
  };
}

export function loadConversationList(data) {
  return {
    type: ActionTypes.LOAD_CONVERSATION,
    data
  };
}

export function loadGroupList(data) {
  return {
    type: ActionTypes.LOAD_GROUPLIST,
    data
  };
}

export function loadGroupMemberList(data) {
  return {
    type: ActionTypes.LOAD_GROUPMEMBER_LIST,
    data
  };
}

export function refreshGroupList(data) {
  return {
    type: ActionTypes.REFRESH_GROUPS,
    data
  };
}

export function addImage(data) { // todo remove this
  return {
    type: ActionTypes.ADD_IMAGE,
    data
  };
}
