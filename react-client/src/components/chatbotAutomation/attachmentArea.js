import React from 'react'
import PropTypes from 'prop-types'
import { isWebURL } from '../../utility/utils'

class AttachmentArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      inputValue: '',
      helpMessage: '',
      invalidUrl: false,
      typingInterval: 1000,
      attachment: {},
      attachmentType: '',
      isUploaded: false,
      waitingForUrlData: false,
      waitingForAttachment: false
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.getComponentType = this.getComponentType.bind(this)
    this.getInputValue = this.getInputValue.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.afterAttachmentUpload = this.afterAttachmentUpload.bind(this)
    this.onUrlResponse = this.onUrlResponse.bind(this)
  }

  componentDidMount () {
    let typingTimer
    let doneTypingInterval = this.state.typingInterval
    let input = document.getElementById(`_attachment_in_chatbot`)
    input.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(() => {
        if (isWebURL(this.state.inputValue)) {
          this.props.handleAttachment({
            pageId: this.props.chatbot.pageId,
            url: this.state.inputValue
          }, this.onUrlResponse)
          this.setState({
            waitingForUrlData: true,
            invalidUrl: false,
            helpMessage: 'Validating url...'
          })
        } else {
          this.setState({
            helpMessage: 'Please provide a valid url',
            invalidUrl: true
          })
        }
      }, doneTypingInterval)
    })
    input.addEventListener('keydown', () => {clearTimeout(typingTimer)})
  }

  onUrlResponse (res) {
    if (res.status === 'success') {
      this.setState({
        waitingForUrlData: false,
        invalidUrl: false,
        helpMessage: 'Url is valid'
      })
    } else {
      this.setState({
        waitingForUrlData: false,
        invalidUrl: true,
        helpMessage: res.description
      })
    }
  }

  onInputChange (e) {
    this.setState({inputValue: e.target.value})
  }

  getInputValue () {
    if (this.state.isUploaded) {
      return `Attachment: ${this.state.attachment.name}`
    } else {
      return this.state.inputValue
    }
  }

  removeAttachment () {
    this.setState({
      inputValue: '',
      helpMessage: '',
      invalidUrl: false,
      attachment: {},
      attachmentType: '',
      isUploaded: false,
      waitingForUrlData: false
    })
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

  afterAttachmentUpload (res) {
    console.log('afterAttachmentUpload', res)
    if (res.status === 'success') {
      this.setState({
        isUploaded: true,
        waitingForAttachment: false
      })
    } else {
      this.props.alertMsg.error('Failed to upload attachment. Please try again later')
      this.setState({waitingForAttachment: false})
    }
  }

  onFileChange (e) {
    if (e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 25000000) {
        this.props.alertMsg.error('Attachment exceeds the limit of 25MB')
      } else if (file.type === 'text/javascript' || file.type === 'text/exe') {
        this.props.alertMsg.error('Cannot add js or exe files. Please select another file')
      } else {
        const type = this.getComponentType(file.type)
        this.setState({
          isUploaded: false,
          inputValue: 'Uploading...',
          attachment: file,
          attachmentType: type,
          waitingForAttachment: true,
          helpMessage: '',
          invalidUrl: false
        })
        const fileData = new FormData()
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('pages', JSON.stringify([this.props.chatbot.pageId]))
        fileData.append('componentType', type)
        this.props.uploadAttachment(fileData, this.afterAttachmentUpload)
      }
    }
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-12'>
          <div className="form-group m-form__group">
            <span className='m--font-boldest'>Attachment:</span>
            <input
              ref='_upload_attachment_in_chatbot'
              style={{display: 'none'}}
              type='file'
              accept='image/*, audio/*, video/*, application/*, text/*'
              onChange={this.onFileChange}
              onClick={(e) => {e.target.value = ''}}
            />
            <div className="input-group">
              <input
                style={{cursor: this.state.isUploaded && 'not-allowed'}}
                type="text"
                id='_attachment_in_chatbot'
                className="form-control m-input"
                placeholder="Paste url or upload file"
                value={this.getInputValue()}
                onChange={this.onInputChange}
                disabled={this.state.isUploaded || this.state.waitingForAttachment}
              />
              {
                this.state.isUploaded &&
                <span onClick={this.removeAttachment} style={{border: 'none', cursor: 'pointer', backgroundColor: '#eee', boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, .075)'}} className='input-group-addon'>
                  <span>
                    <i className='la la-times-circle' />
                  </span>
                </span>
              }
              <span style={{border: '1px solid #ccc', cursor: 'pointer'}} onClick={() => this.refs._upload_attachment_in_chatbot.click()} className="input-group-addon m--font-boldest">
                {
                  this.state.waitingForAttachment
                  ? <div className="m-loader" style={{width: "30px"}} />
                  : <span>
                    <i style={{color: '#575962'}} className='fa fa-cloud-upload' /> Upload
                  </span>
                }
              </span>
            </div>
            <span className={`m-form__help m--font-${this.state.invalidUrl ? 'danger' : this.state.waitingForUrlData ? 'info' : 'success'}`}>
              {this.state.inputValue && this.state.helpMessage}
            </span>
          </div>
        </div>
      </div>
    )
  }
}

AttachmentArea.propTypes = {
  'data': PropTypes.object.isRequired,
  'chatbot': PropTypes.object.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'handleAttachment': PropTypes.func.isRequired
}

export default AttachmentArea
