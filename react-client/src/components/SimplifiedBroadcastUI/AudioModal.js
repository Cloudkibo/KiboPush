/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
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
  }

  handleDone () {
    this.addComponent()
  }

  addComponent () {
    console.log('addComponent AudioModal')
    this.props.addComponent({
      id: this.props.id,
      componentType: 'audio',
      file: this.state.file ? this.state.file : null})
  }

  updateFile (file) {
    this.setState({file}, () => {
      this.refs.audio.pause();
      this.refs.audio.load();
      this.refs.audio.play();
    })
  }

  onTestURLAudio (url) {
    var AUDIO_EXTENSIONS = /\.(m4a|mp4a|mpga|mp2|mp2a|mp3|m2a|m3a|wav|weba|aac|oga|spx|mp4)($|\?)/i
    var truef = AUDIO_EXTENSIONS.test(url)

    if (truef === false) {
    }
  }

  render () {
    return (
      <ModalContainer style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
          onClose={this.props.closeModal}>
          <h3>Add Audio Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h4>Audio:</h4>
              <Audio updateFile={this.updateFile} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '250px', marginLeft: '-50px'}} >
                <div style={{marginTop: '25%'}}>
                    <audio controls name='media' ref="audio">
                      <source src={this.state.file ? (this.state.file.fileurl ? this.state.file.fileurl.url : this.state.file.url) : ''} type='audio/mpeg' />
                    </audio>
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.props.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={!this.state.file} onClick={() => this.handleDone()} className='btn btn-primary'>
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

export default AudioModal
