import React from 'react'
import PropTypes from 'prop-types'
import CARD from './card'

class Gallery extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeCard: 1
    }
    this.addCard = this.addCard.bind(this)
    this.removeCard = this.removeCard.bind(this)
    this.updateCard = this.updateCard.bind(this)
    this.uploadImage = this.uploadImage.bind(this)
    this.scrollToBottom = this.scrollToBottom.bind(this)
    this.updateActiveCard = this.updateActiveCard.bind(this)
  }

  updateActiveCard (index) {
    let data = this.props.componentData
    data.activeCard = index
    this.props.updateBroadcastData(this.props.blockId, this.props.componentData.id, 'update', data)
  }

  updateCard (key, value, index) {
    let data = this.props.componentData
    switch (key) {
      case 'title':
        data.cards[index].title = value
        break
      case 'subtitle':
        data.cards[index].subtitle = value
        break
      case 'image':
        data.cards[index].fileurl = value.fileurl
        data.cards[index].image_url = value.fileurl.url
        data.cards[index].fileName = value.fileName
        data.cards[index].size = value.size
        data.cards[index].type = value.type
        break
      case 'buttons':
        data.cards[index].buttons = value
        break
      default:
        return null
    }
    this.props.updateBroadcastData(this.props.blockId, this.props.componentData.id, 'update', data)
  }

  uploadImage (file, index, handleImageUpload) {
    var fileData = new FormData()
    fileData.append('file', file)
    fileData.append('filename', file.name)
    fileData.append('filetype', file.type)
    fileData.append('filesize', file.size)
    fileData.append('pages', JSON.stringify([this.props.page._id]))
    fileData.append('componentType', 'image')
    var fileInfo = {
      fileName: file.name,
      type: file.type,
      size: file.size,
      cardIndex: index
    }
    this.props.uploadAttachment(fileData, fileInfo, handleImageUpload)
  }

  addCard () {
    this.props.componentData.cards.push({
        buttons: [],
        fileName: '',
        image_url: '',
        title: '',
        subtitle: ''
    })
    const data = this.props.componentData
    data.activeCard = this.props.componentData.cards.length - 1
    this.setState({activeCard: data.cards.length}, () => {
      setTimeout(this.scrollToBottom, 1)
    })
    this.props.updateBroadcastData(this.props.blockId, this.props.componentData.id, 'update', data)
  }

  removeCard (index) {
    const data = this.props.componentData
    if (data.activeCard >= index) {
      data.activeCard = data.activeCard === 0 ? data.activeCard : data.activeCard - 1
    }
    data.cards.splice(index, 1)
    this.setState({activeCard: data.cards.length})
    this.props.updateBroadcastData(this.props.blockId, this.props.componentData.id, 'update', data)
  }

  scrollToBottom () {
    console.log('scrollToBottom called in gallery')
    if (this.bottom) {
      this.bottom.scrollIntoView({behavior: 'smooth', block: 'end'})
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('componentWillRecieveProps of gallery side panel called ', nextProps)
    // if (nextProps.componentData) {
    //   this.setState({text: nextProps.componentData.text})
    // }
  }

  render () {
    console.log('props in gallery side panel', this.props)
    return (
      <div id='side_panel_gallery_component'>
        <div id='dynamic_height_sidepanel' style={{maxHeight: '525px', overflow: 'scroll'}}>
          {
            this.props.componentData.cards.map((card, index) => (
              <CARD
                card={card}
                id={index + 1}
                activeCard={this.state.activeCard}
                updateCard={this.updateCard}
                uploadImage={this.uploadImage}
                showErrorMessage={this.props.showErrorMessage}
                removeCard={this.removeCard}
                showRemove={this.props.componentData.cards.length < 2 ? false : true}
                updateActiveCard={this.updateActiveCard}
                insertButton={this.props.insertButton}
                editButton={this.props.editButton}
                alertMsg={this.props.alertMsg}
              />
            ))
          }
          <div style={{float: 'left', clear: 'both'}}
            ref={(el) => { this.bottom = el }} />
        </div>
        {
          this.props.componentData.cards.length < 10 &&
          <div style={{marginRight: '7px'}} className='card'>
            <button onClick={this.addCard} type="button" className="btn btn-secondary">
              + Add New Card
    				</button>
          </div>
        }
      </div>
    )
  }
}

Gallery.propTypes = {
  'updateBroadcastData': PropTypes.func.isRequired,
  'blockId': PropTypes.number.isRequired,
  'componentData': PropTypes.object.isRequired,
  'uploadAttachment': PropTypes.func.isRequired,
  'showErrorMessage': PropTypes.func.isRequired,
  'insertButton': PropTypes.func.isRequired,
  'editButton': PropTypes.func.isRequired
}

export default Gallery
