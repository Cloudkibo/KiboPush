/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Audio from './Audio'

class AudioModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled: false,
      file: this.props.file ? this.props.file : null
    }
    this.updateFile = this.updateFile.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  handleDone () {
    this.addComponent()
  }

  addComponent () {
    console.log('addComponent AudioModal')
    this.props.addComponent({
      id: this.props.id,
      componentType: 'audio',
      file: this.state.file ? this.state.file : null}, this.props.edit)
  }

  updateFile (file) {
    this.setState({file, edited: true}, () => {
      this.refs.audio.pause();
      this.refs.audio.load();
      this.refs.audio.play();
    })
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
    return (
      {/*
      <ModalContainer style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
        onClose={this.closeModal}>
        <ModalDialog style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
          onClose={this.closeModal}>
          <h3>Add Audio Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h4>Audio:</h4>
              <Audio required file={this.state.file} updateFile={this.updateFile} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '250px', marginLeft: '-50px'}} >
                <div style={{marginTop: '25%'}}>
                    <audio controls name='media' ref="audio">
                      <source src={this.state.file ? this.state.file.fileurl.url : ''} type='audio/mpeg' />
                    </audio>
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={!this.state.file} onClick={() => this.handleDone()} className='btn btn-primary'>
                  {this.props.edit ? 'Edit' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </ModalDialog>
      </ModalContainer>
      */}
    )
  }
}

export default AudioModal
