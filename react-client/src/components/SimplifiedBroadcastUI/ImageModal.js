/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import Image from './AddImage'

class ImageModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled: false,
      imgSrc: this.props.imgSrc ? this.props.imgSrc : null,
      file: this.props.file ? this.props.file : null
    }
    this.updateImage = this.updateImage.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateFile = this.updateFile.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  handleDone () {
    this.addComponent()
  }

  addComponent () {
    console.log('addComponent ImageModal')
    this.props.addComponent({
      id: this.props.id,
      componentType: 'image',
      file: this.state.file,
      fileurl: this.state.file ? this.state.file.fileurl : '',
      image_url: this.state.file ? this.state.file.image_url : ''}, this.props.edit)
  }

  updateImage (imgSrc) {
    this.setState({imgSrc, edited: true})
  }

  updateFile (file) {
    this.setState({file})
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
          <h3>Add Image Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6'>
              <h4>Image:</h4>
              <Image required updateFile={this.updateFile} updateImage={this.updateImage} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '60vh', marginLeft: '-50px'}} >
                <div className='ui-block' style={{margin: 'auto', marginTop: '100px'}} >
                  {
                      this.state.imgSrc &&
                      <img src={this.state.imgSrc} style={{maxWidth: '80%', maxHeight: '30vh', borderRadius: '10px'}} />
                  }
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button disabled={this.state.disabled || !this.state.file} onClick={() => this.handleDone()} className='btn btn-primary'>
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

export default ImageModal
