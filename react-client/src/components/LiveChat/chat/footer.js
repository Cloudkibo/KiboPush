import React from 'react'
import PropTypes from 'prop-types'
import { ReactMic } from 'react-mic'

// components
import MODAL from '../../extras/modal'

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
      showAudioRecording: false,
      recording: false
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.sendThumbsUp = this.sendThumbsUp.bind(this)
    this.onAttachmentUpload = this.onAttachmentUpload.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this.setDataPayload = this.setDataPayload.bind(this)
    this.setMessageData = this.setMessageData.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.getComponentType = this.getComponentType.bind(this)
    this.sendAttachment = this.sendAttachment.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.handleMessageResponse = this.handleMessageResponse.bind(this)
    this.getRecordAudioContent = this.getRecordAudioContent.bind(this)
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.onStopRecording = this.onStopRecording.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.sendSticker = this.sendSticker.bind(this)
    this.sendGif = this.sendGif.bind(this)
    this.updateChatData = this.updateChatData.bind(this)
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
    this.props.updateNewMessage(true)
    this.props.updateState({
      reducer: true,
      userChat: [...this.props.userChat, data],
      sessions: [session, ...sessions]
    })
  }

  sendSticker (sticker) {
    this.props.togglePopover()
    const payload = {
      componentType: 'sticker',
      fileurl: sticker.image.hdpi
    }
    const data = this.setMessageData(this.props.activeSession, payload)
    this.props.sendChatMessage(data)
    data.format = 'convos'
    this.updateChatData(data, payload)
  }

  sendGif (gif) {
    this.props.togglePopover()
    const payload = {
      componentType: 'gif',
      fileurl: gif.images.downsized.url
    }
    const data = this.setMessageData(this.props.activeSession, payload)
    this.props.sendChatMessage(data)
    data.format = 'convos'
    this.updateChatData(data, payload)
  }

  onInputChange (e) {
    this.setState({text: e.target.value})
  }

  removeAttachment () {
    console.log('removeAttachment called')
    this.setState({
      attachment: {},
      componentType: '',
      uploadingFile: false,
      uploaded: false
    })
  }

  startRecording () {
    this.setState({recording: true, showAudioRecording: true})
  }

  stopRecording () {
    this.setState({recording: false, showAudioRecording: false})
  }

  onStopRecording (recordedBlob) {
    var file = new File([recordedBlob.blob], 'audio.mp3', { type: 'audio/mp3', lastModified: recordedBlob.stopTime})
    if (file) {
      this.setState({
        uploadingFile: true,
        attachment: file,
        componentType: 'audio'
      })
      var fileData = new FormData()
      fileData.append('file', file)
      fileData.append('filename', file.name)
      fileData.append('filetype', file.type)
      fileData.append('filesize', file.size)
      fileData.append('componentType', 'audio')
      this.props.uploadRecording(fileData, this.onAttachmentUpload)
    }
  }

  getRecordAudioContent () {
    return (
      <div>
        <ReactMic style={{ width: '450px' }}
          width='450'
          record={this.state.showAudioRecording}
          className='sound-wave'
          onStop={this.onStopRecording}
          strokeColor='#000000'
          mimeType="audio/wav"
        />
        <br />
        {
          !this.state.recording
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
          : <div data-dismiss='modal' role='dialog' aria-label='Voice clip' style={{ fontSize: '14px', height: '178px', overflow: 'hidden', width: '220px' }}>
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
    )
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
      this.updateChatData(data, payload)
      this.setState({
        attachment: {},
        componentType: '',
        uploadingFile: false,
        uploaded: false
      })
    } else {
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
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 25000000) {
        this.props.alertMsg.error('Attachment exceeds the limit of 25MB')
      } if (file.type === 'text/javascript' || file.type === 'text/exe') {
        this.props.alertMsg.error('Cannot add js or exe files. Please select another file')
      } else {
        const data = this.props.performAction('send attachments', this.props.activeSession)
        if (data.isAllowed) {
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

  setMessageData(session, payload) {
    const data = {
      sender_id: session.pageId._id,
      recipient_id: session._id,
      sender_fb_id: session.pageId.pageId,
      recipient_fb_id: session.senderId,
      subscriber_id: session._id,
      company_id: session.companyId,
      payload: payload,
      url_meta: this.state.urlmeta,
      datetime: new Date().toString(),
      status: 'unseen',
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
      e.preventDefault()
      const data = this.props.performAction('send messages', this.props.activeSession)
      if (data.isAllowed) {
        let payload = {}
        let data = {}
        if (this.state.text !== '' && /\S/gm.test(this.state.text)) {
          payload = this.setDataPayload('text')
          data = this.setMessageData(this.props.activeSession, payload)
          this.props.sendChatMessage(data)
          this.setState({ text: '' })
          data.format = 'convos'
          this.updateChatData(data, payload)
        }
      } else {
        this.props.alertMsg.error(data.errorMsg)
      }
    }
  }

  sendThumbsUp () {
    let payload = this.setDataPayload('thumbsUp')
    let data = this.setMessageData(this.props.activeSession, payload)
    this.props.sendChatMessage(data)
    data.format = 'convos'
    this.updateChatData(data, payload)
  }

  sendAttachment () {
    let payload = this.setDataPayload('attachment')
    let data = this.setMessageData(this.props.activeSession, payload)
    this.props.sendAttachment(data, (res) => this.handleMessageResponse(res, data, payload))
  }

  openPicker (type) {
    const popoverOptions = {
      placement: 'left',
      target: `_${type}_picker`
    }
    const otherOptions = {
      setEmoji: (emoji) => this.setEmoji(emoji),
      sendSticker: (sticker) => this.sendSticker(sticker),
      sendGif: (gif) => this.sendGif(gif)
    }
    this.props.getPicker(type, popoverOptions, otherOptions)
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
              : <input
                autoFocus
                type='text'
                placeholder='Type here...'
                onChange={this.onInputChange}
                value={this.state.text}
                onKeyPress={this.onEnter}
                className='m-messenger__form-input'
              />
            }
          </div>
          <div className='m-messenger__form-tools'>
            <button style={{border: '1px solid #36a3f7'}} className='m-messenger__form-attachment' disabled={this.state.uploadingFile}>
              {
                this.state.uploaded
                ? <i style={{color: '#36a3f7'}} onClick={this.sendAttachment} className='flaticon-paper-plane' />
                : <i style={{color: '#36a3f7'}} onClick={this.sendThumbsUp} className='la la-thumbs-o-up' />
              }
            </button>
          </div>
        </div>
        <div style={{color: '#575962'}}>
          <input
            ref='_upload_attachment'
            style={{display: 'none'}}
            type='file'
            accept='image/*, audio/*, video/*, application/*, text/*'
            onChange={this.onFileChange}
            onClick={(e) => {e.target.value = ''}}
          />
          <i
            style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
            data-tip='Upload Attachment'
            className='fa fa-paperclip'
            onClick={() => this.refs._upload_attachment.click()}
          />
          <i
            style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
            data-tip='Record Audio'
            className='fa fa-microphone'
            data-target='#_record_audio'
            data-toggle='modal'
          />
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
            onClick={() => this.openPicker('emoji')}
          />
          <i
            style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
            data-tip='Stickers'
            className='fa fa-sticky-note'
            id='_sticker_picker'
            onClick={() => this.openPicker('sticker')}
          />
          <img
            style={{cursor: 'pointer', height: '20px', margin: '-5px 5px 0px 5px'}}
            data-tip='Gifs'
            alt='Gifs'
            src='https://cdn.cloudkibo.com/public/img/gif-icon.png'
            id='_gif_picker'
            onClick={() => this.openPicker('gif')}
          />
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
  'uploadAttachment': PropTypes.func.isRequired,
  'sendAttachment': PropTypes.func.isRequired,
  'uploadRecording': PropTypes.func.isRequired,
  'getPicker': PropTypes.func.isRequired,
  'togglePopover': PropTypes.func.isRequired,
  'updateNewMessage': PropTypes.func.isRequired
}

export default Footer
