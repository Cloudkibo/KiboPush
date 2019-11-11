/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import {
  fetchChat,
  sendChatMessage,
  markRead
} from '../../redux/actions/smsChat.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  isEmoji,
  getmetaurl,
  displayDate,
  showDate
} from '../liveChat/utilities'
import { Element, Events, scrollSpy, scroller } from 'react-scroll'
import { Picker } from 'emoji-mart'
import { Popover, PopoverBody } from 'reactstrap'
// import MediaCapturer from 'react-multimedia-capture'

class ChatBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.previousScrollHeight = undefined
    this.newMessage = false
    this.state = {
      textAreaValue: '',
      showEmojiPicker: false,
      disabledValue: false,
      changedActiveSession: true
    }
    props.fetchChat(this.props.activeSession._id, {page: 'first', number: 25})
    props.markRead(this.props.activeSession._id, this.props.sessions)

    this.handleTextChange = this.handleTextChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.showEmojiPicker = this.showEmojiPicker.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
    this.shouldLoad = this.shouldLoad.bind(this)
    this.loadMoreMessage = this.loadMoreMessage.bind(this)
    this.updateScrollTop = this.updateScrollTop.bind(this)
  }

  shouldLoad () {
    if (this.props.chat.length < this.props.chatCount) {
      return true
    } else {
      return false
    }
  }

  loadMoreMessage () {
    console.log('loadMoreMessage called')
    this.props.fetchChat(this.props.activeSession._id, {page: 'next', number: 25, last_id: this.props.chat[0]._id})
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

  componentDidMount () {
    console.log('in componentDidMount')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    this.refs.chatScroll.addEventListener('scroll', () => {
      this.previousScrollHeight = this.refs.chatScroll.scrollHeight
      if (this.refs.chatScroll.scrollTop === 0) {
        if (this.shouldLoad()) {
          this.loadMoreMessage()
          this.setState({changedActiveSession: false})
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
    console.log('previousScrollHeight', this.previousScrollHeight)
    console.log('scrollHeight', this.refs.chatScroll.scrollHeight)
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

  showEmojiPicker () {
    this.setState({showEmojiPicker: true})
  }

  toggleEmojiPicker () {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  handleTextChange (e) {
    var isUrl = getmetaurl(e.target.value)
    if (isUrl !== null && isUrl !== '') {
      this.props.fetchUrlMeta(isUrl)
      this.setState({
        prevURL: isUrl,
        displayUrlMeta: true
      })
    } else {
      this.setState({
        urlmeta: {},
        prevURL: '',
        displayUrlMeta: false
      })
    }
    this.setState({
      textAreaValue: e.target.value
    })
  }
  setMessageData (session, payload) {
    var data = ''
    data = {
      sender_id: session.pageId._id, // this is the page id: _id of Pageid
      recipient_id: session._id, // this is the subscriber id: _id of subscriberId
      sender_fb_id: session.pageId.pageId, // this is the (facebook) :page id of pageId
      recipient_fb_id: session.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
      session_id: session._id,
      company_id: session.companyId, // this is admin id till we have companies
      payload: payload, // this where message content will go
      url_meta: this.state.urlmeta,
      datetime: new Date().toString(),
      status: 'unseen', // seen or unseen
      replied_by: {
        type: 'agent',
        id: this.props.user._id,
        name: this.props.user.name
      }
    }
    return data
  }

  onEnter (e) {
    if (e.which === 13) {
      if (this.state.textAreaValue !== '') {
        let data = {
          senderNumber: this.props.chat[0].recipientNumber,
          recipientNumber: this.props.chat[0].senderNumber,
          contactId: this.props.activeSession._id,
          payload: {componentType: 'text', text: this.state.textAreaValue},
          datetime: new Date().toString(),
          repliedBy: {
            id: this.props.user._id,
            name: this.props.user.name,
            type: 'agent'
          }
        }
        this.props.sendChatMessage(data)
        this.setState({textAreaValue: ''})
        data.format = 'kibopush'
        this.props.chat.push(data)
      }
      this.newMessage = true
    }
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps in chatArea', nextProps)
    if (this.state.changedActiveSession) {
      this.previousScrollHeight = undefined
    }
    // // this.getDisabledValue()
    // if (nextProps.urlMeta) {
    //   if (!nextProps.urlMeta.type) {
    //     this.setState({displayUrlMeta: false})
    //   }
    //   this.setState({urlmeta: nextProps.urlMeta})
    // }
    // this.props.markRead(this.props.activeSession._id, this.props.sessions)
  }

  setEmoji (emoji) {
    this.setState({
      textAreaValue: this.state.textAreaValue + emoji.native,
      showEmojiPicker: false
    })
  }

  componentDidUpdate (nextProps) {
    console.log('in componentDidUpdate')
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
    return (
      <div className='col-xl-5'>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-portlet m-portlet--mobile'>
          <div style={{padding: '2.2rem 0rem 2.2rem 2.2rem'}} className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active m-scrollable' role='tabpanel'>
                <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
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
                                      { msg.payload.text && msg.payload.text.split(' ').length === 1 && isEmoji(msg.payload.text)
                                        ? <div className='m-messenger__message-content'>
                                          <div className='m-messenger__message-username'>
                                            {this.props.activeSession.name} reacted
                                          </div>
                                          <div style={{fontSize: '30px'}} className='m-messenger__message-text'>
                                            {msg.payload.text}
                                          </div>
                                        </div>
                                        : <div className='m-messenger__message-content'>
                                          <div className='m-messenger__message-username'>
                                            {this.props.activeSession.name} wrote
                                          </div>
                                          <div style={{display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
                                            {msg.payload.text}
                                          </div>
                                        </div>
                                      }
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
                                      { msg.payload.text && msg.payload.text.split(' ').length === 1 && isEmoji(msg.payload.text)
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <div style={{fontSize: '30px'}} className='m-messenger__message-text'>
                                              {msg.payload.text}
                                            </div>
                                          </div>
                                          {index === this.props.chat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <div style={{display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
                                              {msg.payload.text}
                                            </div>
                                          </div>
                                          {index === this.props.chat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                      }
                                    </div>
                                  </div>
                                </Element>
                              </div>
                            ))
                        }
                      </div>
                    </div>
                  </div>
                  <div className='m-messenger__seperator' />
                  <div className='m-messenger__form' style={{width: '93%', margin: 0}}>
                    <div className='m-input-icon m-input-icon--right m-messenger__form-controls'>
                      <textarea autoFocus ref={(input) => { this.textInput = input }} type='text' name='' placeholder='Type here...' onChange={this.handleTextChange} value={this.state.textAreaValue} onKeyPress={this.onEnter} className='m-messenger__form-input' style={{resize: 'none'}} />
                      <span id='emogiPickerChat' className='m-input-icon__icon m-input-icon__icon--right'>
                        <span>
                          <i className='fa fa-smile-o' style={{cursor: 'pointer'}} onClick={this.showEmojiPicker} />
                        </span>
                      </span>
                      <Popover placement='left' isOpen={this.state.showEmojiPicker} className='chatPopover' target='emogiPickerChat' toggle={this.toggleEmojiPicker}>
                        <PopoverBody>
                          <div>
                            <Picker
                              style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
                              emojiSize={24}
                              perLine={6}
                              skin={1}
                              set='facebook'
                              custom={[]}
                              autoFocus={false}
                              showPreview={false}
                              onClick={(emoji, event) => this.setEmoji(emoji)}
                            />
                          </div>
                        </PopoverBody>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
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
    chat: (state.smsChatInfo.chat),
    chatCount: (state.smsChatInfo.chatCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchChat,
    sendChatMessage,
    markRead
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
