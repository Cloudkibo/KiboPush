/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { sendChatMessage, sendAttachment } from '../../redux/actions/whatsAppChat.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { uploadAttachment, deletefile, fetchUrlMeta } from '../../redux/actions/livechat.actions'
import { Popover, PopoverBody } from 'reactstrap'
import { Picker } from 'emoji-mart'
import StickerMenu from '../../components/StickerPicker/stickers'
import GiphySelect from 'react-giphy-select'
import { Link } from 'react-router'
import { getmetaurl } from '../liveChat/utilities'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import MessageTemplate from './messageTemplate'
import AlertContainer from 'react-alert'
import Halogen from 'halogen'
import YouTube from 'react-youtube'
import {getVideoId} from '../../utility/utils'

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
    this.previousScrollHeight = undefined
    this.newMessage = false
    this.state = {
      textAreaValue: '',
      attachment: [],
      attachmentType: '',
      componentType: '',
      uploaded: false,
      uploadDescription: '',
      uploadedId: '',
      removeFileDescription: '',
      showStickers: false,
      scrolling: true,
      showGifPicker: false,
      showTemplates: false,
      urlmeta: '',
      prevURL: '',
      displayUrlMeta: false
    }

    this.handleTextChange = this.handleTextChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.showEmojiPicker = this.showEmojiPicker.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.getRepliedByMsg = this.getRepliedByMsg.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.resetFileComponent = this.resetFileComponent.bind(this)
    this.setComponentType = this.setComponentType.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.setDataPayload = this.setDataPayload.bind(this)
    this.setMessageData = this.setMessageData.bind(this)
    this.handleSendAttachment = this.handleSendAttachment.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.showStickers = this.showStickers.bind(this)
    this.toggleStickerPicker = this.toggleStickerPicker.bind(this)
    this.sendSticker = this.sendSticker.bind(this)
    this.showGif = this.showGif.bind(this)
    this.sendGif = this.sendGif.bind(this)
    this.toggleGifPicker = this.toggleGifPicker.bind(this)
    this.sendThumbsUp = this.sendThumbsUp.bind(this)
    this.openTemplates = this.openTemplates.bind(this)
    this.closeTemplates = this.closeTemplates.bind(this)
    this.sendTemplate = this.sendTemplate.bind(this)
  }

  showGif () {
    this.setState({showGifPicker: true, scrolling: false})
  }
  openTemplates () {
    this.setState({
      showTemplates: true
    })
  }
  closeTemplates () {
    this.setState({
      showTemplates: false
    })
  }
  sendTemplate (msg) {
    var payload = {
      componentType: 'text',
      text:msg
    }
    var data = this.setMessageData(this.props.activeSession, payload)
    this.props.sendChatMessage(data)
    this.closeTemplates()
    data.format = 'kibopush'
    this.props.chat.push(data)
    this.newMessage = true
  }

  toggleGifPicker () {
    this.setState({showGifPicker: !this.state.showGifPicker})
  }
  showStickers () {
    this.setState({showStickers: true, scrolling: false})
  }
  sendGif (gif) {
    var payload = {
      componentType: 'gif',
      fileurl: {url: gif.images.downsized.url}
    }
    this.setState({
      componentType: 'gif',
      stickerUrl: gif.images.downsized.url,
      scrolling: true
    })
    var session = this.props.activeSession
    var data = this.setMessageData(session, payload)
    this.props.sendChatMessage(data)
    this.toggleGifPicker()
    data.format = 'kibopush'
    this.props.chat.push(data)
    this.newMessage = true
  }
  sendThumbsUp () {
    this.setState({
      componentType: 'thumbsUp',
      scrolling: true
    })
    var payload = {
      componentType: 'thumbsUp',
      fileurl: {url: 'https://cdn.cloudkibo.com/public/img/thumbsup.png'}
    }
    var session = this.props.activeSession
    var data = this.setMessageData(session, payload)
    this.props.sendChatMessage(data)
    data.format = 'kibopush'
    this.props.chat.push(data)
    this.newMessage = true
    this.setState({textAreaValue: ''})
  }

  sendSticker (sticker) {
    var payload = {
      componentType: 'sticker',
      fileurl: {url:sticker.image.hdpi}
    }
    this.setState({
      componentType: 'sticker',
      stickerUrl: sticker.image.hdpi,
      scrolling: true
    })
    var session = this.props.activeSession
    var data = this.setMessageData(session, payload)
    this.props.sendChatMessage(data)
    this.toggleStickerPicker()
    data.format = 'kibopush'
    this.props.chat.push(data)
    this.newMessage = true
  }
  toggleStickerPicker () {
    this.setState({showStickers: !this.state.showStickers})
  }
  setMessageData (session, payload) {
    let data = {
      senderNumber: this.props.chat[0].recipientNumber,
      recipientNumber: this.props.chat[0].senderNumber,
      contactId: session._id,
      payload: payload,
      datetime: new Date().toString(),
      repliedBy: {
        id: this.props.user._id,
        name: this.props.user.name,
        type: 'agent'
      }
    }
    if (this.state.urlmeta !== '') {
      data.url_meta = this.state.urlmeta
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
          name: this.state.attachment.name,
          url: this.state.uploadedUrl
        }
      }
    } else if (component === 'text') {
      payload = {
        componentType: 'text',
        text: this.state.textAreaValue
      }
    } else if (component === 'gif') {
      payload = {
        componentType: this.state.componentType,
        fileurl: {url: this.state.gifUrl}
      }
    } else if (component === 'sticker') {
      payload = {
        componentType: this.state.componentType,
        fileurl: {url: this.state.stickerUrl}
      }
    } else if (component === 'thumbsUp') {
      payload = {
        componentType: 'thumbsUp',
        fileurl: {url: 'https://app.kibopush.com/img/thumbsup.png'}
      }
    }

    return payload
  }

  removeAttachment () {
    if (this.state.uploadedId !== '') {
      this.props.deletefile(this.state.uploadedId, this.handleRemove)
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

  resetFileComponent () {
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

  setComponentType (file) {
    if (file.type.match('image.*')) {
      this.setState({componentType: 'image'})
    } else if (file.type.match('audio.*')) {
      this.setState({componentType: 'audio'})
    } else if (file.type.match('video.*')) {
      this.setState({componentType: 'video'})
    } else if (file.type.match('application.*')) {
      this.setState({componentType: 'file'})
    } else {
      this.setState({componentType: 'Not allowed'})
    }
  }

  onFileChange (e) {
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
      } else if (file.size > 5000000) {
        this.msg.error('Files greater than 5MB not allowed')
      } else {
        var fileData = new FormData()
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('componentType', this.state.componentType)
        console.log('file', file)
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
    console.log('res.payload', res.paylaod)
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

  handleSendAttachment (res) {
    if (res.status === 'success') {
      this.resetFileComponent()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.urlMeta) {
      if (!nextProps.urlMeta.type) {
        this.setState({displayUrlMeta: false})
      }
      this.setState({urlmeta: nextProps.urlMeta})
    }
  }

  onEnter (e) {
    if (e.which === 13) {
      e.preventDefault()
      var payload = {}
      var session = this.props.activeSession
      var data = {}
      if (this.state.uploadedId !== '' && this.state.attachment) {
        payload = this.setDataPayload('attachment')
        data = this.setMessageData(session, payload)
        this.props.onEnter(data, 'attachment', this.handleSendAttachment)
      } else if (this.state.textAreaValue !== '') {
        payload = this.setDataPayload('text')
        data = this.setMessageData(session, payload)
        this.props.onEnter(data, 'text')
        this.setState({textAreaValue: ''})
        this.setState({prevURL: ''})
      }
      this.newMessage = true
    }
  }

  setEmoji (emoji) {
    this.setState({
      textAreaValue: this.state.textAreaValue + emoji.native,
      showEmojiPicker: false
    })
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('render in chatbox', this.props.chat)
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        { this.props.sessionValid
          ?<div>
          <Popover placement='left' isOpen={this.state.showEmojiPicker} className='chatPopover' target='emogiPickerChat' toggle={this.toggleEmojiPicker}>
            <PopoverBody>
              <div>
                <Picker
                  style={{paddingBottom: '100px', height: '390px', marginLeft: '-14px', marginTop: '-10px'}}
                  emojiSize={24}
                  perLine={6}
                  skin={1}
                  set='emojione'
                  showPreview={false}
                  showSkinTones={false}
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
          {/*<Popover placement='left' isOpen={this.state.showGifPicker} className='chatPopover _popover_max_width_400' target='gifPickerChat' toggle={this.toggleGifPicker}>
            <PopoverBody>
              <GiphySelect
                onEntrySelect={gif => this.sendGif(gif)}
              />
            </PopoverBody>
          </Popover>*/}
          <div className='m-messenger__form'>
            <div className='m-input-icon m-input-icon--right m-messenger__form-controls'>
              <textarea autoFocus ref={(input) => { this.textInput = input }} type='text' name='' placeholder='Type here...' onChange={this.handleTextChange} value={this.state.textAreaValue} onKeyPress={this.onEnter} className='m-messenger__form-input' style={{resize: 'none'}} />
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
            <div style={{display: 'inline-block'}} data-tip='image'>
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
              <input type='file' accept='image/* video/mp4' onClick={(e)=>{e.target.value= ''}} onChange={this.onFileChange} onError={this.onFilesError}
                ref='selectImage' style={styles.inputf} />
            </div>
            <div style={{display: 'inline-block'}} data-tip='file'>
              <div>
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
                  }} className='fa fa-file-pdf-o' />
                </i>
                <input type='file' accept='application/pdf' onClick={(e)=>{e.target.value= ''}} onChange={this.onFileChange} onError={this.onFilesError}
                  ref='selectFile' style={styles.inputf} />
              </div>
            </div>
            <div style={{display: 'inline-block'}} data-tip='audio'>
              <i style={styles.iconclass} onClick={() => {
                this.refs.selectAudio.click()
              }}>
                <i style={{
                  fontSize: '20px',
                  position: 'absolute',
                  left: '0',
                  width: '100%',
                  height: '1em',
                  margin: '5px',
                  textAlign: 'center'
                }} className='fa fa-file-audio-o' />
              </i>
              <input type='file' accept='audio/*' onClick={(e)=>{e.target.value= ''}} onChange={this.onFileChange} onError={this.onFilesError}
                ref='selectAudio' style={styles.inputf} />
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
            {/*<div style={{display: 'inline-block'}} data-tip='GIF'>
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
            </div>*/}
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
            <div style={{display: 'inline-block', width: '50%'}}>
              <Link style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', float: 'right'}} onClick={this.openTemplates}>Use Templates</Link>
            </div>
          </div>
          {
            this.state.prevURL && this.props.loadingUrl === true && this.props.urlValue === this.state.prevURL &&
            <div className='align-center'>
              <center><Halogen.RingLoader color='#716aca' /></center>
            </div>
          }
          {
             this.state.prevURL && JSON.stringify(this.state.urlmeta) !== '{}' && this.props.loadingUrl === false &&
             <div style={{clear: 'both', display: 'block', overflow: 'hidden', width: '350px'}}>
               <div style={{borderRadius: '15px', backgroundColor: '#f0f0f0', minHeight: '20px', justifyContent: 'flex-end', boxSizing: 'border-box', clear: 'both', position: 'relative', display: 'inline-block', padding: '5px'}}>
                 {getVideoId(this.state.prevURL)
                  ? <div>
                  <YouTube
                    videoId={getVideoId(this.state.prevURL)}
                    opts={{
                      height: '150',
                      width: '300',
                      playerVars: { // https://developers.google.com/youtube/player_parameters
                        autoplay: 1
                      }
                    }}/>
                  <a href={this.state.prevURL} target='_blank'>
                      <p style={{color: 'rgba(0, 0, 0, 1)', fontSize: '13px', fontWeight: 'bold'}}>{this.state.urlmeta.title}</p>
                    </a>
                    <br />
                    {
                      this.state.urlmeta.description &&
                        <p style={{marginTop: '-35px'}}>{this.state.urlmeta.description.length > 25 ? this.state.urlmeta.description.substring(0, 24) + '...' : this.state.urlmeta.description}</p>
                    }
                    </div>
                 : <table style={{maxWidth: '318px', margin: '10px'}}>
                  <tbody>
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
                 </table>
               }
               </div>
             </div>
          }
        </div>
      :
      <span><p>Chat's 24 hours window session has been expired for this subscriber. You can only use templates to send a message</p>
        <Link style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer', float: 'right', marginRight: '10px'}} onClick={this.openTemplates}>Use Templates</Link>
      </span>
      }
       {
          this.state.showTemplates &&
          <ModalContainer style={{ width: '500px' }}
            onClose={this.closeTemplates}>
            <ModalDialog style={{ width: '500px' }}
              onClose={this.closeTemplates}>
                <MessageTemplate sendTemplate={this.sendTemplate} closeTemplates={this.closeTemplates}/>
            </ModalDialog>
          </ModalContainer>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in ChatBox', state)
  return {
    chatCount: (state.whatsAppChatInfo.chatCount),
    urlMeta: (state.liveChat.urlMeta),
    urlValue: (state.liveChat.urlValue),
    loadingUrl: (state.liveChat.loadingUrl)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    sendChatMessage,
    uploadAttachment,
    deletefile,
    sendAttachment,
    fetchUrlMeta
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatBox)
