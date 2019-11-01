import React from 'react'
import PropTypes from 'prop-types'
import { getmetaurl, displayDate, showDate, isEmoji, validURL } from '../../utility/liveChatUtility'
import { RingLoader } from 'halogenium'
import { ReactMic } from 'react-mic'
import ReactPlayer from 'react-player'
import AlertContainer from 'react-alert'
import ReactTooltip from 'react-tooltip'
import { Popover, PopoverBody } from 'reactstrap'
import { Picker } from 'emoji-mart'
import StickerMenu from '../../components/StickerPicker/stickers'
import GiphyPicker from 'react-gif-picker'
import { Element } from 'react-scroll'
import Slider from 'react-slick'
import RightArrow from '../../containers/convo/RightArrow'
import LeftArrow from '../../containers/convo/LeftArrow'

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

class ChatAreaBody extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.previousScrollHeight = undefined
    this.newMessage = false
    this.state = {
      prevURL: '',
      displayUrlMeta: false,
      urlmeta: '',
      textAreaValue: '',
      disabledValue: false,
      uploadedId: '',
      uploadedUrl: '',
      attachment: [],
      componentType: '',
      attachmentType: '',
      uploaded: false,
      removeFileDescription: '',
      uploadDescription: '',
      showGifPicker: '',
      isShowingModalRecording: false,
      record: false,
      buttonState: 'start',
      showEmojiPicker: false,
      showStickers: false,
      stickerUrl: '',
      showRecorder: false
    }
    this.setComponentType = this.setComponentType.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.sendThumbsUp = this.sendThumbsUp.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.resetFileComponent = this.resetFileComponent.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.onStop = this.onStop.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.showEmojiPicker = this.showEmojiPicker.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.showStickers = this.showStickers.bind(this)
    this.toggleStickerPicker = this.toggleStickerPicker.bind(this)
    this.showGif = this.showGif.bind(this)
    this.toggleGifPicker = this.toggleGifPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.sendSticker = this.sendSticker.bind(this)
    this.sendGif = this.sendGif.bind(this)
    this.showRecorder = this.showRecorder.bind(this)
    this.closeRecorder = this.closeRecorder.bind(this)
    this.onTestURLVideo = this.onTestURLVideo.bind(this)
    this.onTestURLAudio = this.onTestURLAudio.bind(this)
    this.getmainURL = this.getmainURL.bind(this)
    this.geturl = this.geturl.bind(this)
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
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

  onEnter(e) {
    var isUrl = getmetaurl(this.state.textAreaValue)
    if (e.which === 13) {
      e.preventDefault()
      if (this.state.disabledValue && this.props.activeSession.assigned_to.type === 'agent') {
        this.msg.error('You can not send message. Only assigned agent can send messages.')
      } else if (this.state.disabledValue && this.props.activeSession.assigned_to.type === 'team') {
        this.msg.error('You can not send message. Only agents who are part of assigned team can send messages.')
      } else {
        var payload = {}
        var session = this.props.activeSession
        var data = {}
        if (this.state.uploadedId !== '' && this.state.attachment) {
          payload = this.props.setDataPayload('attachment', this.state)
          data = this.props.setMessageData(session, payload)
          this.props.sendAttachment(data, this.handleSendAttachment)
          data.format = 'convos'
          this.props.userChat.push(data)
        } else if (isUrl !== null && isUrl !== '') {
          payload = this.props.setDataPayload('text', this.state)
          data = this.props.setMessageData(session, payload)
          this.props.sendChatMessage(data)
          this.setState({ textAreaValue: '', urlmeta: {}, displayUrlMeta: false })
          data.format = 'convos'
          this.props.userChat.push(data)
        } else if (this.state.textAreaValue !== '') {
          payload = this.props.setDataPayload('text', this.state)
          data = this.props.setMessageData(session, payload)
          this.props.sendChatMessage(data)
          this.setState({ textAreaValue: '' })
          data.format = 'convos'
          this.props.userChat.push(data)
        }
        this.props.updatePendingSession(this.props.activeSession)
        this.newMessage = true
      }
    }
  }

  sendThumbsUp() {
    this.setState({
      componentType: 'thumbsUp'
    })
    var payload = {
      componentType: 'thumbsUp',
      fileurl: 'https://cdn.cloudkibo.com/public/img/thumbsup.png'
    }
    var session = this.props.activeSession
    var data = this.props.setMessageData(session, payload)
    this.props.sendChatMessage(data)
    data.format = 'convos'
    this.props.userChat.push(data)
    this.setState({ textAreaValue: '' })
  }

  removeAttachment() {
    if (this.state.uploadedId !== '') {
      this.props.deletefile(this.state.uploadedId, this.handleRemove)
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

  resetFileComponent() {
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
      this.props.setComponentType(file)
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
    console.log('res.payload', res.paylaod)
  }

  onStop(recordedBlob) {
    // this.closeDialogRecording()
    console.log('recordedBlob is: ', recordedBlob)
    var file = new File([recordedBlob.blob.slice(0)], 'audio.mp3', { type: 'audio/mp3', lastModified: Date.now() })
    console.log('files', file)
    if (file) {
      this.resetFileComponent()
      this.setState({
        attachment: file,
        attachmentType: file.type
      })
      this.props.setComponentType(file)
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

  startRecording() {
    this.setState({ record: true, buttonState: 'stop' })
  }

  stopRecording() {
    this.setState({
      record: false, buttonState: 'start'
    })
  }

  showEmojiPicker() {
    this.setState({ showEmojiPicker: true })
  }

  toggleEmojiPicker() {
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker })
  }

  showStickers() {
    this.setState({ showStickers: true })
  }

  toggleStickerPicker() {
    this.setState({ showStickers: !this.state.showStickers })
  }

  showGif() {
    this.setState({ showGifPicker: true })
  }

  toggleGifPicker() {
    this.setState({ showGifPicker: !this.state.showGifPicker })
  }

  setEmoji(emoji) {
    this.setState({
      textAreaValue: this.state.textAreaValue + emoji.native,
      showEmojiPicker: false
    })
  }

  sendSticker(sticker) {
    var payload = {
      componentType: 'sticker',
      fileurl: sticker.image.hdpi
    }
    this.setState({
      componentType: 'sticker',
      stickerUrl: sticker.image.hdpi
    })
    var session = this.props.activeSession
    var data = this.props.setMessageData(session, payload)
    this.props.sendChatMessage(data)
    this.toggleStickerPicker()
    data.format = 'convos'
    this.props.userChat.push(data)
  }

  sendGif(gif) {
    var payload = {
      componentType: 'gif',
      fileurl: gif.downsized.url
    }
    this.setState({
      componentType: 'gif',
      stickerUrl: gif.downsized.url
    })
    var session = this.props.activeSession
    var data = this.props.setMessageData(session, payload)
    this.props.sendChatMessage(data)
    this.toggleGifPicker()
    data.format = 'convos'
    this.props.userChat.push(data)
  }

  showRecorder() {
    this.setState({ showRecorder: true })
  }

  closeRecorder() {
    this.setState({ showRecorder: false })
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

  geturl(payload) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${payload.coordinates.lat},${payload.coordinates.long}&zoom=13&scale=false&size=400x200&maptype=roadmap&format=png&key=AIzaSyDDTb4NWqigQmW_qCVmSAkmZIIs3tp1x8Q&visual_refresh=true&markers=size:mid%7Ccolor:0xff0000%7Clabel:1%7C${payload.coordinates.lat},${payload.coordinates.long}`
  }

  getmainURL(payload) {
    return `https://www.google.com/maps/place/${payload.coordinates.lat},${payload.coordinates.long}/`
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

  render() {
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
      <div style={{ padding: '2.2rem 0rem 2.2rem 2.2rem' }} className='m-portlet__body'>

        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="recording" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Voice Recording
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
              <div>
                <ReactMic style={{ width: '450px' }}
                  height='100'
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
                    <a role='button' title='Record' onClick={this.startRecording} style={{ color: '#365899', cursor: 'pointer', textDecoration: 'none' }}>
                      <div style={{ backgroundColor: '#f03d25', borderRadius: '72px', color: '#fff', height: '72px', transition: 'width .1s, height .1s', width: '72px', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }}>
                        <span style={{ left: '50%', position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', color: '#fff', textAlign: 'center', cursor: 'pointer', fontSize: '14px' }}>Record</span>
                      </div>
                    </a>
                  </div>
                </div>
                : <div role='dialog' aria-label='Voice clip' style={{ fontSize: '14px', height: '178px', overflow: 'hidden', width: '220px' }}>
                  <div style={{ display: 'block', fontSize: '14px' }}>
                    <div style={{ height: '90px', width: '90px', backgroundColor: '#333', borderRadius: '50%', opacity: '.2', left: '50%', position: 'absolute', textAlign: 'center', top: '50%', transform: 'translate(-50%, -50%)' }} />
                    <a role='button' title='Record' onClick={this.stopRecording} style={{ color: '#365899', cursor: 'pointer', textDecoration: 'none' }}>
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
        <div style={{ float: 'left', clear: 'both' }}
          ref={(el) => { this.top = el }} />
        <Popover placement='left' isOpen={this.state.showEmojiPicker} className='chatPopover' target='emogiPickerChat' toggle={this.toggleEmojiPicker}>
          <PopoverBody>
            <div>
              <Picker
                style={{ paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px' }}
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
        <Popover placement='left' isOpen={this.state.showGifPicker} className='chatPopover' target='gifPickerChat' toggle={this.toggleGifPicker}>
          <PopoverBody>
            <div>
              <GiphyPicker onSelected={(gif) => { this.sendGif(gif) }} />
            </div>
          </PopoverBody>
        </Popover>
        <Popover
          style={{ paddingBottom: '100px', width: '280px', boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25 }}
          placement='top'
          height='390px'
          target={this.recording}
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
        <div className='tab-content'>
          <div className='tab-pane active m-scrollable' role='tabpanel'>
            <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
              <div style={{ height: '393px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom' }} className='m-messenger__messages'>
                <div id='chat-container' ref='chatScroll' style={{ position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr' }}>
                  <div style={{ position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto' }} >
                    {
                      (this.props.chatCount > this.props.userChat.length) &&
                      <p style={{ textAlign: 'center' }}>Loading...</p>
                    }
                    {
                      this.props.userChat.map((msg, index) => (
                        msg.format === 'facebook'
                          ? <div key={index} style={{ marginLeft: 0, marginRight: 0, display: 'block', clear: 'both' }} className='row'>
                            <Element name={msg.datetime}>
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
                              <div style={{ minWidth: '200px', maxWidth: '200px' }} key={msg._id} className='m-messenger__message m-messenger__message--in'>
                                <div className='m-messenger__message-pic'>
                                  <img src={this.props.activeSession.profilePic} alt='' />
                                </div>
                                <div className='m-messenger__message-body'>
                                  <div className='m-messenger__message-arrow' />
                                  {
                                    msg.payload.attachments && !msg.url_meta
                                      ? (
                                        <div className='m-messenger__message-content'>
                                          <div className='m-messenger__message-username'>
                                            {this.props.activeSession.firstName} shared
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
                                                    ? <a key={index} href={att.payload.url} target='_blank'>
                                                      <img
                                                        src={att.payload.url}
                                                        style={{ maxWidth: '150px', maxHeight: '85px', marginTop: '10px' }}
                                                      />
                                                    </a>
                                                    : att.type === 'location'
                                                      ? <table key={index} style={{ border: '1px solid #ccc', borderRadius: '15px', borderCollapse: 'separate', padding: '5px' }}>
                                                        <tbody>
                                                          <tr>
                                                            <td>
                                                              <a href={this.getmainURL(att.payload)} target='_blank'>
                                                                <img style={{ width: '200px' }} src={this.geturl(att.payload)} />
                                                              </a>
                                                            </td>
                                                          </tr>
                                                          <tr>
                                                            <td>
                                                              <p style={{ fontWeight: 'bold' }}> {att.title} </p>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      : att.type === 'file' &&
                                                      <a key={index} href={att.payload.url} target='_blank'>
                                                        <h6 style={{ marginTop: '10px' }}><i className='fa fa-file-text-o' /><strong> {att.payload.url.split('?')[0].split('/')[att.payload.url.split('?')[0].split('/').length - 1]}</strong></h6>
                                                      </a>
                                            ))
                                          }
                                        </div>
                                      )
                                      : msg.url_meta
                                        ? <div className='m-messenger__message-content'>
                                          <div className='m-messenger__message-username'>
                                            {this.props.activeSession.firstName} shared a link
                                    </div>
                                          <div style={{ clear: 'both', display: 'block' }}>
                                            <div style={{ borderRadius: '15px', backgroundColor: '#f0f0f0', minHeight: '20px', justifyContent: 'flex-end', boxSizing: 'border-box', clear: 'both', position: 'relative', display: 'inline-block' }}>
                                              <table style={{ maxWidth: '175px' }}>
                                                {
                                                  msg.url_meta.type && msg.url_meta.type === 'video'
                                                    ? <tbody>
                                                      <tr>
                                                        <td style={{ width: '30%' }} colspan='2'>
                                                          <ReactPlayer
                                                            url={msg.url_meta.url}
                                                            controls
                                                            width='100%'
                                                            height='100px'
                                                          />
                                                        </td>
                                                        <td style={{ width: '70%' }}>
                                                          <div>
                                                            <a href={msg.url_meta.url} target='_blank'>
                                                              <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', width: '200px' }}>{msg.url_meta.title}</p>
                                                            </a>
                                                            <br />
                                                            <p style={{ marginTop: '-35px' }}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
                                                          </div>
                                                        </td>
                                                      </tr>
                                                    </tbody>
                                                    : <tbody>
                                                      <tr>
                                                        <td>
                                                          <div style={{ width: 45, height: 45 }}>
                                                            {
                                                              msg.url_meta.image &&
                                                              <img src={msg.url_meta.image.url} style={{ width: 45, height: 45 }} />
                                                            }
                                                          </div>
                                                        </td>
                                                        <td>
                                                          <div>
                                                            <a href={msg.url_meta.url} target='_blank'>
                                                              <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', width: '200px' }}>{msg.url_meta.title}</p>
                                                            </a>
                                                            <br />
                                                            {
                                                              msg.url_meta.description &&
                                                              <p style={{ marginTop: '-35px' }}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
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
                                              {this.props.activeSession.firstName} reacted
                                    </div>
                                            <div style={{ fontSize: '30px' }} className='m-messenger__message-text'>
                                              {msg.payload.text}
                                            </div>
                                          </div>
                                          : <div className='m-messenger__message-content'>
                                            <div className='m-messenger__message-username'>
                                              {this.props.activeSession.firstName} wrote
                                    </div>
                                            <div style={{ wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px' }} className='m-messenger__message-text'>
                                              {msg.payload.text}
                                            </div>
                                          </div>
                                  }
                                </div>
                              </div>
                            </Element>
                          </div>
                          : <div key={index} style={{ marginLeft: 0, marginRight: 0, display: 'block', clear: 'both' }} className='row'>
                            <Element name={msg.datetime}>
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
                              <div style={{ minWidth: '200px' }} key={msg._id} className='m-messenger__message m-messenger__message--out'>
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
                                          <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                            <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
                                            <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                              <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                            </div>
                                          }
                                        </div>
                                        : msg.payload.componentType === 'file'
                                          ? <div>
                                            <div className='m-messenger__message-content'>
                                              <div className='m-messenger__message-username'>
                                                {this.getRepliedByMsg(msg)}
                                              </div>
                                              <a download={msg.payload.fileName} target='_blank' href={msg.payload.fileurl.url} >
                                                <h6 style={{ color: 'white' }}><i className='fa fa-file-text-o' /><strong> {msg.payload.fileName}</strong></h6>
                                              </a>
                                            </div>
                                            {index === this.props.userChat.length - 1 && msg.seen &&
                                              <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
                                                  <div style={{ maxWidth: 200, borderRadius: '10px' }} className='ui-block hoverbordersolid'>
                                                    <div style={{ backgroundColor: '#F2F3F8', padding: '5px' }} className='cardimageblock'>
                                                      <a href={msg.payload.fileurl} target='_blank'>
                                                        <img style={{ maxWidth: 180, borderRadius: '5px' }} src={msg.payload.fileurl} />
                                                      </a>
                                                    </div>
                                                    <div style={{ marginTop: '10px', padding: '5px' }}>
                                                      <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{msg.payload.title}</div>
                                                      <div style={{ textAlign: 'left', color: '#ccc' }}>{msg.payload.description}</div>
                                                    </div>
                                                  </div>
                                                  {
                                                    msg.payload.buttons && msg.payload.buttons.length > 0 &&
                                                    msg.payload.buttons.map((b, i) => (
                                                      <a key={i} href={b.url} target='_blank' style={{ width: '100%', marginTop: '5px' }} className='btn btn-secondary btn-sm'>
                                                        {b.title}
                                                      </a>
                                                    ))
                                                  }
                                                </div>
                                              </div>
                                              {index === this.props.userChat.length - 1 && msg.seen &&
                                                <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                  <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                                </div>
                                              }
                                            </div>
                                            : msg.payload.componentType === 'gallery'
                                              ? <div>
                                                <div style={{ width: '250px' }} className='m-messenger__message-content'>
                                                  <div className='m-messenger__message-username'>
                                                    {this.getRepliedByMsg(msg)}
                                                  </div>
                                                  <Slider ref={(c) => { this.slider = c }} {...settings}>
                                                    {
                                                      msg.payload.cards.map((card, i) => (
                                                        <div key={i}>
                                                          <div id={i} style={{ maxWidth: '200px', borderRadius: '10px' }} className='ui-block hoverbordersolid'>
                                                            <div style={{ backgroundColor: '#F2F3F8', padding: '5px' }} className='cardimageblock'>
                                                              <a href={card.image_url} target='_blank'>
                                                                <img style={{ maxWidth: 180, borderRadius: '5px' }} src={card.image_url} />
                                                              </a>
                                                            </div>
                                                            <div style={{ marginTop: '10px', padding: '5px' }}>
                                                              <div style={{ textAlign: 'left', fontWeight: 'bold' }}>{card.title}</div>
                                                              <div style={{ textAlign: 'left', color: '#ccc' }}>{card.subtitle}</div>
                                                            </div>
                                                          </div>
                                                          {
                                                            card.buttons && card.buttons.length > 0 &&
                                                            card.buttons.map((b, i) => (
                                                              <a key={i} href={b.url} target='_blank' style={{ width: '100%', marginTop: '5px' }} className='btn btn-secondary btn-sm'>
                                                                {b.title}
                                                              </a>
                                                            ))
                                                          }
                                                        </div>
                                                      ))
                                                    }
                                                  </Slider>
                                                </div>
                                                {index === this.props.userChat.length - 1 && msg.seen &&
                                                  <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                    <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
                                                      src={msg.payload.fileurl.url}
                                                      style={{ maxWidth: '150px', maxHeight: '85px' }}
                                                    />
                                                  </div>
                                                  {index === this.props.userChat.length - 1 && msg.seen &&
                                                    <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                      <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
                                                        src={msg.payload.fileurl}
                                                        style={{ maxWidth: '150px', maxHeight: '85px' }}
                                                      />
                                                    </div>
                                                    {index === this.props.userChat.length - 1 && msg.seen &&
                                                      <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                        <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
                                                          src={msg.payload.fileurl}
                                                          style={{ maxWidth: '150px', maxHeight: '85px' }}
                                                        />
                                                      </div>
                                                      {index === this.props.userChat.length - 1 && msg.seen &&
                                                        <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                          <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
                                                            src={msg.payload.fileurl}
                                                            style={{ maxWidth: '150px', maxHeight: '85px' }}
                                                          />
                                                        </div>
                                                        {index === this.props.userChat.length - 1 && msg.seen &&
                                                          <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                            <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
                                                              <div style={{ clear: 'both', display: 'block' }}>
                                                                <div style={{ borderRadius: '15px', backgroundColor: '#f0f0f0', minHeight: '20px', justifyContent: 'flex-end', boxSizing: 'border-box', clear: 'both', position: 'relative', display: 'inline-block' }}>
                                                                  <table style={{ maxWidth: '175px' }}>
                                                                    {
                                                                      msg.url_meta.type && msg.url_meta.type === 'video'
                                                                        ? <tbody>
                                                                          <tr>
                                                                            <td style={{ width: '30%' }} colspan='2'>
                                                                              <ReactPlayer
                                                                                url={msg.url_meta.url}
                                                                                controls
                                                                                width='100%'
                                                                                height='100px'
                                                                              />
                                                                            </td>
                                                                            <td style={{ width: '70%' }}>
                                                                              <div>
                                                                                <a href={msg.url_meta.url} target='_blank'>
                                                                                  <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', width: '200px' }}>{msg.url_meta.title}</p>
                                                                                </a>
                                                                                <br />
                                                                                <p style={{ marginTop: '-35px', color: '#696d75' }}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
                                                                              </div>
                                                                            </td>
                                                                          </tr>
                                                                        </tbody>
                                                                        : <tbody>
                                                                          <tr>
                                                                            <td>
                                                                              <div style={{ width: 45, height: 45 }}>
                                                                                {
                                                                                  msg.url_meta.image &&
                                                                                  <img src={msg.url_meta.image.url} style={{ width: 45, height: 45 }} />
                                                                                }
                                                                              </div>
                                                                            </td>
                                                                            <td>
                                                                              <div>
                                                                                <a href={msg.url_meta.url} target='_blank'>
                                                                                  <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold', textOverflow: 'ellipsis', overflow: 'hidden', width: '200px' }}>{msg.url_meta.title}</p>
                                                                                </a>
                                                                                <br />
                                                                                {
                                                                                  msg.url_meta.description &&
                                                                                  <p style={{ marginTop: '-35px', color: '#696d75' }}>{msg.url_meta.description.length > 25 ? msg.url_meta.description.substring(0, 24) + '...' : msg.url_meta.description}</p>
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
                                                              <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                                <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
                                                                  ? <div style={{ wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px' }} className='m-messenger__message-text'>
                                                                    <a style={{ color: 'white' }} href={msg.payload.text} target='_blank'>
                                                                      <p>{msg.payload.text}</p>
                                                                    </a>
                                                                  </div>
                                                                  : <div style={{ wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px' }} className='m-messenger__message-text'>
                                                                    {msg.payload.text}
                                                                  </div>
                                                              }
                                                            </div>
                                                            {index === this.props.userChat.length - 1 && msg.seen &&
                                                              <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                                <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
                                                              <div style={{ fontSize: '30px' }} className='m-messenger__message-text'>
                                                                {msg.payload.text}
                                                              </div>
                                                            </div>
                                                            {index === this.props.userChat.length - 1 && msg.seen &&
                                                              <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                                <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
                                                              </div>
                                                            }
                                                          </div>
                                                          : <div>
                                                            <div className='m-messenger__message-content'>
                                                              <div className='m-messenger__message-username'>
                                                                {this.getRepliedByMsg(msg)}
                                                              </div>
                                                              <div style={{ wordBreak: 'break-all', display: 'block', overflow: 'hidden', width: '200px' }} className='m-messenger__message-text'>
                                                                {msg.payload.text}
                                                              </div>
                                                            </div>
                                                            {
                                                              msg.payload.buttons && msg.payload.buttons.length > 0 &&
                                                              msg.payload.buttons.map((b, i) => (
                                                                <a key={i} href={b.url} target='_blank' style={{ borderColor: '#716aca', width: '100%', marginTop: '5px' }} className='btn btn-outline-brand btn-sm'>
                                                                  {b.title}
                                                                </a>
                                                              ))
                                                            }
                                                            {index === this.props.userChat.length - 1 && msg.seen &&
                                                              <div style={{ float: 'right', marginRight: '15px', fontSize: 'small' }}>
                                                                <i className='la la-check' style={{ fontSize: 'small' }} />&nbsp;Seen&nbsp;{displayDate(msg.seenDateTime)}
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
              <div className='m-messenger__form'>
                <div className='m-messenger__form-controls'>
                  <input autoFocus ref={(input) => { this.textInput = input }} type='text' name='' placeholder='Type here...' onChange={this.handleTextChange} value={this.state.textAreaValue} onKeyPress={this.onEnter} className='m-messenger__form-input' />
                </div>
                <div className='m-messenger__form-tools'>
                  <a className='m-messenger__form-attachment'>
                    <i onClick={this.sendThumbsUp} className='la la-thumbs-o-up' />
                  </a>
                </div>
              </div>
              {this.state.uploaded
                ? <div style={{ wordWrap: 'break-word', overFlow: 'auto', minHeight: '50px' }}>
                  <span onClick={this.removeAttachment} style={{ cursor: 'pointer', float: 'right' }} className='fa-stack'>
                    <i style={{ color: '#ccc' }} className='fa fa-times fa-stack-1x fa-inverse' />
                  </span>
                  <div><i className='fa fa-file-text-o' /> {this.state.attachment.name}</div>
                  <div style={{ wordWrap: 'break-word', color: 'red', fontSize: 'small' }}>{this.state.removeFileDescription}</div>
                </div>
                : <div style={{ wordWrap: 'break-word', color: 'red', fontSize: 'small' }}>{this.state.uploadDescription}</div>
              }
              <div>
                <div style={{ display: 'inline-block' }} data-tip='emoticons'>
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
                  <input type='file' accept='image/*' onChange={this.onFileChange}
                    ref='selectImage' style={styles.inputf} />
                </div>
                <div style={{ display: 'inline-block' }} data-tip='attachments'>
                  {this.state.uploadedId !== ''
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
                      <input type='file' accept='image/*,audio/*,video/*,application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf' onChange={this.onFileChange}
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
                      <input type='file' accept='image/*,audio/*,video/*,application/msword, application/vnd.ms-excel, application/vnd.ms-powerpoint, text/plain, application/pdf' onChange={this.onFileChange}
                        ref='selectFile' style={styles.inputf} />
                    </div>
                  }
                </div>
                <div ref={(c) => { this.recording = c }} style={{ display: 'inline-block' }} data-tip='recording'>
                  <i data-toggle="modal" data-target="#recording" style={styles.iconclass}>
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
                <div style={{ display: 'inline-block' }} data-tip='emoticons1'>
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
                <div style={{ display: 'inline-block' }} data-tip='stickers'>
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
                <div style={{ display: 'inline-block' }} data-tip='GIF'>
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
                <div style={{ clear: 'both', display: 'block' }}>
                  <div style={{ borderRadius: '15px', backgroundColor: '#f0f0f0', minHeight: '20px', justifyContent: 'flex-end', boxSizing: 'border-box', clear: 'both', position: 'relative', display: 'inline-block' }}>
                    <table style={{ maxWidth: '318px' }}>
                      {
                        this.state.urlmeta.type && this.state.urlmeta.type === 'video'
                          ? <tbody>
                            <tr>
                              <td style={{ width: '30%' }} colspan='2'>
                                <ReactPlayer
                                  url={this.state.urlmeta.url}
                                  controls
                                  width='100%'
                                  height='100px'
                                />
                              </td>
                              <td style={{ width: '70%' }}>
                                <div>
                                  <a href={this.state.urlmeta.url} target='_blank'>
                                    <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold' }}>{this.state.urlmeta.title}</p>
                                  </a>
                                  <br />
                                  <p style={{ marginTop: '-35px' }}>{this.state.urlmeta.description.length > 25 ? this.state.urlmeta.description.substring(0, 24) + '...' : this.state.urlmeta.description}</p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                          : <tbody>
                            <tr>
                              <td>
                                <div style={{ width: 45, height: 45 }}>
                                  {
                                    this.state.urlmeta.image &&
                                    <img src={this.state.urlmeta.image.url} style={{ width: 45, height: 45 }} />
                                  }
                                </div>
                              </td>
                              <td>
                                <div>
                                  <a href={this.state.urlmeta.url} target='_blank'>
                                    <p style={{ color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold' }}>{this.state.urlmeta.title}</p>
                                  </a>
                                  <br />
                                  {
                                    this.state.urlmeta.description &&
                                    <p style={{ marginTop: '-35px' }}>{this.state.urlmeta.description.length > 25 ? this.state.urlmeta.description.substring(0, 24) + '...' : this.state.urlmeta.description}</p>
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
    )
  }
}

ChatAreaBody.propTypes = {
  'chatCount': PropTypes.number.isRequired,
  'userChat': PropTypes.array.isRequired,
  'fetchUrlMeta': PropTypes.func.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'setMessageData': PropTypes.func.isRequired,
  'setDataPayload': PropTypes.func.isRequired,
  'sendAttachment': PropTypes.func.isRequired,
  'sendChatMessage': PropTypes.func.isRequired,
  'deletefile': PropTypes.func.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'loadingUrl': PropTypes.bool.isRequired,
  'urlValue': PropTypes.string.isRequired,
  'user': PropTypes.object.isRequired
}

export default ChatAreaBody
