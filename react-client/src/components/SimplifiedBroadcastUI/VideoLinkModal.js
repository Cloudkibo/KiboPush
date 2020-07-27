/* eslint-disable no-undef */
import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RingLoader } from 'halogenium'
import AddButton from './AddButton'
import { downloadYouTubeVideo, uploadTemplate, urlMetaData } from '../../redux/actions/convos.actions'
import { getVideoId, deleteFile } from '../../utility/utils'
import YouTube from 'react-youtube'
import FacebookPlayer from 'react-player/lib/players/Facebook'

class VideoLinkModal extends React.Component {
  constructor(props) {
    super(props)
    console.log('VideoLinkModal props in constructor', props)
    let youtubeButtons = []
    let facebookButtons = []
    if (props.videoType) {
      if (props.videoType === 'youtube') {
        youtubeButtons = props.buttons.map(button => { return { visible: true, title: button.title } })
      } else if (props.videoType === 'facebook') {
        facebookButtons = props.buttons.map(button => { return { visible: true, title: button.title } })
      }
    } else {
      youtubeButtons = props.buttons.map(button => { return { visible: true, title: button.title } })
    }
    let facebookDisabled = true
    let youtubeDisabled = true
    if (props.videoType) {
      if (props.videoType === 'youtube') {
        youtubeDisabled = props.edit ? false : true
      } else if (props.videoType === 'facebook') {
        facebookDisabled = props.edit ? false : true
      }
    } else {
      youtubeDisabled = props.edit ? false : true
    }

    this.state = {
      facebookDisabled,
      youtubeDisabled,
      buttonLimit: 3,
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'],
      file: this.props.file ? this.props.file : '',
      facebookLink: this.props.facebookUrl ? this.props.facebookUrl : '',
      youtubeLink: this.props.youtubeLink ? this.props.youtubeLink : '',
      facebookButtons,
      youtubeButtons,
      videoLink: this.props.videoLink ? this.props.videoLink : '',
      videoTitle: this.props.videoTitle ? this.props.videoTitle : '',
      videoDescription: this.props.videoDescription ? this.props.videoDescription : '',
      youtubeLoading: false,
      facebookLoading: false,
      videoId: this.props.videoId ? this.props.videoId : null,
      card: this.props.card,
      fileSizeExceeded: this.props.fileSizeExceeded,
      initialFile: this.props.file ? this.props.file.fileurl.id : null,
      videoType: this.props.videoType ? this.props.videoType : 'youtube',
      facebookUrl: this.props.facebookUrl,
      processingError: ''
    }
    console.log('VideoLinkModal state', this.state)
    console.log('VideoLinkModal module', this.props.module)
    this.updateFile = this.updateFile.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
    this.validateYoutubeUrl = this.validateYoutubeUrl.bind(this)
    this.handleLinkChange = this.handleLinkChange.bind(this)
    this.uploadTemplate = this.uploadTemplate.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleUrlMetaData = this.handleUrlMetaData.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.facebookVideoReady = this.facebookVideoReady.bind(this)
    this.getInputBorderColor = this.getInputBorderColor.bind(this)
    this.checkDisabled = this.checkDisabled.bind(this)
    this.handleProcessingError = this.handleProcessingError.bind(this)
  }
  
  handleProcessingError (res) {
    if (res.status !== 'success') {
      this.setState({
        processingError: `Unable to process file. Please try again. ${res.description ? res.description: ''}`,
        fileSizeExceeded: false, 
        youtubeDisabled: true,
        youtubeLoading: false
      })
    }
  }

  handleLinkChange(e) {
    console.log('changing link', e.target.value)
    if (this.state.file) {
      let canBeDeleted = true
      for (let i = 0; i < this.props.initialFiles.length; i++) {
        if (this.state.file.fileurl.id === this.props.initialFiles[i]) {
          canBeDeleted = false
          break
        }
      }
      if (this.state.initialFile === this.state.file.fileurl.id) {
        canBeDeleted = false
      }
      if (canBeDeleted) {
        this.props.setTempFiles(null, [this.state.file.fileurl.id])
        deleteFile(this.state.file.fileurl.id)
      }
    }
    if (this.state.videoType === 'youtube') {
      this.setState({ 
        fileSizeExceeded: false, 
        youtubeButtons: [], 
        youtubeDisabled: true,
        youtubeLink: e.target.value, 
        videoId: null, 
        videoTitle: null, 
        videoDescription: null, 
        file: null, 
        card: null,
        processingError: ''
      }, () => {
        this.validateYoutubeUrl()
      })
    } else if (this.state.videoType === 'facebook') {
      this.setState({ 
        facebookButtons: [], 
        facebookDisabled: true,
        facebookLink: e.target.value,
        processingError: ''
      }, () => {
        this.validateFacebookUrl()
      })
    }
  }

