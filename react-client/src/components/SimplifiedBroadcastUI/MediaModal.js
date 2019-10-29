/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Media from './AddMedia'
import AddButton from './AddButton'

class MediaModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      buttons: props.buttons.map(button => { return { visible: true, title: button.title } }),
      numOfCurrentButtons: 0,
      disabled: false,
      buttonDisabled: false,
      buttonLimit: 3,
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'],
      imgSrc: props.imgSrc ? props.imgSrc : '',
      file: props.file ? props.file : null,
      edited: false
    }
    this.updateFile = this.updateFile.bind(this)
    this.updateImage = this.updateImage.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  handleDone() {
    if (this.props.noButtons || !this.props.pages) {
      this.addComponent([])
    } else {
      this.AddButton.handleDone()
    }
  }

  addComponent(buttons) {
    console.log('addComponent MediaModal', this.state)
    if (this.props.module === 'jsonads') {
      this.props.addComponent({
        id: this.props.id,
        componentType: this.state.imgSrc ? 'image' : 'video',
        file: this.state.file,
        fileurl: this.state.file ? this.state.file.fileurl : '',
        fileName: this.state.file.fileName,
        image_url: this.state.file ? this.state.file.image_url : ''
      },
        this.props.edit)
    } else {
      this.props.addComponent({
        id: this.props.id,
        componentType: 'media',
        fileurl: this.state.file.fileurl,
        fileName: this.state.file.fileName,
        image_url: this.state.file.image_url ? this.state.file.image_url : '',
        size: this.state.file.size,
        type: this.state.file.type,
        mediaType: this.state.imgSrc ? 'image' : 'video',
        buttons
      }, this.props.edit)
    }
  }

  updateButtonStatus(status) {
    console.log('updateButtonStatus MediaModal', status)
    status.edited = true
    this.setState(status)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      buttons: nextProps.buttons.map(button => { return { visible: true, title: button.title } }),
      numOfCurrentButtons: 0,
      disabled: false,
      buttonDisabled: false,
      buttonLimit: 3,
      buttonActions: nextProps.buttonActions ? nextProps.buttonActions : ['open website', 'open webview'],
      imgSrc: nextProps.imgSrc ? nextProps.imgSrc : '',
      file: nextProps.file ? nextProps.file : null,
      edited: false
    })
  }


  componentWillUnmount() {
    this.props.closeModal()
  }

  updateStatus(status) {
    status.edited = true
    this.setState(status)
  }

  updateImage(imgSrc) {
    this.setState({ imgSrc, edited: true })
  }

  updateFile(file) {
    console.log('updating file MediaModal', file)
    this.setState({ file, edited: true, disabled: false }, () => {
      if (this.refs.video) {
        this.refs.video.pause();
        this.refs.video.load();
      }
    })
  }

  closeModal() {
    if (!this.state.edited) {
      this.props.closeModal()
    } else {
      this.props.showCloseModalAlertDialog()
    }
  }

  render() {
    let visibleButtons = this.state.buttons.filter(button => button.visible)
    return (
      <div className="modal-content">
        <div style={{ display: 'block' }} className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Add Media Component
									</h5>
          <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">
              &times;
											</span>
          </button>
        </div>
        <div style={{ color: 'black' }} className="modal-body">
          <div className='row'>
            <div className='col-6' style={{ maxHeight: '65vh', overflowY: 'scroll' }}>
              <h4>Media:</h4>
              <Media
                required
                updateStatus={this.updateStatus}
                mediaType={this.state.imgSrc ? 'image' : 'video'}
                pages={this.props.pages}
                file={this.state.file}
                updateImage={this.updateImage}
                updateFile={this.updateFile}
                fileurl={this.state.file ? this.state.file.fileurl : ''}
                fileName={this.state.file ? this.state.file.fileName : ''}
                image_url={this.state.file && this.state.file.image_url ? this.state.file.image_url : ''}
                size={this.state.file ? this.state.file.size : ''}
                type={this.state.file ? this.state.file.type : ''} />
              {
                (this.props.pages && !this.props.noButtons && this.state.file) &&
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
                <div className='ui-block' style={{ maxWidth: '250px', margin: 'auto', marginTop: '100px' }} >
                  {
                    this.state.imgSrc &&
                    <div style={{ border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px' }}>
                      <img src={this.state.imgSrc} style={{ minHeight: '130px', maxWidth: '250px', padding: '25px', margin: '-25px' }} />
                    </div>
                  }
                  {
                    (this.state.file && !this.state.imgSrc) &&
                    <div style={{ border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px' }}>
                      <video ref="video" controls style={{ width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }} name='media' id='youtube_player'>
                        <source src={this.state.file.fileurl.url} type='audio/mpeg' />
                      </video>
                    </div>
                  }
                  {
                    visibleButtons.map((button, index) => {
                      return (
                        <div style={{ border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px', padding: '5px', paddingTop: '5%' }}>
                          <h5 style={{ color: '#0782FF' }}>{button.title}</h5>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
            <div className='row' style={{ marginTop: '-5vh' }}>
              <div className='pull-right'>
                <button onClick={this.closeModal} className='btn btn-primary' style={{ marginRight: '25px', marginLeft: '280px' }}
                 data-dismiss='modal'>
                  Cancel
                </button>
                <button disabled={!this.state.file || this.state.disabled || this.state.buttonDisabled} onClick={() => this.handleDone()} className='btn btn-primary'
                data-dismiss='modal'>
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

export default MediaModal
