import React from 'react'
import PropTypes from 'prop-types'

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
      uploaded: false
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onEnter = this.onEnter.bind(this)
    this.sendThumbsUp = this.sendThumbsUp.bind(this)
    this.onAttachmentUpload = this.onAttachmentUpload.bind(this)
    this.onRecordAudio = this.onRecordAudio.bind(this)
    this.openPicker = this.openPicker.bind(this)
    this.setDataPayload = this.setDataPayload.bind(this)
    this.setMessageData = this.setMessageData.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.getComponentType = this.getComponentType.bind(this)
    this.sendAttachment = this.sendAttachment.bind(this)
    this.handleMessageResponse = this.handleMessageResponse.bind(this)
  }

  onInputChange (e) {
    this.setState({text: e.target.value})
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
      this.props.activeSession.lastPayload = payload
      this.props.activeSession.lastRepliedBy = data.replied_by
      this.props.updateState({
        userChat: [...this.props.userChat, data],
        activeSession: this.props.activeSession
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
        }
        data.format = 'convos'
        this.props.activeSession.lastPayload = payload
        this.props.activeSession.lastRepliedBy = data.replied_by
        this.props.updateState({
          userChat: [...this.props.userChat, data],
          activeSession: this.props.activeSession
        })
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
    this.props.activeSession.lastPayload = payload
    this.props.activeSession.lastRepliedBy = data.replied_by
    this.props.updateState({
      userChat: [...this.props.userChat, data],
      activeSession: this.props.activeSession
    })
  }

  sendAttachment () {
    let payload = this.setDataPayload('attachment')
    let data = this.setMessageData(this.props.activeSession, payload)
    this.props.sendAttachment(data, (res) => this.handleMessageResponse(res, data, payload))
  }

  onRecordAudio () {}

  openPicker (type) {}

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
              : <input
                autoFocus
                type='text'
                placeholder='Type here...'
                onChange={this.onInputChange}
                value={this.state.uploaded ? `Attachment: ${this.state.attachment.name}` : this.state.text}
                onKeyPress={this.onEnter}
                className='m-messenger__form-input'
                disabled={this.state.uploaded}
              />
            }
          </div>
          <div className='m-messenger__form-tools'>
            <button style={{border: '1px solid #36a3f7'}} className='m-messenger__form-attachment'>
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
            onClick={this.onRecordAudio}
          />
          <i
            style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
            data-tip='Emoticons'
            className='fa fa-smile-o'
            onClick={() => this.openPicker('emoji')}
          />
          <i
            style={{cursor: 'pointer', fontSize: '20px', margin: '0px 5px'}}
            data-tip='Stickers'
            className='fa fa-sticky-note'
            onClick={() => this.openPicker('sticker')}
          />
          <img
            style={{cursor: 'pointer', height: '20px', margin: '-5px 5px 0px 5px'}}
            data-tip='Gifs'
            alt='Gifs'
            src='gif-icon.png'
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
  'uploadAttachment': PropTypes.func.isRequired,
  'sendAttachment': PropTypes.func.isRequired
}

export default Footer