  handleDone() {
    if (this.props.noButtons || (this.state.videoType === 'youtube' && this.state.card)) {
      this.addComponent([])
    } else {
      if (this.state.videoType === 'youtube') {
        this.YoutubeAddButton.handleDone()
      } else if (this.state.videoType === 'facebook') {
        this.FacebookAddButton.handleDone()
      }
    }
  }

  addComponent(buttons) {
    console.log('addComponent VideoLinkModal', this.state)
    if (this.props.module === 'whatsapp') {
      this.props.addComponent({
        id: this.props.id >= 0 ? this.props.id : null,
        componentType: 'text',
        videoTitle: this.state.videoTitle,
        videoDescription: this.state.videoDescription,
        videoId: this.state.videoId,
        text: this.state.youtubeLink,
        buttons
      }, this.props.edit)
    } else {
      if (this.state.videoType === 'facebook') {
        this.props.addComponent({
          id: this.props.id,
          componentName:  'Facebook video',
          videoType: this.state.videoType,
          facebookUrl: this.state.facebookUrl,
          componentType: 'media',
          mediaType: 'video',
          buttons
        }, this.props.edit)
      } else if (this.state.videoType === 'youtube') {
        if (this.state.fileSizeExceeded) {
          this.props.addComponent({
            id: this.props.id,
            fileSizeExceeded: this.state.fileSizeExceeded,
            componentName:  'YouTube video',
            videoType: this.state.videoType,
            youtubeLink: this.state.youtubeLink,
            componentType: 'card',
            image_url: this.state.card.image_url ? this.state.card.image_url : '',
            title: this.state.card.title,
            description: this.state.card.subtitle,
            buttons: this.state.card.buttons,
            default_action: this.state.card.default_action,
            card: this.state.card
          }, this.props.edit)
        } else {
          if (this.state.initialFile) {
            let canBeDeleted = true
            for (let i = 0; i < this.props.initialFiles.length; i++) {
              if (this.state.initialFile === this.props.initialFiles[i]) {
                canBeDeleted = false
                break
              }
            } 
            if (canBeDeleted) {
              if (this.state.file.fileurl.id !== this.state.initialFile) {
                deleteFile(this.state.initialFile)
              }
            }
          }
          this.props.addComponent({
            id: this.props.id,
            componentName:  'YouTube video',
            youtubeLink: this.state.youtubeLink,
            videoLink: this.state.videoLink,
            componentType: 'media',
            fileurl: this.state.file.fileurl,
            fileName: this.state.file.fileName,
            image_url: '',
            size: this.state.file.size,
            type: this.state.file.type,
            mediaType: 'video',
            buttons
          }, this.props.edit)
        }
      }
    }
  }

  updateButtonStatus(status) {
    console.log('updateButtonStatus MediaModal', status)
    if (this.state.videoType === 'youtube') {
      status.youtubeButtonDisabled = status.buttonDisabled
      if (status.buttons) {
        status.youtubeButtons = status.buttons 
      }
    } else if (this.state.videoType === 'facebook') {
      status.facebookButtonDisabled = status.buttonDisabled
      if (status.buttons) {
        status.facebookButtons = status.buttons 
      }
    }
    this.setState(status)
  }

  updateFile(file) {
    if (file === 'ERR_LIMIT_REACHED') {
      this.setState({ fileSizeExceeded: true, youtubeDisabled: true, youtubeLoading: false })
      this.props.urlMetaData(this.state.youtubeLink, (data) => this.handleUrlMetaData(data), this.handleProcessingError)
      return
    }
    this.props.setTempFiles([file.fileurl.id])
    console.log('updating YouTube file', file)
    if (this.props.pages) {
      this.uploadTemplate(file)
    } else { 
      this.setState({
        youtubeLoading: false,
        file: file,
        videoLink: file.fileurl.url
      }, () => {
        this.refs.video.pause();
        this.refs.video.load();
        this.refs.video.play();
      })
    }
    // this.setState({file, videoLink: file.fileurl.url}, () => {
    //   this.refs.video.pause();
    //   this.refs.video.load();
    //   this.refs.video.play();
    // })
  }

