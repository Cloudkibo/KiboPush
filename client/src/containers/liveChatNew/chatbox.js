/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import AlertContainer from 'react-alert'
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
// import Popover from 'react-simple-popover'
import Popover from '../../components/Popover/popover'
import StickerMenu from '../../components/StickerPicker/stickers'
import GiphyPicker from 'react-gif-picker'
import {
  isEmoji,
  getmetaurl,
  displayDate,
  showDate,
  validURL
} from './utilities'
import Halogen from 'halogen'
import Slider from 'react-slick'
import RightArrow from '../convo/RightArrow'
import LeftArrow from '../convo/LeftArrow'

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
      showGifPicker: false,
      gifUrl: '',
      urlmeta: '',
      prevURL: '',
      displayUrlMeta: false,
      showStickers: false
    }
    props.fetchUserChats(this.props.currentSession._id)
    props.markRead(this.props.currentSession._id, this.props.sessions)
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
    this.createGallery = this.createGallery.bind(this)
    this.getmainURL = this.getmainURL.bind(this)
    this.geturl = this.geturl.bind(this)
  }

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    this.scrollToBottom()
    this.scrollToTop()
  }

  scrollToBottom () {
    this.messagesEnd.scrollIntoView({behavior: 'instant'})
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  removeAttachment () {
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
    this.state.componentType = 'sticker'
    this.state.stickerUrl = sticker.image.hdpi
    let enterEvent = new Event('keypress')
    enterEvent.which = 13
    this.onEnter(enterEvent)
  }

  sendGif (gif) {
    this.state.componentType = 'gif'
    this.state.gifUrl = gif.downsized.url
    let enterEvent = new Event('keypress')
    enterEvent.which = 13
    this.onEnter(enterEvent)
  }

  sendThumbsUp () {
    this.state.componentType = 'thumbsUp'
    let enterEvent = new Event('keypress')
    enterEvent.which = 13
    this.onEnter(enterEvent)
  }

  resetFileComponent () {
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
      url_meta: this.state.urlmeta,
      datetime: new Date(),
      status: 'unseen', // seen or unseen
      replied_by: {
        type: 'agent',
        id: this.props.user._id,
        name: this.props.user.name
      }
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
        fileurl: {
          id: this.state.uploadedId,
          url: this.state.uploadedUrl
        }
      }
    } else if (component === 'gif') {
      payload = {
        componentType: this.state.componentType,
        fileurl: this.state.gifUrl
      }
    } else if (component === 'sticker') {
      payload = {
        componentType: this.state.componentType,
        fileurl: this.state.stickerUrl
      }
    } else if (component === 'text') {
      payload = {
        componentType: 'text',
        text: this.state.textAreaValue
      }
    } else if (component === 'thumbsUp') {
      payload = {
        componentType: 'thumbsUp',
        fileurl: 'https://app.kibopush.com/img/thumbsup.png'
      }
    }
    return payload
  }

  onEnter (e) {
    var isUrl = getmetaurl(this.state.textAreaValue)
    if (e.which === 13) {
      e.preventDefault()
      var payload = {}
      var session = this.props.currentSession
      var data = {}
      if (this.state.uploadedId !== '' && this.state.attachment) {
        payload = this.setDataPayload('attachment')
        data = this.setMessageData(session, payload)
        this.props.sendAttachment(data, this.handleSendAttachment)
        data.format = 'convos'
        this.props.userChat.push(data)
      } else if (isUrl !== null && isUrl !== '') {
        payload = this.setDataPayload('text')
        data = this.setMessageData(session, payload)
        this.props.sendChatMessage(data)
        this.setState({textAreaValue: '', urlmeta: {}, displayUrlMeta: false})
        data.format = 'convos'
        this.props.userChat.push(data)
      } else if (this.state.textAreaValue !== '') {
        payload = this.setDataPayload('text')
        data = this.setMessageData(session, payload)
        this.props.sendChatMessage(data)
        this.setState({textAreaValue: ''})
        data.format = 'convos'
        this.props.userChat.push(data)
      } else if (this.state.componentType === 'gif') {
        payload = this.setDataPayload('gif')
        data = this.setMessageData(session, payload)
        this.props.sendChatMessage(data)
        this.closeGif()
        data.format = 'convos'
        this.props.userChat.push(data)
      } else if (this.state.componentType === 'sticker') {
        payload = this.setDataPayload('sticker')
        data = this.setMessageData(session, payload)
        this.props.sendChatMessage(data)
        this.hideStickers()
        data.format = 'convos'
        this.props.userChat.push(data)
      } else if (this.state.componentType === 'thumbsUp') {
        payload = this.setDataPayload('thumbsUp')
        data = this.setMessageData(session, payload)
        this.props.sendChatMessage(data, session.companyId)
        data.format = 'convos'
        this.props.userChat.push(data)
        this.setState({textAreaValue: ''})
      }
    }
  }

  handleSendAttachment (res) {
    if (res.status === 'success') {
      this.resetFileComponent()
    }
  }

  handleRemove (res) {
    if (res.status === 'success') {
      this.resetFileComponent()
    }
    if (res.status === 'failed') {
      this.setState({uploaded: true, removeFileDescription: res.description})
    }
  }

  setComponentType (file) {
    if (file.type.match('image.*')) {
      this.setState({componentType: 'image'})
    } else if (file.type.match('audio.*')) {
      this.setState({componentType: 'audio'})
    } else if (file.type.match('video.*')) {
      this.setState({componentType: 'video'})
    } else if (file.type.match('application.*') || file.type.match('text.*')) {
      this.setState({componentType: 'file'})
    } else {
      this.setState({componentType: 'Not allowed'})
    }
  }

  onFileChange (e) {
    var files = e.target.files
    var file = e.target.files[files.length - 1]
    if (file) {
      this.resetFileComponent()
      this.setState({
        attachment: file,
        attachmentType: file.type
      })
      this.setComponentType(file)
      if (file.type === 'text/javascript' || file.type === 'text/exe') {
        this.msg.error('Cannot add js or exe files. Please select another file')
      } else if (file.size > 25000000) {
        this.msg.error('Files greater than 25MB not allowed')
      } else {
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
    this.textInput.focus()
  }
  handleUpload (res) {
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
    }
  }

  onTestURLAudio (url) {
    var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i
    var truef = AUDIO_EXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  componentWillReceiveProps (nextProps) {
    this.scrollToBottom()
    this.scrollToTop()
    if (nextProps.urlMeta) {
      if (!nextProps.urlMeta.type) {
        this.setState({displayUrlMeta: false})
      }
      this.setState({urlmeta: nextProps.urlMeta})
    }
    if (nextProps.userChat) {
    }
  }

  setEmoji (emoji) {
    this.setState({
      textAreaValue: this.state.textAreaValue + emoji.native,
      showEmojiPicker: false
    })
  }

  componentDidUpdate (nextProps) {
    this.scrollToBottom()
    this.scrollToTop()
    if (nextProps.userChat && nextProps.userChat.length > 0 && nextProps.userChat[0].session_id === this.props.currentSession._id) {
      this.props.markRead(this.props.currentSession._id, this.props.sessions)
    }
  }

  createGallery (cards) {
    var temp = []

    for (var i = 0; i < cards.length; i++) {
      temp.push({
        elemnet: (<div>
          <div style={{width: 200, borderRadius: '10px'}} className='ui-block hoverbordersolid'>
            <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
              <a href={cards[i].image_url} target='_blank'>
                <img style={{maxWidth: 180, borderRadius: '5px'}} src={cards[i].image_url} />
              </a>
            </div>
            <div style={{marginTop: '10px', padding: '5px'}}>
              <div style={{textAlign: 'left', fontWeight: 'bold'}}>{cards[i].title}</div>
              <div style={{textAlign: 'left', color: '#ccc'}}>{cards[i].subtitle}</div>
            </div>
          </div>
        </div>),
        key: i
      })
    }
    return (
      temp.map((card, i) => (
        <div key={card.key}>{card.element}</div>
      ))
    )
  }

  geturl (payload) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${payload.coordinates.lat},${payload.coordinates.long}&zoom=13&scale=false&size=400x200&maptype=roadmap&format=png&key=AIzaSyDDTb4NWqigQmW_qCVmSAkmZIIs3tp1x8Q&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${payload.coordinates.lat},${payload.coordinates.long}`
  }

  getmainURL (payload) {
    return `https://www.google.com/maps/place/${payload.coordinates.lat},${payload.coordinates.long}/`
  }

  render () {
    var settings = {
      arrows: true,
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <RightArrow />,
      prevArrow: <LeftArrow />
    }
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='col-xl-5'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <Popover
          style={{paddingBottom: '100px', width: '280px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
          placement='top'
          height='390px'
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
          style={{width: '305px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
          placement='top'
          height='360px'
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
          style={{width: '232px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
          placement='top'
          height='400px'
          target={this.gifs}
          show={this.state.showGifPicker}
          onHide={this.closeGif}
        >
          <div style={{marginLeft: '-15px', marginTop: '-20px'}}>
            <GiphyPicker onSelected={this.sendGif} />
          </div>
        </Popover>
        <div className='m-portlet m-portlet--mobile'>
          <div style={{padding: '1.3rem', borderBottom: '1px solid #ebedf2'}}>
            <button style={{backgroundColor: 'white'}} className='btn'>Status: {this.props.currentSession.is_assigned ? 'Assigned' : 'Unassigned'}</button>
            {
              this.props.currentSession.status === 'new'
              ? <button style={{float: 'right', borderColor: '#34bfa3'}} type='button' className='btn m-btn--square btn-outline-success'><i className='la la-check' /> Mark as done</button>
              : <button style={{float: 'right', borderColor: '#34bfa3'}} type='button' className='btn m-btn--square btn-outline-success'><i className='fa fa-envelope-open-o' /> Reopen</button>
            }
          </div>
          <div style={{padding: '2.2rem 0rem 2.2rem 2.2rem'}} className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active m-scrollable' role='tabpanel'>
                <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                  <div style={{height: '393px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                    <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                      <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                        {
                            this.props.userChat && this.props.userChat.map((msg, index) => (
                              msg.format === 'facebook'
                              ? <div key={index} style={{marginLeft: 0, marginRight: 0, display: 'block'}} className='row'>
                                {
                                  index === 0
                                  ? <div className='m-messenger__datetime'>
                                    {displayDate(msg.datetime)}
                                  </div>
                                  : index > 0 && showDate(this.props.userChat[index - 1].datetime, msg.datetime) &&
                                  <div className='m-messenger__datetime'>
                                    {displayDate(msg.datetime)}
                                  </div>
                                }
                                <div style={{minWidth: '200px', maxWidth: '200px'}} key={msg._id} className='m-messenger__message m-messenger__message--in'>
                                  <div className='m-messenger__message-pic'>
                                    <img src={this.props.currentSession.subscriber_id.profilePic} alt='' />
                                  </div>
                                  <div className='m-messenger__message-body'>
                                    <div className='m-messenger__message-arrow' />
                                    {
                                      msg.payload.attachments && !msg.url_meta
                                      ? (
                                        <div className='m-messenger__message-content'>
                                          <div className='m-messenger__message-username'>
                                            {this.props.currentSession.subscriber_id.firstName} shared
                                          </div>
                                          {
                                            msg.payload.attachments.map((att, index) => (
                                              att.type === 'video'
                                              ? <div key={index}>
                                                <ReactPlayer
                                                  url={att.payload.url}
                                                  controls
                                                  width='100%'
                                                  height='140px'
                                                  onPlay={this.onTestURLVideo(att.payload.url)}
                                                />
                                              </div>
                                              : att.type === 'audio'
                                              ? <div style={{marginTop: '40px'}} key={index}>
                                                <ReactPlayer
                                                  url={att.payload.url}
                                                  controls
                                                  width='100%'
                                                  height='auto'
                                                  onPlay={this.onTestURLAudio(att.payload.url)}
                                                />
                                              </div>
                                              : att.type === 'image'
                                              ? <a key={index} href={att.payload.url} target='_blank'>
                                                <img
                                                  src={att.payload.url}
                                                  style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
                                                />
                                              </a>
                                              : att.type === 'location'
                                              ? <table key={index} style={{border: '1px solid #ccc', borderRadius: '15px', borderCollapse: 'separate', padding: '5px'}}>
                                                <tbody>
                                                  <tr>
                                                    <td>
                                                      <a href={this.getmainURL(att.payload)} target='_blank'>
                                                        <img style={{width: '200px'}} src={this.geturl(att.payload)} />
                                                      </a>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td>
                                                      <p style={{fontWeight: 'bold'}}> {att.title} </p>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              : att.type === 'file' &&
                                              <a key={index} href={att.payload.url} target='_blank'>
                                                <h6 style={{marginTop: '10px'}}><i className='fa fa-file-text-o' /><strong> {att.payload.url.split('?')[0].split('/')[att.payload.url.split('?')[0].split('/').length - 1]}</strong></h6>
                                              </a>
                                            ))
                                          }
                                        </div>
                                      )
                                      : msg.url_meta
                                      ? <div className='m-messenger__message-content'>
                                        <div className='m-messenger__message-username'>
                                          {this.props.currentSession.subscriber_id.firstName} shared a link
                                        </div>
                                        <div style={{clear: 'both', display: 'block'}}>
                                          <div style={{borderRadius: '15px', backgroundColor: '#f0f0f0', minHeight: '20px', justifyContent: 'flex-end', boxSizing: 'border-box', clear: 'both', position: 'relative', display: 'inline-block'}}>
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
                                                          <p style={{color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', width: '200px'}}>{msg.url_meta.title}</p>
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
                                                          <p style={{color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', width: '200px'}}>{msg.url_meta.title}</p>
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
                                      : msg.payload.text.split(' ').length === 1 && isEmoji(msg.payload.text)
                                      ? <div className='m-messenger__message-content'>
                                        <div className='m-messenger__message-username'>
                                          {this.props.currentSession.subscriber_id.firstName} reacted
                                        </div>
                                        <div style={{fontSize: '30px'}} className='m-messenger__message-text'>
                                          {msg.payload.text}
                                        </div>
                                      </div>
                                      : <div className='m-messenger__message-content'>
                                        <div className='m-messenger__message-username'>
                                          {this.props.currentSession.subscriber_id.firstName} wrote
                                        </div>
                                        <div style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
                                          {msg.payload.text}
                                        </div>
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                              : <div key={index} style={{marginLeft: 0, marginRight: 0, display: 'block'}} className='row'>
                                {
                                  index === 0
                                  ? <div className='m-messenger__datetime'>
                                    {displayDate(msg.datetime)}
                                  </div>
                                  : index > 0 && showDate(this.props.userChat[index - 1].datetime, msg.datetime) &&
                                  <div className='m-messenger__datetime'>
                                    {displayDate(msg.datetime)}
                                  </div>
                                }
                                <div style={{minWidth: '200px'}} key={msg._id} className='m-messenger__message m-messenger__message--out'>
                                  <div className='m-messenger__message-body'>
                                    <div className='m-messenger__message-arrow' />
                                    {
                                      msg.payload.componentType &&
                                      (msg.payload.componentType === 'video'
                                      ? <div className='m-messenger__message-content'>
                                        <ReactPlayer
                                          url={msg.payload.fileurl.url}
                                          controls
                                          width='100%'
                                          height='140px'
                                          onPlay={this.onTestURLVideo(msg.payload.fileurl.url)}
                                        />
                                      </div>
                                      : msg.payload.componentType === 'audio'
                                      ? <div className='m-messenger__message-content'>
                                        <ReactPlayer
                                          url={msg.payload.fileurl.url}
                                          controls
                                          width='100%'
                                          height='auto'
                                          onPlay={this.onTestURLAudio(msg.payload.fileurl.url)}
                                        />
                                      </div>
                                      : msg.payload.componentType === 'file'
                                      ? <div className='m-messenger__message-content'>
                                        <a download={msg.payload.fileName} target='_blank' href={msg.payload.fileurl.url} >
                                          <h6 style={{color: 'white'}}><i className='fa fa-file-text-o' /><strong> {msg.payload.fileName}</strong></h6>
                                        </a>
                                      </div>
                                      : msg.payload.componentType === 'card'
                                      ? <div className='m-messenger__message-content'>
                                        <div>
                                          <div style={{maxWidth: 200, borderRadius: '10px'}} className='ui-block hoverbordersolid'>
                                            <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
                                              <a href={msg.payload.fileurl} target='_blank'>
                                                <img style={{maxWidth: 180, borderRadius: '5px'}} src={msg.payload.fileurl} />
                                              </a>
                                            </div>
                                            <div style={{marginTop: '10px', padding: '5px'}}>
                                              <div style={{textAlign: 'left', fontWeight: 'bold'}}>{msg.payload.title}</div>
                                              <div style={{textAlign: 'left', color: '#ccc'}}>{msg.payload.description}</div>
                                            </div>
                                          </div>
                                          {
                                            msg.payload.buttons && msg.payload.buttons.length > 0 &&
                                            msg.payload.buttons.map((b, i) => (
                                              <a key={i} href={b.url} target='_blank' style={{width: '100%', marginTop: '5px'}} className='btn btn-secondary btn-sm'>
                                                {b.title}
                                              </a>
                                            ))
                                          }
                                        </div>
                                      </div>
                                      : msg.payload.componentType === 'gallery'
                                      ? <div style={{width: '250px'}} className='m-messenger__message-content'>
                                        <Slider ref={(c) => { this.slider = c }} {...settings}>
                                          {
                                            msg.payload.cards.map((card, i) => (
                                              <div key={i}>
                                                <div id={i} style={{maxWidth: '200px', borderRadius: '10px'}} className='ui-block hoverbordersolid'>
                                                  <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
                                                    <a href={card.image_url} target='_blank'>
                                                      <img style={{maxWidth: 180, borderRadius: '5px'}} src={card.image_url} />
                                                    </a>
                                                  </div>
                                                  <div style={{marginTop: '10px', padding: '5px'}}>
                                                    <div style={{textAlign: 'left', fontWeight: 'bold'}}>{card.title}</div>
                                                    <div style={{textAlign: 'left', color: '#ccc'}}>{card.subtitle}</div>
                                                  </div>
                                                </div>
                                                {
                                                  card.buttons && card.buttons.length > 0 &&
                                                  card.buttons.map((b, i) => (
                                                    <a key={i} href={b.url} target='_blank' style={{width: '100%', marginTop: '5px'}} className='btn btn-secondary btn-sm'>
                                                      {b.title}
                                                    </a>
                                                  ))
                                                }
                                              </div>
                                            ))
                                          }
                                        </Slider>
                                      </div>
                                      : msg.payload.componentType === 'image'
                                      ? <div className='m-messenger__message-content'>
                                        <img
                                          src={msg.payload.fileurl.url}
                                          style={{maxWidth: '150px', maxHeight: '85px'}}
                                          />
                                      </div>
                                      : msg.payload.componentType === 'gif'
                                      ? <div className='m-messenger__message-content'>
                                        <img
                                          src={msg.payload.fileurl}
                                          style={{maxWidth: '150px', maxHeight: '85px'}}
                                        />
                                      </div>
                                      : msg.payload.componentType === 'sticker'
                                      ? <div className='m-messenger__message-content'>
                                        <img
                                          src={msg.payload.fileurl}
                                          style={{maxWidth: '150px', maxHeight: '85px'}}
                                        />
                                      </div>
                                      : msg.payload.componentType === 'thumbsUp'
                                      ? <div className='m-messenger__message-content'>
                                        <img
                                          src={msg.payload.fileurl}
                                          style={{maxWidth: '150px', maxHeight: '85px'}}
                                        />
                                      </div>
                                      : msg.url_meta && msg.url_meta !== ''
                                      ? (msg.url_meta.type
                                        ? <div className='m-messenger__message-content'>
                                          <div style={{clear: 'both', display: 'block'}}>
                                            <div style={{borderRadius: '15px', backgroundColor: '#f0f0f0', minHeight: '20px', justifyContent: 'flex-end', boxSizing: 'border-box', clear: 'both', position: 'relative', display: 'inline-block'}}>
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
                                                            <p style={{color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', width: '200px'}}>{msg.url_meta.title}</p>
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
                                                            <p style={{color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', width: '200px'}}>{msg.url_meta.title}</p>
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
                                        : <div className='m-messenger__message-content'>
                                          {
                                            validURL(msg.payload.text)
                                            ? <div style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
                                              <a style={{color: 'white'}} href={msg.payload.text} target='_blank'>
                                                <p>{msg.payload.text}</p>
                                              </a>
                                            </div>
                                            : <div style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
                                              {msg.payload.text}
                                            </div>
                                          }
                                        </div>
                                      )
                                      : msg.payload.text.split(' ').length === 1 && isEmoji(msg.payload.text)
                                      ? <div className='m-messenger__message-content'>
                                        <div style={{fontSize: '30px'}} className='m-messenger__message-text'>
                                          {msg.payload.text}
                                        </div>
                                      </div>
                                      : <div>
                                        <div className='m-messenger__message-content'>
                                          <div style={{textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text'>
                                            {msg.payload.text}
                                          </div>
                                        </div>
                                        {
                                          msg.payload.buttons && msg.payload.buttons.length > 0 &&
                                          msg.payload.buttons.map((b, i) => (
                                            <a key={i} href={b.url} target='_blank' style={{borderColor: '#716aca', width: '100%', marginTop: '5px'}} className='btn btn-outline-brand btn-sm'>
                                              {b.title}
                                            </a>
                                          ))
                                        }
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                        }
                        <div style={{float: 'left', clear: 'both'}}
                          ref={(el) => { this.messagesEnd = el }} />
                      </div>
                    </div>
                  </div>
                  <div className='m-messenger__seperator' />
                  <div className='m-messenger__form'>
                    <div className='m-messenger__form-controls'>
                      <input autoFocus ref={(input) => { this.textInput = input }} type='text' name='' placeholder='Type here...' onChange={this.handleTextChange} value={this.state.textAreaValue} onKeyPress={this.onEnter} className='m-messenger__form-input' />
                    </div>
                    <div className='m-messenger__form-tools'>
                      <a className='m-messenger__form-attachment'>
                        <i onClick={this.sendThumbsUp.bind(this)} className='la la-thumbs-o-up' />
                      </a>
                    </div>
                  </div>
                  { this.state.uploaded
                    ? <div style={{wordWrap: 'break-word', overFlow: 'auto', minHeight: '50px'}}>
                      <span onClick={this.removeAttachment} style={{cursor: 'pointer', float: 'right'}} className='fa-stack'>
                        <i style={{color: '#ccc'}} className='fa fa-times fa-stack-1x fa-inverse' />
                      </span>
                      <div><i className='fa fa-file-text-o' /> {this.state.attachment.name}</div>
                      <div style={{wordWrap: 'break-word', color: 'red', fontSize: 'small'}}>{this.state.removeFileDescription}</div>
                    </div>
                    : <div style={{wordWrap: 'break-word', color: 'red', fontSize: 'small'}}>{this.state.uploadDescription}</div>
                  }
                  <div>
                    <div style={{display: 'inline-block'}} data-tip='emoticons'>
                      <i style={styles.iconclass} onClick={() => {
                        this.refs.selectImage.click()
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
                      <input type='file' accept='image/*' onChange={this.onFileChange} onError={this.onFilesError}
                        ref='selectImage' style={styles.inputf} />
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
                            ref='selectFile' style={styles.inputf} disabled />
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
                            ref='selectFile' style={styles.inputf} />
                        </div>
                      }
                    </div>
                    {
                      /*
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
                      */
                    }
                  </div>
                  {
                    this.props.loadingUrl === true && this.props.urlValue === this.state.prevURL &&
                    <div className='align-center'>
                      <center><Halogen.RingLoader color='#716aca' /></center>
                    </div>
                  }
                  {
                     JSON.stringify(this.state.urlmeta) !== '{}' && this.props.loadingUrl === false &&
                     <div style={{clear: 'both', display: 'block'}}>
                       <div style={{borderRadius: '15px', backgroundColor: '#f0f0f0', minHeight: '20px', justifyContent: 'flex-end', boxSizing: 'border-box', clear: 'both', position: 'relative', display: 'inline-block'}}>
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
                                       <p style={{color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold'}}>{this.state.urlmeta.title}</p>
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
                                      <p style={{color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold'}}>{this.state.urlmeta.title}</p>
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
