import React from 'react'

import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AddButton from './AddButton'
import Image from './AddImage'
import AddAction from './AddAction'

class CardModal extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: this.props.file ? this.props.file : null,
      title: props.title ? props.title : 'Card Title',
      subtitle: props.subtitle ? props.subtitle : 'Card Subtitle',
      buttons: props.buttons.map(button => button.type === 'element_share' ? {visible: true, title: 'Share'} : {visible: true, title: button.title}),
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview', 'add share'],
      buttonLimit: 3,
      disabled: false,
      buttonDisabled: false,
      actionDisabled: false,
      imgSrc: props.imgSrc ? props.imgSrc : null,
      webviewsize: props.webviewsize ? props.webviewsize : 'FULL',
      webviewurl: props.webviewurl ? props.webviewurl : '',
      elementUrl: props.elementUrl ? props.elementUrl : '',
      default_action: props.default_action ? props.default_action : ''
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.updateImage = this.updateImage.bind(this)
    this.updateFile = this.updateFile.bind(this)
  }

  updateImage (image) {
    this.setState({imgSrc: image})
  }

  updateFile (file) {
    this.setState({file})
  }

  handleTitleChange (e) {
    this.setState({title: e.target.value}, () => {
      if (this.state.title === '') {
        this.setState({disabled: true})
      } else {
        this.setState({disabled: false})
      }
    })
  }

  handleSubtitleChange (e) {
    this.setState({subtitle: e.target.value}, () => {
      if (this.state.subtitle === '') {
        this.setState({disabled: true})
      } else {
        this.setState({disabled: false})
      }
    })
  }

  updateStatus (status) {
    this.setState(status)
  }

  handleDone () {
    this.AddButton.handleDone()
  }

  addComponent (buttons) {
    console.log('addComponent CardModal')
    this.props.addComponent({
      id: this.props.id,
      componentType: 'card',
      file: this.state.file ? this.state.file : null,
      fileurl: this.state.file ? this.state.file.fileurl : '',
      image_url: this.state.file ? this.state.file.image_url : '',
      fileName: this.state.file ? this.state.file.fileName : '',
      type: this.state.file ? this.state.file.type : '',
      size: this.state.file ? this.state.file.size : '',
      title: this.state.title,
      description: this.state.subtitle,
      webviewurl: this.state.webviewurl,
      elementUrl: this.state.elementUrl,
      webviewsize: this.state.webviewsize,
      default_action: this.state.default_action,
      buttons})
  }

  render () {
    let visibleButtons = this.state.buttons.filter(button => button.visible)
    return (
      <ModalContainer style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
        onClose={this.props.closeModal}>
        <ModalDialog style={{width: '900px', left: '45vh', top: '82px', cursor: 'default'}}
          onClose={this.props.closeModal}>
          <h3>Add Card Component</h3>
          <hr />
          <div className='row'>
            <div className='col-6' style={{maxHeight: '500px', overflowY: 'scroll'}}>
              <h4>Title:</h4>
              <input value={this.state.title} style={{maxWidth: '100%', borderColor: this.state.title === '' ? 'red' : ''}} onChange={this.handleTitleChange} className='form-control' />
              <div style={{marginBottom: '30px', color: 'red'}}>{this.state.title === '' ? '*Required' : ''}</div>
              <h4>Subtitle:</h4>
              <input value={this.state.subtitle} style={{maxWidth: '100%', borderColor: this.state.subtitle === '' ? 'red' : ''}} onChange={this.handleSubtitleChange} className='form-control' />
              <div style={{marginBottom: '30px', color: 'red'}}>{this.state.subtitle === '' ? '*Required' : ''}</div>
              <h4>Image:</h4>
              <Image
                required
                imgSrc={this.state.imgSrc}
                file={this.state.file}
                updateFile={this.updateFile}
                updateImage={this.updateImage} />
              <AddButton
                required
                buttons={this.state.buttons}
                finalButtons={this.props.buttons}
                pageId={this.props.pageId}
                buttonLimit={this.state.buttonLimit}
                buttonActions={this.state.buttonActions}
                ref={(ref) => { this.AddButton = ref }}
                updateButtonStatus={this.updateStatus}
                addComponent={(buttons) => this.addComponent(buttons)} />
              <AddAction
                default_action={this.state.default_action}
                webviewurl={this.state.webviewurl}
                webviewsize={this.state.webviewsize}
                elementUrl={this.state.elementUrl}
                updateActionStatus={this.updateStatus} />
            </div>
            <div className='col-1'>
              <div style={{minHeight: '100%', width: '1px', borderLeft: '1px solid rgba(0,0,0,.1)'}} />
            </div>
            <div className='col-5'>
              <h4 style={{marginLeft: '-50px'}}>Preview:</h4>
              <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '3px', minHeight: '490px', marginLeft: '-50px'}} >
                <div className='ui-block' style={{border: '1px solid rgba(0,0,0,.1)', borderRadius: '10px', minHeight: '200px', maxWidth: '250px', margin: 'auto', marginTop: '100px'}} >
                  {
                      this.state.imgSrc &&
                      <img src={this.state.imgSrc} style={{maxHeight: '130px', minWidth: '250px', padding: '25px', margin: '-25px'}} />
                  }
                  <hr style={{marginTop: this.state.imgSrc ? '' : '100px', marginBottom: '5px'}} />
                  <h6 style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '16px'}}>{this.state.title}</h6>
                  <p style={{textAlign: 'justify', marginLeft: '10px', marginTop: '10px', fontSize: '13px'}}>{this.state.subtitle}</p>

                  {
                      this.state.buttons.map(button => {
                        if (button.visible) {
                          return (
                            <div>
                              <hr />
                              <h5 style={{color: '#0782FF'}}>{button.title}</h5>
                            </div>
                          )
                        }
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
                <button disabled={this.state.disabled || this.state.buttonDisabled || this.state.actionDisabled || !this.state.file || visibleButtons.length <= 0} onClick={() => this.handleDone()} className='btn btn-primary'>
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

export default CardModal
