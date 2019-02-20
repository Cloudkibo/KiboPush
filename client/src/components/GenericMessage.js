/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Image from '../containers/convo/Image'
import List from '../containers/convo/List'
import Video from '../containers/convo/Video'
import Audio from '../containers/convo/Audio'
import File from '../containers/convo/File'
import Text from '../containers/convo/Text'
import Card from '../containers/convo/Card'
import Gallery from '../containers/convo/Gallery'
import Media from '../containers/convo/Media'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'
import DragSortableList from 'react-drag-sortable'
import GenericMessageComponents from './GenericMessageComponents'
import PropTypes from 'prop-types'

class GenericMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    let hiddenComponents = this.props.hiddenComponents.map(component => component.toLowerCase())
    this.state = {
      list: [],
      broadcast: [],
      isShowingModal: false,
      convoTitle: this.props.convoTitle,
      pageId: '',
      hiddenComponents: hiddenComponents
    }
    this.reset = this.reset.bind(this)
    this.showResetAlertDialog = this.showResetAlertDialog.bind(this)
    this.closeResetAlertDialog = this.closeResetAlertDialog.bind(this)
    this.handleMedia = this.handleMedia.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleList = this.handleList.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.newConvo = this.newConvo.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
    this.addComponent = this.addComponent.bind(this)
    if (props.setReset) {
      props.setReset(this.reset)
    }
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  reset (showDialog = true) {
    if (showDialog) {
      this.showResetAlertDialog()
    } else {
      this.newConvo()
    }
  }

  showResetAlertDialog () {
    if (this.state.broadcast.length > 0 || this.state.list.length > 0) {
      this.setState({isShowingModalResetAlert: true})
    }
  }

  closeResetAlertDialog () {
    this.setState({isShowingModalResetAlert: false})
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  renameTitle () {
    console.log('in renameTitle')
    if (this.titleConvo.value === '') {
      return
    }
    console.log('renaming title')
    this.setState({convoTitle: this.titleConvo.value})
    this.closeDialog()
    this.props.handleChange({convoTitle: this.titleConvo.value})
  }

  handleText (obj) {
    console.log('handleText', obj)
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].text = obj.text
        if (obj.button.length > 0) {
          temp[i].buttons = obj.button
        } else {
          delete temp[i].buttons
        }
        isPresent = true
      }
    })

    if (!isPresent) {
      if (obj.button.length > 0) {
        temp.push({id: obj.id, text: obj.text, componentType: 'text', buttons: obj.button})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text'})
      }
    }

    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp})
  }

  handleCard (obj) {
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
      }
      return
    }
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].fileurl = obj.fileurl
        temp[i].image_url = obj.image_url
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].title = obj.title
        temp[i].buttons = obj.buttons
        temp[i].description = obj.description
        if (obj.default_action && obj.default_action !== '') {
          temp[i].default_action = obj.default_action
        } else if (temp[i].default_action) {
          delete temp[i].default_action
        }
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp})
  }

  handleMedia (obj) {
    if (obj.error) {
      if (obj.error === 'invalid image') {
        this.msg.error('Please select an image of type jpg, gif, bmp or png')
        return
      }
      if (obj.error === 'file size error') {
        this.msg.error('File size cannot exceed 25MB')
        return
      }
      if (obj.error === 'invalid file') {
        this.msg.error('File is not valid')
        return
      }
    }
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].mediaType = obj.mediaType
        temp[i].fileurl = obj.fileurl
        temp[i].image_url = obj.image_url
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].buttons = obj.buttons
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp})
  }

  handleGallery (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    if (obj.cards) {
      obj.cards.forEach((d) => {
        delete d.id
      })
    }
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].cards = obj.cards
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp})
  }

  handleImage (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    this.props.handleChange(temp)
  }

  handleFile (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i] = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }
    this.props.handleChange({broadcast: temp})
    // this.setState({broadcast: temp})
  }
  handleList (obj) {
    console.log('in create convo handleList', obj)
    var temp = this.state.broadcast
    var isPresent = false
    obj.listItems.forEach((d) => {
      delete d.id
    })
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].listItems = obj.listItems
        temp[i].topElementStyle = obj.topElementStyle
        temp[i].buttons = obj.buttons
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
    this.props.handleChange({broadcast: temp})
  }

  removeComponent (obj) {
    console.log('obj in removeComponent', obj)
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    console.log('temp', temp)
    console.log('temp2', temp2)
    this.setState({list: temp, broadcast: temp2})
    this.props.handleChange({broadcast: temp2, list: temp})
  }

  newConvo () {
    this.setState({broadcast: [], list: []})
    this.props.handleChange({broadcast: [], list: []})
  }

  addComponent (componentType) {
    let timeStamp = new Date().getTime()
    var temp = this.state.list
    let components = {
      'Text': (<Text id={timeStamp} pageId={this.state.pageId} key={timeStamp} handleText={this.handleText} onRemove={this.removeComponent} removeState />),
      'Image': (<Image id={timeStamp} pages={this.props.location.state.pages} key={timeStamp} handleImage={this.handleImage} onRemove={this.removeComponent} />),
      'Card': (<Card id={timeStamp} pageId={this.state.pageId} pages={this.props.location.state.pages} key={timeStamp} handleCard={this.handleCard} onRemove={this.removeComponent} singleCard />),
      'Gallery': (<Gallery id={timeStamp} pageId={this.state.pageId} pages={this.props.location.state.pages} key={timeStamp} handleGallery={this.handleGallery} onRemove={this.removeComponent} />),
      'Audio': (<Audio id={timeStamp} pages={this.props.location.state.pages} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />),
      'Video': (<Video id={timeStamp} pages={this.props.location.state.pages} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />),
      'File': (<File id={timeStamp} pages={this.props.location.state.pages} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />),
      'List': (<List id={timeStamp} pageId={this.state.pageId} pages={this.props.location.state.pages} key={timeStamp} handleList={this.handleList} onRemove={this.removeComponent} />),
      'Media': (<Media id={timeStamp} pageId={this.state.pageId} pages={this.props.location.state.pages} key={timeStamp} handleMedia={this.handleMedia} onRemove={this.removeComponent} />)
    }
    this.msg.info(`New ${componentType} Component Added`)
    this.setState({list: [...temp, {content: components[componentType]}]})
    this[`handle${componentType}`]({id: timeStamp, text: '', button: []})
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (<div className='m-grid__item m-grid__item--fluid m-wrapper'>
      <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
      <div style={{float: 'left', clear: 'both'}}
        ref={(el) => { this.top = el }} />
      <div className='m-content'>
        <div className='row'>
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <div className='row'>
              <div className='col-12'>
                <div className='row'>
                  <GenericMessageComponents hiddenComponents={this.state.hiddenComponents} addComponent={this.addComponent} />
                  <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                    <StickyDiv zIndex={1}>
                      <div style={{border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea'}} className='ui-block'>
                        <div style={{padding: '5px'}}>
                          {!this.props.titleEditable
                                ? <h3> {this.state.convoTitle} </h3>
                                : <h3>{this.state.convoTitle} <i onClick={this.showDialog} id='convoTitle' style={{cursor: 'pointer'}} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
                              }
                        </div>
                      </div>
                    </StickyDiv>
                    {
                    this.state.isShowingModal &&
                    <ModalContainer style={{width: '500px'}}
                      onClose={this.closeDialog}>
                      <ModalDialog style={{width: '500px'}}
                        onClose={this.closeDialog}>
                        <h3>Rename:</h3>
                        <input style={{maxWidth: '300px', float: 'left', margin: 2}} ref={(c) => { this.titleConvo = c }} placeholder={this.state.convoTitle} type='text' className='form-control' />
                        <button style={{float: 'left', margin: 2}} onClick={this.renameTitle} className='btn btn-primary btn-sm' type='button'>Save</button>
                      </ModalDialog>
                    </ModalContainer>
                    }
                    {
                    this.state.isShowingModalResetAlert &&
                    <ModalContainer style={{width: '500px'}}
                      onClose={this.closeResetAlertDialog}>
                      <ModalDialog style={{width: '500px'}}
                        onClose={this.closeResetAlertDialog}>
                        <p>Are you sure you want to reset the message ?</p>
                        <button style={{float: 'right', marginLeft: '10px'}}
                          className='btn btn-primary btn-sm'
                          onClick={() => {
                            this.newConvo()
                            this.closeResetAlertDialog()
                          }}>Yes
                        </button>
                        <button style={{float: 'right'}}
                          className='btn btn-primary btn-sm'
                          onClick={() => {
                            this.closeResetAlertDialog()
                          }}>Cancel
                        </button>
                      </ModalDialog>
                    </ModalContainer>
                    }
                    <div className='ui-block' style={{height: 90 + 'vh', overflowY: 'scroll', marginTop: '-15px', paddingLeft: 75, paddingRight: 75, paddingTop: 30, borderRadius: '0px', border: '1px solid #ccc'}}>
                      {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}
                      <DragSortableList items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

GenericMessage.propTypes = {
  'convoTitle': PropTypes.string,
  'handleChange': PropTypes.func.isRequired,
  'location': PropTypes.object.isRequired,
  'setReset': PropTypes.func,
  'hiddenComponents': PropTypes.array,
  'titleEditable': PropTypes.bool
}

GenericMessage.defaultProps = {
  'convoTitle': 'Title',
  'hiddenComponents': [],
  'titleEditable': true
}

export default GenericMessage
