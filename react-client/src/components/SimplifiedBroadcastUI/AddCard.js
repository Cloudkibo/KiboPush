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
      buttons: props.card.component.buttons.map(button => button.type === 'element_share' ? {visible: true, title: 'Share'} : {visible: true, title: button.title}),
      buttonActions: ['open website', 'open webview', 'add share'],
      buttonLimit: 1,
      disabled: false,
      buttonDisabled: false,
      actionDisabled: false,
      imgSrc: props.card.component.image_url,
      webviewurl: props.card.component.webviewurl,
      elementUrl: props.card.component.elementUrl,
      webviewsize: props.card.component.webviewsize ? props.card.component.webviewsize : 'FULL',
      default_action: props.card.component.default_action ? props.card.component.default_action : null
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateStatus = this.updateStatus.bind(this)
    this.updateImage = this.updateImage.bind(this)
    this.updateFile = this.updateFile.bind(this)
    this.props.updateStatus({title: this.state.title, subtitle: this.state.subtitle})
  }

  updateFile (file) {
    this.setState({file}, () => {
      this.props.updateStatus({
        fileurl: this.state.file ? this.state.file.fileurl : '',
        image_url: this.state.file ? this.state.file.image_url : '',
        fileName: this.state.file ? this.state.file.fileName : '',
        type: this.state.file ? this.state.file.type : '',
        size: this.state.file ? this.state.file.size : ''
      })
    })
  }

  updateImage (image) {
    this.setState({imgSrc: image})
  }

  handleTitleChange (e) {
    this.setState({title: e.target.value}, () => {
      if (this.state.title === '') {
        this.updateStatus({disabled: true, title: this.state.title})
      } else {
        this.updateStatus({disabled: false, title: this.state.title})
      }
    })
  }

  handleSubtitleChange (e) {
    this.setState({subtitle: e.target.value}, () => {
      if (this.state.subtitle === '') {
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
      webviewsize: this.state.webviewsize,
      buttons
    }
    if (this.state.file) {
      card.fileurl = this.state.file.fileurl
      card.image_url = this.state.image_url
      card.fileName = this.state.file.fileName
      card.type = this.state.file.type
      card.size = this.state.file.size
    }
    if (this.state.webviewurl) {
      card.webviewurl = this.state.webviewurl
    }
    if (this.state.elementUrl) {
      card.elementUrl = this.state.elementUrl
    }
    this.props.addCard(card)
  }

  render () {
    return (
      <div className='ui-block' style={{transform: 'scale(0.9,0.9)', border: '1px solid rgba(0,0,0,.3)', borderRadius: '3px', minHeight: '300px', padding: '20px', marginTop: '-20px'}}>
        {(this.props.id !== 1 && this.props.id !== 2) && <div onClick={this.props.closeCard} style={{marginLeft: '100%', marginTop: '-10px', marginBottom: '15px', cursor: 'pointer'}}>❌</div>}
        <div>
          <h4 style={{textAlign: 'left'}}>Element #{this.props.id}</h4>
        </div>
        <hr style={{marginBottom: '30px'}} />
        <h4>Title:</h4>
        <input value={this.state.title} style={{marginBottom: '30px', maxWidth: '100%'}} onChange={this.handleTitleChange} className='form-control' />
        <h4>Subtitle:</h4>
        <input value={this.state.subtitle} style={{marginBottom: '30px', maxWidth: '100%'}} onChange={this.handleSubtitleChange} className='form-control' />
        <h4>Image:</h4>
        <Image
          imgSrc={this.state.imgSrc}
          file={this.state.file}
          updateFile={this.updateFile}
          updateImage={this.updateImage} />
        <AddButton
          buttons={this.state.buttons}
          finalButtons={this.props.buttons}
          pageId={this.props.pageId}
          buttonLimit={this.state.buttonLimit}
          buttonActions={this.state.buttonActions}
          ref={(ref) => { this.AddButton = ref }}
          updateButtonStatus={this.updateStatus}
          addComponent={(buttons) => this.addCard(buttons)} />
        <AddAction
          webviewurl={this.state.webviewurl}
          webviewsize={this.state.webviewsize}
          elementUrl={this.state.elementUrl}
          updateActionStatus={this.updateStatus} />
      </div>
    )
  }
}

export default AddCard
