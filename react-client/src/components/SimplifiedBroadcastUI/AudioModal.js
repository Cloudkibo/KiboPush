/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Audio from './Audio'
import { deleteFile } from '../../utility/utils'

class AudioModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      edited: false,
      disabled: false,
      file: this.props.file ? this.props.file : null,
      initialFile: this.props.file ? this.props.file.fileurl.id : null
    }
    this.updateFile = this.updateFile.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('in audio', nextProps)
    // this.setState({
    //   disabled: false,
    //   file: nextProps.file ? nextProps.file : null
    // })
  }

  handleDone () {
    this.addComponent()
  }

  addComponent () {
    if (this.state.initialFile) {
      let canBeDeleted = true
      for (let i = 0; i < this.props.initialFiles.length; i++) {
        if (this.state.initialFile === this.props.initialFiles[i]) {
          canBeDeleted = false
          break
        }
      }
      if (canBeDeleted) {
        if (this.state.file.id !== this.state.initialFile) {
          deleteFile(this.state.initialFile)
        }
      }
    }
    console.log('addComponent AudioModal')
    this.props.addComponent({
      id: this.props.id,
      componentType: 'audio',
      componentName: 'audio',
      file: this.state.file ? this.state.file : null}, this.props.edit)
      this.setState({edited:false})
  }

  updateFile (file, isEditFile) {
    this.props.setTempFiles([file.fileurl.id])
    this.setState({file, edited: isEditFile}, () => {
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

  render () {
    return (
          <div className="modal-content" style={{width: '72vw'}}>
            <div style={{ display: 'block' }} className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Audio Component
							</h5>
              <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" onClick={this.closeModal} aria-label="Close">
                <span aria-hidden="true">
                  &times;
											</span>
              </button>
            </div>
            <div style={{ color: 'black' }} className="modal-body">
              <div className='row'>
                <div className='col-6'>
                  <h4>Audio:</h4>
                  <Audio
                    required
                    setTempFiles={this.props.setTempFiles}
                    file={this.state.file}
                    initialFile={this.state.initialFile}
                    initialFiles={this.props.initialFiles}
                    updateFile={this.updateFile}
                    pages={this.props.pages}
                    showValidationModal= {this.props.showValidationModal}
                    onFilesError={this.props.onFilesError}
                    alertMsg={this.props.alertMsg}
                  />
                </div>
                <div className='col-1'>
                  <div style={{ minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)' }} />
                </div>
                <div className='col-5'>
                  <h4 style={{ marginLeft: '-50px' }}>Preview:</h4>
                  <div className='ui-block' style={{ border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '250px', marginLeft: '-50px' }} >
                    <div style={{ marginTop: '25%' }}>
                      <audio controls name='media' ref="audio">
                        <source src={this.state.file ? this.state.file.fileurl.url : ''} type='audio/mpeg' />
                      </audio>
                    </div>
                  </div>
                </div>

                <div className='col-6' style={{ marginTop: '-5vh' }}>
                  <div className='pull-right'>
                    <button onClick={this.closeModal} className='btn btn-primary' style={{ marginRight: '20px' }}
                   >
                      Cancel
                </button>
                    <button disabled={!this.state.file || this.state.disabled}  onClick={() => this.handleDone()} className='btn btn-primary'
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

export default AudioModal
