import React from 'react'
import PropTypes from 'prop-types'

// components
import LEFTCHATITEM from './leftChatItem'
import RIGHTCHATITEM from './rightChatItem'

class Body extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      shouldScrollToBottom: true,
      scrollEventAdded: false
    }
    this.getSeen = this.getSeen.bind(this)
    this.allowedType = this.allowedType.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.loadMoreMessage = this.loadMoreMessage.bind(this)
    this.updateScrollTop = this.updateScrollTop.bind(this)
    this.shoudLoadMore = this.shoudLoadMore.bind(this)
    this.addScrollEvent = this.addScrollEvent.bind(this)

    this.previousScrollHeight = undefined
  }

  scrollToBottom (chat) {
    console.log('scrollToBottom called')
    const lastMessage = document.getElementById(chat[chat.length - 1]._id)
    if (lastMessage) {
      lastMessage.scrollIntoView({behavior: 'smooth', block: 'end'})
    }
  }

  allowedType (chat) {
    let isAllowed = true
    if (
      chat.payload.attachments &&
      chat.payload.attachments.length > 0 &&
      ['template', 'fallback'].includes(chat.payload.attachments[0].type)
    ) {
      isAllowed = false
    }
    return isAllowed
  }

  getSeen (message, index) {
    if (index === (this.props.userChat.length - 1) && message.seen) {
      return (
        <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
          <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{this.props.displayDate(message.seenDateTime)}
        </div>
      )
    } else {
      return <div />
    }
  }

  loadMoreMessage() {
    this.props.fetchUserChats(
      this.props.activeSession._id,
      { page: 'next', number: 25, last_id: this.props.userChat[0]._id }
    )
  }

  updateScrollTop() {
    if (this.previousScrollHeight && this.refs.chatScroll && this.previousScrollHeight !== this.refs.chatScroll.scrollHeight) {
      this.refs.chatScroll.scrollTop = this.refs.chatScroll.scrollHeight - this.previousScrollHeight
    }
  }

  shoudLoadMore () {
    return (this.props.chatCount > this.props.userChat.length)
  }

  addScrollEvent () {
    this.refs.chatScroll.addEventListener('scroll', (event) => {
      let element = event.target
      this.previousScrollHeight = this.refs.chatScroll.scrollHeight
      if (this.refs.chatScroll.scrollTop === 0) {
        if (this.shoudLoadMore()) {
          this.loadMoreMessage()
        }
      } else if (
        (element.scrollHeight - element.scrollTop - 100) <= element.clientHeight  &&
        this.props.activeSession.unreadCount > 0
      ) {
        console.log('scrolled')
        let session = this.props.activeSession
        session.unreadCount = 0
        this.props.markRead(session._id)
        this.props.updateState({activeSession: session})
      }
    })
    this.setState({scrollEventAdded: true})
  }

  componentDidUpdate (prevProps) {
    if (!this.state.scrollEventAdded && this.refs.chatScroll) {
      this.addScrollEvent()
    }
    if (prevProps.userChat.length !== this.props.userChat.length) {
      if (this.props.activeSession._id !== prevProps.activeSession._id) {
        // this.scrollToBottom(this.props.userChat)
      } else if (this.props.newMessage) {
        this.scrollToBottom(this.props.userChat)
        this.props.updateNewMessage(false)
      } else {
        setTimeout(() => {this.updateScrollTop()}, 100)
      }
    }
    if (
      !this.props.loadingChat &&
      this.props.userChat &&
      this.props.userChat.length > 0 &&
      this.state.shouldScrollToBottom
    ) {
      this.setState({shouldScrollToBottom: false}, () => {this.scrollToBottom(this.props.userChat)})
    }
    if (this.props.activeSession._id !== prevProps.activeSession._id) {
      this.setState({shouldScrollToBottom: true})
    }
  }

  render() {
    return (
      <div style={{padding: '2.2rem 0rem 2.2rem 2.2rem'}} className='m-portlet__body'>
        <div className='tab-content'>
          <div className='tab-pane active m-scrollable' role='tabpanel'>
            <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                {
                  this.props.loadingChat
                  ? <div style={{height: '57vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='m-messenger__messages'>
                    <div>
                      <div className="m-loader" style={{width: "30px", display: "inline-block"}} />
                      <span>Loading Chat...</span>
                    </div>
                  </div>
                  : this.props.userChat.length > 0
                  ? <div style={{height: '57vh', position: 'relative', overflow: 'hidden', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                    <div id='chat-container' ref='chatScroll' style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                      <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                        {
                          !this.props.loadingChat && this.shoudLoadMore() &&
                          <div style={{textAlign: 'center'}}>
                            <div className="m-loader" style={{width: "30px", display: "inline-block"}} />
                            <span>Loading Chat...</span>
                          </div>
                        }
                        {
                          this.props.userChat.map((chat, index) => (
                            chat.format === 'convos'
                            ? <RIGHTCHATITEM
                              key={index}
                              message={chat}
                              index={index}
                              showDate={this.props.showDate}
                              displayDate={this.props.displayDate}
                              activeSession={this.props.activeSession}
                              previousMessage={this.props.userChat[index - 1]}
                              user={this.props.user}
                              seenElement={this.getSeen(chat, index)}
                            />
                            : this.allowedType(chat) &&
                              <LEFTCHATITEM
                                key={index}
                                message={chat}
                                index={index}
                                showDate={this.props.showDate}
                                displayDate={this.props.displayDate}
                                activeSession={this.props.activeSession}
                                previousMessage={this.props.userChat[index - 1]}
                              />
                          ))
                        }
                      </div>
                    </div>
                  </div>
                  : <div style={{height: '55vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}} className='m-messenger__messages'>
                    <div>
                      <span>No chat history found</span>
                    </div>
                  </div>
                }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Body.propTypes = {
  'userChat': PropTypes.array.isRequired,
  'chatCount': PropTypes.number,
  'showDate': PropTypes.func.isRequired,
  'displayDate': PropTypes.func.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'loadingChat': PropTypes.bool.isRequired,
  'user': PropTypes.object.isRequired,
  'fetchUserChats': PropTypes.func.isRequired,
  'markRead': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired,
  'newMessage': PropTypes.bool.isRequired,
  'updateNewMessage': PropTypes.func.isRequired
}

export default Body
