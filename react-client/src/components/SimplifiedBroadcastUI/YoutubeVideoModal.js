/* eslint-disable no-undef */
import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { RingLoader } from 'halogenium'
import AddButton from './AddButton'
import { downloadYouTubeVideo, uploadTemplate, urlMetaData } from '../../redux/actions/convos.actions'
import { getVideoId } from '../../utility/utils'
import YouTube from 'react-youtube'

class YoutubeVideoModal extends React.Component {
  constructor(props) {
    super(props)
    console.log('YoutubeVideoModal props', props)
    this.state = {
      buttons: props.buttons.map(button => { return { visible: true, title: button.title } }),
      numOfCurrentButtons: 0,
      disabled: props.edit ? false : true,
      buttonDisabled: false,
      buttonLimit: 3,
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'],
      file: this.props.file ? this.props.file : '',
      link: this.props.youtubeLink ? this.props.youtubeLink : '',
      videoLink: this.props.videoLink ? this.props.videoLink : '',
      videoTitle: this.props.videoTitle ? this.props.videoTitle : '',
      videoDescription: this.props.videoDescription ? this.props.videoDescription : '',
      loading: false,
      videoId: this.props.videoId ? this.props.videoId : null,
    }
    console.log('YoutubeVideoModal state', this.state)
    console.log('YoutubeVideoModal module', this.props.module)
    this.updateFile = this.updateFile.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
    this.validateYoutubeUrl = this.validateYoutubeUrl.bind(this)
    this.handleLinkChange = this.handleLinkChange.bind(this)
    this.uploadTemplate = this.uploadTemplate.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleUrlMetaData = this.handleUrlMetaData.bind(this)
  }

  handleLinkChange(e) {
    console.log('changing link', e.target.value)
    this.setState({ disabled: true, link: e.target.value, videoId: null, videoTitle: null, videoDescription: null }, () => {
      this.validateYoutubeUrl()
    })
  }

  handleDone() {
    if (this.props.noButtons) {
      this.addComponent([])
    } else {
      this.AddButton.handleDone()
    }
  }

  addComponent(buttons) {
    console.log('addComponent YoutubeVideoModal', this.state)
    if (this.props.module === 'whatsapp') {
      this.props.addComponent({
        id: this.props.id >= 0 ? this.props.id : null,
        componentType: 'text',
        videoTitle: this.state.videoTitle,
        videoDescription: this.state.videoDescription,
        videoId: this.state.videoId,
        text: this.state.link,
        buttons
      }, this.props.edit)
    } else {
      this.props.addComponent({
        id: this.props.id,
        youtubeLink: this.state.link,
        videoLink: this.state.videoLink,
        componentType: 'media',
        fileurl: this.state.file.fileurl,
        fileName: this.state.file.fileName,
        image_url: '',
        size: this.state.file.size,
        type: this.state.file.type,
        mediaType: 'video',
        buttons
      })
    }
  }

  updateButtonStatus(status) {
    console.log('updateButtonStatus MediaModal', status)
    this.setState(status)
  }

