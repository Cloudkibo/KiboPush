import React from 'react'

import AddButton from './AddButton'
import Image from './AddImage'
import AddAction from './AddAction'

class AddCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: props.card.component.fileurl ? {
        fileurl: props.card.component.fileurl,
        image_url: props.card.component.image_url,
        fileName: props.card.component.fileName,
        type: props.card.component.type,
        size: props.card.component.size
      } : null,
      title: props.card.component.title,
      subtitle: props.card.component.description ? props.card.component.description : props.card.component.subtitle,
      buttons: props.card.component.buttons.map(button => button.type ? {visible: true, title: button.title} : {visible: button.visible, title: button.title}),
      buttonActions: this.props.buttonActions ? this.props.buttonActions : ['open website', 'open webview'],
      buttonLimit: this.props.buttonLimit ? this.props.buttonLimit : 1,
      disabled: false,
      buttonDisabled: false,
      actionDisabled: false,
      imgSrc: props.card.component.image_url,
      webviewurl: props.card.component.webviewurl,
      elementUrl: props.card.component.elementUrl,
      webviewsize: props.card.component.webviewsize ? props.card.component.webviewsize : 'FULL',
      default_action: props.card.component.default_action ? props.card.component.default_action : null
    }
    this.titleId = `card${this.props.id}-title`
    this.subtitleId = `card${this.props.id}-subtitle`
    this.imageId = `card${this.props.id}-image`
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.updateImage = this.updateImage.bind(this)
    this.updateFile = this.updateFile.bind(this)
    this.inputSelected = this.inputSelected.bind(this)
    //this.props.updateStatus({title: this.state.title, subtitle: this.state.subtitle})
    console.log('AddCard constructor state', this.state)
    console.log('AddCard constructor props', this.props)
  }

  inputSelected (e, elementId) {
    console.log(`${elementId} selected`)
    document.getElementById(elementId).scrollIntoView({ behavior: 'smooth' })
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    let newState = {
      file: nextProps.card.component.fileurl ? {
      fileurl: nextProps.card.component.fileurl,
      image_url: nextProps.card.component.image_url,
      fileName: nextProps.card.component.fileName,
      type: nextProps.card.component.type,
      size: nextProps.card.component.size
      } : null,
      title: nextProps.card.component.title,
      subtitle: nextProps.card.component.description ? nextProps.card.component.description : nextProps.card.component.subtitle,
      buttons: nextProps.card.component.buttons.map(button => button.type ? {visible: true, title: button.title} : {visible: button.visible, title: button.title}),
      buttonActions: nextProps.buttonActions ? nextProps.buttonActions : ['open website', 'open webview'],
      buttonLimit: nextProps.buttonLimit ? nextProps.buttonLimit : 1,
      disabled: false,
      buttonDisabled: false,
      actionDisabled: false,
      imgSrc: nextProps.card.component.image_url,
      webviewurl: nextProps.card.component.webviewurl,
      elementUrl: nextProps.card.component.elementUrl,
      webviewsize: nextProps.card.component.webviewsize ? nextProps.card.component.webviewsize : 'FULL',
      default_action: nextProps.card.component.default_action ? nextProps.card.component.default_action : null
    }
    console.log('AddCard newState', newState)
    this.setState(newState)
  }

  updateFile (file) {
    this.setState({file}, () => {
      let data = {
        fileurl: this.state.file ? this.state.file.fileurl : '',
        image_url: this.state.file ? this.state.file.image_url : '',
        fileName: this.state.file ? this.state.file.fileName : '',
        type: this.state.file ? this.state.file.type : '',
        size: this.state.file ? this.state.file.size : ''
      }
      if (this.state.title === '' || this.state.subtitle === '' ||
        (this.props.onlyCard && !this.state.file)) {
          data.disabled = true
        } else {
          data.disabled = false
        }
        this.props.updateStatus(data)
    })
  }

  updateImage (image) {
    this.setState({imgSrc: image})
  }

  handleTitleChange (e) {
    this.setState({title: e.target.value}, () => {
      if (this.state.title === '' || this.state.subtitle === '' ||
        (this.props.onlyCard && !this.state.file)) {
        this.updateStatus({disabled: true, title: this.state.title})
      } else {
          this.updateStatus({disabled: false, title: this.state.title})
      }
    })
  }

  handleSubtitleChange (e) {
    this.setState({subtitle: e.target.value}, () => {
      if (this.state.subtitle === '' || this.state.tile === ''||
      (this.props.onlyCard && !this.state.file)) {
        this.updateStatus({disabled: true, subtitle: this.state.subtitle})
      } else {
        this.updateStatus({disabled: false, subtitle: this.state.subtitle})
      }
    })
  }

  updateStatus (status) {
    console.log('AddCard updateStatus', status)
    this.setState(status)
    this.props.updateStatus(status)
  }

  handleDone () {
    this.AddButton.handleDone()
  }

  addCard (buttons) {
    console.log('addCard buttons in AddCard', buttons)
    let card = {
      id: this.props.id,
      title: this.state.title,
      subtitle: this.state.subtitle,
      buttons
    }
    if (this.state.file) {
      card.image_url = this.state.file.image_url
    } else {
      card.image_url = ''
    }
    if (this.state.webviewurl || this.state.elementUrl) {
      card.default_action = this.state.default_action
    }
    this.props.addCard(card)
  }

  render () {
    return (
      <div>
        <div className='ui-block' style={{padding: '5px'}}>
          {/* <div>
            <h4 style={{textAlign: 'left'}}>{this.props.cardComponent ? 'Card ' : 'Element '} #{this.props.index+1}</h4>
          </div>
          <hr style={{marginBottom: '30px'}} /> */}
          <div className='row'>
            <div className='col-3'>
              <h5 style={{marginTop: '5px'}} id={this.titleId}>Title:</h5>
            </div>
            <div className='col-9'>
              <input onSelect={(e) => this.inputSelected(e, this.titleId)} placeholder={'Please type here...'} value={this.state.title} style={{maxWidth: '100%', borderColor: this.state.title === '' ? 'red' : ''}} onChange={this.handleTitleChange} className='form-control' />
              <div style={{marginBottom: '30px', color: 'red', textAlign: 'left'}}>{this.state.title === '' ? '*Required' : ''}</div>
            </div>
          </div>

          <div className='row'>
            <div className='col-3'>
              <h5 style={{marginTop: '5px'}} id={this.subtitleId}>Subtitle:</h5>
            </div>
            <div className='col-9'>
              <input onSelect={(e) => this.inputSelected(e, this.subtitleId)} placeholder={'Please type here...'} value={this.state.subtitle} style={{maxWidth: '100%', borderColor: this.state.subtitle === '' ? 'red' : ''}} onChange={this.handleSubtitleChange} className='form-control' />
              <div style={{marginBottom: '30px', color: 'red', textAlign: 'left'}}>{this.state.subtitle === '' ? '*Required' : ''}</div>
            </div>
          </div>
          {/* <h4 id={this.titleId}>Title:</h4>
          <input onSelect={(e) => this.inputSelected(e, this.titleId)} placeholder={'Please type here...'} value={this.state.title} style={{maxWidth: '100%', borderColor: this.state.title === '' ? 'red' : ''}} onChange={this.handleTitleChange} className='form-control' /> */}
          {/* <div style={{marginBottom: '30px', color: 'red', textAlign: 'left'}}>{this.state.title === '' ? '*Required' : ''}</div> */}
          {/* <h4 id={this.subtitleId}>Subtitle:</h4>
          <input onSelect={(e) => this.inputSelected(e, this.subtitleId)} placeholder={'Please type here...'} value={this.state.subtitle} style={{maxWidth: '100%', borderColor: this.state.subtitle === '' ? 'red' : ''}} onChange={this.handleSubtitleChange} className='form-control' />
          <div style={{marginBottom: '30px', color: 'red', textAlign: 'left'}}>{this.state.subtitle === '' ? '*Required' : ''}</div> */}
          <h5 style={{textAlign: 'left', marginLeft: '5px', marginBottom: '10px'}} id={this.imageId}>Image:</h5>
          <Image
            imageId={this.imageId}
            onSelect={(e) => this.inputSelected(e, this.imageId)}
            edit={this.props.edit}
            required={this.props.onlyCard}
            imgSrc={this.state.imgSrc}
            file={this.state.file}
            updateFile={this.updateFile}
            updateImage={this.updateImage} />
          <AddButton
            cardId={this.props.id}
            edit={this.props.edit}
            required={this.props.onlyCard}
            replyWithMessage={this.props.replyWithMessage}
            buttons={this.state.buttons}
            finalButtons={this.props.card.component.buttons}
            pageId={this.props.pageId}
            buttonLimit={this.state.buttonLimit}
            buttonActions={this.state.buttonActions}
            ref={(ref) => { this.AddButton = ref }}
            updateButtonStatus={this.updateStatus}
            toggleGSModal={this.props.toggleGSModal}
            closeGSModal={this.props.closeGSModal}
            addComponent={(buttons) => this.addCard(buttons)}
            disabled={this.props.disabled}
            />
          <AddAction
            edit={this.props.edit}
            default_action={this.state.default_action}
            webviewurl={this.state.webviewurl}
            webviewsize={this.state.webviewsize}
            elementUrl={this.state.elementUrl}
            updateActionStatus={this.updateStatus} />
        </div>
      </div>
    )
  }
}

export default AddCard
