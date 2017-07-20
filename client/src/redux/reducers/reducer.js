import { combineReducers } from 'redux';

import { connectInfo } from './connectinfo.reducer';
import { chatListInfo } from './chatlist.reducer';
import { contactListInfo } from './contactlist.reducer';
import { conversationListInfo } from './conversation.reducer';
import { archiveListInfo } from './archivelist.reducer';
import { groupListInfo } from './grouplist.reducer';
import { groupMemberListInfo } from './groupmemberlist.reducer';

const appReducer = combineReducers({
  connectInfo,
  chatListInfo,
  archiveListInfo,
  contactListInfo,
  conversationListInfo,
  groupListInfo,
  groupMemberListInfo
});

export default appReducer;