  uploadTemplate(data) {
    console.log('updating file AddMedia', data)
    //this.props.updateFile(data)
    var video = data.type.match('video.*')
    if (video) {
      console.log('video uploading template')
      this.props.uploadTemplate({
        pages: this.props.pages,
        url: data.fileurl.url,
        componentType: 'video',
        id: data.fileurl.id,
        name: data.fileurl.name
      }, {
        id: this.props.id,
        componentType: 'video',
        fileName: data.fileurl.name,
        type: data.fileurl.type,
        size: data.fileurl.size
      }, (newData) => this.updateFileUrl(data, newData), null, this.handleProcessingError)
    }
  }

  updateFileUrl(data, newData) {
    data.fileurl = newData.fileurl
    console.log('updating fileurl of VideoLinkModal', data)
    this.setState({
      youtubeLoading: false,
      file: data,
      videoLink: data.fileurl.url
    }, () => {
      if (this.refs.video) {
        this.refs.video.pause();
        this.refs.video.load();
      }
    })
  }

  facebookVideoReady () {
    this.setState({ 
      facebookLoading: false, 
      facebookDisabled: false
    })
  }

  validateFacebookUrl () {
    /* eslint-disable */
    let regExp = /^(?:(?:https?:)?\/\/)?(?:www\.)?(web.)?facebook\.com\/[a-zA-Z0-9\.]+\/videos\/(?:[a-zA-Z0-9\.]+\/)?([0-9]+)\/?$/g
    /* eslint-enable */
    if (regExp.test(this.state.facebookLink)) {
      this.setState({ 
        facebookUrl: this.state.facebookLink,
        facebookLoading: true, 
        facebookDisabled: true,
        edited: true 
      })
    } else {
      this.setState({ 
        facebookDisabled: true,
        facebookUrl: '', 
        facebookLoading: false, 
        edited: true 
      })
    }
  }


  validateYoutubeUrl() {
    let url = this.state.youtubeLink
    if (url !== undefined || url !== '') {
      /* eslint-disable */
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
      /* eslint-enable */
      var match = url.match(regExp)
      if (match && match[2].length === 11) {
        this.setState({ youtubeDisabled: false, youtubeLoading: true, fileSizeExceeded: false, edited: true }, () => {
          if (this.props.module && this.props.module === 'whatsapp') {
            console.log('setting videoId')
            let videoId = getVideoId(this.state.youtubeLink)
            console.log('setting videoId', videoId)
            this.setState({ videoId, youtubeLoading: false })
            this.props.urlMetaData(this.state.youtubeLink, (data) => this.handleUrlMetaData(data))
          } else {
            this.props.downloadYouTubeVideo(this.state.youtubeLink, this.props.id, (file) => { this.updateFile(file) }, this.handleProcessingError)
          }
        })
      } else {
        this.setState({ youtubeDisabled: true, file: null, fileSizeExceeded: false, edited: false })
      }
    }
  }

  handleUrlMetaData(data) {
    if (data) {
      let description
      if (data.ogDescription) {
        description = data.ogDescription.length > 80 ? data.ogDescription.substring(0, 80) + '...' : data.ogDescription
      } else {
        description = this.props.connectedPages.filter(page => page.pageId === this.props.pageId)[0].pageName
      }
      if (data.ogImage && data.ogImage.url && data.ogImage.url.startsWith('/')) {
          data.ogImage.url = this.state.youtubeLink + data.ogImage.url
      }
      let card = {
        title: data.ogTitle.length > 80 ? data.ogTitle.substring(0, 80) + '...' : data.ogTitle,
        subtitle: description,
        image_url: data.ogImage && data.ogImage.url ? data.ogImage.url : this.defaultImage,
        buttons: [
            {
                title: 'Watch on YouTube',
                type: 'web_url',
                url: this.state.youtubeLink
            }
        ],
        default_action: {
            type: 'web_url',
            url: this.state.youtubeLink
        }
      }
      this.setState({card, youtubeDisabled: false})
    }
  }

