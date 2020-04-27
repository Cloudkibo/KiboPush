import React from 'react'
import PropTypes from 'prop-types'
import { isWebURL, validateYoutubeURL } from '../../utility/utils'
import { Popover, PopoverBody} from 'reactstrap'
import BUTTONACTION from './buttonAction'
import CONFIRMATIONMODAL from '../extras/confirmationModal'

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
      waitingForAttachment: false,
      buttons: [],
      currentButton: {},
      showPopover: false,
      popoverTarget: '_action_in_chatbot'
    }
    this.onInputChange = this.onInputChange.bind(this)
    this.onFileChange = this.onFileChange.bind(this)
    this.getComponentType = this.getComponentType.bind(this)
    this.getInputValue = this.getInputValue.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.afterAttachmentUpload = this.afterAttachmentUpload.bind(this)
    this.onUrlResponse = this.onUrlResponse.bind(this)
    this.showPopover = this.showPopover.bind(this)
    this.togglePopover = this.togglePopover.bind(this)
    this.onSaveAction = this.onSaveAction.bind(this)
    this.onRemoveAction = this.onRemoveAction.bind(this)
    this.handleFilChange = this.handleFilChange.bind(this)
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
          }, () => {
            this.props.updateParentState({disableNext: true})
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

  showPopover () {
    this.setState({
      showPopover: true,
      popoverTarget: '_attach_button_in_chatbot',
      currentButton: this.state.buttons[0] || {title: '', url: ''}
    })
  }

  togglePopover () {
    this.setState({showPopover: !this.state.showPopover})
  }

  onSaveAction (data) {
    data.type = 'web_url'
    this.setState({buttons: [data], showPopover: false})
    let attachment = this.props.attachment
    attachment.buttons = [data]
    this.props.updateParentState({attachment})
  }

  onRemoveAction () {
    this.setState({buttons: [], showPopover: false})
    let attachment = this.props.attachment
    attachment.buttons = []
    this.props.updateParentState({attachment})
  }

  onUrlResponse (res) {
    const data = res.payload
    if (res.status === 'success') {
      let helpMessage = 'Url is valid.'
      if (data.attachment_id) {
        helpMessage = `${helpMessage} This will be sent as a playable video on messenger.`
      } else if (validateYoutubeURL(this.state.inputValue)) {
        helpMessage = `${helpMessage} Video size is greater than 25MB and it will be sent as a card.`
      } else {
        helpMessage =`${helpMessage} This will be sent as a card.`
      }
      this.setState({
        waitingForUrlData: false,
        invalidUrl: false,
        helpMessage,
        attachmentType: data.attachment_id ? 'video' : 'card'
      })
      const attachment = {
        type: data.attachment_id ? 'video' : 'card',
        fileurl: data.attachment_id ? data : {},
        cardData: data.attachment_id ? {} : {
          title: data.ogTitle,
          description: data.ogDescription,
          image_url: data.ogImage && data.ogImage.url,
          url: this.state.inputValue
        },
        fileData: data.attachment_id ? {url: this.state.inputValue} : {},
        buttons: this.state.buttons
      }
      this.props.updateParentState({attachment, disableNext: false})
    } else {
      this.setState({
        waitingForUrlData: false,
        invalidUrl: true,
        helpMessage: res.description
      })
      this.props.updateParentState({disableNext: false})
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
      waitingForUrlData: false,
      buttons: []
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

  afterAttachmentUpload (res, type) {
    console.log('afterAttachmentUpload', res)
    if (res.status === 'success') {
      this.setState({
        isUploaded: true,
        waitingForAttachment: false,
        attachmentType: type
      })
      const attachment = {
        type,
        fileurl: res.payload,
        fileData: {
          name: this.state.attachment.name,
          type: this.state.attachment.type,
          size: this.state.attachment.size
        },
        buttons: this.state.buttons
      }
      this.props.updateParentState({attachment, disableNext: false})
    } else {
      this.props.alertMsg.error('Failed to upload attachment. Please try again later')
      this.setState({waitingForAttachment: false})
      this.props.updateParentState({disableNext: false})
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
          attachmentType: '',
          waitingForAttachment: true,
          helpMessage: '',
          invalidUrl: false
        }, () => {
          this.props.updateParentState({disableNext: true})
        })
        const fileData = new FormData()
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('pages', JSON.stringify([this.props.chatbot.pageId]))
        fileData.append('componentType', type)
        this.props.uploadAttachment(fileData, (res) => this.afterAttachmentUpload(res, type))
      }
    }
  }

  handleFilChange () {
    if (this.state.attachmentType) {
      this.refs._override_attachment.click()
    } else {
      this.refs._upload_attachment_in_chatbot.click()
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (!(this.state.waitingForUrlData || this.state.waitingForAttachment)) {
      if (nextProps.attachment && Object.keys(nextProps.attachment).length > 0) {
        this.setState({
          inputValue: nextProps.attachment.fileData ? (nextProps.attachment.fileData.url || '') : nextProps.attachment.cardData.url,
          attachment: nextProps.attachment.fileData || {},
          attachmentType: nextProps.attachment.type,
          buttons: nextProps.attachment.buttons,
          isUploaded: nextProps.attachment.fileData && !nextProps.attachment.fileData.url ? true : false
        })
      } else {
        this.setState({
          inputValue: '',
          attachment: {},
          attachmentType: '',
          isUploaded: false,
          buttons: [],
          currentButton: {}
        })
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
              accept='image/*, video/*'
              onChange={this.onFileChange}
              onClick={(e) => {e.target.value = ''}}
            />
            <div className="input-group">
              <input
                style={{cursor: this.state.isUploaded && 'not-allowed'}}
                type="text"
                id='_attachment_in_chatbot'
                className="form-control m-input"
                placeholder="Paste url or upload an image or video"
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
              <span style={{border: '1px solid #ccc', cursor: 'pointer'}} onClick={this.handleFilChange} className="input-group-addon m--font-boldest">
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
          {
            this.state.buttons.length > 0 &&
            <button
              id='_attach_button_in_chatbot'
              type="button"
              style={{border: '1px solid #36a3f7'}}
              className="btn btn-outline-info btn-sm"
              onClick={this.showPopover}
            >
							{this.state.buttons[0].title}
						</button>
          }
          {
            this.state.attachmentType &&
            ['file', 'audio'].indexOf(this.state.attachmentType) === -1 &&
            this.state.buttons.length === 0 &&
            <button
              id='_attach_button_in_chatbot'
              style={{border: 'none', cursor: 'pointer'}}
              className='m-link m-link--state m-link--info'
              onClick={this.showPopover}
            >
							+ Attach button
						</button>
          }
          <div id='_action_in_chatbot'>
            <Popover
              placement='right'
              isOpen={this.state.showPopover}
              className='chatPopover _popover_max_width_400'
              target={this.state.popoverTarget}
              toggle={this.togglePopover}
            >
              <PopoverBody>
                {
                  this.state.showPopover &&
                  <BUTTONACTION
                    title={this.state.currentButton.title}
                    url={this.state.currentButton.url}
                    onCancel={this.togglePopover}
                    onSave={this.onSaveAction}
                    onRemove={this.onRemoveAction}
                    showRemove={this.state.buttons.length > 0}
                    alertMsg={this.props.alertMsg}
                  />
                }
              </PopoverBody>
            </Popover>
          </div>
          <button style={{display: 'none'}} ref='_override_attachment' data-toggle='modal' data-target='#_override_attachment_chatbot' />
          <CONFIRMATIONMODAL
            id='_override_attachment_chatbot'
            title='Override Attachment'
            description='This will override the existing attachment. Are you sure you want to continue?'
            onConfirm={() => this.refs._upload_attachment_in_chatbot.click()}
          />
        </div>
      </div>
    )
  }
}

AttachmentArea.propTypes = {
  'chatbot': PropTypes.object.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'handleAttachment': PropTypes.func.isRequired,
  'attachment': PropTypes.object.isRequired,
  'updateParentState': PropTypes.func.isRequired
}

export default AttachmentArea
