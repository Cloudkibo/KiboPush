/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dotdotdot from 'react-dotdotdot'
import Highlighter from 'react-highlight-words'
import { searchChat, fetchUserChats } from '../../redux/actions/livechat.actions'
import { scroller } from 'react-scroll'

class Profile extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      searchValue: ''
    }
    this.changeSearchValue = this.changeSearchValue.bind(this)
    this.searchChat = this.searchChat.bind(this)
    this.scrollToMessage = this.scrollToMessage.bind(this)
  }

  changeSearchValue (e) {
    this.setState({searchValue: e.target.value})
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
      scroller.scrollTo(messageId, {delay: 300, containerId: 'chat-container'})
    } else {
      this.props.fetchUserChats(this.props.currentSession._id, {page: 'next', number: 25, last_id: this.props.userChat[0]._id, messageId: messageId}, this.scrollToMessage)
    }
  }

  searchChat () {
    const data = {
      session_id: this.props.currentSession._id,
      text: this.state.searchValue
    }
    console.log('data to search', data)
    this.props.searchChat(data)
  }

  render () {
    return (
      <div className='col-xl-3'>
        <div className='m-portlet m-portlet--full-height'>
          <div style={{padding: '0px'}} className='m-portlet__body'>
            <div style={{padding: '1.5rem'}}>
              <h5>Search<i style={{cursor: 'pointer', float: 'right', fontWeight: 'bold'}} onClick={this.props.hideSearch} className='la la-close' /></h5>
              <br />
              <div className='input-group'>
                <input onChange={this.changeSearchValue} value={this.state.searchValue} type='text' className='form-control' placeholder='Search Messages...' />
                <span className='input-group-btn'>
                  <button onClick={this.searchChat} className='btn btn-primary' type='button'>
                    Go!
                  </button>
                </span>
              </div>
            </div>
            <div style={{height: '525px', overflowY: 'scroll'}} className='m-widget4'>
              {
                this.props.searchChatMsgs && this.props.searchChatMsgs.length > 0
                ? this.props.searchChatMsgs.map((chat, index) => (
                  <div key={chat._id} onClick={() => { this.scrollToMessage(chat._id) }} style={{cursor: 'pointer'}} className='m-widget4__item'>
                    <div className='m-widget4__info'>
                      <span className='m-widget4__sub'>{new Date(chat.datetime).getDate() + '/' + new Date(chat.datetime).getMonth() + '/' + new Date(chat.datetime).getFullYear()}</span>
                      <br />
                      <Dotdotdot clamp={2}>
                        <span style={{fontWeight: 'normal'}} className='m-widget4__title'>
                          <strong>{chat.format === 'facebook' ? (this.props.currentSession.firstName + ': ') : 'You: '}</strong>
                          <Highlighter
                            searchWords={this.state.searchValue.split(' ')}
                            highlightStyle={{backgroundColor: 'yellow'}}
                            autoEscape
                            textToHighlight={chat.payload.text}
                          />
                        </span>
                      </Dotdotdot>
                    </div>
                  </div>
                ))
                : this.props.searchChatMsgs && this.props.searchChatMsgs.length === 0 &&
                <p style={{textAlign: 'center'}}>No search result found!</p>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    searchChatMsgs: (state.liveChat.searchChat),
    userChat: (state.liveChat.userChat)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    searchChat,
    fetchUserChats
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
