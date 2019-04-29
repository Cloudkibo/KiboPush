/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Media from './Media'
import AddButton from './AddButton'

class MediaModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      buttons: [],
      numOfCurrentButtons: 0,
      disabled: false,
      buttonDisabled: false,
      buttonLimit: 3,
      buttonActions: ['open website', 'open webview'],
      imgSrc: null,
      file: null
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
    this.props.addComponent({componentType: 'media',
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
    this.setState({file})
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
            <div className='col-6'>
              <h4>Media:</h4>
              <Media updateImage={this.updateImage} updateFile={this.updateFile} />
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
                <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', maxWidth: '250px', minHeight: '150px', margin: 'auto', marginTop: '100px'}} >
                  {
                      this.state.imgSrc &&
                      <img src={this.state.imgSrc} style={{minHeight: '130px', maxWidth: '250px', padding: '25px', margin: '-25px'}} />
                  }
                  {
                    (this.state.file && !this.state.imgSrc) &&
                    <video controls style={{width: '100%', borderRadius: '10px', marginTop: '-10px'}}name='media'>
                      <source src={this.state.file.fileurl.url} type='audio/mpeg' />
                    </video>
                  }
                  {
                      visibleButtons.map((button, index) => {
                        let style = null
                        if (index === 0 || visibleButtons.length === 1) {
                          style = {marginTop: '55%'}
                          if (this.state.imgSrc) {
                            style = null
                          }
                          if (this.state.file && !this.state.imgSrc) {
                            style = {marginTop: '-8%'}
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
                <button disabled={!this.state.file || this.state.disabled || this.state.buttonDisabled} onClick={() => this.handleDone()} className='btn btn-primary'>
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

export default MediaModal
