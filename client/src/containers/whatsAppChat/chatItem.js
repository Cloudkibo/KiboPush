/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import {
  fetchChat,
  sendChatMessage,
  markRead
} from '../../redux/actions/whatsAppChat.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  displayDate,
  showDate
} from '../liveChat/utilities'
import { Element, Events, scrollSpy, scroller } from 'react-scroll'
import ReactPlayer from 'react-player'

// import MediaCapturer from 'react-multimedia-capture'

class ChatItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.previousScrollHeight = undefined
    this.newMessage = false
    this.state = {
    }
    this.showContent = this.showContent.bind(this)
    this.shouldLoad = this.shouldLoad.bind(this)
    this.loadMoreMessage = this.loadMoreMessage.bind(this)
    this.updateScrollTop = this.updateScrollTop.bind(this)
    this.onTestURLAudio = this.onTestURLAudio.bind(this)
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
  }

  getRepliedByMsg (msg) {
    if (
      (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
      msg.replied_by && msg.replied_by.type === 'agent' && this.props.user._id !== msg.replied_by.id
    ) {
      return `${msg.replied_by.name} replied`
    } else {
      return 'You replied'
    }
  }

  onTestURLAudio (url) {
    var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i
    var truef = AUDIO_EXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  showContent (msg, type, index) {
    let content = []
    if (msg.payload.componentType !== 'text') {
      content.push(<div className='m-messenger__message-content'>
        <div className='m-messenger__message-username'>
          {type === 'twilio' ? `${this.props.activeSession.number} shared` : this.getRepliedByMsg(msg) }
        </div>
        {msg.payload.componentType === 'image'
          ? <a key={index} href={msg.payload.fileurl.url} target='_blank'>
            <img
              src={msg.payload.fileurl.url}
              style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
            />
          </a>
        : msg.payload.componentType === 'file'
        ? <a key={index} href={msg.payload.fileurl.url} target='_blank'>
          <h6 style={{marginTop: '10px'}}><i className='fa fa-file-text-o' /><strong>{msg.payload.fileName}</strong></h6>
        </a>
      : msg.payload.componentType === 'audio' &&
      <div key={index}>
        <ReactPlayer
          url={msg.payload.fileurl.url}
          controls
          width='230px'
          height='60px'
          onPlay={this.onTestURLAudio(msg.payload.fileurl.url)}
        />
      </div>
      }
      </div>)
    } else {
      content.push(<div className='m-messenger__message-content'>
        <div className='m-messenger__message-username'>
          {type === 'twilio' ? `${this.props.activeSession.number} wrote` : this.getRepliedByMsg(msg)}
        </div>
        <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
          {msg.payload.text}
        </div>
      </div>)
    }
    return content
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

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    this.refs.chatScroll.addEventListener('scroll', () => {
      this.previousScrollHeight = this.refs.chatScroll.scrollHeight
      if (this.refs.chatScroll.scrollTop === 0) {
        if (this.shouldLoad()) {
          this.loadMoreMessage()
          // this.updateScrollTop()
        }
      }
    })

    Events.scrollEvent.register('begin', function (to, element) {
      // console.log('begin', arguments)
    })

    Events.scrollEvent.register('end', function (to, element) {
      // console.log('end', arguments)
    })

    scrollSpy.update()
  }

  updateScrollTop () {
    if (this.previousScrollHeight && this.previousScrollHeight !== this.refs.chatScroll.scrollHeight) {
      this.refs.chatScroll.scrollTop = this.refs.chatScroll.scrollHeight - this.previousScrollHeight
    } else if (this.props.chat) {
      this.scrollToTop()
      setTimeout(scroller.scrollTo(this.props.chat[this.props.chat.length - 1].datetime, {delay: 300, containerId: 'chat-container'}), 3000)
      // this.props.disableScroll()
    }
  }

  componetWillUnmount () {
    Events.scrollEvent.remove('begin')
    Events.scrollEvent.remove('end')
  }

  scrollToTop () {
    // this.top.scrollIntoView({behavior: 'instant'})
  }

  componentWillReceiveProps (nextProps) {
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
    this.props.updateUnreadCount(this.props.activeSession)
    this.updateScrollTop()
    if (this.newMessage) {
      this.previousScrollHeight = this.refs.chatScroll.scrollHeight
      this.newMessage = false
    }
    if (nextProps.chat && nextProps.chat.length > 0 && nextProps.chat[0].contactId === this.props.activeSession._id) {
      this.props.markRead(this.props.activeSession._id, this.props.sessions)
    }
  }

  render () {
    console.log('render in chatitem', this.props.chat)
    return (
      <div style={{height: '420px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
        <div id='chat-container' ref='chatScroll' style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
          <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
            {
              (this.props.chatCount && this.props.chat && this.props.chatCount > this.props.chat.length) &&
              <p style={{textAlign: 'center'}}>Loading...</p>
            }
            {
                this.props.chat && this.props.chat.map((msg, index) => (
                  msg.format === 'twilio'
                  ? <div key={index} style={{marginLeft: 0, marginRight: 0, display: 'block', clear: 'both'}} className='row'>
                    <Element name={msg.datetime}>
                      {
                        index === 0
                        ? <div className='m-messenger__datetime'>
                          {displayDate(msg.datetime)}
                        </div>
                        : index > 0 && showDate(this.props.chat[index - 1].datetime, msg.datetime) &&
                        <div className='m-messenger__datetime'>
                          {displayDate(msg.datetime)}
                        </div>
                      }
                      <div style={{minWidth: '200px', maxWidth: '200px'}} key={msg._id} className='m-messenger__message m-messenger__message--in'>
                        <div className='m-messenger__message-pic'>
                          <img src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg' alt='' />
                        </div>
                        <div className='m-messenger__message-body'>
                          <div className='m-messenger__message-arrow' />
                          {this.showContent(msg, 'twilio', index)}
                        </div>
                      </div>
                    </Element>
                  </div>
                  : <div key={index} style={{marginLeft: 0, marginRight: 0, display: 'block', clear: 'both'}} className='row'>
                    <Element name={msg.datetime}>
                      {
                        index === 0
                        ? <div className='m-messenger__datetime'>
                          {displayDate(msg.datetime)}
                        </div>
                        : index > 0 && showDate(this.props.chat[index - 1].datetime, msg.datetime) &&
                        <div className='m-messenger__datetime'>
                          {displayDate(msg.datetime)}
                        </div>
                      }
                      <div style={{minWidth: '200px'}} key={msg._id} className='m-messenger__message m-messenger__message--out'>
                        <div className='m-messenger__message-body'>
                          <div className='m-messenger__message-arrow' />
                          <div>
                            {this.showContent(msg, 'kibopush', index)}
                            {index === this.props.chat.length - 1 && msg.status === 'seen' &&
                              <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                              </div>
                            }
                          </div>
                        </div>
                      </div>
                    </Element>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    chatCount: (state.whatsAppChatInfo.chatCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchChat,
    sendChatMessage,
    markRead
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatItem)
