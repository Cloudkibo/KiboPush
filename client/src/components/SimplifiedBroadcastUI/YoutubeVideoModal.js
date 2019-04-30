/* eslint-disable no-undef */
import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddButton from './AddButton'

class YoutubeVideoModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttons: [],
      numOfCurrentButtons: 0,
      disabled: true,
      buttonDisabled: false,
      buttonLimit: 3,
      buttonActions: ['open website', 'open webview'],
      file: null,
      link: ''
    }
    this.updateFile = this.updateFile.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
    this.validateYoutubeUrl = this.validateYoutubeUrl.bind(this)
    this.handleLinkChange = this.handleLinkChange.bind(this)
  }

  handleLinkChange (e) {
    this.setState({link: e.target.value}, () => {
      this.validateYoutubeUrl()
    })
  }

  handleDone () {
    this.AddButton.handleDone()
  }

  addComponent (buttons) {
    console.log('addComponent MediaModal')
    this.props.addComponent({componentType: 'media',
      fileurl: this.state.file ? this.state.file.fileurl : '',
      buttons})
  }

  updateButtonStatus (status) {
    console.log('updateButtonStatus MediaModal', status)
    this.setState(status)
  }

  updateFile (file) {
    this.setState({file})
  }

  validateYoutubeUrl () {
    let url = this.state.link
    if (url !== undefined || url !== '') {
      var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
      var match = url.match(regExp)
      if (match && match[2].length === 11) {
        this.setState({disabled: false}, () => {
          this.video.mediaelementplayer()
        })
      } else {
        this.setState({disabled: true})
      }
    }
  }

  render () {
    let visibleButtons = this.state.buttons.filter(button => button.visible)
    return (
      <ModalContainer style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
          onClose={this.props.closeModal}>
          <h3>Add Video from YouTube </h3>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h4>YouTube Link:</h4>
              <input value={this.state.link} style={{marginBottom: '30px', maxWidth: '100%'}} onChange={this.handleLinkChange} className='form-control' />
              <AddButton buttonLimit={this.state.buttonLimit}
                pageId={this.props.pageId}
                buttonActions={this.state.buttonActions}
                ref={(ref) => { this.AddButton = ref }}
                updateButtonStatus={this.updateButtonStatus}
                addComponent={(buttons) => this.addComponent(buttons)} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '500px', marginLeft: '-50px'}} >
                <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', maxWidth: '250px', minHeight: '130px', margin: 'auto', marginTop: '100px'}} >
                  {
                    (!this.state.disabled) &&
                    <video ref={(ref) => { this.video = ref }} controls style={{width: '100%', borderRadius: '10px', marginTop: '-10px', borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}} name='media' id='youtube_player'>
                      <source src={this.state.link} type='audio/mpeg' />
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
            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.props.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={this.state.disabled} onClick={() => this.handleDone()} className='btn btn-primary'>
                    Add
                </button>
              </div>
            </div>
          </div>
        </ModalDialog>
      </ModalContainer>

    )
  }
}

export default YoutubeVideoModal
