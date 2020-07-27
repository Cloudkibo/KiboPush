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
    this.initialZoomCountdown = 3
    this.initialZoomInvitationMessage = 'Please join Zoom meeting to discuss this in detail. [invite_url]'
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
      showAudioRecording: false,
      zoomTopic: '',
      zoomAgenda: '',
      zoomInvitationMessage: this.initialZoomInvitationMessage,
      zoomMeetingCreated: false,
      zoomCountdown: this.initialZoomCountdown,
      zoomMeetingUrl: '',
      zoomMeetingCreationError: false,
      cannedMessages: [],
      dataForSearch: [],
      showCannedMessages: this.props.showCannedMessage,
      selectedCannMessage : false,
      selectedIndex: 0,
      caption: ''
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
    this.getZoomIntegrationContent = this.getZoomIntegrationContent.bind(this)
    this.goToIntegrations = this.goToIntegrations.bind(this)
    this.setZoomTopic = this.setZoomTopic.bind(this)
    this.setZoomAgenda = this.setZoomAgenda.bind(this)
    this.setZoomInvitationMessage = this.setZoomInvitationMessage.bind(this)
    this.createZoomMeeting = this.createZoomMeeting.bind(this)
    this.checkZoomDisabled = this.checkZoomDisabled.bind(this)
    this.resetZoomValues = this.resetZoomValues.bind(this)
    this.appendInvitationUrl = this.appendInvitationUrl.bind(this)
    this.selectCannMessage = this.selectCannMessage.bind(this)
    this.toggleHover =this.toggleHover.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.responseMessageHandleChange = this.responseMessageHandleChange.bind(this)
    this.listDataDisplay = this.listDataDisplay.bind(this)
    this.onCaptionChange = this.onCaptionChange.bind(this)
  }
  componentDidMount () {

    window.onkeydown = (e) => {
      console.log(e.which)
      if (this.state.showCannedMessages) {
      let selectedIndex = this.state.selectedIndex
      if (e.which === 40 ) {
        if(selectedIndex < this.state.cannedMessages.length-1 )
        this.setState({selectedIndex: selectedIndex +1})
        document.getElementById("cardBody").scrollTop +=55

      } else if (e.which === 38) {
        if(selectedIndex !== 0) {
        this.setState({selectedIndex: selectedIndex - 1})
        document.getElementById("cardBody").scrollTop -=55
        }
      }
    }
  }
}
  responseMessageHandleChange (event) {
    let selectedCannMessage = this.state.selectedCannMessage
    selectedCannMessage.responseMessage = event.target.value
    this.setState({ selectedCannMessage: selectedCannMessage })
  }


  toggleHover (id) {
    // console.log('Hovver called', id)
    // document.getElementById(id).style.backgroundColor = 'lightgrey'
    this.setState({selectedIndex: id})

  }

  onMouseLeave (id) {
    // document.getElementById(id).style.backgroundColor = 'white'
  }

  selectCannMessage (CannMessage) {
    let cannResponse = {...CannMessage}
    let activeSession = this.props.activeSession
    if (cannResponse.responseMessage.includes('{{user_full_name}}')) {
      if(!activeSession.name) {
        cannResponse.responseMessage = cannResponse.responseMessage.replace(
          /{{user_full_name}}/g, activeSession.firstName + ' ' + activeSession.lastName)
      } else {
        cannResponse.responseMessage = cannResponse.responseMessage.replace(
          /{{user_full_name}}/g, activeSession.name)
      }
    }
    if (cannResponse.responseMessage.includes('{{user_first_name}}')) {
      if(!activeSession.name) {
      cannResponse.responseMessage = cannResponse.responseMessage.replace(
        /{{user_first_name}}/g, activeSession.firstName)
      } else {
        let subscriberName = activeSession.name.split(' ')
        cannResponse.responseMessage = cannResponse.responseMessage.replace(
          /{{user_first_name}}/g, subscriberName[0])
      }
    }
    if (cannResponse.responseMessage.includes('{{user_last_name}}')) {
      if (!activeSession.name) {
         cannResponse.responseMessage = cannResponse.responseMessage.replace(
        /{{user_last_name}}/g, activeSession.lastName)
    } else {
      let subscriberName = activeSession.name.split(' ')
      if (subscriberName.length >= 2) {
       cannResponse.responseMessage = cannResponse.responseMessage.replace(
        /{{user_last_name}}/g, subscriberName[subscriberName.length-1])
    } else {
      cannResponse.responseMessage = cannResponse.responseMessage.replace(
        /{{user_last_name}}/g, '')
    }
  }
  }
    this.setState({selectedCannMessage: cannResponse, text:`/${cannResponse.responseCode}`})
  }

  onCaptionChange (e) {
    this.setState({caption: e.target.value})
  }

  resetZoomValues () {
    clearInterval(this.zoomCountdownTimer)
    this.setState({
      zoomTopic: '',
      zoomAgenda: '',
      zoomInvitationMessage: this.initialZoomInvitationMessage,
      zoomMeetingCreated: false,
      zoomCountdown: this.initialZoomCountdown,
      zoomMeetingUrl: '',
      zoomMeetingCreationError: false,
      text: this.state.text === this.state.zoomInvitationMessage ? '' : this.state.text,
      zoomMeetingLoading: false,
      showAppendInvitationUrl: false
    })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {

    if (nextProps.cannedResponses) {
      this.setState({ cannedMessages: nextProps.cannedResponses, dataForSearch: nextProps.cannedResponses })
    }
    if(this.props.activeSession._id !== nextProps.activeSession._id) {
      this.setState({showCannedMessages: false, text: ''})
    }
  }

  appendInvitationUrl () {
    if (!this.state.zoomInvitationMessage.includes('invite_url')) {
      this.setState({zoomInvitationMessage: this.state.zoomInvitationMessage + " [invite_url]"}, () => {
        document.getElementById('_zoom_invitation_message').setCustomValidity('')
      })
    }
  }

  createZoomMeeting (event) {
    event.preventDefault()
    this.setState({zoomMeetingLoading: true}, () => {
      this.props.createZoomMeeting({
          subscriberId: this.props.activeSession._id,
          topic: this.state.zoomTopic,
          agenda: this.state.zoomAgenda,
          invitationMessage: this.state.zoomInvitationMessage
      }, (res) => {
        if (res.status === 'success' && res.payload) {
          this.setState({
            zoomMeetingLoading: false,
            zoomMeetingCreated: true,
            zoomMeetingUrl: res.payload.joinUrl,
            text: this.state.zoomInvitationMessage.replace('[invite_url]', res.payload.joinUrl)
          }, () => {
            document.getElementById('_close_zoom_integration').style.display = 'none'
            this.sendMessage()
            this.zoomCountdownTimer= setInterval(() => {
              if (this.state.zoomCountdown <= 1) {
                if (this.state.zoomMeetingUrl) {
                  clearInterval(this.zoomCountdownTimer)
                  document.getElementById('_zoomMeetingLink').click()
                  //window.open(this.state.zoomMeetingUrl, '_blank')
                  document.getElementById('_close_zoom_integration').style.display = 'block'
                  document.getElementById('_close_zoom_integration').click()
                }
              } else {
                this.setState({zoomCountdown: this.state.zoomCountdown - 1})
              }
            }, 1000)
          })
        } else {
          console.log('error creating zoom meeting', res.description)
          this.setState({zoomMeetingCreationError: true, zoomMeetingLoading: false})
        }
      })
    })
  }

  goToIntegrations () {
    this.props.history.push({
      pathname: '/settings',
      state: {tab: 'integrations'}
    })
  }

  setEmoji (emoji) {
    if (this.state.uploaded) {
      this.setState({caption: this.state.caption + emoji.native})
    } else {
      this.setState({text: this.state.text + emoji.native})
    }
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
    if (text[0] === '/') {
      this.setState({ showCannedMessages: true , selectedIndex: 0})
      this.search(text)
    } else {
      this.setState({ showCannedMessages: false, selectedCannMessage: null, selectedIndex: 0})
    }
    if(this.state.selectedCannMessage) {
      if (/\s/.test(text)) {
        var regex = new RegExp("^/" + this.state.selectedCannMessage.responseCode, "g")
        if(!text.match(regex)) {
          this.setState({selectedCannMessage: null})
          this.search(text)
        }
     } else {
       if(text !== `/${this.state.selectedCannMessage.responseCode}`) {
       this.setState({selectedCannMessage: null})
       this.search(text)
      }
    }
   }
    let state = {text}
    const url = getmetaurl(text)
    if (url && url !== this.state.currentUrl) {
      state.loadingUrlMeta = true
      state.currentUrl = url
      this.props.fetchUrlMeta(url, this.handleUrlMeta)
    }
    this.setState(state)
  }

  search (value) {
    if (this.state.dataForSearch.length > 0) {
      let searchArray = []
      if (value[value.length-1] === ' ') {
        let text = value.trim().slice(1)
        this.state.dataForSearch.forEach(element => {
          if (element.responseCode.toLowerCase() === text.toLowerCase()) {
            this.setState({selectedCannMessage: element})
            searchArray.push(element)
        }
      })
      this.setState({ cannedMessages: searchArray })
    }
      else if (value !== '/') {
        let text = value.slice(1)
        this.state.dataForSearch.forEach(element => {
          if (element.responseCode.toLowerCase().includes(text.toLowerCase())) searchArray.push(element)
        })
        this.setState({ cannedMessages: searchArray })
      } else {
        let dataForSearch = this.state.dataForSearch
        this.setState({ cannedMessages: dataForSearch })
      }
    }
  }

  removeAttachment () {
    this.props.deletefile(this.state.attachment.id)
    this.setState({
      attachment: {},
      componentType: '',
      uploadingFile: false,
      uploaded: false,
      caption: ''
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

  setZoomTopic (e) {
    this.setState({zoomTopic: e.target.value})
  }

  setZoomAgenda (e) {
    this.setState({zoomAgenda: e.target.value})
  }

  setZoomInvitationMessage (e) {
    if (!e.target.value) {
      e.target.setCustomValidity("Please fill in this field.")
    } else if (!e.target.value.includes('[invite_url]')) {
      e.target.setCustomValidity("[invite_url] is required in the invitation message.")
    } else {
      e.target.setCustomValidity("")
    }
    this.setState({zoomInvitationMessage: e.target.value})
  }

  checkZoomDisabled () {
    return !this.state.zoomTopic || !this.state.zoomAgenda || !this.state.zoomInvitationMessage
  }

  getZoomIntegrationContent () {
    if (!this.props.zoomIntegrations && this.props.zoomIntegrations.length === 0) {
      return (
        <div>
          <div>
            <span>
              You have not integrated Zoom Meetings with KiboPush. Please integrate Zoom to continue.
            </span>
          </div>
          <div style={{marginTop: '25px', textAlign: 'center'}}>
            <div onClick={this.goToIntegrations} className='btn btn-primary'>
              Integrate
            </div>
          </div>
        </div>
      )
    } else if (!this.state.zoomMeetingCreated) {
      return (
        <form onSubmit={this.createZoomMeeting}>
          <div className="m-form m-form--fit m-form--label-align-right">
            <span>{`Please provide the following information to create a zoom meeting and send invitation to ${this.props.activeSession.firstName}.`}</span>
            <div style={{marginTop: '20px', paddingLeft: '0', paddingRight: '0'}} className="form-group m-form__group row">
              <label for="_zoom_topic" className="col-2 col-form-label">
                Topic:
              </label>
              <div className="col-10">
                <input required onChange={this.setZoomTopic} className="form-control m-input" type="text" value={this.state.zoomTopic} id="_zoom_topic" />
                {/* <div style={{color: 'red'}}>{'*Required'}</div> */}
              </div>
            </div>

            <div style={{paddingLeft: '0', paddingRight: '0'}} className="form-group m-form__group row">
              <label for="_zoom_agenda" className="col-2 col-form-label">
                Agenda:
              </label>
              <div className="col-10">
                <input required onChange={this.setZoomAgenda} className="form-control m-input" type="text" value={this.state.zoomAgenda} id="_zoom_agenda" />
                {/* <div style={{color: 'red'}}>{'*Required'}</div> */}
              </div>
            </div>

            <div style={{paddingLeft: '0', paddingRight: '0'}} className="form-group m-form__group">
              <label for="_zoom_invitation_message">
                Invitation Message:
              </label>
              <textarea required onChange={this.setZoomInvitationMessage} className="form-control m-input" value={this.state.zoomInvitationMessage} id="_zoom_invitation_message" rows="3"></textarea>
              {/* <div style={{color: 'red'}}>{'*Required'}</div> */}
            </div>

            <div className='m-messenger__form-tools pull-right messengerTools' style={{ backgroundColor: '#F1F0F0', marginTop: '-40px', marginRight: '10px' }}>
              <div id='_appendInvitationUrl' style={{ display: 'inline-block', float: 'left' }}>
                <i data-tip={this.state.zoomInvitationMessage.includes('invite_url') ? 'Invitation URL is already present' : 'Append invitation URL'} onClick={this.appendInvitationUrl} style={{
                  height: '24px',
                  width: '24px',
                  position: 'relative',
                  display: 'inline-block',
                  cursor: 'pointer'
                }}>
                  <i className='greetingMessage fa fa-link' style={{
                    fontSize: '20px',
                    left: '0px',
                    width: '100%',
                    height: '2em',
                    textAlign: 'center',
                    color: 'rgb(120, 120, 120)'
                  }} />
                </i>
              </div>
            </div>

             <div style={{
               fontSize: '12px',
               marginTop: '-10px',
               fontStyle: 'italic'
             }}>{'Note: [invite_url] will be replaced by the generated zoom meeting invitation link'}</div>

            <div style={{paddingBottom: '0', paddingRight: '0', paddingLeft: '0', float: 'right'}} className="m-form__actions">
              <button disabled={this.state.zoomMeetingLoading} style={{float: 'right', marginLeft: '30px'}} type='submit' className="btn btn-primary">
                {
                  this.state.zoomMeetingLoading ?
                  <div>
                    <div className="m-loader" style={{height: '10px', width: "30px", display: "inline-block"}}></div>
                    <span>Loading...</span>
                  </div>
                  : <span>Create and Invite</span>
                }
              </button>
              {
                this.state.zoomMeetingCreationError &&
                <span style={{color: 'red'}}>There was an error creating the meeting. Please try again.</span>
              }
            </div>
          </div>
        </form>
      )
    } else {
      return (
        <div>
          <span>{`Zoom meeting has been successfully created and invitation has been sent to ${this.props.activeSession.firstName}. Redirecting you to Zoom Meetings in:`}</span>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: '50px', marginBottom: '50px'}}>
            <div className="numberCircle">{this.state.zoomCountdown}</div>
          </div>
        </div>
      )
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
        loading: false,
        caption: ''
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
    if (this.state.caption !== '') {
      payload.caption = this.state.caption
    }
    return payload
  }

  onEnter (e) {
    if (e.which === 13) {
      e.preventDefault()
      console.log('this.state.selectedCannMessage', this.state.selectedCannMessage)
      if(this.state.selectedCannMessage) {
        let selectCannMessage = this.state.selectedCannMessage
        if(selectCannMessage.responseMessage === '') {
          this.props.alertMsg.error('Canned Message response cannot be empty')
        } else {
          let text = this.state.text
          if(text.includes(selectCannMessage.responseCode)) {
            text = text.replace(`/${selectCannMessage.responseCode}`, selectCannMessage.responseMessage)
          } else {
            text = selectCannMessage.responseMessage
          }
          this.setState({showCannedMessages: false, text: text, selectedCannMessage: null }, ()=> {
          this.sendMessage()
        })
        }
      }
      else if (!this.state.selectedCannMessage && this.state.showCannedMessages) {
        if(this.state.cannedMessages.length > 0) {
        this.selectCannMessage(this.state.cannedMessages[this.state.selectedIndex])
        } else {
          this.setState({showCannedMessages: false})
          this.sendMessage()
        }
      }
      else {
        if (!this.state.showCannedMessages)
            this.sendMessage()
      }
    }
  }

  sendMessage() {
    console.log('this.state.urlMeta', this.state.urlmeta)
    const data = this.props.performAction('send messages', this.props.activeSession)
    if (data.isAllowed) {
      let payload = {}
      let data = {}
      console.log('sending message', this.state.text)
      if (this.state.text !== '' && /\S/gm.test(this.state.text)) {
        console.log('updating chat data', data)
        payload = this.setDataPayload('text')
        data = this.props.setMessageData(this.props.activeSession, payload, this.state.urlmeta)
        this.props.sendChatMessage(data)
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
    if (type === 'caption_emoji') {
      type = 'emoji'
    }
    this.props.getPicker(type, popoverOptions, otherOptions)
  }

  componentWillUnmount () {
    if (this.state.attachment && this.state.attachment.id) {
      this.props.deletefile(this.state.attachment.id)
    }
  }

  listDataDisplay () {
    let data = this.state.cannedMessages.map((item, index) => {
      let responseMessage = item.responseMessage
      if (responseMessage.length > 37) {
        responseMessage = responseMessage.trim().substring(0, 37) + "……"
      }
      if(this.state.selectedIndex === index) {
      return <li className='m-nav__item' style={{backgroundColor:'rgba(0,0,0,.03)'}} key={index} id ={`m-nav${index}`} onMouseOver={()=> this.toggleHover(index)} onMouseLeave={()=> this.onMouseLeave(`m-nav${index}`)}>
          <p style={{ wordBreak: 'break-all', cursor: 'pointer', margin: 'auto'}} onClick={() => this.selectCannMessage(item)}>/{item.responseCode}</p>
          <p style={{ wordBreak: 'break-all', cursor: 'pointer', color: 'grey'}} onClick={() => this.selectCannMessage(item)}>{responseMessage}</p>
            </li>
      } else {
        return <li className='m-nav__item' style={{backgroundColor:'white'}} key={index} id ={`m-nav${index}`} onMouseOver={()=> this.toggleHover(index)} onMouseLeave={()=> this.onMouseLeave(`m-nav${index}`)}>
          <p style={{ wordBreak: 'break-all', cursor: 'pointer', margin: 'auto'}} onClick={() => this.selectCannMessage(item)}>/{item.responseCode}</p>
          <p style={{ wordBreak: 'break-all', cursor: 'pointer', color: 'grey'}} onClick={() => this.selectCannMessage(item)}>{responseMessage}</p>
        </li>
      }
    })
    return data
  }

  render () {
    return (
      <div
        className='m-messenger'
        style={{
          position: 'absolute',
          bottom: 0,
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
        <MODAL
          id='_zoom_integration'
          title={this.props.zoomIntegration ? 'Zoom Meeting' : 'Zoom Integration'}
          content={this.getZoomIntegrationContent()}
          onClose={this.resetZoomValues}
        />
        <a id='_zoomMeetingLink' style={{display: 'none'}} href={this.state.zoomMeetingUrl} target='_blank' rel="noopener noreferrer"> </a>
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
                  </div> :
                  <div> {this.state.showCannedMessages &&
                    <div className='m-dropdown__wrapper'>
                      <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                      <div className='m-dropdown__inner'>
                        <div className='m-dropdown__body'>
                          <div className='m-dropdown__content'>
                            <div className='card'>
                              <ul className='m-nav'>
                                <li key={100} className='m-nav__item'>
                                  <div className='card-header'>
                                    <h4 className='mb-0'>
                                      <div style={{cursor: 'auto'}}
                                        className='btn'
                                        data-toggle='collapse'
                                        aria-expanded='true'
                                      >
                                      {this.state.selectedCannMessage ? this.state.selectedCannMessage.responseCode : 'Canned responses'}
                                      </div>
                                    </h4>
                                  </div>
                                </li>
                              </ul>
                              <div className='card-body' id = 'cardBody' style={{ maxHeight: '230px', overflow: 'auto' }}>
                                {!this.state.selectedCannMessage ? this.state.cannedMessages.length > 0 ?
                                <ul className='m-nav' >
                                   {this.listDataDisplay()}
                                </ul>
                                  : <ul className='m-nav'>
                                    <li key={0} className='m-nav__item'>
                                      <p style={{ wordBreak: 'break-all' }}>No Data to Display</p>
                                    </li>
                                  </ul>
                                : <ul className='m-nav'>
                                <li key={0} className='m-nav__item'>
                                <textarea value={this.state.selectedCannMessage.responseMessage} onChange={this.responseMessageHandleChange}
                                className='form-control m-input m-input--solid'
                                id='description' rows='3'
                                style={{ height: '100px', resize: 'none' }} maxlength='1000' required />
                               </li>
                              </ul>
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
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
                  </div>
           }
          </div>
          <div className='m-messenger__form-tools' style={{verticalAlign: 'bottom'}}>
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
        {this.props.showCaption && this.state.uploaded && (this.state.componentType === 'image' || this.state.componentType === 'video') &&
        <div className='m-messenger__form'>
            <div className='m-input-icon m-input-icon--right'>
              <input
                autoFocus
                type='text'
                placeholder='Enter Caption...'
                onChange={this.onCaptionChange}
                value={this.state.caption}
                style={{outline: '0', borderWidth: '0 0 2px', borderColor: '#f4f5f8', color: '#575961', width: '300px', height: '30px'}}
              />
            <span onClick={() => this.openPicker('caption_emoji')} style={{cursor: 'pointer'}} className='m-input-icon__icon m-input-icon__icon--right'>
                <span>
                  <i
                    style={{
                      cursor: 'pointer',
                      fontSize: '20px',
                      margin: '0px 5px'
                    }}
                    data-tip='Emoticons'
                    className='fa fa-smile-o'
                    id='_caption_emoji_picker'
                  />
                </span>
              </span>
            </div>
          </div>
        }
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
          {
            this.props.showZoom &&
            <img
              style={{cursor: 'pointer', height: '30px', margin: '-5px 5px 0px 5px'}}
              alt='Zoom'
              src='https://cdn.cloudkibo.com/public/img/zoom.png'
              id='_zoom_integration'
              className='fa fa-video-camera'
              data-target='#_zoom_integration'
              data-backdrop="static"
              data-keyboard="false"
              data-toggle='modal'
            />
          }
        </div>
      </div>
    )
  }
}

Footer.propTypes = {
  'cannedResponses': PropTypes.array.isRequired,
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
  'filesAccepted': PropTypes.string,
  'showCaption': PropTypes.bool,
}


export default Footer
