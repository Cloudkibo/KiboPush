/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import File from './File'

class ImageModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled: false,
      file: null
    }
    this.updateFile = this.updateFile.bind(this)
    this.handleDone = this.handleDone.bind(this)
  }

  handleDone () {
    this.addComponent()
  }

//   'file': {
//     component: (<File id={componentId} pages={this.props.pages} key={componentId} file={broadcast.fileurl ? broadcast : null} handleFile={this.handleFile} onRemove={this.removeComponent} buttonActions={this.props.buttonActions} replyWithMessage={this.props.replyWithMessage} />),
//     handler: () => { this.handleFile({id: componentId, componentType: 'file', fileurl: ''}) }
//   },

  addComponent () {
    console.log('addComponent ImageModal')
    this.props.addComponent({componentType: 'file',
      fileurl: this.state.file ? this.state.file.fileurl : ''})
  }

  updateFile (file) {
    this.setState({file})
  }

  render () {
    return (
      <ModalContainer style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
          onClose={this.props.closeModal}>
          <h3>Add Image Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h4>File:</h4>
              <File updateFile={this.updateFile} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '250px', marginLeft: '-50px'}} >
                <section className='discussion'>
                  <div className='bubble recipient' style={{marginRight: '120px', marginTop: '100px', fontSize: '20px'}}> 📁 <u>{this.state.file ? this.state.file.fileName : 'File'}</u></div>
                </section>
              </div>
            </div>

            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.props.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={!this.state.file} onClick={() => this.handleDone()} className='btn btn-primary'>
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

export default ImageModal
