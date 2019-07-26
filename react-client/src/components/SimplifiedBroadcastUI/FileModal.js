/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddFile from './AddFile'

class FileModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled: false,
      file: this.props.file ? this.props.file : ''
    }
    this.updateFile = this.updateFile.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  handleDone () {
    this.addComponent()
  }

//   'file': {
//     component: (<File id={componentId} pages={this.props.pages} key={componentId} file={broadcast.fileurl ? broadcast : null} handleFile={this.handleFile} onRemove={this.removeComponent} buttonActions={this.props.buttonActions} replyWithMessage={this.props.replyWithMessage} />),
//     handler: () => { this.handleFile({id: componentId, componentType: 'file', fileurl: ''}) }
//   },

  addComponent () {
    console.log('addComponent FileModal')
    this.props.addComponent({
      id: this.props.id,
      componentType: 'file',
      file: this.state.file ? this.state.file : ''}, this.props.edit)
  }

  updateFile (file) {
    this.setState({file, edited: true})
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
      <ModalContainer style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
        onClose={this.closeModal}>
        <ModalDialog style={{width: '72vw', maxHeight: '85vh', left: '25vw', top: '12vh', cursor: 'default'}}
          onClose={this.closeModal}>
          <h3>Add File Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h4>File:</h4>
              <AddFile required file={this.state.file} updateFile={this.updateFile} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '250px', marginLeft: '-50px'}} >
                <div className='discussion'>
                  <div className='bubble recipient' style={{marginRight: '120px', marginTop: '100px', fontSize: '20px'}}>
                  📁 <a href={this.state.file ? this.state.file.fileurl.url : null} target='_blank' download>{this.state.file ? this.state.file.fileName : 'File'}</a>
                  </div>
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

    )
  }
}

export default FileModal
