/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { searchWhatsAppChat, fetchChat } from '../../redux/actions/whatsAppChat.actions'

import SEARCH from '../../components/LiveChat/search.js'

class Search extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.searchChat = this.searchChat.bind(this)
    this.scrollToMessage = this.scrollToMessage.bind(this)
  }

  scrollToMessage (messageId) {
   this.props.scrollToMessage(messageId)
  }

  searchChat (searchValue) {
    const data = {
      subscriber_id: this.props.currentSession._id,
      text: searchValue
    }
    console.log('data to search', data)
    this.props.searchWhatsAppChat(data)
  }

  render () {
    return (
      <div className='col-xl-3'>
       <SEARCH scrollToMessage={this.scrollToMessage} 
        clearSearchResult={this.props.clearSearchResult} 
        searchChatMsgs={this.props.searchChatMsgs ? this.props.searchChatMsgs : []} 
        hideSearch={this.props.hideSearch} 
        searchChat={this.searchChat}
        subscriberName = {this.props.currentSession.name ? this.props.currentSession.name : (this.props.currentSession.firstName ? this.props.currentSession.firstName+ ' '+this.props.currentSession.lastName: '')}/>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    searchChatMsgs: (state.whatsAppChatInfo.searchChat),
    chat: (state.whatsAppChatInfo.chat),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    searchWhatsAppChat,
    fetchChat
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Search)
