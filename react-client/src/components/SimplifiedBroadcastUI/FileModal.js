/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import AddFile from './AddFile'
import { deleteFile } from '../../utility/utils'

class FileModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: false,
      file: this.props.file ? this.props.file : '',
      initialFile: this.props.file ? this.props.file.fileurl.id : null
    }
    this.updateFile = this.updateFile.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  handleDone() {
    this.addComponent()
  }

  //   'file': {
  //     component: (<File id={componentId} pages={this.props.pages} key={componentId} file={broadcast.fileurl ? broadcast : null} handleFile={this.handleFile} onRemove={this.removeComponent} buttonActions={this.props.buttonActions} replyWithMessage={this.props.replyWithMessage} />),
  //     handler: () => { this.handleFile({id: componentId, componentType: 'file', fileurl: ''}) }
  //   },

  addComponent() {
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
    console.log('addComponent FileModal')
    this.props.addComponent({
      id: this.props.id,
      componentType: 'file',
      componentName: 'file',
      file: this.state.file ? this.state.file : ''
    }, this.props.edit)
  }

  updateFile(file) {
    this.props.setTempFiles([file.fileurl.id])
    this.setState({ file, edited: true })
  }

  closeModal() {
    if (!this.state.edited) {
      this.props.closeModal()
    } else {
      this.props.showCloseModalAlertDialog()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: false,
      file: nextProps.file ? nextProps.file : ''
    })
  }

  render() {
    return (
      <div className="modal-content" style={{width: '72vw'}}>
        <div style={{ display: 'block' }} className="modal-header">
          <h5 className="modal-title" id="exampleModalLabel">
            Add File Component
									</h5>
          <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" onClick={this.closeModal} className="close" aria-label="Close">
            <span aria-hidden="true">
              &times;
											</span>
          </button>
        </div>
        <div style={{ color: 'black' }} className="modal-body">
          <div className='row'>
            <div className='col-6'>
              <h4>File:</h4>
              <AddFile 
                required 
                initialFile={this.state.initialFile}
                initialFiles={this.props.initialFiles}
                file={this.state.file} 
                updateFile={this.updateFile} 
                module={this.props.module} 
              />
            </div>
            <div className='col-1'>
              <div style={{ minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)' }} />
            </div>
            <div className='col-5'>
              <h4 style={{ marginLeft: '-50px' }}>Preview:</h4>
              <div className='ui-block' style={{ border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '250px', marginLeft: '-50px' }} >
                <div className='discussion'>
                  <div className='bubble recipient' style={{ marginRight: '120px', marginTop: '100px', fontSize: '20px' }}>
                    <span role='img' aria-label='file'>📁</span> <a href={this.state.file ? this.state.file.fileurl.url : null} target='_blank' rel='noopener noreferrer' download>{this.state.file ? this.state.file.fileName : 'File'}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-6' style={{ marginTop: '-5vh' }}>
              <div className='pull-right'>
              <button onClick={this.closeModal} className='btn btn-primary' style={{ marginRight: '20px' }}
                >
                  Cancel
                </button>
                <button disabled={!this.state.file} onClick={() => this.handleDone()} className='btn btn-primary'
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

export default FileModal