  updateFile(file) {
    if (file === 'ERR_LIMIT_REACHED') {
      this.setState({ fileSizeExceeded: true, disabled: true, loading: false })
      return
    }
    console.log('updating YouTube file', file)
    if (this.props.module !== 'jsonads') {
      this.uploadTemplate(file)
    } else {
      this.setState({
        loading: false,
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

  setLoading() {
    this.setState({ loading: true })
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
      }, (newData) => this.updateFileUrl(data, newData))
    }
  }

  updateFileUrl(data, newData) {
    data.fileurl = newData.fileurl
    console.log('updating fileurl of YoutubeVideoModal', data)
    this.setState({
      loading: false,
      file: data,
      videoLink: data.fileurl.url
    }, () => {
      this.refs.video.pause();
      this.refs.video.load();
      this.refs.video.play();
    })
  }


  validateYoutubeUrl() {
    let url = this.state.link
    if (url !== undefined || url !== '') {
      /* eslint-disable */
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
      /* eslint-enable */
      var match = url.match(regExp)
      if (match && match[2].length === 11) {
        this.setState({ disabled: false, loading: true, fileSizeExceeded: false, edited: true }, () => {
          if (this.props.module && this.props.module === 'whatsapp') {
            console.log('setting videoId')
            let videoId = getVideoId(this.state.link)
            console.log('setting videoId', videoId)
            this.setState({ videoId, loading: false })
            this.props.urlMetaData(this.state.link, (data) => this.handleUrlMetaData(data))
          } else {
            this.props.downloadYouTubeVideo(this.state.link, this.props.id, (file) => { this.updateFile(file) })
          }
        })
      } else {
        this.setState({ disabled: true, file: null, fileSizeExceeded: false, edited: false })
      }
    }
  }

  handleUrlMetaData(data) {
    this.setState({ videoTitle: data.title, videoDescription: data.description })
  }

  closeModal() {
    if (!this.state.edited) {
      this.props.closeModal()
    } else {
      this.props.showCloseModalAlertDialog()
    }
  }


  UNSAFE_componentWillUnmount() {
    this.props.closeModal()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      buttons: nextProps.buttons.map(button => { return { visible: true, title: button.title } }),
      numOfCurrentButtons: 0,
      disabled: nextProps.edit ? false : true,
      buttonDisabled: false,
      buttonLimit: 3,
      buttonActions: nextProps.buttonActions ? nextProps.buttonActions : ['open website', 'open webview'],
      file: nextProps.file ? this.props.file : '',
      link: nextProps.youtubeLink ? nextProps.youtubeLink : '',
      videoLink: nextProps.videoLink ? nextProps.videoLink : '',
      videoTitle: nextProps.videoTitle ? nextProps.videoTitle : '',
      videoDescription: nextProps.videoDescription ? nextProps.videoDescription : '',
      loading: false,
      videoId: nextProps.videoId ? nextProps.videoId : null,
    })
  }

  render() {
    console.log('video link', this.state.link)
    let visibleButtons = this.state.buttons.filter(button => button.visible)
    return (
      <div className="modal-content" style={{width: '72vw'}}>
        <div style={{ display: 'block' }} className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Add Video from YouTube
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
              <h4>YouTube Link:</h4>
              <input value={this.state.link} style={{ maxWidth: '100%', borderColor: this.state.disabled && !this.state.loading ? 'red' : (this.state.loading || !this.state.disabled) ? 'green' : '' }} onChange={this.handleLinkChange} className='form-control' />
              <div style={{ color: 'red' }}>{this.state.fileSizeExceeded ? '*The size of this YouTube video exceeds the 25 Mb limit imposed by Facebook. Please try another video.' : ''}</div>
              <div style={{ color: 'red' }}>{!this.state.fileSizeExceeded && this.state.disabled && !this.state.loading ? '*Please enter a valid YouTube link.' : ''}</div>
              <div style={{ marginBottom: '30px', color: 'green' }}>{this.state.loading ? '*Please wait for the YouTube video to download.' : ''}</div>
              {
                this.state.file && this.props.module !== 'whatsapp' &&
                <AddButton
                  replyWithMessage={this.props.replyWithMessage}
                  buttons={this.state.buttons}
                  finalButtons={this.props.buttons}
                  buttonLimit={this.state.buttonLimit}
                  pageId={this.props.pageId}
                  buttonActions={this.state.buttonActions}
                  ref={(ref) => { this.AddButton = ref }}
                  updateButtonStatus={this.updateButtonStatus}
                  addComponent={(buttons) => this.addComponent(buttons)} />
              }
            </div>
            <div className='col-1'>
              <div style={{ minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)' }} />
            </div>
            <div className='col-5'>
              <h4 style={{ marginLeft: '-50px' }}>Preview:</h4>
              <div className='ui-block' style={{ overflowY: 'auto', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '68vh', maxHeight: '68vh', marginLeft: '-50px' }} >
                <div className='ui-block' style={{ border: !this.state.disabled ? '1px solid rgba(0,0,0,.1)' : '', borderRadius: '10px', maxWidth: '80%', margin: 'auto', marginTop: '80px' }} >
                  {
                    this.state.loading && <div className='align-center' style={{ padding: '50px' }}>
                      <center><RingLoader color='#FF5E3A' /></center>
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
                          <p style={{ textAlign: 'left', color: '#0782FF', fontSize: '0.9em', marginLeft: '5px' }}>{this.state.link}</p>
                        </div>
                      }
                    </div>
                  }
                  {
                    (this.props.module !== 'whatsapp' && !this.state.disabled && !this.state.loading) &&
                    <video ref="video" controls style={{ width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} name='media' id='youtube_player'>
                      <source src={this.state.videoLink} type='audio/mpeg' />
                    </video>
                  }
                  {
                    visibleButtons.map((button, index) => {
                      let style = null
                      if (index === 0 || visibleButtons.length === 1) {
                        style = { marginTop: '55%' }
                        if (this.state.link && !this.state.disabled) {
                          style = { marginTop: '-9%' }
                        }
                      }
                      return (
                        <div style={style}>
                          <hr />
                          <h5 style={{ color: '#0782FF' }}>{button.title}</h5>
                        </div>
                      )
                    })
                  }

                </div>
              </div>
            </div>
            <div className='col-6' style={{ marginTop: '-5vh' }}>
              <div className='pull-right'>
              <button onClick={this.closeModal} className='btn btn-primary' style={{ marginRight: '20px' }}
              >
                  Cancel
                </button>
                <button disabled={(!this.props.module === 'whatsapp' && !this.state.file) || this.state.disabled || this.state.buttonDisabled || (this.props.module === 'whatsapp' && !this.state.videoTitle)} onClick={() => this.handleDone()} className='btn btn-primary'
                 >
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
export default connect(mapStateToProps, mapDispatchToProps)(YoutubeVideoModal)
