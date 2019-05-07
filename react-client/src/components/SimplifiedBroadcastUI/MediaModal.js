/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Media from './AddMedia'
import AddButton from './AddButton'

class MediaModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttons: props.buttons.map(button => button.type === 'element_share' ? {visible: true, title: 'Share'} : {visible: true, title: button.title}),
      numOfCurrentButtons: 0,
      disabled: false,
      buttonDisabled: false,
      buttonLimit: 3,
      buttonActions: ['open website', 'open webview'],
      imgSrc: props.imgSrc ? props.imgSrc : '',
      file: props.file ? props.file : null
    }
    this.updateFile = this.updateFile.bind(this)
    this.updateImage = this.updateImage.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
  }

  handleDone () {
    this.AddButton.handleDone()
  }

  addComponent (buttons) {
    console.log('addComponent MediaModal')
    this.props.addComponent({
      id: this.props.id,
      componentType: 'media',
      file: this.state.file,
      fileurl: this.state.file ? this.state.file.fileurl : '',
      buttons})
  }

  updateButtonStatus (status) {
    console.log('updateButtonStatus MediaModal', status)
    this.setState(status)
  }

  updateImage (imgSrc) {
    this.setState({imgSrc})
  }

  updateFile (file) {
    this.setState({file}, () => {
      this.refs.video.pause();
      this.refs.video.load();
    })
  }

  render () {
    let visibleButtons = this.state.buttons.filter(button => button.visible)
    return (
      <ModalContainer style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
          onClose={this.props.closeModal}>
          <h3>Add Media Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6' style={{maxHeight: '500px', overflowY: 'scroll'}}>
              <h4>Media:</h4>
              <Media updateImage={this.updateImage} updateFile={this.updateFile} />
              {
                this.state.file &&
                <AddButton
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
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '500px', marginLeft: '-50px'}} >
                <div className='ui-block' style={{maxWidth: '250px', margin: 'auto', marginTop: '100px'}} >
                  {
                      this.state.imgSrc &&
                      <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px'}}>
                        <img src={this.state.imgSrc} style={{minHeight: '130px', maxWidth: '250px', padding: '25px', margin: '-25px'}} />
                      </div>
                  }
                  {
                    (this.state.file && !this.state.imgSrc) &&
                    <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px'}}>
                      <video ref="video" controls style={{width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}} name='media' id='youtube_player'>
                        <source src={this.state.file.fileurl.url} type='audio/mpeg' />
                      </video>
                    </div>
                  }
                  {
                      visibleButtons.map((button, index) => {
                        return (
                          <div style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '5px', padding: '5px', paddingTop: '5%'}}>

                            <h5 style={{color: '#0782FF'}}>{button.title}</h5>
                          </div>
                        )
                      })
                  }

                </div>
              </div>
            </div>
            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.props.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={!this.state.file || this.state.disabled || this.state.buttonDisabled} onClick={() => this.handleDone()} className='btn btn-primary'>
                  {this.props.edit ? 'Edit' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </ModalDialog>
      </ModalContainer>

    )
  }
}

export default MediaModal