  closeModal() {
    if (!this.state.edited) {
      this.props.closeModal()
    } else {
      this.props.showCloseModalAlertDialog()
    }
  }

  handleRadioButton (e) {
    this.setState({
      videoType: e.target.value
    })
  }

  getInputBorderColor () {
    if (this.state.videoType === 'youtube') {
      if (this.state.youtubeDisabled && !this.state.youtubeLoading && !this.state.fileSizeExceeded) {
        return 'red'
      } else if (this.state.youtubeLoading || !this.state.youtubeDisabled || this.state.fileSizeExceeded) {
        return 'green'
      }
    } else if (this.state.videoType === 'facebook') {
      if (this.state.facebookDisabled && !this.state.facebookLoading) {
        return 'red'
      } else if (this.state.facebookLoading || !this.state.facebookDisabled) {
        return 'green'
      }
    }
    return ''
  }

  checkDisabled () {
    if (this.props.module === 'whatsapp') {
      return this.state.videoId && this.state.videoTitle && this.state.videoDescription
    } else if (this.state.videoType === 'youtube') {
      return this.state.youtubeDisabled || this.state.youtubeButtonDisabled || this.state.youtubeLoading
    } else if (this.state.videoType === 'facebook') {
      return this.state.facebookDisabled || this.state.facebookButtonDisabled || this.state.facebookLoading
    }
  }

