/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { fetchUserChats, uploadAttachment, deletefile, sendAttachment } from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'
import { Picker } from 'emoji-mart'
import Popover from 'react-simple-popover'

const styles = {
  iconclass: {
    height: 24,
    padding: '0 15px',
    width: 24,
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer'
  },
  inputf: {
    display: 'none'
  }
}

class ChatBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      attachment: [],
      attachmentType: '',
      componentType: '',
      uploaded: false,
      uploadDescription: '',
      uploadedId: '',
      removeFileDescription: '',
      textAreaValue: '',
      showEmojiPicker: false
    }
    props.fetchUserChats(this.props.session._id)
    this.onFileChange = this.onFileChange.bind(this)
    this.setComponentType = this.setComponentType.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.resetFileComponent = this.resetFileComponent.bind(this)
    this.handleSendAttachment = this.handleSendAttachment.bind(this)
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.onTestURLAudio = this.onTestURLAudio.bind(this)
    this.showEmojiPicker = this.showEmojiPicker.bind(this)
    this.closeEmojiPicker = this.closeEmojiPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    console.log('componentDidMount called')
    this.scrollToBottom()
  }

  scrollToBottom () {
    var target = ReactDOM.findDOMNode(this.messagesEnd)
    target.scrollIntoView({behavior: 'smooth'})
  }

  removeAttachment () {
    console.log('remove', this.state.uploadedId)
    if (this.state.uploadedId !== '') {
      this.props.deletefile(this.state.uploadedId, this.handleRemove)
    }
  }

  showEmojiPicker () {
    this.setState({showEmojiPicker: true})
  }

  closeEmojiPicker () {
    this.setState({showEmojiPicker: false})
  }

  resetFileComponent () {
    console.log('resettingFileComponent')
    this.setState({
      attachment: [],
      attachmentType: '',
      componentType: '',
      uploaded: false,
      uploadDescription: '',
      uploadedId: '',
      removeFileDescription: ''
    })
  }

  handleTextChange (e) {
    this.setState({
      textAreaValue: e.target.value
    })
  }

  onEnter (e) {
    console.log('event in onEnter' + e)
    if (e.which === 13) {
      e.preventDefault()
      console.log('state in onEnter: ', this.state)
      if (this.state.uploadedId !== '') {
        var payload = {
          componentType: this.state.componentType,
          fileName: this.state.attachment.name,
          fileurl: this.state.uploadedId,
          size: this.state.attachment.size,
          type: this.state.attachmentType
        }
      }
      var session = this.props.session
      var data = {
        sender_id: session.page_id._id, // this is the page id: _id of Pageid
        recipient_id: session.subscriber_id._id, // this is the subscriber id: _id of subscriberId
        sender_fb_id: session.page_id.pageId, // this is the (facebook) :page id of pageId
        recipient_fb_id: session.subscriber_id.pageId, // this is the (facebook) subscriber id : pageid of subscriber id
        session_id: session._id,
        company_id: session.company_id, // this is admin id till we have companies
        payload: payload, // this where message content will go
        url_meta: '',
        status: 'unseen' // seen or unseen
      }
    }
    console.log(data)
    this.props.sendAttachment(data, this.handleSendAttachment)
  }

  sendThumbsUp () {
    let payload = {
      uploadedId: new Date().getTime(),
      componentType: 'image',
      fileurl: 'https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m&_nc_cid=0&oh=8bfd127ce3a4ae8c53f87b0e29eb6de5&oe=5A761DDC'
    }
    this.setState(payload)
    console.log('state inside sendThumbsUp: ', this.state)
    let enterEvent = new Event('keypress')
    enterEvent.which = 13
    this.onEnter(enterEvent)
  }

  handleSendAttachment (res) {
    if (res.status === 'success') {
      this.resetFileComponent()
    }
  }

  handleRemove (res) {
    console.log('handle remove', res)
    if (res.status === 'success') {
      this.resetFileComponent()
    }
    if (res.status === 'failed') {
      this.setState({uploaded: true, removeFileDescription: res.description})
    }
    console.log(this.state)
  }

  setComponentType (file) {
    if (file.type.match('image.*')) {
      this.setState({componentType: 'image'})
    } else if (file.type.match('audio.*')) {
      this.setState({componentType: 'audio'})
    } else if (file.type.match('video.*')) {
      this.setState({componentType: 'audio'})
    } else if (file.type.match('application.*') || file.type.match('text.*')) {
      this.setState({componentType: 'file'})
    } else {
      this.setState({componentType: 'Not allowed'})
    }
    console.log(this.state.componentType)
  }

  onFileChange (e) {
    console.log('onFileChange')
    var files = e.target.files
    var file = e.target.files[files.length - 1]
    if (file) {
      this.resetFileComponent()
      console.log('OnFileChange', file)
      this.setState({
        attachment: file,
        attachmentType: file.type
      })
      this.setComponentType(file)
      var fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      fileData.append('componentType', this.state.componentType)
      this.setState({uploadDescription: 'File is uploading..'})
      this.props.uploadAttachment(fileData, this.handleUpload)
    }
  }
  handleUpload (res) {
    console.log('handleUpload', res)
    if (res.status === 'failed') {
      this.setState({
        uploaded: false,
        attachment: [],
        uploadDescription: res.description,
        attachmentType: '',
        componentType: '',
        uploadedId: '',
        removeFileDescription: ''
      })
    }
    if (res.status === 'success') {
      this.setState({ uploaded: true, uploadDescription: '', removeFileDescription: '', uploadedId: res.payload })
      this.props.fetchUserChats(this.props.session._id)
    }
  }

  onTestURLVideo (url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
      alert('Video File Format not supported. Please download.')
    }
  }

  onTestURLAudio (url) {
    var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i
    var truef = AUDIO_EXTENSIONS.test(url)

    if (truef === false) {
      alert('Audio File Format not supported. Please download.')
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.userChat) {
      console.log('user chats updated', nextProps.userChat)
    }
  }

  setEmoji (emoji) {
    console.log('selected emoji', emoji)
    this.setState({
      textAreaValue: this.state.textAreaValue + emoji.native,
      showEmojiPicker: false
    })
  }

  componentDidUpdate (nextProps) {
    // this.scrollToBottom()
  }

  render () {
    console.log('current session', this.props.session)
    return (
      <div className='ui-block popup-chat' style={{zIndex: 0}}>
        <div style={{marginTop: '28px'}} className='ui-block-title'>
          <span className='icon-status online' />
          <h6 className='title'>{this.props.session.subscriber_id.firstName + ' ' + this.props.session.subscriber_id.lastName}</h6>
        </div>
        <Popover
          style={{paddingBottom: '100px', width: '280px', height: '390px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
          placement='top'
          target={this.target}
          show={this.state.showEmojiPicker}
          onHide={this.closeEmojiPicker}
        >
          <div>
            <Picker
              style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
              emojiSize={24}
              perLine={7}
              skin={1}
              set='facebook'
              custom={[]}
              autoFocus={false}
              showPreview={false}
              onClick={(emoji, event) => this.setEmoji(emoji)}
            />
          </div>
        </Popover>
        <div className='mCustomScrollbar ps ps--theme_default' data-mcs-theme='dark' data-ps-id='380aaa0a-c1ab-f8a3-1933-5a0d117715f0'>
          <ul style={{maxHeight: '275px', minHeight: '275px', overflowY: 'scroll'}} className='notification-list chat-message chat-message-field'>
            {
              this.props.userChat && this.props.userChat.map((msg) => (
                msg.format === 'convos'
                  ? (
                    <li>
                      <div className='author-thumb-right'>
                        <img style={{width: '34px', height: '34px'}} src={this.props.session.subscriber_id.profilePic} alt='author' />
                      </div>
                      {
                        msg.payload.componentType
                        ? (msg.payload.componentType === 'video'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-right'>
                              <ReactPlayer
                                url={msg.payload.fileurl}
                                controls
                                width='100%'
                                height='140'
                                onPlay={this.onTestURLVideo(msg.payload.fileurl)}
                              />
                            </div>
                          </div>
                          : msg.payload.componentType === 'audio'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-right'>
                              <ReactPlayer
                                url={msg.payload.fileurl}
                                controls
                                width='100%'
                                height='140'
                                onPlay={this.onTestURLAudio(msg.payload.fileurl)}
                              />
                            </div>
                          </div>
                          : msg.payload.componentType === 'file'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-right'>
                              <a href={msg.upload.fileurl} download >{msg.upload.fileName}</a>
                            </div>
                          </div>
                          : msg.payload.componentType === 'image'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-right'>
                              <img
                                src={msg.payload.fileurl}
                                style={{maxWidth: '150px', maxHeight: '85px'}}
                              />
                            </div>
                          </div>
                          : <div className='notification-event'>
                            <div className='facebook-chat-right'>
                              <h6 style={{color: '#fff'}}><i className='fa fa-file-text-o' /><strong> {msg.payload.fileurl.split('?')[0].split('/')[msg.payload.fileurl.split('?')[0].split('/').length - 1]}</strong></h6>
                            </div>
                          </div>
                        )
                        : <div className='notification-event'>
                          <span className='chat-message-item-right'>{msg.payload.text}</span>
                          {/**
                            <span className='notification-date'><time className='entry-date updated' datetime='2004-07-24T18:18'>{msg.timestamp}</time></span>
                          **/}
                        </div>
                      }
                    </li>
                  )
                  : (
                    <li>
                      <div className='author-thumb-left'>
                        <img style={{width: '34px', height: '34px'}} src={this.props.session.subscriber_id.profilePic} alt='author' />
                      </div>
                      {
                        msg.payload.attachments
                        ? (msg.payload.attachments[0].type === 'video'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-left'>
                              <ReactPlayer
                                url={msg.payload.attachments[0].payload.url}
                                controls
                                width='100%'
                                height='140'
                                onPlay={this.onTestURLVideo(msg.payload.attachments[0].payload.url)}
                              />
                            </div>
                          </div>
                          : msg.payload.attachments[0].type === 'audio'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-left'>
                              <ReactPlayer
                                url={msg.payload.attachments[0].payload.url}
                                controls
                                width='100%'
                                height='140'
                                onPlay={this.onTestURLAudio(msg.payload.attachments[0].payload.url)}
                              />
                            </div>
                          </div>
                          : msg.payload.attachments[0].type === 'image'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-left'>
                              <img
                                src={msg.payload.attachments[0].payload.url}
                                style={{maxWidth: '150px', maxHeight: '85px'}}
                              />
                            </div>
                          </div>
                          : <div className='notification-event'>
                            <div className='facebook-chat-left'>
                              <h6><i className='fa fa-file-text-o' /><strong> {msg.payload.attachments[0].payload.url.split('?')[0].split('/')[msg.payload.attachments[0].payload.url.split('?')[0].split('/').length - 1]}</strong></h6>
                            </div>
                          </div>
                        )
                        : <div className='notification-event'>
                          <span className='chat-message-item-left'>{msg.payload.text}</span>
                          {/**
                            <span className='notification-date'><time className='entry-date updated' datetime='2004-07-24T18:18'>{msg.timestamp}</time></span>
                          **/}
                        </div>
                      }
                    </li>
                  )
              ))}
            <div style={{float: 'left'}}
              ref={(el) => { this.messagesEnd = el }} />
          </ul>
          <div className='ps__scrollbar-x-rail' ><div className='ps__scrollbar-x' tabindex='0' /></div>
        </div>
        <form>
          <div className='form-group label-floating is-empty'>
            <label className='control-label'>Press enter to send message...</label>
            <textarea className='form-control' placeholder='' onChange={this.handleTextChange} value={this.state.textAreaValue} onKeyPress={this.onEnter} />
            { this.state.uploaded
              ? <div style={{backgroundColor: '#f1ecec', wordWrap: 'break-word', overFlow: 'auto', minHeight: '50px'}}>
                <span onClick={this.removeAttachment} style={{cursor: 'pointer', float: 'right'}} className='fa-stack'>
                  <i style={{color: '#ccc'}} className='fa fa-circle fa-stack-2x' />
                  <i className='fa fa-times fa-stack-1x fa-inverse' />
                </span>
                <div>{this.state.attachment.name}</div>
                <div style={{wordWrap: 'break-word', color: 'red', fontSize: 'small'}}>{this.state.removeFileDescription}</div>
              </div>
              : <div style={{wordWrap: 'break-word', color: 'red', fontSize: 'small'}}>{this.state.uploadDescription}</div>
            }
            <div>
              <div style={{display: 'inline-block'}} data-tip='emoticons'>
                <i style={styles.iconclass} onClick={() => {
                  this.refs.selectFile.click()
                }}>
                  <i style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '1em',
                    margin: '5px',
                    textAlign: 'center'
                  }} className='fa fa-file-image-o' />
                </i>
              </div>
              <div style={{display: 'inline-block'}} data-tip='attachments'>
                { this.state.uploadedId !== ''
                  ? <div>
                    <i style={styles.iconclass} onClick={() => {
                      this.refs.selectFile.click()
                    }}>
                      <i style={{
                        fontSize: '20px',
                        position: 'absolute',
                        left: '0',
                        width: '100%',
                        height: '2em',
                        margin: '5px',
                        textAlign: 'center',
                        color: 'lightgrey'
                      }} className='fa fa-paperclip' />
                    </i>
                    <input type='file' accept='image/*,audio/*,video/*,application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf' onChange={this.onFileChange} onError={this.onFilesError}
                      multiple='false' ref='selectFile' style={styles.inputf} disabled />
                  </div>
                  : <div>
                    <i style={styles.iconclass} onClick={() => {
                      this.refs.selectFile.click()
                    }}>
                      <i style={{
                        fontSize: '20px',
                        position: 'absolute',
                        left: '0',
                        width: '100%',
                        height: '2em',
                        margin: '5px',
                        textAlign: 'center'
                      }} className='fa fa-paperclip' />
                    </i>
                    <input type='file' accept='image/*,audio/*,video/*,application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf' onChange={this.onFileChange} onError={this.onFilesError}
                      multiple='false' ref='selectFile' style={styles.inputf} />
                  </div>
                }
              </div>
              <div ref={(c) => { this.target = c }} style={{display: 'inline-block'}} data-tip='emoticons'>
                <i onClick={this.showEmojiPicker} style={styles.iconclass}>
                  <i style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '2em',
                    margin: '5px',
                    textAlign: 'center',
                    color: '#787878'
                  }} className='fa fa-smile-o' />
                </i>
              </div>

              <div ref={(c) => { this.stickers = c }} style={{display: 'inline-block'}} data-tip='stickers'>
                <i onClick={this.showStickers} style={styles.iconclass}>
                  <i style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '2em',
                    margin: '5px',
                    textAlign: 'center'
                  }} className='fa fa-file-o' />
                  <i style={{
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    margin: '5px',
                    fontSize: '12px',
                    bottom: -4
                  }}
                    className='center fa fa-smile-o' />
                </i>
              </div>
              <div style={{display: 'inline-block'}} data-tip='GIF'>
                <i style={styles.iconclass}>
                  <i style={{
                    fontSize: '20px',
                    position: 'absolute',
                    left: '0',
                    width: '100%',
                    height: '2em',
                    margin: '5px',
                    textAlign: 'center'
                  }} className='fa fa-file-o' />
                  <p style={{
                    position: 'absolute',
                    text: 'GIF',
                    left: '0',
                    width: '100%',
                    textAlign: 'center',
                    margin: '5px',
                    fontSize: '8px',
                    bottom: -5
                  }}>GIF</p>
                </i>
              </div>
              <div style={{display: 'inline-block', float: 'right'}} data-tip='Thumbs Up' onClick={this.sendThumbsUp.bind(this)}>
                <i style={styles.iconclass}>
                  <i style={{
                    fontSize: '20px',
                    color: '#0099e6',
                    position: 'absolute',
                    right: '0',
                    width: '100%',
                    height: '2.5em',
                    margin: '5px',
                    textAlign: 'center'
                  }} className='fa fa-thumbs-up' />
                </i>
              </div>
            </div>
            <div className='add-options-message'>
              <div className='options-message smile-block'>
                <ul className='more-dropdown more-with-triangle triangle-bottom-right'>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat1.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat2.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat3.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat4.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat5.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat6.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat7.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat8.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat9.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat10.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat11.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat12.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat13.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat14.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat15.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat16.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat17.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat18.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat19.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat20.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat21.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat22.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat23.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat24.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat25.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat26.png' alt='icon' />
                    </a>
                  </li>
                  <li>
                    <a href='#'>
                      <img src='img/icon-chat27.png' alt='icon' />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <span className='material-input' /></div>
        </form>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    userChat: (state.liveChat.userChat),
    sessions: (state.liveChat.sessions),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchUserChats: (fetchUserChats),
    uploadAttachment: (uploadAttachment),
    deletefile: (deletefile),
    sendAttachment: (sendAttachment)
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
