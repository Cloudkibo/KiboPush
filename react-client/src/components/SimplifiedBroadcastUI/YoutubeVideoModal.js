/* eslint-disable no-undef */
import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddButton from './AddButton'
import Halogen from 'halogen'
import { downloadYouTubeVideo, uploadTemplate } from '../../redux/actions/convos.actions'

class YoutubeVideoModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttons: props.buttons.map(button => button.type === 'element_share' ? {visible: true, title: 'Share'} : {visible: true, title: button.title}),
      numOfCurrentButtons: 0,
      disabled: props.edit ? false : true,
      buttonDisabled: false,
      buttonLimit: 3,
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'],
      file: this.props.file ? this.props.file : '',
      link: this.props.youtubeLink ? this.props.youtubeLink : '',
      videoLink: this.props.videoLink ? this.props.videoLink : '',
      loading: false,
    }
    this.updateFile = this.updateFile.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
    this.validateYoutubeUrl = this.validateYoutubeUrl.bind(this)
    this.handleLinkChange = this.handleLinkChange.bind(this)
    this.uploadTemplate = this.uploadTemplate.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  handleLinkChange (e) {
    console.log('changing link', e.target.value)
    this.setState({link: e.target.value}, () => {
      this.validateYoutubeUrl()
    })
  }

  handleDone () {
    this.AddButton.handleDone()
  }

  addComponent (buttons) {
    console.log('addComponent YoutubeVideoModal', this.state)
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
      buttons})
  }

  updateButtonStatus (status) {
    console.log('updateButtonStatus MediaModal', status)
    this.setState(status)
  }

  updateFile (file) {
    if (file === 'ERR_LIMIT_REACHED') {
      this.setState({fileSizeExceeded: true, disabled: true, loading: false})
      return
    }
    console.log('updating YouTube file', file)
    this.uploadTemplate(file)
    // this.setState({file, videoLink: file.fileurl.url}, () => {
    //   this.refs.video.pause();
    //   this.refs.video.load();
    //   this.refs.video.play();
    // })
  }

  setLoading () {
    this.setState({loading: true})
  }

  uploadTemplate (data) {
    console.log('updating file AddMedia', data)
    //this.props.updateFile(data)
    var video = data.type.match('video.*')
    if (video) {
      console.log('video uploading template')
      this.props.uploadTemplate({pages: this.props.pages,
        url: data.fileurl.url,
        componentType: 'video',
        id: data.fileurl.id,
        name: data.fileurl.name
      }, { id: this.props.id,
        componentType: 'video',
        fileName: data.fileurl.name,
        type: data.fileurl.type,
        size: data.fileurl.size
      }, (newData) => this.updateFileUrl(data, newData))
    } 
  }

  updateFileUrl (data, newData) {
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


  validateYoutubeUrl () {
    let url = this.state.link
    if (url !== undefined || url !== '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
      var match = url.match(regExp)
      if (match && match[2].length === 11) {
        this.setState({disabled: false, loading: true, fileSizeExceeded: false, edited: true}, () => {
          this.props.downloadYouTubeVideo(this.state.link, this.props.id, (file) => {this.updateFile(file)})
        })
      } else {
        this.setState({disabled: true, file: null, fileSizeExceeded: false, edited: false})
      }
    }
  }

  closeModal () {
    if (!this.state.edited) {
      this.props.closeModal()
    } else {
      this.props.showCloseModalAlertDialog()
    }
  }


  componentWillUnmount() {
    this.props.closeModal()
  }

  render () {
    console.log('video link', this.state.link)
    let visibleButtons = this.state.buttons.filter(button => button.visible)
    return (
      <ModalContainer style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
        onClose={this.closeModal}>
        <ModalDialog style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
          onClose={this.closeModal}>
          <h3>Add Video from YouTube </h3>
          <hr />
          <div className='row'>
            <div className='col-6' style={{maxHeight: '65vh', overflowY: 'scroll'}}>
              <h4>YouTube Link:</h4>
              <input value={this.state.link} style={{ maxWidth: '100%', borderColor: this.state.disabled && !this.state.loading ? 'red' : (this.state.loading || !this.state.disabled) ? 'green' : ''}} onChange={this.handleLinkChange} className='form-control' />
              <div style={{color: 'red'}}>{this.state.fileSizeExceeded ? '*The size of this YouTube video exceeds the 25 Mb limit imposed by Facebook. Please try another video.' : ''}</div>
              <div style={{color: 'red'}}>{!this.state.fileSizeExceeded && this.state.disabled && !this.state.loading ? '*Please enter a valid YouTube link.' : ''}</div>
              <div style={{marginBottom: '30px', color: 'green'}}>{this.state.loading ? '*Please wait for the YouTube video to download.' : ''}</div>
              {
                this.state.file &&
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
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{overflowY: 'auto', border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '68vh', maxHeight: '68vh', marginLeft: '-50px'}} >
                <div className='ui-block' style={{border: !this.state.disabled ? '1px solid rgba(0,0,0,.1)' : '', borderRadius: '10px', maxWidth: '70%', margin: 'auto', marginTop: '100px'}} >
                {this.state.loading && <div className='align-center' style={{padding: '50px'}}>
                  <center><Halogen.RingLoader color='#FF5E3A' /></center>
                  </div>
                }
                  {
                    (!this.state.disabled && !this.state.loading) &&
                    <video ref="video" controls style={{width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}} name='media' id='youtube_player'>
                      <source src={this.state.videoLink} type='audio/mpeg' />
                    </video>
                  }
                  {
                      visibleButtons.map((button, index) => {
                        let style = null
                        if (index === 0 || visibleButtons.length === 1) {
                          style = {marginTop: '55%'}
                          if (this.state.link && !this.state.disabled) {
                            style = {marginTop: '-9%'}
                          }
                        }
                        return (
                          <div style={style}>
                            <hr />
                            <h5 style={{color: '#0782FF'}}>{button.title}</h5>
                          </div>
                        )
                      })
                  }

                </div>
              </div>
            </div>
            <div className='row' style={{marginTop: '-5vh'}}>
              <div className='pull-right'>
                <button onClick={this.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={!this.state.file || this.state.disabled || this.state.buttonDisabled} onClick={() => this.handleDone()} className='btn btn-primary'>
                    {this.props.edit ? 'Edit' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </ModalDialog>
      </ModalContainer>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    uploadTemplate,
    downloadYouTubeVideo
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(YoutubeVideoModal)