  render() {
    console.log('VideoLinkModal props in render', this.props)
    let visibleButtons = []
    if (this.state.videoType === 'facebook') {
      visibleButtons = this.state.facebookButtons.filter(button => button.visible)
    } else if (this.state.videoType === 'youtube') {
      visibleButtons = this.state.youtubeButtons.filter(button => button.visible)
    }
    return (
      <div className="modal-content" style={{width: '72vw'}}>
        <div style={{ display: 'block' }} className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Video Link
          </h5>
          <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" onClick={this.closeModal} aria-label="Close">
            <span aria-hidden="true">
              &times;
            </span>
          </button>
        </div>
        <div style={{ color: 'black' }} className="modal-body">
          <div className='row'>
            
            <div className='col-6' style={{ maxHeight: '65vh', overflowY: 'scroll' }}>

              {
                this.props.module !== 'whatsapp' &&
                <div>
                <label>Select video source:</label>
                <div className='row' style={{marginLeft: '10px'}}>
                  <div className='col-md-6 col-lg-6 col-sm-6'>
                    <div className='radio'>
                      <input
                        type='radio'
                        value='youtube'
                        name='youtube'
                        onChange={this.handleRadioButton}
                        checked={this.state.videoType === 'youtube'} />
                      <span>YouTube</span>
                    </div>
                  </div>
                  <div className='col-md-6 col-lg-6 col-sm-6'>
                    <div className='radio'>
                      <input
                        type='radio'
                        value='facebook'
                        name='facebook'
                        onChange={this.handleRadioButton}
                        checked={this.state.videoType === 'facebook'} />
                      <span>Facebook</span>
                    </div>
                  </div>
                </div>
                <br />
              </div>
              }

              {
                <div style={{display: this.state.videoType !== 'youtube' ? 'none' : ''}}>
                  <input 
                    value={this.state.youtubeLink} 
                    style={{ 
                      maxWidth: '100%', 
                      borderColor: this.getInputBorderColor()
                    }} 
                    onChange={this.handleLinkChange} 
                    className='form-control' 
                  />
                  <div style={{ color: 'green' }}>{this.state.fileSizeExceeded ? '*The size of this YouTube video exceeds the 25 Mb limit imposed by Facebook, so it will be sent as a card.' : ''}</div>
                  <div style={{ color: 'red' }}>{!this.state.fileSizeExceeded && this.state.processingError === '' && this.state.youtubeDisabled && !this.state.youtubeLoading ? `*Please enter a valid YouTube video link.` : ''}</div>
                  <div style={{ color: 'red' }}>{this.state.processingError !== '' ? this.state.processingError : ''}</div>
                  <div style={{ marginBottom: '30px', color: 'green' }}>{this.state.youtubeLoading ? `*Please wait for the YouTube video to download.` : ''}</div>
                  {
                  !this.state.youtubeLoading && this.state.file &&
                  <AddButton
                    replyWithMessage={this.props.replyWithMessage}
                    disabled={this.state.youtubeDisabled}
                    buttons={this.state.youtubeButtons}
                    finalButtons={this.props.videoType === 'youtube' ? this.props.buttons : []}
                    buttonLimit={this.state.buttonLimit}
                    pageId={this.props.pageId}
                    buttonActions={this.state.buttonActions}
                    ref={(ref) => { this.YoutubeAddButton = ref }}
                    updateButtonStatus={this.updateButtonStatus}
                    toggleGSModal={this.props.toggleGSModal}
                    closeGSModal={this.props.closeGSModal}
                    addComponent={(buttons) => this.addComponent(buttons)} />
                  }
                </div>
              }

              {
                <div style={{display: this.state.videoType !== 'facebook' ? 'none' : ''}}>
                  <input 
                    value={this.state.facebookLink} 
                    style={{ 
                      maxWidth: '100%', 
                      borderColor: this.getInputBorderColor()
                    }} 
                    onChange={this.handleLinkChange} 
                    className='form-control' 
                  />
                  <div style={{ color: 'red' }}>{this.state.facebookDisabled && !this.state.facebookLoading ? `*Please enter a valid Facebook video link.` : ''}</div>
                  <div style={{ marginBottom: '30px', color: 'green' }}>{this.state.facebookLoading ? `*Validating Facebook video link...Please make sure video is publicly accessible` : ''}</div>
                  {
                    !this.state.facebookLoading && this.state.facebookUrl &&
                    <AddButton
                      replyWithMessage={this.props.replyWithMessage}
                      disabled={this.state.facebookDisabled}
                      buttons={this.state.facebookButtons}
                      finalButtons={this.props.videoType === 'facebook' ? this.props.buttons : []}
                      buttonLimit={this.state.buttonLimit}
                      pageId={this.props.pageId}
                      buttonActions={this.state.buttonActions}
                      ref={(ref) => { this.FacebookAddButton = ref }}
                      updateButtonStatus={this.updateButtonStatus}
                      toggleGSModal={this.props.toggleGSModal}
                      closeGSModal={this.props.closeGSModal}
                      addComponent={(buttons) => this.addComponent(buttons)} />
                  }
                </div>
              }
          
            </div>
            <div className='col-1'>
              <div style={{ minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)' }} />
            </div>
            <div className='col-5'>
              <h4 style={{ marginLeft: '-50px' }}>Preview:</h4>
              <div className='ui-block' 
                style={{ 
                  overflowY: 'auto', 
                  border: '1px solid rgba(0,0,0,.1)', 
                  borderRadius: '3px', 
                  minHeight: '68vh', 
                  maxHeight: '68vh', 
                  marginLeft: '-50px' 
                }} >
                <div className='ui-block' 
                  style={{ 
                    border: (this.state.videoType === 'youtube' && !this.state.youtubeDisabled && !this.state.fileSizeExceeded) || (this.state.videoType === 'facebook' && !this.state.facebookDisabled) ? '1px solid rgba(0,0,0,.1)' : '', 
                    borderRadius: '10px', 
                    maxWidth: '80%', 
                    margin: 'auto', 
                    marginTop: '50px',
                    marginBottom: '50px' 
                  }} >
                  {
                    this.state.youtubeLoading && this.state.videoType !== 'facebook' && 
                    <div className='align-center' style={{ padding: '50px' }}>
                      <center><RingLoader color='#FF5E3A' /></center>
                    </div>
                  }
                  {
                    this.state.videoType === 'youtube' && this.state.fileSizeExceeded && this.state.card &&
                      <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '200px', maxWidth: '250px', margin: 'auto', marginTop: '-10px'}} className="carousel-item active">
                        {
                            this.state.card.image_url &&
                            <img alt='' src={this.state.card.image_url} style={{objectFit: 'cover', minHeight: '170px', maxHeight: '170px', maxWidth: '300px', paddingBottom: '11px', paddingTop: '29px', margin: '-25px', width: '100%', height: '100%' }} />
                        }
                        <hr style={{marginTop: this.state.card.image_url ? '' : '100px', marginBottom: '5px'}} />
                        <h6 style={{textAlign: 'left', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{this.state.card.title}</h6>
                        <p style={{textAlign: 'left', marginLeft: '10px', marginTop: '5px', fontSize: '13px'}}>{this.state.card.subtitle ? this.state.card.subtitle : this.state.card.description}</p>
                        {/* <p style={{textAlign: 'left', marginLeft: '10px', fontSize: '13px'}}>{this.state.card.default_action && this.state.card.default_action.url}</p> */}
                        {
                            this.state.card.buttons && this.state.card.buttons.map((button, index) => (
                            (button.visible || button.type) && (
                              <div>
                                  <hr style={{marginTop: !this.state.card.title && !this.state.card.subtitle && index === 0 ? '50px' : ''}}/>
                                  <h5 style={{color: '#0782FF'}}>{button.title}</h5>
                              </div>
                            )
                          ))
                        }
                    </div>
                  }

                  {
                    this.state.videoId &&
                    <div>
                      <div>
                        <YouTube
                          videoId={this.state.videoId}
                          opts={{
                            height: '150',
                            width: '300',
                            playerVars: {
                              autoplay: 0
                            }
                          }}
                        />
                      </div>
                      {
                        this.state.videoTitle &&
                        <div>
                          <div style={{ textAlign: 'left', 'marginLeft': '10px' }}>
                            <h6>{this.state.videoTitle}</h6>
                            <h7>{this.state.videoDescription.length > 50 ? this.state.videoDescription.substr(0, 47) + '...' : this.state.videoDescription}</h7>
                            <p style={{ fontSize: '0.7em', marginTop: '5px' }}>www.youtube.com</p>
                          </div>
                          <hr />
                          <p style={{ textAlign: 'left', color: '#0782FF', fontSize: '0.9em', marginLeft: '5px' }}>{this.state.youtubeLink}</p>
                        </div>
                      }
                    </div>
                  }
                  {
                    (this.props.module !== 'whatsapp' && !this.state.youtubeDisabled && !this.state.youtubeLoading && !this.state.fileSizeExceeded && this.state.videoType === 'youtube' && this.state.videoLink) &&
                    <video ref="video" controls style={{ width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} name='media' id='youtube_player'>
                      <source src={this.state.videoLink} type='audio/mpeg' />
                    </video>
                  }
                  {
                    (this.props.module !== 'whatsapp' && this.state.facebookUrl) &&
                      <div style={{display: this.state.videoType !== 'facebook' ? 'none' : '', marginTop: '-10px'}}>
                        <FacebookPlayer
                          style={{marginTop: '10px', borderRadius: '10px 10px 0px 0px'}}
                          onReady={this.facebookVideoReady}
                          width='100%'
                          height='100%'
                          controls={true}
                          url={this.state.facebookUrl}
                          config={{
                            facebook: {
                              appId: '1429073230510150'
                            }
                          }}
                        />
                      </div>
                  }
                  {
                    visibleButtons.map((button, index) => {
                      let style = null
                      let hrStyle = null
                      if (index === 0 || visibleButtons.length === 1) {
                        style = { marginTop: '55%' }
                        if ((this.state.videoType === 'facebook' && this.state.facebookLink && !this.state.facebookDisabled) ||
                          (this.state.videoType === 'youtube' && this.state.youtubeLink && !this.state.youtubeDisabled)
                        ) {
                          style = { marginTop: '-9%', padding: '2px' }
                        }
                      } else {
                        if (index === visibleButtons.length - 1) {
                          style = {paddingBottom: '5px'}
                        }
                        hrStyle = {marginTop: '5px', marginBottom: '5px'}
                      }
                      return (
                        <div style={style}>
                          <hr style={hrStyle} />
                          <span style={{ fontWeight: '500', color: '#0782FF' }}>{button.title}</span>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className='col-6' style={{ marginTop: '-5vh' }}>
              <div className='pull-right'>
                <button onClick={this.closeModal} className='btn btn-primary' style={{ marginRight: '20px' }}>
                  Cancel
                </button>
                <button disabled={this.checkDisabled()} onClick={() => this.handleDone()} className='btn btn-primary'>
                  {this.props.edit ? 'Edit' : 'Next'}
                </button>
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
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    uploadTemplate,
    downloadYouTubeVideo,
    urlMetaData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoLinkModal)
