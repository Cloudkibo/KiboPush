/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { searchWhatsAppChat } from '../../redux/actions/whatsAppChat.actions'
import { scroller } from 'react-scroll'
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
    console.log('scrollToMessage called')
    // check if message exists
    let counter = 0
    for (let i = 0; i < this.props.userChat.length; i++) {
      if (this.props.userChat[i]._id === messageId) {
        counter = 1
        break
      }
    }

    if (counter === 1) {
      scroller.scrollTo(messageId, {delay: 3000, containerId: 'chat-container'})
    } else {
      // this.props.fetchUserChats(this.props.currentSession._id, {page: 'next', number: 25, last_id: this.props.userChat[0]._id, messageId: messageId}, this.scrollToMessage)
    }
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
       <SEARCH clearSearchResult={this.props.clearSearchResult} searchChatMsgs={this.props.searchChatMsgs} hideSearch={this.props.hideSearch} searchChat={this.searchChat}/>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    searchChatMsgs: (state.whatsAppChatInfo.searchChat)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    searchWhatsAppChat
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Search)
