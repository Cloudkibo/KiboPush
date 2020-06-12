import React from 'react'
import PropTypes from 'prop-types'
import { getmetaurl } from '../../../containers/liveChat/utilities'

// components
import MODAL from '../../extras/modal'
import AUDIORECORDER from '../../audioRecorder'
import CARD from '../messages/horizontalCard'

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      text: '',
      attachment: {},
      componentType: '',
      gif: '',
      sticker: '',
      urlmeta: {},
      uploadingFile: false,
      uploaded: false,
      loading: false,
      loadingUrlMeta: false,
      currentUrl: '',
      showAudioRecording: false
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.sendThumbsUp = this.sendThumbsUp.bind(this)
    this.onAttachmentUpload = this.onAttachmentUpload.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this.setDataPayload = this.setDataPayload.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.getComponentType = this.getComponentType.bind(this)
    this.sendAttachment = this.sendAttachment.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.handleMessageResponse = this.handleMessageResponse.bind(this)
    this.getRecordAudioContent = this.getRecordAudioContent.bind(this)
    this.onDoneRecording = this.onDoneRecording.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.sendSticker = this.sendSticker.bind(this)
    this.sendGif = this.sendGif.bind(this)
    this.updateChatData = this.updateChatData.bind(this)
    this.handleUrlMeta = this.handleUrlMeta.bind(this)
    this.removeUrlMeta = this.removeUrlMeta.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.toggleAudioRecording = this.toggleAudioRecording.bind(this)
    this.sendAgentName = this.sendAgentName.bind(this)
  }

  sendAgentName () {
    let data = this.props.setMessageData(this.props.activeSession, {
      componentType: 'text',
      text: `${this.props.user.name} sent:`
    })
    this.props.sendChatMessage(data)
  }

  setEmoji (emoji) {
    this.setState({text: this.state.text + emoji.native})
  }

  updateChatData (data, payload) {
    data._id = new Date().getTime()
    let sessions = this.props.sessions
    let session = this.props.activeSession
    let index = sessions.findIndex((s) => s._id === session._id)
    sessions.splice(index, 1)
    session.lastPayload = payload
    session.lastRepliedBy = data.replied_by
    session.pendingResponse = false
    session.last_activity_time = new Date()
    this.props.updateNewMessage(true)
    this.props.updateState({
      reducer: true,
      userChat: [...this.props.userChat, data],
      sessions: [session, ...sessions]
    })
  }

  sendSticker (sticker) {
    const data = this.props.performAction('send messages', this.props.activeSession)
    if (data.isAllowed) {
      this.props.togglePopover()
      const payload = {
        componentType: 'sticker',
        fileurl: sticker.image.hdpi
      }
      const data = this.props.setMessageData(this.props.activeSession, payload)
      if (this.props.showAgentName) {
        this.sendAgentName()
      }
      this.props.sendChatMessage(data)
      data.format = 'convos'
      this.updateChatData(data, payload)
    } else {
      this.props.alertMsg.error(data.errorMsg)
    }
  }

  sendGif (gif) {
    const data = this.props.performAction('send messages', this.props.activeSession)
    if (data.isAllowed) {
      this.props.togglePopover()
      const payload = {
        componentType: 'gif',
        fileurl: gif.images.downsized.url
      }
      const data = this.props.setMessageData(this.props.activeSession, payload)
      if (this.props.showAgentName) {
        this.sendAgentName()
      }
      this.props.sendChatMessage(data)
      data.format = 'convos'
      this.updateChatData(data, payload)
    } else {
      this.props.alertMsg.error(data.errorMsg)
    }
  }

  removeUrlMeta () {
    this.setState({urlmeta: {}})
    this.props.updateChatAreaHeight('57vh')
  }

  handleUrlMeta (data) {
    console.log('urlMeta', data)
    if (data) {
      this.setState({
        loadingUrlMeta: false,
        urlmeta: data.ogTitle ? data : {}
      })
      this.props.updateChatAreaHeight('42vh')
    } else {
      this.setState({
        loadingUrlMeta: false,
        urlmeta: {}
      })
      this.props.updateChatAreaHeight('57vh')
    }
  }

  onInputChange (e) {
    const text = e.target.value
    let state = {text}
    const url = getmetaurl(text)
    if (url && url !== this.state.currentUrl) {
      state.loadingUrlMeta = true
      state.currentUrl = url
      this.props.fetchUrlMeta(url, this.handleUrlMeta)
    }
    this.setState(state)
  }

  removeAttachment () {
    this.props.deletefile(this.state.attachment.id)
    this.setState({
      attachment: {},
      componentType: '',
      uploadingFile: false,
      uploaded: false
    })
  }

  toggleAudioRecording (value) {
    this.setState({showAudioRecording: value})
  }
  onDoneRecording (recordedBlob) {
    console.log('recordedBlob object', recordedBlob)
    const file = new File([recordedBlob.blob], 'recorded-audio.mp3', { type: recordedBlob.blob.type, lastModified: new Date()})
    if (file) {
      if (this.state.attachment) {
        this.props.deletefile(this.state.attachment.id)
      }
      this.setState({
        uploadingFile: true,
        attachment: file,
        componentType: 'audio'
      })
      const fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      fileData.append('componentType', 'audio')
      this.props.uploadRecording(fileData, this.onAttachmentUpload)
    }
  }

  getRecordAudioContent () {
    if (this.state.showAudioRecording) {
      return (
        <AUDIORECORDER
          onDoneRecording={this.onDoneRecording}
          closeModalOnStop={true}
        />
      )
    } else {
      return (<div />)
    }
  }

  getComponentType(type) {
    if (type.match('image.*')) {
      return 'image'
    } else if (type.match('audio.*')) {
      return 'audio'
    } else if (type.match('video.*')) {
      return 'video'
    } else if (type.match('application.*') || type.match('text.*')) {
      return 'file'
    }
  }

  handleMessageResponse (res, data, payload) {
    if (res.status === 'success') {
      data.format = 'convos'
      this.setState({
        attachment: {},
        componentType: '',
        uploadingFile: false,
        uploaded: false,
        loading: false
      }, () => {
        this.updateChatData(data, payload)
      })
    } else {
      this.setState({loading: false})
      this.props.alertMsg.error('Failed to send message')
    }
  }

  onAttachmentUpload (res) {
    if (res.status === 'success') {
      let attachment = this.state.attachment
      attachment.id = res.payload.id
      attachment.url = res.payload.url
      this.setState({
        uploadingFile: false,
        attachment,
        uploaded: true
      })
    } else {
      this.setState({
        uploadingFile: false,
        attachment: {},
        componentType: ''
      })
      this.props.alertMsg.error('Failed to upload attachment')
    }
  }

  onFileChange (e) {
    // debugger
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 25000000) {
        this.props.alertMsg.error('Attachment exceeds the limit of 25MB')
      } else if (file.type === 'text/javascript' || file.type === 'text/exe') {
        this.props.alertMsg.error('Cannot add js or exe files. Please select another file')
      } else {
        const data = this.props.performAction('send attachments', this.props.activeSession)
        if (data.isAllowed) {
          if (this.state.attachment && this.state.attachment.id) {
            this.props.deletefile(this.state.attachment.id)
          }
          const componentType = this.getComponentType(file.type)
          this.setState({
            uploadingFile: true,
            attachment: file,
            componentType
          })
          var fileData = new FormData()
          fileData.append('file', file)
          fileData.append('filename', file.name)
          fileData.append('filetype', file.type)
          fileData.append('filesize', file.size)
          fileData.append('componentType', componentType)
          this.props.uploadAttachment(fileData, this.onAttachmentUpload)
        } else {
          this.props.alertMsg.error(data.errorMsg)
        }
      }
    }
  }

  setDataPayload(component) {
    let payload = {}
    switch (component) {
      case 'text':
        payload = {
          componentType: 'text',
          text: this.state.text
        }
        break
      case 'attachment':
        payload = {
          componentType: this.state.componentType,
          fileName: this.state.attachment.name,
          size: this.state.attachment.size,
          type: this.state.attachment.type,
          fileurl: {
            id: this.state.attachment.id,
            name: this.state.attachment.name,
            url: this.state.attachment.url
          }
        }
        break
      case 'gif':
        payload = {
          componentType: this.state.componentType,
          fileurl: this.state.gif
        }
        break
      case 'sticker':
        payload = {
          componentType: this.state.componentType,
          fileurl: this.state.sticker
        }
        break
      case 'thumbsUp':
        payload = {
          componentType: 'thumbsUp',
          fileurl: 'https://cdn.cloudkibo.com/public/img/thumbsup.png'
        }
        break
      default:
    }
    return payload
  }

  onEnter (e) {
    if (e.which === 13) {
      e.preventDefault()
      this.sendMessage()
    }
  }

  sendMessage() {
    const data = this.props.performAction('send messages', this.props.activeSession)
    if (data.isAllowed) {
      let payload = {}
      let data = {}
      if (this.state.text !== '' && /\S/gm.test(this.state.text)) {
        payload = this.setDataPayload('text')
        data = this.props.setMessageData(this.props.activeSession, payload)
        let dataWithAgentName = JSON.parse(JSON.stringify(data))
        dataWithAgentName.payload.text = (this.props.showAgentName ? `${this.props.user.name} sent:\r\n` : '') + data.payload.text
        console.log('dataWithAgentName', dataWithAgentName)
        this.props.sendChatMessage(dataWithAgentName)
        this.setState({ text: '', urlmeta: {}, currentUrl: '' })
        this.props.updateChatAreaHeight('57vh')
        data.format = 'convos'
        this.updateChatData(data, payload)
      }
    } else {
      this.props.alertMsg.error(data.errorMsg)
    }
  }

  sendThumbsUp () {
    const data = this.props.performAction('send messages', this.props.activeSession)
    if (data.isAllowed) {
      let payload = this.setDataPayload('thumbsUp')
      let data = this.props.setMessageData(this.props.activeSession, payload)
      if (this.props.showAgentName) {
        this.sendAgentName()
      }
      this.props.sendChatMessage(data)
      data.format = 'convos'
      this.updateChatData(data, payload)
    } else {
      this.props.alertMsg.error(data.errorMsg)
    }
  }

  sendAttachment () {
    const data = this.props.performAction('send messages', this.props.activeSession)
    if (data.isAllowed) {
      this.setState({loading: true})
      let payload = this.setDataPayload('attachment')
      let data = this.props.setMessageData(this.props.activeSession, payload)
      if (this.props.showAgentName) {
        this.sendAgentName()
      }
      this.props.sendAttachment(data, (res) => this.handleMessageResponse(res, data, payload))
    } else {
      this.props.alertMsg.error(data.errorMsg)
    }
  }

  openPicker (type) {
    const popoverOptions = {
      placement: 'top',
      target: `_${type}_picker`
    }
    const otherOptions = {
      setEmoji: (emoji) => this.setEmoji(emoji),
      sendSticker: (sticker) => this.sendSticker(sticker),
      sendGif: (gif) => this.sendGif(gif)
    }
    this.props.getPicker(type, popoverOptions, otherOptions)
  }

  componentWillUnmount () {
    if (this.state.attachment && this.state.attachment.id) {
      this.props.deletefile(this.state.attachment.id)
    }
  }

  render() {
    return (
      <div
        className='m-messenger'
        style={{
          position: 'absolute',
          bottom: 0,
          borderTop: '1px solid #ebedf2',
          width: '100%',
          padding: '15px'
        }}
      >
        <MODAL
          id='_record_audio'
          title='Record Audio'
          content={this.getRecordAudioContent()}
          onClose={() => {this.toggleAudioRecording(false)}}
        />
        <div className='m-messenger__form'>
          <div className='m-messenger__form-controls'>
            {
              this.state.uploadingFile
              ? <div className='align-center'>
                <center>
                  <div className="m-loader" style={{width: "30px", display: "inline-block"}} />
                  <span>Uploading...</span>
                </center>
              </div>
              : this.state.uploaded
              ? <div className='m-input-icon m-input-icon--right'>
                <input
                  style={{cursor: 'not-allowed'}}
                  type='text'
                  value={`Attachment: ${this.state.attachment.name.length > 20 ? this.state.attachment.name.substring(0, 20) + '...' : this.state.attachment.name}`}
                  className='m-messenger__form-input'
                  disabled
                />
                <span onClick={this.removeAttachment} style={{cursor: 'pointer'}} className='m-input-icon__icon m-input-icon__icon--right'>
                  <span>
                    <i className='la la-trash' />
                  </span>
                </span>
              </div>
              :
              <div className='m-input-icon m-input-icon--right'>
                <input
                  autoFocus
                  type='text'
                  placeholder='Type here...'
                  onChange={this.onInputChange}
                  value={this.state.text}
                  onKeyPress={this.onEnter}
                  className='m-messenger__form-input'
                />
                <span onClick={() => this.openPicker('emoji')} style={{cursor: 'pointer'}} className='m-input-icon__icon m-input-icon__icon--right'>
                  <span>
                      {
                        this.props.showEmoji &&
                        <i
                          style={{
                            cursor: this.state.uploaded ? 'not-allowed' : 'pointer',
                            fontSize: '20px',
                            margin: '0px 5px',
                            pointerEvents: this.state.uploaded && 'none',
                            opacity: this.state.uploaded && '0.5'
                          }}
                          data-tip='Emoticons'
                          className='fa fa-smile-o'
                          id='_emoji_picker'
                        />
                      }
                  </span>
                </span>
              </div>
            }
          </div>
          <div className='m-messenger__form-tools'>
            <a href={this.state.downLink} download='record-audio.webm' style={{border: '1px solid #36a3f7'}} className='m-messenger__form-attachment' disabled={this.state.uploadingFile}>
              {
                this.state.loading
                ? <div className="m-loader" style={{width: "30px"}} />
                : this.state.uploaded
                ? <i style={{color: '#36a3f7'}} onClick={this.sendAttachment} className='flaticon-paper-plane' />
                :
                (
                  this.props.showThumbsUp ?
                  <i style={{color: '#36a3f7'}} onClick={this.sendThumbsUp} className='la la-thumbs-o-up' />
                  :
                  <i style={{color: '#36a3f7'}} onClick={this.sendMessage} className='flaticon-paper-plane' />
                )
              }
            </a>
          </div>
        </div>
        {
          this.state.loadingUrlMeta
          ? <div style={{marginBottom: '10px'}} className='align-center'>
            <center>
              <div className="m-loader" style={{width: "30px", display: "inline-block"}} />
              <span>Fetching url meta...</span>
            </center>
          </div>
          : this.state.urlmeta.constructor === Object && Object.keys(this.state.urlmeta).length > 0 &&
          <div
            style={{
              borderRadius: '15px',
              backgroundColor: '#f0f0f0',
              minHeight: '20px',
              justifyContent: 'flex-end',
              position: 'relative',
              display: 'inline-block',
              padding: '5px',
              marginBottom: '10px'
            }}
          >
            <i style={{float: 'right', cursor: 'pointer'}} className='fa fa-times' onClick={this.removeUrlMeta} />
            <CARD
              title={this.state.urlmeta.ogTitle}
              description={this.state.urlmeta.ogDescription}
              image={this.state.urlmeta.ogImage && this.state.urlmeta.ogImage.url}
            />
          </div>
        }
        <div style={{color: '#575962'}}>
          {
            this.props.showUploadAttachment &&
            <div style={{display: 'inline'}}>
              <input
                ref='_upload_attachment'
                style={{display: 'none'}}
                type='file'
                accept={this.props.filesAccepted}
                onChange={this.onFileChange}
                onClick={(e) => {e.target.value = ''}}
              />
              <i
                style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
                data-tip='Upload Attachment'
                className='fa fa-paperclip'
                onClick={() => this.refs._upload_attachment.click()}
              />
            </div>
          }
          {
            this.props.showRecordAudio &&
            <i
              style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
              data-tip='Record Audio'
              className='fa fa-microphone'
              data-target='#_record_audio'
              data-backdrop="static"
              data-keyboard="false"
              data-toggle='modal'
              onClick={() => {this.toggleAudioRecording(true)}}
            />
          }
          {
            this.props.showSticker &&
            <i
              style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
              data-tip='Stickers'
              className='fa fa-sticky-note'
              id='_sticker_picker'
              onClick={() => this.openPicker('sticker')}
            />
          }
          {
            this.props.showGif &&
            <img
              style={{cursor: 'pointer', height: '20px', margin: '-5px 5px 0px 5px'}}
              data-tip='Gifs'
              alt='Gifs'
              src='https://cdn.cloudkibo.com/public/img/gif-icon.png'
              id='_gif_picker'
              onClick={() => this.openPicker('gif')}
            />
          }
        </div>
      </div>
    )
  }
}

Footer.propTypes = {
  'performAction': PropTypes.func.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'user': PropTypes.object.isRequired,
  'sendChatMessage': PropTypes.func.isRequired,
  'updateState': PropTypes.func.isRequired,
  'userChat': PropTypes.array.isRequired,
  'sessions': PropTypes.array.isRequired,
  'uploadAttachment': PropTypes.func,
  'sendAttachment': PropTypes.func,
  'uploadRecording': PropTypes.func,
  'getPicker': PropTypes.func.isRequired,
  'togglePopover': PropTypes.func.isRequired,
  'updateNewMessage': PropTypes.func.isRequired,
  'deletefile': PropTypes.func,
  'updateChatAreaHeight': PropTypes.func.isRequired,
  'showUploadAttachment': PropTypes.bool.isRequired,
  'showRecordAudio': PropTypes.bool.isRequired,
  'showSticker': PropTypes.bool.isRequired,
  'showEmoji': PropTypes.bool.isRequired,
  'showGif': PropTypes.bool.isRequired,
  'showThumbsUp': PropTypes.bool.isRequired,
  'filesAccepted': PropTypes.string
}

export default Footer
