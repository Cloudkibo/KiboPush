/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import AlertContainer from 'react-alert'
import {
  fetchOpenSessions,
  fetchUserChats,
  uploadAttachment,
  deletefile,
  sendAttachment,
  sendChatMessage,
  fetchUrlMeta,
  markRead,
  changeStatus,
  sendNotifications,
  fetchTeamAgents
} from '../../redux/actions/livechat.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPlayer from 'react-player'
import { Picker } from 'emoji-mart'
import { Popover, PopoverBody} from 'reactstrap'
import StickerMenu from '../../components/StickerPicker/stickers'
import GiphySelect from 'react-giphy-select'
import {
  isEmoji,
  getmetaurl,
  displayDate,
  showDate,
  validURL
} from './utilities'
import { ReactMic } from 'react-mic'
import { RingLoader } from 'halogenium'
import Slider from 'react-slick'
import RightArrow from '../convo/RightArrow'
import LeftArrow from '../convo/LeftArrow'
import ReactTooltip from 'react-tooltip'
import { Element, Events, scrollSpy, scroller } from 'react-scroll'
import moment from 'moment'

// import MediaCapturer from 'react-multimedia-capture'
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
  constructor(props, context) {
    super(props, context)
    this.previousScrollHeight = undefined
    this.newMessage = false
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
      showRecorder: false,
      gifUrl: '',
      urlmeta: '',
      prevURL: '',
      displayUrlMeta: false,
      showStickers: false,
      disabledValue: false,
      record: false,
      buttonState: 'start',
      recording: false,
      scrolling: true,
      pendingResponseValue: '',
      sessionValid: false
    }
    props.fetchUserChats(this.props.currentSession._id, { page: 'first', number: 25 })
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
    this.showRecorder = this.showRecorder.bind(this)
    this.closeRecorder = this.closeRecorder.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.onData = this.onData.bind(this)
    this.onStop = this.onStop.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.showStickers = this.showStickers.bind(this)
    this.toggleStickerPicker = this.toggleStickerPicker.bind(this)
    this.sendGif = this.sendGif.bind(this)
    this.showGif = this.showGif.bind(this)
    this.toggleGifPicker = this.toggleGifPicker.bind(this)
    this.sendSticker = this.sendSticker.bind(this)
    this.setDataPayload = this.setDataPayload.bind(this)
    this.setMessageData = this.setMessageData.bind(this)
    this.createGallery = this.createGallery.bind(this)
    this.getmainURL = this.getmainURL.bind(this)
    this.geturl = this.geturl.bind(this)
    this.showDialogPending = this.showDialogPending.bind(this)
    this.closeDialogPending = this.closeDialogPending.bind(this)
    this.handleAgentsForReopen = this.handleAgentsForReopen.bind(this)
    this.handleAgentsForResolved = this.handleAgentsForResolved.bind(this)
    this.getDisabledValue = this.getDisabledValue.bind(this)
    this.handleAgentsForDisbaledValue = this.handleAgentsForDisbaledValue.bind(this)
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.handleStop = this.handleStop.bind(this)
    this.shouldLoad = this.shouldLoad.bind(this)
    this.loadMoreMessage = this.loadMoreMessage.bind(this)
    this.updateScrollTop = this.updateScrollTop.bind(this)
    this.removeUrlMeta = this.removeUrlMeta.bind(this)
    this.isUserSessionValid = this.isUserSessionValid.bind(this)
  }

  isUserSessionValid(chats) {
    var userMessages = []
    var sessionValid = false
    for (let a = 0; a < chats.length; a++) {
      let msg = chats[a]
      if (msg.format === 'facebook') {
        userMessages.push(msg)
      }
    }
    var lastMessage = userMessages[userMessages.length - 1]
    if (lastMessage) {
      sessionValid = moment(lastMessage.datetime).isAfter(moment().subtract(24, 'hours'))
    }
    this.setState({
      sessionValid: sessionValid
    })
    return sessionValid
  }

  removeUrlMeta() {
    this.props.fetchUrlMeta('')
  }

  showDialogPending(value) {
    this.setState({ pendingResponseValue: value })
  }

  closeDialogPending() {
    this.setState({ pendingResponseValue: '' })
  }

  shouldLoad() {
    if (this.props.userChat.length < this.props.chatCount) {
      return true
    } else {
      return false
    }
  }

  loadMoreMessage() {
    this.props.fetchUserChats(this.props.currentSession._id, { page: 'next', number: 25, last_id: this.props.userChat[0]._id })
  }

  handleAgentsForDisbaledValue(teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      agentIds.push(teamAgents[i].agentId._id)
    }
    if (!agentIds.includes(this.props.user._id)) {
      this.setState({ disabledValue: true })
    }
  }

  getDisabledValue() {
    this.setState({ disabledValue: false })
    if (this.props.currentSession.is_assigned) {
      if (this.props.currentSession.assigned_to.type === 'agent' && this.props.currentSession.assigned_to.id !== this.props.user._id) {
        this.setState({ disabledValue: true })
      } else if (this.props.currentSession.assigned_to.type === 'team') {
        this.props.fetchTeamAgents(this.props.currentSession.assigned_to.id, this.handleAgentsForDisbaledValue)
      }
    }
  }

  getRepliedByMsg(msg) {
    if (
      (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') &&
      msg.replied_by && msg.replied_by.type === 'agent' && this.props.user._id !== msg.replied_by.id
    ) {
      return `${msg.replied_by.name} replied`
    } else {
      return 'You replied'
    }
  }

  componentDidMount() {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.0.0/js/swiper.min.js')
    document.body.appendChild(addScript)
    this.getDisabledValue()
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

  updateScrollTop() {
    console.log('updateScrollTop refs.chatScroll.scrollHeight', this.refs.chatScroll.scrollHeight)
    console.log('updateScrollTop previousScrollHeight', this.previousScrollHeight)
    if (this.previousScrollHeight && this.previousScrollHeight !== this.refs.chatScroll.scrollHeight) {
      console.log('this.refs.chatScroll.scrollTop', (this.refs.chatScroll.scrollHeight - this.previousScrollHeight))
      this.refs.chatScroll.scrollTop = this.refs.chatScroll.scrollHeight - this.previousScrollHeight
    } else {
      this.scrollToTop()
      if (this.props.userChat && this.props.userChat.length > 0) {
        setTimeout(scroller.scrollTo(this.props.userChat[this.props.userChat.length - 1]._id, { delay: 300, containerId: 'chat-container' }), 3000)
      }
      this.props.disableScroll()
    }
  }

  componetWillUnmount() {
    Events.scrollEvent.remove('begin')
    Events.scrollEvent.remove('end')
  }

  removeAttachment() {
    if (this.state.uploadedId !== '') {
      this.props.deletefile(this.state.uploadedId, this.handleRemove)
    }
  }

  showEmojiPicker() {
    this.setState({ showEmojiPicker: true, scrolling: false })
  }

  toggleEmojiPicker() {
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker })
  }

  showRecorder() {
    this.setState({ showRecorder: true })
  }

  closeRecorder() {
    this.setState({ showRecorder: false })
  }

  startRecording() {
    this.setState({ record: true, buttonState: 'stop' })
  }

  stopRecording() {
    this.setState({
      record: false, buttonState: 'start'
    })
  }

  onData(recordedBlob) {
    console.log('chunk of real-time data is: ', recordedBlob)
  }

  onStop(recordedBlob) {
    // this.closeDialogRecording()
    var file = new File([recordedBlob.blob.slice(0)], 'audio.mp3', { type: 'audio/mp3', lastModified: Date.now() })
    if (file) {
      this.resetFileComponent()
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
      fileData.append('componentType', 'audio')
      this.setState({ uploadDescription: 'File is uploading..' })
      this.props.uploadAttachment(fileData, this.handleUpload)
    }
    this.textInput.focus()
  }

  showStickers() {
    this.setState({ showStickers: true, scrolling: false })
  }

  toggleStickerPicker() {
    this.setState({ showStickers: !this.state.showStickers })
  }

  showGif() {
    this.setState({ showGifPicker: true, scrolling: false })
  }

  toggleGifPicker() {
    this.setState({ showGifPicker: !this.state.showGifPicker })
  }

  sendSticker(sticker) {
    var payload = {
      componentType: 'sticker',
      fileurl: sticker.image.hdpi
    }
    this.setState({
      componentType: 'sticker',
      stickerUrl: sticker.image.hdpi,
      scrolling: true
    })
    var session = this.props.currentSession
    var data = this.setMessageData(session, payload)
    this.props.sendChatMessage(data, this.props.fetchOpenSessions)
    this.toggleStickerPicker()
    data.format = 'convos'
    this.props.userChat.push(data)
    this.newMessage = true
  }

  sendGif(gif) {
    var payload = {
      componentType: 'gif',
      fileurl: gif.images.downsized.url
    }
    this.setState({
      componentType: 'gif',
      stickerUrl: gif.images.downsized.url,
      scrolling: true
    })
    var session = this.props.currentSession
    var data = this.setMessageData(session, payload)
    this.props.sendChatMessage(data, this.props.fetchOpenSessions)
    this.toggleGifPicker()
    data.format = 'convos'
    this.props.userChat.push(data)
    this.newMessage = true
  }

  sendThumbsUp() {
    this.setState({
      componentType: 'thumbsUp',
      scrolling: true
    })
    var payload = {
      componentType: 'thumbsUp',
      fileurl: 'https://cdn.cloudkibo.com/public/img/thumbsup.png'
    }
    var session = this.props.currentSession
    var data = this.setMessageData(session, payload)
    this.props.sendChatMessage(data, this.props.fetchOpenSessions)
    data.format = 'convos'
    this.props.userChat.push(data)
    this.newMessage = true
    this.setState({ textAreaValue: '' })
  }

  resetFileComponent() {
    this.newMessage = true
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

  handleTextChange(e) {
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
  setMessageData(session, payload) {
    console.log('current session', session)
    var data = ''
    data = {
      sender_id: session.pageId._id, // this is the page id: _id of Pageid
      recipient_id: session._id, // this is the subscriber id: _id of subscriberId
      sender_fb_id: session.pageId.pageId, // this is the (facebook) :page id of pageId
      recipient_fb_id: session.senderId, // this is the (facebook) subscriber id : pageid of subscriber id
      subscriber_id: session._id,
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
    // var indexes = this.props.openSessions.filter((new_session, index) => {
    //     if(new_session._id === session._id) {
    //       console.log('index', index)
    //       return index
    //     }
    // })
    // console.log('indexes', indexes)

    // var index=0
    // for(var i=0; i< this.props.openSessions.length; i++) {
    //   if(this.props.openSessions[i]._id === session._id) {
    //       index=i
    //   }
    // }
    // this.props.openSessions[index].last_activity_time = Date.now()
    // this.props.openSessions.sort(function (a, b) {
    //   return new Date(b.last_activity_time) - new Date(a.last_activity_time)
    // })
    return data
  }
  setDataPayload(component) {
    var payload = ''
    if (component === 'attachment') {
      payload = {
        componentType: this.state.componentType,
        fileName: this.state.attachment.name,
        size: this.state.attachment.size,
        type: this.state.attachmentType,
        fileurl: {
          id: this.state.uploadedId,
          name: this.state.attachment.name,
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

  onEnter(e) {
    var isUrl = getmetaurl(this.state.textAreaValue)
    if (e.which === 13) {
      e.preventDefault()
      if (this.state.disabledValue && this.props.currentSession.assigned_to.type === 'agent') {
        this.msg.error('You can not send message. Only assigned agent can send messages.')
      } else if (this.state.disabledValue && this.props.currentSession.assigned_to.type === 'team') {
        this.msg.error('You can not send message. Only agents who are part of assigned team can send messages.')
      } else {
        var payload = {}
        var session = this.props.currentSession
        var data = {}
        if (this.state.uploadedId !== '' && this.state.attachment) {
          payload = this.setDataPayload('attachment')
          data = this.setMessageData(session, payload)
          this.props.sendAttachment(data, this.handleSendAttachment)
          data.format = 'convos'
          this.props.userChat.push(data)
          this.setState({ uploaded: false })
        } else if (isUrl !== null && isUrl !== '') {
          payload = this.setDataPayload('text')
          data = this.setMessageData(session, payload)
          this.props.sendChatMessage(data, this.props.fetchOpenSessions)
          this.setState({ textAreaValue: '', displayUrlMeta: false })
          this.removeUrlMeta()
          data.format = 'convos'
          this.props.userChat.push(data)
        } else if (this.state.textAreaValue !== '') {
          payload = this.setDataPayload('text')
          data = this.setMessageData(session, payload)
          this.props.sendChatMessage(data, this.props.fetchOpenSessions)
          this.setState({ textAreaValue: '' })
          data.format = 'convos'
          this.props.userChat.push(data)
        }
        this.newMessage = true
        this.setState({ scrolling: true })
        this.props.updatePendingSession(this.props.currentSession, false)
      }
    }
  }

  handleSendAttachment(res) {
    if (res.status === 'success') {
      this.resetFileComponent()
    }
  }

  handleRemove(res) {
    if (res.status === 'success') {
      this.resetFileComponent()
    }
    if (res.status === 'failed') {
      this.setState({ uploaded: true, removeFileDescription: res.description })
    }
  }

  setComponentType(file) {
    if (file.type.match('image.*')) {
      this.setState({ componentType: 'image' })
    } else if (file.type.match('audio.*')) {
      this.setState({ componentType: 'audio' })
    } else if (file.type.match('video.*')) {
      this.setState({ componentType: 'video' })
    } else if (file.type.match('application.*') || file.type.match('text.*')) {
      this.setState({ componentType: 'file' })
    } else {
      this.setState({ componentType: 'Not allowed' })
    }
  }

  onFileChange(e) {
    var files = e.target.files
    console.log('e.target.files', e.target.files)
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
        console.log('file', file)
        this.setState({ uploadDescription: 'File is uploading..' })
        this.props.uploadAttachment(fileData, this.handleUpload)
      }
    }
    this.textInput.focus()
  }
  handleUpload(res) {
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
      this.setState({ uploaded: true, uploadDescription: '', removeFileDescription: '', uploadedId: res.payload.id, uploadedUrl: res.payload.url })
    }
  }

  onTestURLVideo(url) {
    var videoEXTENSIONS = /\.(mp4|ogg|webm|quicktime)($|\?)/i
    var truef = videoEXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  onTestURLAudio(url) {
    var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i
    var truef = AUDIO_EXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  scrollToTop() {
    console.log('scrollToTop')
    this.top.scrollIntoView({ behavior: 'instant' })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log('UNSAFE_componentWillReceiveProps chatbox.js')
    if (nextProps.userChat && nextProps.userChat.length > 0 && nextProps.userChat[0].subscriber_id === this.props.currentSession._id) {
      this.isUserSessionValid(nextProps.userChat)
    }
    if (nextProps.userChat.length > 0 && this.props.userChat.length > 0) {
      if (nextProps.userChat[0].subscriber_id !== this.props.userChat[0].subscriber_id) {
        this.newMessage = true
      } else if (!(nextProps.userChat.length > this.props.userChat.length + 1)) {
        this.newMessage = true
      }
    }
    this.getDisabledValue()
    if (nextProps.urlMeta) {
      if (!nextProps.urlMeta.type) {
        this.setState({ displayUrlMeta: false })
      }
      this.setState({ urlmeta: nextProps.urlMeta })
    }
  }

  setEmoji(emoji) {
    this.setState({
      textAreaValue: this.state.textAreaValue + emoji.native,
      showEmojiPicker: false
    })
  }

  componentDidUpdate(nextProps) {
    if (this.newMessage) {
      console.log('componentDidUpdate newMessage')
      this.previousScrollHeight = this.refs.chatScroll.scrollHeight
      this.newMessage = false
    }

    console.log('this.previousScrollHeight', this.previousScrollHeight)
    if (this.props.socketData && this.props.socketData.subscriber_id === this.props.currentSession._id && this.props.socketData.message.replied_by && this.props.socketData.message.replied_by.id !== this.props.user._id) {
      this.previousScrollHeight = this.refs.chatScroll.scrollHeight
      if (!this.state.scrolling) {
        this.updateScrollTop()
      }
      this.props.markRead(this.props.currentSession._id, this.props.sessions)
    }
    if (this.state.scrolling) {
      this.updateScrollTop()
    }
  }

  createGallery(cards) {
    var temp = []

    for (var i = 0; i < cards.length; i++) {
      temp.push({
        elemnet: (<div>
          <div style={{ width: 200, borderRadius: '10px' }} className='ui-block hoverbordersolid'>
            <div style={{ backgroundColor: '#F2F3F8', padding: '5px' }} className='cardimageblock'>
              <a href={cards[i].image_url} target='_blank' rel='noopener noreferrer'>
                <img alt='' style={{ maxWidth: 180, borderRadius: '5px' }} src={cards[i].image_url} />
              </a>
            </div>
            <div style={{ marginTop: '10px', padding: '5px' }}>
              <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{cards[i].title}</div>
              <div style={{ textAlign: 'left', color: '#ccc' }}>{cards[i].subtitle}</div>
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

  geturl(payload) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${payload.coordinates.lat},${payload.coordinates.long}&zoom=13&scale=false&size=400x200&maptype=roadmap&format=png&key=AIzaSyDDTb4NWqigQmW_qCVmSAkmZIIs3tp1x8Q&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${payload.coordinates.lat},${payload.coordinates.long}`
  }

  getmainURL(payload) {
    return `https://www.google.com/maps/place/${payload.coordinates.lat},${payload.coordinates.long}/`
  }

  handleAgentsForResolved(teamAgents) {
    let agentIds = []
    console.log('teamAgents', teamAgents)
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId._id !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId._id)
      }
    }
    console.log('agentIds', agentIds)
    if (agentIds.length > 0) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.currentSession.firstName + ' ' + this.props.currentSession.lastName} has been marked resolved by ${this.props.user.name}.`,
        category: { type: 'chat_session', id: this.props.currentSession._id },
        agentIds: agentIds,
        companyId: this.props.currentSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  handleAgentsForReopen(teamAgents) {
    let agentIds = []
    for (let i = 0; i < teamAgents.length; i++) {
      if (teamAgents[i].agentId._id !== this.props.user._id) {
        agentIds.push(teamAgents[i].agentId._id)
      }
    }
    if (agentIds.length > 0) {
      let notificationsData = {
        message: `Session of subscriber ${this.props.currentSession.firstName + ' ' + this.props.currentSession.lastName} has been reopened by ${this.props.user.name}.`,
        category: { type: 'chat_session', id: this.props.currentSession._id },
        agentIds: agentIds,
        companyId: this.props.currentSession.companyId
      }
      this.props.sendNotifications(notificationsData)
    }
  }

  changeStatus(e, status, id) {
    if (this.state.disabledValue && this.props.currentSession.assigned_to.type === 'agent' && status === 'resolved') {
      this.msg.error('You can not resolve chat session. Only assigned agent can resolve it.')
    } else if (this.state.disabledValue && this.props.currentSession.assigned_to.type === 'agent' && status === 'new') {
      this.msg.error('You can not reopen chat session. Only assigned agent can reopen it.')
    } else if (this.state.disabledValue && this.props.currentSession.assigned_to.type === 'team' && status === 'resolved') {
      this.msg.error('You can not resolve chat session. Only agents who are part of assigned team can resolve chat session.')
    } else if (this.state.disabledValue && this.props.currentSession.assigned_to.type === 'team' && status === 'new') {
      this.msg.error('You can not reopen chat session. Only agents who are part of assigned team can reopen chat session.')
    } else {
      this.props.changeStatus({ _id: id, status: status }, this.props.changeActiveSessionFromChatbox)
      if (status === 'resolved' && this.props.currentSession.is_assigned) {
        if (this.props.currentSession.assigned_to.type === 'agent' && this.props.currentSession.assigned_to.id !== this.props.user._id) {
          let notificationsData = {
            message: `Session of subscriber ${this.props.currentSession.firstName + ' ' + this.props.currentSession.lastName} has been marked resolved by ${this.props.user.name}.`,
            category: { type: 'chat_session', id: this.props.currentSession._id },
            agentIds: [this.props.currentSession.assigned_to.id],
            companyId: this.props.currentSession.companyId
          }
          this.props.sendNotifications(notificationsData)
        } else if (this.props.currentSession.assigned_to.type === 'team') {
          this.props.fetchTeamAgents(this.props.currentSession.assigned_to.id, this.handleAgentsForResolved)
        }
      } else if (status === 'new' && this.props.currentSession.is_assigned) {
        if (this.props.currentSession.assigned_to.type === 'agent' && this.props.currentSession.assigned_to.id !== this.props.user._id) {
          let notificationsData = {
            message: `Session of subscriber ${this.props.currentSession.firstName + ' ' + this.props.currentSession.lastName} has been reopened by ${this.props.user.name}.`,
            category: { type: 'chat_session', id: this.props.currentSession._id },
            agentIds: [this.props.currentSession.assigned_to.id],
            companyId: this.props.currentSession.companyId
          }
          this.props.sendNotifications(notificationsData)
        } else if (this.props.currentSession.assigned_to.type === 'team') {
          this.props.fetchTeamAgents(this.props.currentSession.assigned_to.id, this.handleAgentsForReopen)
        }
      }
    }
  }
  handleStart(stream) {
    this.setState({
      recording: true
    })

    console.log('Recording Started.')
  }
  handleStop(blob) {
    console.log('blob', blob)
    this.setState({
      recording: false
    })

    console.log('Recording Stopped.')
    this.downloadAudio(blob)
  }
  render () {
    console.log('chatbox render_data',this.state.isShowingModal)
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
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="pendingResponse" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    {this.state.pendingResponseValue ? 'Add ' : 'Remove '}Pending Response
  									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
  											</span>
                  </button>
                </div>
                <div style={{ color: 'black' }} className="modal-body">
                  <p>{this.state.pendingResponseValue ? 'Are you sure you want to mark this session as pending response?' : 'Are you sure you want to remove this session as pending response?'}</p>
                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', padding: '5px' }}>
                      <button className='btn btn-primary' onClick={(e) => {
                        this.props.removePending(this.props.currentSession, this.state.pendingResponseValue)
                        this.closeDialogPending()
                      }}
                        data-dismiss='modal'>
                        Yes
                    </button>
                    </div>
                    <div style={{ display: 'inline-block', padding: '5px' }}>
                      <button className='btn btn-primary' data-dismiss='modal'>
                        No
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="voiceRecording" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Voice Recordings
  									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
  											</span>
                  </button>
                </div>
                <div style={{ color: 'black' }} className="modal-body">
                  {/*  <div ref='app'>
                  <h3>Audio Recorder</h3>
                  <MediaCapturer
                  constraints={{ audio: true }}
                  mimeType='audio/webm'
                  timeSlice={10}
                  onStart={this.handleStart}
                  onStop={this.onStop}
                  onError={this.handleError}
                  render={({ start, stop, pause, resume }) =>
                  <div>
                  <button onClick={start}>Start</button>
                  <button onClick={stop}>Stop</button>
                  </div>
                  } />
                  </div> */}
                  <div>
                    <ReactMic style={{ width: '450px' }}
                      width='450'
                      record={this.state.record}
                      className='sound-wave'
                      onStop={this.onStop}
                      strokeColor='#000000'
                      mimeType='audio.mp3' />
                  </div>
                  <br />
                  {this.state.buttonState === 'start'
                    ? <div role='dialog' aria-label='Voice clip' style={{ fontSize: '14px', height: '178px', overflow: 'hidden', width: '220px' }}>
                      <div style={{ display: 'block', fontSize: '14px' }}>
                        <div style={{ height: '0px', width: '0px', backgroundColor: '#333', borderRadius: '50%', opacity: '.2', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }} />
                        <a href='#/' role='button' title='Record' onClick={this.startRecording} style={{ color: '#365899', cursor: 'pointer', textDecoration: 'none' }}>
                          <div style={{ backgroundColor: '#f03d25', borderRadius: '72px', color: '#fff', height: '72px', transition: 'width .1s, height .1s', width: '72px', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }}>
                            <span style={{ left: '50%', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center', cursor: 'pointer', fontSize: '14px' }}>Record</span>
                          </div>
                        </a>
                      </div>
                    </div>
                    : <div role='dialog' aria-label='Voice clip' style={{ fontSize: '14px', height: '178px', overflow: 'hidden', width: '220px' }}>
                      <div style={{ display: 'block', fontSize: '14px' }}>
                        <div style={{ height: '90px', width: '90px', backgroundColor: '#333', borderRadius: '50%', opacity: '.2', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }} />
                        <a href='#/' role='button' title='Record' onClick={this.stopRecording} style={{ color: '#365899', cursor: 'pointer', textDecoration: 'none' }}>
                          <div style={{ borderRadius: '54px', height: '54px', width: 54, backgroundColor: '#f03d25', color: '#fff', transition: 'width .1s, height .1s', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }}>
                            <span style={{ height: '14px', width: '14px', backgroundColor: '#fff', left: '50%', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center', cursor: 'pointer', fontSize: '14px' }} />
                          </div>
                        </a>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>

        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <ReactTooltip
          place='bottom'
          type='dark'
          effect='solid'
        />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        {
          /*
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
          */
        }
        {/* {this.props.user.isSuperUser &&
          <Popover
          style={{paddingBottom: '100px', width: '280px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
          placement='top'
          height='390px'
          target='recordingDiv'
          show={this.state.showRecorder}
          onHide={this.closeRecorder}
        >
          <div>
            <ReactMic
              record={this.state.record}
              className='sound-wave'
              onStop={this.onStop}
              strokeColor='#000000'
              mimeType='audio.mp3' />
            <button onClick={this.startRecording}>Start</button>
            <button onClick={this.stopRecording}>Stop</button>
          </div>
        </Popover>
      } */
    }
        <div className='m-portlet m-portlet--mobile'>
          <div style={{padding: '1.3rem', borderBottom: '1px solid #ebedf2'}}>
            <button style={{backgroundColor: 'white'}} className='btn'>Status: {this.props.currentSession.is_assigned ? 'Assigned' : 'Unassigned'}</button>
            {
              this.props.currentSession.status === 'new'
              ? <div style={{float: 'right'}}>
                {this.props.currentSession.pendingResponse
                ? <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={() => this.showDialogPending(false)} data-tip='Remove Pending Flag' className='la la-user-times' />
              : <i  style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={() => this.showDialogPending(true)} data-tip='Add Pending Flag' className='la la-user-plus' />
                }
                <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={this.props.showSearch} data-tip='Search' className='la la-search' />
                <i style={{cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold'}} onClick={(e) => { this.changeStatus(e, 'resolved', this.props.currentSession._id)}} data-tip='Mark as done' className='la la-check' />
              </div>
              : <div style={{float: 'right'}}>
                {this.props.currentSession.pendingResponse
                ? <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={() => this.showDialogPending(false)} data-tip='Remove Pending Flag' className='la la-user-times' />
                : <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={() => this.showDialogPending(true)} data-tip='Add Pending Flag' className='la la-user-plus' />
                }
                <i style={{cursor: 'pointer', color: '#212529', fontSize: '25px', marginRight: '5px'}} onClick={this.props.showSearch} data-tip='Search' className='la la-search' />
                <i style={{cursor: 'pointer', color: '#34bfa3', fontSize: '25px', fontWeight: 'bold'}} data-tip='Reopen' onClick={(e) => {
                  this.changeStatus(e, 'new', this.props.currentSession._id)
                }} className='fa fa-envelope-open-o' />
              </div>
            }
          </div>
          <div style={{padding: '2.2rem 0rem 2.2rem 2.2rem'}} className='m-portlet__body'>
            <div className='tab-content'>
              <div className='tab-pane active m-scrollable' role='tabpanel'>
                <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                  <div style={{height: '393px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                    <div id='chat-container' ref='chatScroll' style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                      <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                        {
                          (this.props.chatCount > this.props.userChat.length) &&
                          <p style={{textAlign: 'center'}}>Loading...</p>
                        }
                        {
                            this.props.userChat.map((msg, index) => (
                              msg.format === 'facebook'
                              ? <div key={index} style={{marginLeft: 0, marginRight: 0, display: 'block', clear: 'both'}} className='row'>
                                <Element name={msg._id}>
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
                                      <img src={this.props.currentSession.profilePic} alt='' />
                                    </div>
                                    <div className='m-messenger__message-body'>
                                      <div className='m-messenger__message-arrow' />
                                      {
                                        msg.payload.attachments && !msg.url_meta
                                        ? (
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.props.currentSession.firstName} shared
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
                                                ? <div key={index}>
                                                  <ReactPlayer
                                                    url={att.payload.url}
                                                    controls
                                                    width='230px'
                                                    height='60px'
                                                    onPlay={this.onTestURLAudio(att.payload.url)}
                                                  />
                                                </div>
                                                : att.type === 'image'
                                                ? <a key={index} href={att.payload.url} target='_blank' rel='noopener noreferrer'>
                                                  <img
                                                    alt=''
                                                    src={att.payload.url}
                                                    style={{maxWidth: '150px', maxHeight: '85px', marginTop: '10px'}}
                                                  />
                                                </a>
                                                : att.type === 'location'
                                                ? <table key={index} style={{border: '1px solid #ccc', borderRadius: '15px', borderCollapse: 'separate', padding: '5px'}}>
                                                  <tbody>
                                                    <tr>
                                                      <td>
                                                        <a href={this.getmainURL(att.payload)} target='_blank' rel='noopener noreferrer'>
                                                          <img alt='' style={{width: '200px'}} src={this.geturl(att.payload)} />
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
                                                <a key={index} href={att.payload.url} target='_blank' rel='noopener noreferrer'>
                                                  <h6 style={{marginTop: '10px'}}><i className='fa fa-file-text-o' /><strong> {att.payload.url.split('?')[0].split('/')[att.payload.url.split('?')[0].split('/').length - 1]}</strong></h6>
                                                </a>
                                              ))
                                            }
                                          </div>
                                        )
                                        : msg.url_meta
                                        ? <div className='m-messenger__message-content'>
                                          <div className='m-messenger__message-username'>
                                            {this.props.currentSession.firstName} shared a link
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
                                                          <a href={msg.url_meta.url} target='_blank' rel='noopener noreferrer'>
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
                                                            <img alt='' src={msg.url_meta.image.url} style={{width: 45, height: 45}} />
                                                          }
                                                        </div>
                                                      </td>
                                                      <td>
                                                        <div>
                                                          <a href={msg.url_meta.url} target='_blank' rel='noopener noreferrer'>
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
                                        : msg.payload.text && msg.payload.text.split(' ').length === 1 && isEmoji(msg.payload.text)
                                        ? <div className='m-messenger__message-content'>
                                          <div className='m-messenger__message-username'>
                                            {this.props.currentSession.firstName} reacted
                                          </div>
                                          <div style={{fontSize: '30px'}} className='m-messenger__message-text' value={msg.payload.text}>
                                            {msg.payload.text}
                                          </div>
                                        </div>
                                        : <div className='m-messenger__message-content'>
                                          <div className='m-messenger__message-username'>
                                            {this.props.currentSession.firstName} wrote
                                          </div>
                                          <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text' value={msg.payload.text}>
                                            {msg.payload.text}
                                          </div>
                                        </div>
                                      }
                                    </div>
                                  </div>
                                </Element>
                              </div>
                              : <div key={index} style={{marginLeft: 0, marginRight: 0, display: 'block', clear: 'both'}} className='row'>
                                <Element name={msg._id}>
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
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <ReactPlayer
                                              url={msg.payload.fileurl.url}
                                              controls
                                              width='100%'
                                              height='140px'
                                              onPlay={this.onTestURLVideo(msg.payload.fileurl.url)}
                                            />
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'audio'
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <ReactPlayer
                                              url={msg.payload.fileurl.url}
                                              controls
                                              width='230px'
                                              height='60px'
                                              onPlay={this.onTestURLAudio(msg.payload.fileurl.url)}
                                            />
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'file'
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <a download={msg.payload.fileName} target='_blank' rel='noopener noreferrer' href={msg.payload.fileurl.url} >
                                              <h6 style={{color: 'white'}}><i className='fa fa-file-text-o' /><strong> {msg.payload.fileName}</strong></h6>
                                            </a>
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'card'
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <div>
                                              <div style={{maxWidth: 200, borderRadius: '10px'}} className='ui-block hoverbordersolid'>
                                                <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
                                                  {
                                                    msg.payload.image_url &&
                                                    <a href={msg.payload.image_url} target='_blank' rel='noopener noreferrer'>
                                                      <img alt='' style={{maxWidth: 180, borderRadius: '5px'}} src={msg.payload.image_url} />
                                                    </a>
                                                  }
                                                </div>
                                                <div style={{marginTop: '10px', padding: '5px'}}>
                                                  <div style={{textAlign: 'left', fontWeight: 'bold'}}>{msg.payload.title}</div>
                                                  {
                                                    msg.payload.subtitle &&
                                                    <div style={{textAlign: 'left', color: '#ccc'}}>{msg.payload.subtitle}</div>
                                                  }
                                                </div>
                                                {
                                                  msg.payload.buttons && msg.payload.buttons.length > 0 &&
                                                  msg.payload.buttons.map(b => (
                                                    <a href={b.url} target='_blank' rel='noopener noreferrer' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                                                      {b.type === 'element_share' ? 'Share' : b.title}
                                                    </a>
                                                  ))
                                                }
                                              </div>
                                            </div>
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'gallery'
                                        ? <div>
                                          <div style={{width: '250px'}} className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <Slider ref={(c) => { this.slider = c }} {...settings}>
                                              {
                                                msg.payload.cards.map((card, i) => (
                                                  <div key={i}>
                                                    <div style={{maxWidth: 200, borderRadius: '10px'}} className='ui-block hoverbordersolid'>
                                                      <div style={{backgroundColor: '#F2F3F8', padding: '5px'}} className='cardimageblock'>
                                                        {
                                                          card.image_url &&
                                                          <a href={card.image_url} target='_blank' rel='noopener noreferrer'>
                                                            <img alt='' style={{maxWidth: 180, borderRadius: '5px'}} src={card.image_url} />
                                                          </a>
                                                        }
                                                      </div>
                                                      <div style={{marginTop: '10px', padding: '5px'}}>
                                                        <div style={{textAlign: 'left', fontWeight: 'bold'}}>{card.title}</div>
                                                        {
                                                          card.subtitle &&
                                                          <div style={{textAlign: 'left', color: '#ccc'}}>{card.subtitle}</div>
                                                        }
                                                      </div>
                                                      {
                                                        card.buttons && card.buttons.length > 0 &&
                                                        card.buttons.map(b => (
                                                          <a href={b.url} target='_blank' rel='noopener noreferrer' style={{borderColor: '#36a3f7', width: '100%', marginTop: '5px'}} className='btn btn-outline-info btn-sm'>
                                                            {b.type === 'element_share' ? 'Share' : b.title}
                                                          </a>
                                                        ))
                                                      }
                                                    </div>
                                                  </div>
                                                ))
                                              }
                                            </Slider>
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'list'
                                        ? <div>
                                          <div style={{width: '250px'}} className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px'}} >
                                              {
                                                msg.payload.elements.map((list, index) => {
                                                  let largeStyle = {
                                                    border: '1px solid #ccc'
                                                  }
                                                  let isLarge = (msg.payload.top_element_style === 'large' && index === 0)
                                                  if (isLarge) {
                                                    largeStyle = {
                                                      backgroundImage: list.image_url && `url(${list.image_url})`,
                                                      backgroundSize: '100%',
                                                      backgroundRepeat: 'no-repeat',
                                                      border: '1px solid #ccc'
                                                    }
                                                  }
                                                  return (
                                                    <div style={largeStyle}>
                                                      <div className='row' style={{padding: '10px'}}>
                                                        <div className={isLarge ? 'col-12' : 'col-6'} style={{minHeight: '75px'}}>
                                                          <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '15px'}}>{list.title}</h6>
                                                          {
                                                            list.subtitle &&
                                                            <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '12px'}}>{list.subtitle}</p>
                                                          }
                                                        </div>
                                                        {
                                                          !isLarge &&
                                                          <div className='col-6'>
                                                            {
                                                              list.image_url &&
                                                              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '80%', minWidth: '80%', marginLeft: '20%'}} >
                                                                <img alt='' src={list.image_url} style={{maxWidth: '100%', maxHeight: '100%'}} />
                                                              </div>
                                                            }
                                                          </div>
                                                        }
                                                        {
                                                          list.buttons && list.buttons.map(button => (
                                                            <div className='ui-block' style={{border: '1px solid rgb(7, 130, 255)', borderRadius: '5px', minHeight: '50%', minWidth: '25%', marginLeft: '10%', marginTop: '-10px'}} >
                                                              <h5 style={{color: '#0782FF', fontSize: '12px'}}>{button.type === 'element_share' ? 'Share' : button.title}</h5>
                                                            </div>
                                                          ))
                                                        }
                                                      </div>
                                                    </div>
                                                  )
                                                })
                                              }
                                              {
                                                msg.payload.buttons && msg.payload.buttons.length > 0 &&
                                                msg.payload.buttons.map(button =>(
                                                  <div>
                                                    <h7 style={{color: '#0782FF'}}>{button.type === 'element_share' ? 'Share' : button.title}</h7>
                                                  </div>
                                                ))
                                              }
                                            </div>
                                          </div>
                                          {
                                            index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'image'
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <img
                                              alt=''
                                              src={msg.payload.fileurl.url}
                                              style={{maxWidth: '150px', maxHeight: '85px'}}
                                              />
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'gif'
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <img
                                              alt=''
                                              src={msg.payload.fileurl}
                                              style={{maxWidth: '150px', maxHeight: '85px'}}
                                            />
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'sticker'
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <img
                                              alt=''
                                              src={msg.payload.fileurl}
                                              style={{maxWidth: '150px', maxHeight: '85px'}}
                                            />
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'thumbsUp'
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <img
                                              alt=''
                                              src={msg.payload.fileurl}
                                              style={{maxWidth: '150px', maxHeight: '85px'}}
                                            />
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'poll'
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <div style={{width: '200px'}} className='m-messenger__message-text' value={msg.payload.text}>
                                              {msg.payload.text}
                                            </div>
                                            <div>
                                              {
                                                msg.payload.quick_replies && msg.payload.quick_replies.length > 0 &&
                                                msg.payload.quick_replies.map((b, x) => (
                                                  <button key={x} style={{margin: '3px'}} type='button' className='btn m-btn--pill btn-secondary m-btn m-btn--bolder btn-sm'>
                                                    {b.title}
                                                  </button>
                                                ))
                                              }
                                            </div>
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'survey'
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <div style={{width: '200px'}} className='m-messenger__message-text' value={msg.payload.text}>
                                              {msg.payload.attachment.payload.text}
                                            </div>
                                            <div style={{margin: '0px -14px -20px -20px'}}>
                                              {
                                                msg.payload.attachment.payload.buttons && msg.payload.attachment.payload.buttons.length > 0 &&
                                                msg.payload.attachment.payload.buttons.map((b, i) => (
                                                  <button
                                                    key={i}
                                                    style={{
                                                      margin: '3px 3px -4px 3px',
                                                      borderRadius: msg.payload.attachment.payload.buttons.length === i + 1 ? '0px 0px 10px 10px' : 0,
                                                      borderColor: '#716aca'
                                                    }}
                                                    type='button'
                                                    className='btn btn-secondary btn-block'
                                                  >
                                                    {typeof b.title === 'string' &&
                                                      b.title
                                                    }
                                                  </button>
                                                ))
                                              }
                                            </div>
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.url_meta && msg.url_meta !== ''
                                        ? (msg.url_meta.type
                                          ? <div>
                                            <div className='m-messenger__message-content'>
                                              <div className='m-messenger__message-username'>
                                                {this.getRepliedByMsg(msg)}
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
                                                              <a href={msg.url_meta.url} target='_blank' rel='noopener noreferrer'>
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
                                                                <img alt='' src={msg.url_meta.image.url} style={{width: 45, height: 45}} />
                                                              }
                                                            </div>
                                                          </td>
                                                          <td>
                                                            <div>
                                                              <a href={msg.url_meta.url} target='_blank' rel='noopener noreferrer'>
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
                                            {index === this.props.userChat.length - 1 && msg.seen &&
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
                                              {
                                                validURL(msg.payload.text)
                                                ? <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text' value={msg.payload.text}>
                                                  <a style={{color: 'white'}} href={msg.payload.text} target='_blank' rel='noopener noreferrer'>
                                                    <p>{msg.payload.text}</p>
                                                  </a>
                                                </div>
                                                : <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text' value={msg.payload.text}>
                                                  {msg.payload.text}
                                                </div>
                                              }
                                            </div>
                                            {index === this.props.userChat.length - 1 && msg.seen &&
                                              <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                                <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                              </div>
                                            }
                                          </div>
                                        )
                                        : msg.payload.text && msg.payload.text.split(' ').length === 1 && isEmoji(msg.payload.text)
                                        ? <div>
                                          <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.getRepliedByMsg(msg)}
                                            </div>
                                            <div style={{fontSize: '30px'}} className='m-messenger__message-text' value={msg.payload.text}>
                                              {msg.payload.text}
                                            </div>
                                          </div>
                                          {index === this.props.userChat.length - 1 && msg.seen &&
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
                                            <div style={{wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px'}} className='m-messenger__message-text' value={msg.payload.text}>
                                              {msg.payload.text}
                                            </div>
                                          </div>
                                          {
                                            msg.payload.buttons && msg.payload.buttons.length > 0 &&
                                            msg.payload.buttons.map((b, i) => (
                                              <a
                                                key={i}
                                                href={b.url}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                style={{
                                                  margin: '3px 3px -4px 3px',
                                                  borderRadius: msg.payload.buttons.length === i + 1 ? '0px 0px 10px 10px' : 0,
                                                  borderColor: '#716aca',
                                                  width: '230px'
                                                }}
                                                className='btn btn-outline-primary btn-block'
                                              >
                                                {b.type === 'element_share' ? 'Share' : b.title}
                                              </a>
                                            ))
                                          }
                                          {index === this.props.userChat.length - 1 && msg.seen &&
                                            <div style={{float: 'right', marginRight: '15px', fontSize: 'small'}}>
                                              <i className='la la-check' style={{fontSize: 'small'}} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                      )}
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
                  {this.state.sessionValid
                ? <div>
                <Popover placement='left' isOpen={this.state.showEmojiPicker} className='chatPopover' target='emogiPickerChat' toggle={this.toggleEmojiPicker}>
                    <PopoverBody>
                      <div>
                        <Picker
                          style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
                          emojiSize={24}
                          perLine={6}
                          skin={1}
                          set='facebook'
                          showPreview={false}
                          showSkinTones={false}
                          custom={[]}
                          autoFocus={false}
                          onClick={(emoji, event) => this.setEmoji(emoji)}
                        />
                      </div>
                    </PopoverBody>
                  </Popover>
                  <Popover placement='left' isOpen={this.state.showStickers} className='chatPopover' target='stickerPickerChat' toggle={this.toggleStickerPicker}>
                    <PopoverBody>
                      <div>
                        <StickerMenu
                          apiKey={'80b32d82b0c7dc5c39d2aafaa00ba2bf'}
                          userId={'imran.shoukat@khi.iba.edu.pk'}
                          sendSticker={(sticker) => { this.sendSticker(sticker) }}
                        />
                      </div>
                    </PopoverBody>
                  </Popover>
                  <Popover placement='left' isOpen={this.state.showGifPicker} className='chatPopover _popover_max_width_400' target='gifPickerChat' toggle={this.toggleGifPicker}>
                    <PopoverBody>
                      <GiphySelect
                        onEntrySelect={gif => this.sendGif(gif)}
                      />
                    </PopoverBody>
                  </Popover>
                <div className='m-messenger__form'>
                    <div className='m-messenger__form-controls'>
                      <input autoFocus ref={(input) => { this.textInput = input }} type='text' name='' placeholder='Type here...' onChange={this.handleTextChange} value={this.state.textAreaValue} onKeyPress={this.onEnter} className='m-messenger__form-input' />
                    </div>
                    <div className='m-messenger__form-tools'>
                      <a href='#/' className='m-messenger__form-attachment'>
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
                    <div style={{display: 'inline-block'}} data-tip='Upload Image'>
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
                      <input type='file' accept='image/*' onClick={(e)=>{e.target.value= ''}} onChange={this.onFileChange} onError={this.onFilesError} onKeyPress={this.onEnter}
                        ref='selectImage' style={styles.inputf} />
                    </div>
                    <div style={{display: 'inline-block'}} data-tip='Upload File'>
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
                          <input type='file' onClick={(e)=>{e.target.value= ''}} accept='image/*,audio/*,video/*,application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf' onChange={this.onFileChange} onError={this.onFilesError}
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
                          <input type='file' onClick={(e)=>{e.target.value= ''}} accept='image/*,audio/*,video/*,application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf' onChange={this.onFileChange} onError={this.onFilesError}
                            ref='selectFile' style={styles.inputf} />
                        </div>
                      }
                    </div>
                    <div id='recordingDiv' ref={(c) => { this.recording = c }} style={{display: 'inline-block'}} data-tip='recording'>
                      <i onClick={this.showDialogRecording} style={styles.iconclass}>
                        <i style={{
                          fontSize: '20px',
                          position: 'absolute',
                          left: '0',
                          width: '100%',
                          height: '2em',
                          margin: '5px',
                          textAlign: 'center',
                          color: '#787878'
                        }} className='fa fa-microphone' />
                      </i>
                    </div>
                    <div style={{display: 'inline-block'}} data-tip='emoticons'>
                      <i id='emogiPickerChat' onClick={this.showEmojiPicker} style={styles.iconclass}>
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
                    <div style={{display: 'inline-block'}} data-tip='stickers'>
                      <i id='stickerPickerChat' onClick={this.showStickers} style={styles.iconclass}>
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
                      <i id='gifPickerChat' onClick={this.showGif} style={styles.iconclass}>
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
                  </div>
                  {
                    this.props.loadingUrl === true && this.props.urlValue === this.state.prevURL &&
                    <div className='align-center'>
                      <center><RingLoader color='#716aca' /></center>
                    </div>
                  }
                  {
                     JSON.stringify(this.state.urlmeta) !== '{}' && this.props.loadingUrl === false &&
                     <div style={{clear: 'both', display: 'block'}}>
                       <div style={{borderRadius: '15px', backgroundColor: '#f0f0f0', minHeight: '20px', justifyContent: 'flex-end', boxSizing: 'border-box', clear: 'both', position: 'relative', display: 'inline-block', padding: '5px'}}>
                         <i style={{float: 'right', color: 'red', cursor: 'pointer'}} className='fa fa-times' onClick={this.removeUrlMeta} />
                         <table style={{maxWidth: '318px', margin: '10px'}}>
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
                                     <a href={this.state.urlmeta.url} target='_blank' rel='noopener noreferrer'>
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
                                        <img alt='' src={this.state.urlmeta.image.url} style={{width: 45, height: 45}} />
                                    }
                                  </div>
                                </td>
                                <td>
                                  <div>
                                    <a href={this.state.urlmeta.url} target='_blank' rel='noopener noreferrer'>
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
                : <span><p>Chat's 24 hours window session has been expired for this subscriber. You cannot send a message to this subscriber now. Please ask the subsriber to message you first in order to be able to chat with him/her.</p>
                </span>
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

function mapStateToProps(state) {
  console.log(state)
  return {
    updateSessionTimeStamp: (state.liveChat.updateSessionTimeStamp),
    userChat: (state.liveChat.userChat),
    chatCount: (state.liveChat.chatCount),
    sessions: (state.liveChat.sessions),
    openSessions: (state.liveChat.openSessions),
    closeSessions: (state.liveChat.closeSessions),
    urlValue: (state.liveChat.urlValue),
    loadingUrl: (state.liveChat.loadingUrl),
    urlMeta: (state.liveChat.urlMeta),
    user: (state.basicInfo.user),
    socketData: (state.liveChat.socketData),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchOpenSessions: fetchOpenSessions,
    fetchUserChats: (fetchUserChats),
    uploadAttachment: (uploadAttachment),
    deletefile: (deletefile),
    sendAttachment: (sendAttachment),
    sendChatMessage: (sendChatMessage),
    fetchUrlMeta: (fetchUrlMeta),
    markRead: (markRead),
    changeStatus: (changeStatus),
    sendNotifications: (sendNotifications),
    fetchTeamAgents: (fetchTeamAgents)
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
