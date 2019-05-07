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
      image_url: this.state.file ? this.state.file.image_url : ''})
  }

  updateImage (imgSrc) {
    this.setState({imgSrc})
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
              <h4>Image:</h4>
              <Image updateFile={this.updateFile} updateImage={this.updateImage} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '400px', marginLeft: '-50px'}} >
                <div className='ui-block' style={{maxWidth: '70%', margin: 'auto', marginTop: '100px'}} >
                  {
                      this.state.imgSrc &&
                      <img src={this.state.imgSrc} style={{maxHeight: '150px', border: '1px solid rgba(0,0,0,.1)'}} />
                  }
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='pull-right'>
                <button onClick={this.props.closeModal} className='btn btn-primary' style={{marginRight: '25px', marginLeft: '280px'}}>
                    Cancel
                </button>
                <button onClick={() => this.handleDone()} className='btn btn-primary'>
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

export default ImageModal
