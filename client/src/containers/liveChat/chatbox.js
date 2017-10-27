/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import {
  fetchUserChats,
  uploadAttachment,
  deletefile,
  sendAttachment,
  sendChatMessage,
  fetchUrlMeta,
  markRead
} from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'
import { Picker } from 'emoji-mart'
import Popover from 'react-simple-popover'
import StickerMenu from '../../components/StickerPicker/stickers'
import GiphyPicker from 'react-gif-picker'
import { isEmoji, getmetaurl } from './utilities'
import Halogen from 'halogen'

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
      uploadedUrl: '',
      removeFileDescription: '',
      textAreaValue: '',
      showEmojiPicker: false,
      showGif: false,
      gifUrl: '',
      urlmeta: {},
      prevURL: '',
      displayUrlMeta: false
    }
    props.fetchUserChats(this.props.session._id)
    props.markRead(this.props.session._id, this.props.sessions)
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
    this.showStickers = this.showStickers.bind(this)
    this.hideStickers = this.hideStickers.bind(this)
    this.sendSticker = this.sendSticker.bind(this)
    this.showGif = this.showGif.bind(this)
    this.closeGif = this.closeGif.bind(this)
    this.sendGif = this.sendGif.bind(this)
    this.setDataPayload = this.setDataPayload.bind(this)
    this.setMessageData = this.setMessageData.bind(this)
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
    this.messagesEnd.scrollIntoView({behavior: 'smooth'})
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

  showStickers () {
    this.setState({showStickers: true})
  }

  hideStickers () {
    this.setState({showStickers: false})
  }

  showGif () {
    this.setState({showGifPicker: true})
  }

  closeGif () {
    this.setState({showGifPicker: false})
  }

  sendSticker (sticker) {
    console.log('sending sticker', sticker)
    let payload = {
      componentType: 'sticker',
      stickerUrl: sticker.image.hdpi
    }
    this.setState(payload, () => {
      console.log('state inside sendSticker: ', this.state)
      let enterEvent = new Event('keypress')
      enterEvent.which = 13
      this.onEnter(enterEvent)
    })
  }

  sendGif (gif) {
    console.log('sending Gif', gif)
    this.state.componentType = 'gif'
    this.state.gifUrl = gif.downsized.url
    console.log('state inside sendGif: ', this.state)
    let enterEvent = new Event('keypress')
    enterEvent.which = 13
    this.onEnter(enterEvent)
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
      removeFileDescription: '',
      showGifPicker: false
    })
  }

  handleTextChange (e) {
    var isUrl = getmetaurl(e.target.value)
    console.log('isUrl', isUrl)
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
      sender_id: session.page_id._id, // this is the page id: _id of Pageid
      recipient_id: session.subscriber_id._id, // this is the subscriber id: _id of subscriberId
      sender_fb_id: session.page_id.pageId, // this is the (facebook) :page id of pageId
      recipient_fb_id: session.subscriber_id.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
      session_id: session._id,
      company_id: session.company_id, // this is admin id till we have companies
      payload: payload, // this where message content will go
      url_meta: '',
      status: 'unseen' // seen or unseen
    }
    return data
  }
  setDataPayload (component) {
    var payload = ''
    if (component === 'attachment') {
      payload = {
        componentType: this.state.componentType,
        fileName: this.state.attachment.name,
        size: this.state.attachment.size,
        type: this.state.attachmentType,
        fileurl: this.state.uploadedUrl
      }
    } else if (component === 'gif') {
      payload = {
        componentType: this.state.componentType,
        fileurl: this.state.gifUrl
      }
    } else if (component === 'sticker') {
      payload = {
        componentType: thihs.state.componentType,
        fileurl: this.state.stickerUrl
      }
    }
    return payload
  }

  onEnter (e) {
    console.log('event in onEnter' + e)
    var isUrl = getmetaurl(this.state.textAreaValue)
    if (e.which === 13) {
      e.preventDefault()
      console.log('state in onEnter: ', this.state)
      var payload = {}
      var session = this.props.session
      var data = {}
      if (this.state.uploadedId !== '' && this.state.attachment) {
        payload = this.setDataPayload('attachment')
        data = this.setMessageData(session, payload)
        console.log(data)
        this.props.sendAttachment(data, this.handleSendAttachment)
        data.format = 'convos'
        this.props.userChat.push(data)
      } else if (isUrl !== null && isUrl !== '') {
        payload = {
          componentType: 'text',
          text: this.state.textAreaValue
        }
        data = {
          sender_id: session.page_id._id, // this is the page id: _id of Pageid
          recipient_id: session.subscriber_id._id, // this is the subscriber id: _id of subscriberId
          sender_fb_id: session.page_id.pageId, // this is the (facebook) :page id of pageId
          recipient_fb_id: session.subscriber_id.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
          session_id: session._id,
          company_id: session.company_id, // this is admin id till we have companies
          payload: payload, // this where message content will go
          url_meta: this.state.urlmeta,
          status: 'unseen' // seen or unseen
        }
        console.log(data)
        this.props.sendChatMessage(data)
        this.setState({textAreaValue: '', urlmeta: {}, displayUrlMeta: false})
        data.format = 'convos'
        this.props.userChat.push(data)
      } else if (this.state.textAreaValue !== '') {
        payload = {
          componentType: 'text',
          text: this.state.textAreaValue
        }
        data = {
          sender_id: session.page_id._id, // this is the page id: _id of Pageid
          recipient_id: session.subscriber_id._id, // this is the subscriber id: _id of subscriberId
          sender_fb_id: session.page_id.pageId, // this is the (facebook) :page id of pageId
          recipient_fb_id: session.subscriber_id.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
          session_id: session._id,
          company_id: session.company_id, // this is admin id till we have companies
          payload: payload, // this where message content will go
          url_meta: '',
          status: 'unseen' // seen or unseen
        }
        console.log(data)
        this.props.sendChatMessage(data)
        this.setState({textAreaValue: ''})
        data.format = 'convos'
        this.props.userChat.push(data)
      } else if (this.state.componentType === 'gif') {
        payload = this.setDataPayload('gif')
        data = this.setMessageData(session, payload)
        console.log(data)
        this.props.sendChatMessage(data)
        this.closeGif()
        data.format = 'convos'
        this.props.userChat.push(data)
      } else if (this.state.componentType === 'sticker') {
        payload = this.setDataPayload('sticker')
        data = this.setMessageData(session, payload)
        console.log(data)
        this.props.sendChatMessage(data)
        data.format = 'convos'
        this.props.userChat.push(data)
      }
    }
  }

  sendThumbsUp () {
    let payload = {
      uploadedId: new Date().getTime(),
      componentType: 'image',
      uploadedUrl: 'https://scontent.xx.fbcdn.net/v/t39.1997-6/851557_369239266556155_759568595_n.png?_nc_ad=z-m&_nc_cid=0&oh=8bfd127ce3a4ae8c53f87b0e29eb6de5&oe=5A761DDC'
    }
    this.setState(payload, () => {
      console.log('state inside sendThumbsUp: ', this.state)
      let enterEvent = new Event('keypress')
      enterEvent.which = 13
      this.onEnter(enterEvent)
    })
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
      this.setState({uploaded: true, uploadDescription: '', removeFileDescription: '', uploadedId: res.payload.id, uploadedUrl: res.payload.url})
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
    this.scrollToBottom()
    if (nextProps.urlMeta) {
      if (!nextProps.urlMeta.type) {
        this.setState({displayUrlMeta: false})
      }
      this.setState({urlmeta: nextProps.urlMeta})
    }
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
    this.scrollToBottom()
    this.props.markRead(this.props.session._id, this.props.sessions)
  }

  render () {
    console.log('current session', this.props.session)
    return (
      <div className='ui-block popup-chat' style={{zIndex: 0}}>
        {
          this.state.displayUrlMeta
          ? <div className='ui-block-title'>
            <span className='icon-status online' />
            <h6 className='title'>{this.props.session.subscriber_id.firstName + ' ' + this.props.session.subscriber_id.lastName}</h6>
          </div>
          : <div style={{marginTop: '28px'}} className='ui-block-title'>
            <span className='icon-status online' />
            <h6 className='title'>{this.props.session.subscriber_id.firstName + ' ' + this.props.session.subscriber_id.lastName}</h6>
          </div>
        }
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

        <Popover
          style={{ width: '305px', height: '360px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25 }}
          placement='top'
          target={this.stickers}
          show={this.state.showStickers}
          onHide={this.hideStickers}
        >
          <StickerMenu
            apiKey={'80b32d82b0c7dc5c39d2aafaa00ba2bf'}
            userId={'imran.shoukat@khi.iba.edu.pk'}
            sendSticker={this.sendSticker}
          />
        </Popover>
        <Popover
          style={{ width: '305px', height: '360px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25 }}
          placement='top'
          target={this.gifs}
          show={this.state.showGifPicker}
          onHide={this.closeGif}
        >
          <div>
            <GiphyPicker onSelected={this.sendGif} />
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
                        <img style={{width: '34px', height: '34px'}} src={this.props.user.profilePic} alt='author' />
                      </div>
                      {
                        msg.payload.componentType && (msg.payload.componentType === 'video'
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
                                height='auto'
                                onPlay={this.onTestURLAudio(msg.payload.fileurl)}
                              />
                            </div>
                          </div>
                          : msg.payload.componentType === 'file'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-right'>
                              <a download={msg.payload.fileName} target='_blank' href={msg.payload.fileurl} style={{color: 'blue', textDecoration: 'underline'}} >{msg.payload.fileName}</a>
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
                          : msg.payload.componentType === 'gif'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-right'>
                              <img
                                src={msg.payload.fileurl}
                                style={{maxWidth: '150px', maxHeight: '85px'}}
                              />
                            </div>
                          </div>
                          : msg.url_meta && msg.url_meta !== '' && msg.url_meta !== '{}'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-right'>
                              <div style={{clear: 'both', display: 'block'}}>
                                <div className='wrapperforURL'>
                                  <table style={{maxWidth: '175px'}}>
                                    {
                                      msg.url_meta.type && msg.url_meta.type === 'video'
                                      ? <tbody>
                                        <tr>
                                          <td style={{width: '30%'}} colspan='2'>
                                            <ReactPlayer
                                              url={msg.url_meta.url}
                                              controls
                                              width='100%'
                                              height='100px'
                                            />
                                          </td>
                                          <td style={{width: '70%'}}>
                                            <div>
                                              <a href={msg.url_meta.url} target='_blank'>
                                                <p className='urlTitle'>{msg.url_meta.title}</p>
                                              </a>
                                              <br />
                                              <p style={{marginTop: '-35px', color: '#696d75'}}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                      : <tbody>
                                        <tr>
                                          <td>
                                            <div style={{width: 45, height: 45}}>
                                              {
                                                msg.url_meta.image &&
                                                <img src={msg.url_meta.image.url} style={{width: 45, height: 45}} />
                                              }
                                            </div>
                                          </td>
                                          <td>
                                            <div>
                                              <a href={msg.url_meta.url} target='_blank'>
                                                <p className='urlTitle'>{msg.url_meta.title}</p>
                                              </a>
                                              <br />
                                              {
                                                msg.url_meta.description &&
                                                <p style={{marginTop: '-35px', color: '#696d75'}}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
                                              }
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    }
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          : msg.payload.text.split(' ').length === 1 && isEmoji(msg.payload.text)
                          ? <div className='notification-event'>
                            <span className='emojis-right'>{msg.payload.text}</span>
                            {/**
                              <span className='notification-date'><time className='entry-date updated' datetime='2004-07-24T18:18'>{msg.timestamp}</time></span>
                            **/}
                          </div>
                          : <div className='notification-event'>
                            <span className='chat-message-item-right'>{msg.payload.text}</span>
                            {/**
                              <span className='notification-date'><time className='entry-date updated' datetime='2004-07-24T18:18'>{msg.timestamp}</time></span>
                            **/}
                          </div>
                        )
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
                                height='auto'
                                onPlay={this.onTestURLAudio(msg.payload.attachments[0].payload.url)}
                              />
                            </div>
                          </div>
                          : msg.payload.attachments[0].type === 'image'
                          ? <div className='notification-event'>
                            <div className='facebook-chat-left'>
                              <a href={msg.payload.attachments[0].payload.url} target='_blank'>
                                <img
                                  src={msg.payload.attachments[0].payload.url}
                                  style={{maxWidth: '150px', maxHeight: '85px'}}
                                />
                              </a>
                            </div>
                          </div>
                          : msg.url_meta
                          ? <div className='notification-event'>
                            <div className='facebook-chat-left'>
                              <div style={{clear: 'both', display: 'block'}}>
                                <div className='wrapperforURL'>
                                  <table style={{maxWidth: '175px'}}>
                                    {
                                      msg.url_meta.type && msg.url_meta.type === 'video'
                                      ? <tbody>
                                        <tr>
                                          <td style={{width: '30%'}} colspan='2'>
                                            <ReactPlayer
                                              url={msg.url_meta.url}
                                              controls
                                              width='100%'
                                              height='100px'
                                            />
                                          </td>
                                          <td style={{width: '70%'}}>
                                            <div>
                                              <a href={msg.url_meta.url} target='_blank'>
                                                <p className='urlTitle'>{msg.url_meta.title}</p>
                                              </a>
                                              <br />
                                              <p style={{marginTop: '-35px'}}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                      : <tbody>
                                        <tr>
                                          <td>
                                            <div style={{width: 45, height: 45}}>
                                              {
                                                msg.url_meta.image &&
                                                <img src={msg.url_meta.image.url} style={{width: 45, height: 45}} />
                                              }
                                            </div>
                                          </td>
                                          <td>
                                            <div>
                                              <a href={msg.url_meta.url} target='_blank'>
                                                <p className='urlTitle'>{msg.url_meta.title}</p>
                                              </a>
                                              <br />
                                              {
                                                msg.url_meta.description &&
                                                <p style={{marginTop: '-35px'}}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
                                              }
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    }
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          : <div className='notification-event'>
                            <div className='facebook-chat-left'>
                              <a href={msg.payload.attachments[0].payload.url} target='_blank'>
                                <h6><i className='fa fa-file-text-o' /><strong> {msg.payload.attachments[0].payload.url.split('?')[0].split('/')[msg.payload.attachments[0].payload.url.split('?')[0].split('/').length - 1]}</strong></h6>
                              </a>
                            </div>
                          </div>
                        )
                        : msg.payload.text.split(' ').length === 1 && isEmoji(msg.payload.text)
                        ? <div className='notification-event'>
                          <span className='emojis-left'>{msg.payload.text}</span>
                          {/**
                            <span className='notification-date'><time className='entry-date updated' datetime='2004-07-24T18:18'>{msg.timestamp}</time></span>
                          **/}
                        </div>
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
            <div style={{float: 'left', clear: 'both'}}
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
              <div ref={(c) => { this.gifs = c }} style={{display: 'inline-block'}} data-tip='GIF'>
                <i onClick={this.showGif} style={styles.iconclass}>
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
            <div />
            {
              this.props.loadingUrl === true && this.props.urlValue === this.state.prevURL &&
              <div className='align-center'>
                <center><Halogen.RingLoader color='#FF5E3A' /></center>
              </div>
            }
            {
               JSON.stringify(this.state.urlmeta) !== '{}' && this.props.loadingUrl === false &&
               <div style={{clear: 'both', display: 'block'}}>
                 <div className='wrapperforURL'>
                   <table style={{maxWidth: '318px'}}>
                     {
                       this.state.urlmeta.type && this.state.urlmeta.type === 'video'
                       ? <tbody>
                         <tr>
                           <td style={{width: '30%'}} colspan='2'>
                             <ReactPlayer
                               url={this.state.urlmeta.url}
                               controls
                               width='100%'
                               height='100px'
                             />
                           </td>
                           <td style={{width: '70%'}}>
                             <div>
                               <a href={this.state.urlmeta.url} target='_blank'>
                                 <p className='urlTitle'>{this.state.urlmeta.title}</p>
                               </a>
                               <br />
                               <p style={{marginTop: '-35px'}}>{this.state.urlmeta.description.length > 25 ? this.state.urlmeta.description.substring(0, 24) + '...' : this.state.urlmeta.description}</p>
                             </div>
                           </td>
                         </tr>
                       </tbody>
                      : <tbody>
                        <tr>
                          <td>
                            <div style={{width: 45, height: 45}}>
                              {
                                this.state.urlmeta.image &&
                                  <img src={this.state.urlmeta.image.url} style={{width: 45, height: 45}} />
                              }
                            </div>
                          </td>
                          <td>
                            <div>
                              <a href={this.state.urlmeta.url} target='_blank'>
                                <p className='urlTitle'>{this.state.urlmeta.title}</p>
                              </a>
                              <br />
                              {
                                this.state.urlmeta.description &&
                                  <p style={{marginTop: '-35px'}}>{this.state.urlmeta.description.length > 25 ? this.state.urlmeta.description.substring(0, 24) + '...' : this.state.urlmeta.description}</p>
                              }
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    }
                   </table>
                 </div>
               </div>
            }
          </div>
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
    urlValue: (state.liveChat.urlValue),
    loadingUrl: (state.liveChat.loadingUrl),
    urlMeta: (state.liveChat.urlMeta),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchUserChats: (fetchUserChats),
    uploadAttachment: (uploadAttachment),
    deletefile: (deletefile),
    sendAttachment: (sendAttachment),
    sendChatMessage: (sendChatMessage),
    fetchUrlMeta: (fetchUrlMeta),
    markRead: (markRead)
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
