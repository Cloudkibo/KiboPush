// /* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import {
  fetchChat,
  sendChatMessage,
  markRead,
  updateChat,
  sendAttachment
} from '../../redux/actions/whatsAppChat.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ChatBox from './chatbox'
import ChatItem from './chatItem'
// import MediaCapturer from 'react-multimedia-capture'

class ChatArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.previousScrollHeight = undefined
    this.newMessage = false
    this.state = {
    }
    props.fetchChat(this.props.activeSession._id, {page: 'first', number: 25})
    props.markRead(this.props.activeSession._id, this.props.sessions)

    this.shouldLoad = this.shouldLoad.bind(this)
    this.loadMoreMessage = this.loadMoreMessage.bind(this)
    this.updateChat = this.updateChat.bind(this)
    this.onEnter = this.onEnter.bind(this)
    // this.updateScrollTop = this.updateScrollTop.bind(this)
  }

  onEnter (data, type, handleSendAttachment) {
    console.log('in onEnter')
    if (type === 'attachment') {
      this.props.sendAttachment(data, handleSendAttachment)
      data.format = 'kibopush'
      this.props.chat.push(data)
    } else {
      console.log('in else')
      this.props.sendChatMessage(data)
      data.format = 'kibopush'
      // this.props.updateChat(this.props.chat, data)
      this.props.chat.push(data)
      this.forceUpdate()
    }
  }

  updateChat (chat, newChat) {
    console.log('in updateChat')
    this.props.updateChat(this.props.chat, newChat)
  }

  shouldLoad () {
    if (this.props.chat.length < this.props.chatCount) {
      return true
    } else {
      return false
    }
  }

  loadMoreMessage () {
    this.props.fetchChat(this.props.activeSession._id, {page: 'next', number: 25, last_id: this.props.chat[0]._id})
  }

  // componentDidMount () {
  //   console.log('in componentDidMount')
  //   var addScript = document.createElement('script')
  //   addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
  //   document.body.appendChild(addScript)
  //   this.refs.chatScroll.addEventListener('scroll', () => {
  //     this.previousScrollHeight = this.refs.chatScroll.scrollHeight
  //     if (this.refs.chatScroll.scrollTop === 0) {
  //       if (this.shouldLoad()) {
  //         this.loadMoreMessage()
  //         // this.updateScrollTop()
  //       }
  //     }
  //   })
  //
  //   Events.scrollEvent.register('begin', function (to, element) {
  //     // console.log('begin', arguments)
  //   })
  //
  //   Events.scrollEvent.register('end', function (to, element) {
  //     // console.log('end', arguments)
  //   })
  //
  //   scrollSpy.update()
  // }
  //
  // updateScrollTop () {
  //   console.log('previousScrollHeight', this.previousScrollHeight)
  //   console.log('scrollHeight', this.refs.chatScroll.scrollHeight)
  //   if (this.previousScrollHeight && this.previousScrollHeight !== this.refs.chatScroll.scrollHeight) {
  //     this.refs.chatScroll.scrollTop = this.refs.chatScroll.scrollHeight - this.previousScrollHeight
  //   } else if (this.props.chat) {
  //     this.scrollToTop()
  //     setTimeout(scroller.scrollTo(this.props.chat[this.props.chat.length - 1].datetime, {delay: 300, containerId: 'chat-container'}), 3000)
  //     // this.props.disableScroll()
  //   }
  // }
  //
  // componetWillUnmount () {
  //   Events.scrollEvent.remove('begin')
  //   Events.scrollEvent.remove('end')
  // }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  componentWillReceiveProps (nextProps) {
    console.log('in componentWillReceiveProps of ChatArea', nextProps)
    // // this.getDisabledValue()
    // if (nextProps.urlMeta) {
    //   if (!nextProps.urlMeta.type) {
    //     this.setState({displayUrlMeta: false})
    //   }
    //   this.setState({urlmeta: nextProps.urlMeta})
    // }
    // this.props.markRead(this.props.activeSession._id, this.props.sessions)
  }

  componentDidUpdate (nextProps) {
    console.log('in componentDidUpdate of ChatArea', nextProps)
    // this.props.updateUnreadCount(this.props.activeSession)
    // this.updateScrollTop()
    // if (this.newMessage) {
    //   this.previousScrollHeight = this.refs.chatScroll.scrollHeight
    //   this.newMessage = false
    // }
    if (nextProps.chat && nextProps.chat.length > 0 && nextProps.chat[0].contactId === this.props.activeSession._id) {
      this.props.markRead(this.props.activeSession._id, this.props.sessions)
    }
  }

  render () {
    console.log('render in CHATAREA', this.props.chat)
    return (
      <div className='col-xl-5'>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-portlet m-portlet--mobile'>
          <div style={{padding: '2.2rem 0rem 2.2rem 2.2rem'}} className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active m-scrollable' role='tabpanel'>
                {this.props.chat && this.props.chat.length > 0 &&
                <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                  <ChatItem activeSession={this.props.activeSession}
                    user={this.props.user}
                    updateUnreadCount={this.props.updateUnreadCount}
                    chat={this.props.chat} />
                  <div className='m-messenger__seperator' />
                  <ChatBox activeSession={this.props.activeSession}
                    user={this.props.user}
                    updateChat={this.updateChat}
                    chat={this.props.chat}
                    onEnter={this.onEnter} />
                </div>
              }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('in mapStateToProps of ChatArea', state)
  return {
    chat: (state.whatsAppChatInfo.chat),
    chatCount: (state.whatsAppChatInfo.chatCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchChat,
    sendChatMessage,
    markRead,
    updateChat,
    sendAttachment
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatArea)
