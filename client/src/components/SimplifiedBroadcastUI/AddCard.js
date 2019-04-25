import React from 'react'

import AddButton from './AddButton'
import Image from './Image'
import Card from '../../containers/convo/CardList'

class AddCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      file: null,
      title: this.props.title,
      subtitle: this.props.subtitle,
      buttons: [],
      buttonActions: ['open website', 'open webview', 'add share'],
      buttonLimit: this.props.buttonLimit
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleSubtitleChange = this.handleSubtitleChange.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.updateButtonStatus = this.updateButtonStatus.bind(this)
    this.updateImage = this.updateImage.bind(this)
  }

//   'list': {
//     component: (<List id={componentId} pageId={this.state.pageId} pages={this.props.pages} key={componentId} list={broadcast} cards={broadcast.listItems} handleList={this.handleList} onRemove={this.removeComponent} buttonActions={this.props.buttonActions} replyWithMessage={this.props.replyWithMessage} default_action={this.props.default_action} />),
//     handler: () => { this.handleList({id: componentId, componentType: 'list', listItems: [], topElementStyle: 'compact'}) }
//   }

// this.props.handleCard({id: this.props.id,
//     componentType: 'card',
//     fileurl: this.state.fileurl,
//     image_url: this.state.image_url,
//     fileName: this.state.fileName,
//     type: this.state.type,
//     size: this.state.size,
//     title: this.state.title,
//     description: this.state.subtitle,
//     buttons: this.state.buttons,
//     default_action: defaultAction
//   })

//   updateCard () {
//     if (this.state.webviewurl !== '') {
//       this.props.checkWhitelistedDomains({pageId: this.props.pageId, domain: this.state.webviewurl}, this.handleWebView)
//     } else if (this.state.elementUrl !== '') {
//       let defaultAction
//       defaultAction = {
//         type: 'web_url', url: this.state.elementUrl
//       }
//       this.setState({
//         defaultAction: defaultAction
//       })
//       this.props.handleCard({id: this.props.id,
//         componentType: 'card',
//         fileurl: this.state.fileurl,
//         image_url: this.state.image_url,
//         fileName: this.state.fileName,
//         type: this.state.type,
//         size: this.state.size,
//         title: this.state.title,
//         description: this.state.subtitle,
//         buttons: this.state.buttons,
//         default_action: defaultAction
//       })
//       if (this.state.checkbox) {
//         this.props.topElementStyle('LARGE')
//       } else {
//         this.props.topElementStyle('compact')
//       }
//     }
//     if (this.state.openWebView === false) {
//       this.setState({
//         openPopover: false
//       })
//     }
//   }

  updateImage (image, file) {
    // this.setState({imgSrc: image, file})
    this.props.updateStatus({imgSrc: image, file})
  }

  handleTitleChange (e) {
    this.setState({title: e.target.value}, () => {
      if (this.state.title === '') {
        // this.setState({disabled: true})
        this.props.updateStatus({disabled: true})
      } else {
        // this.setState({disabled: false})
        this.props.updateStatus({disabled: false})
      }
    })
  }

  handleSubtitleChange (e) {
    this.setState({subtitle: e.target.value}, () => {
      if (this.state.subtitle === '') {
        // this.setState({disabled: true})
        this.props.updateStatus({disabled: true})
      } else {
        // this.setState({disabled: false})
        this.props.updateStatus({disabled: false})
      }
    })
  }

  updateButtonStatus (status) {
    // this.setState(status)
    this.props.updateStatus(status)
  }

  handleDone () {
    this.AddButton.handleDone()
  }

  addCard (buttons) {
    // <Card pages={this.props.pages} pageId={this.props.pageId} replyWithMessage={this.props.replyWithMessage} id={k + 1} buttonActions={this.props.buttonActions} button_id={this.props.id} buttons={this.props.cards[k].buttons} cardDetails={this.props.cards[k]} handleCard={this.handleCard} topElementStyle={this.topElementStyle} removeElement={this.removeElement} topStyle={this.props.list.topElementStyle} />
    this.props.addCard({
      id: this.props.id,
      fileurl: this.state.file ? this.state.file.fileurl : '',
      image_url: this.state.file ? this.state.file.image_url : '',
      fileName: this.state.file ? this.state.file.fileName : '',
      type: this.state.file ? this.state.file.type : '',
      size: this.state.file ? this.state.file.size : '',
      title: this.state.title,
      description: this.state.subtitle,
      buttons})
  }

  render () {
    return (
      <div className='col-6'>
        <h4>Title:</h4>
        <input value={this.state.title} style={{marginBottom: '30px', maxWidth: '100%'}} onChange={this.handleTitleChange} className='form-control' />
        <h4>Subtitle:</h4>
        <input value={this.state.subtitle} style={{marginBottom: '30px', maxWidth: '100%'}} onChange={this.handleSubtitleChange} className='form-control' />
        <h4>Image:</h4>
        <Image updateImage={this.updateImage} />
        <AddButton buttonLimit={this.state.buttonLimit} buttonActions={this.state.buttonActions} ref={(ref) => { this.AddButton = ref }} updateButtonStatus={this.updateButtonStatus} addComponent={(buttons) => this.addCard(buttons)} />
      </div>
    )
  }
}

export default AddCard
