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
// import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'

class GenericMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      list: [],
      broadcast: [],
      isShowingModal: false,
      convoTitle: this.props.convoTitle ? this.props.convoTitle : 'Title',
      pageId: ''
    }
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

    props.setReset(this.showResetAlertDialog)
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
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
    var temp = this.state.list.filter((component) => { return (component.props.id !== obj.id) })
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

  render () {
    let timeStamp = new Date().getTime()
    console.log('timeStamp', timeStamp)
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
                { this.props.location && this.props.location.state && this.props.location.state.module === 'welcome' &&
                <div className='pull-right'>
                  <button className='btn btn-primary' style={{marginRight: '10px'}} disabled={(this.state.broadcast.length === 0)} onClick={this.sendConvo}>Save</button>
                  <button className='btn btn-primary' onClick={() => this.goBack()}>Back</button>
                </div>
                  }
              </div>
            </div>
            <div className='row'>
              <div className='col-12'>
                <div className='tab-content'>
                  <div className='tab-pane fade active in' id='tab_1'>
                    <div className='row'>
                      <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                        <div className='row' >
                          <div className='col-3'>
                            <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, <Text id={timeStamp} pageId={this.state.pageId} key={timeStamp} handleText={this.handleText} onRemove={this.removeComponent} removeState />]}); this.handleText({id: timeStamp, text: '', button: []}) }}>
                              <div className='align-center'>
                                <img src='https://cdn.cloudkibo.com/public/icons/text.png' alt='Text' style={{maxHeight: 25}} />
                                <h6>Text</h6>
                              </div>
                            </div>
                          </div>
                          <div className='col-3'>
                            <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Image Component Added'); this.setState({list: [...temp, <Image id={timeStamp} pages={this.props.location.state.pages} key={timeStamp} handleImage={this.handleImage} onRemove={this.removeComponent} />]}); this.handleImage({id: timeStamp, componentType: 'image', image_url: '', fileurl: ''}) }}>
                              <div className='align-center'>
                                <img src='https://cdn.cloudkibo.com/public/icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                                <h6>Image</h6>
                              </div>
                            </div>
                          </div>
                          <div className='col-3'>
                            <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, <Card id={timeStamp} pageId={this.state.pageId} pages={this.props.location.state.pages} key={timeStamp} handleCard={this.handleCard} onRemove={this.removeComponent} singleCard />]}); this.handleCard({id: timeStamp, componentType: 'card', title: '', description: '', fileurl: '', buttons: []}) }}>
                              <div className='align-center'>
                                <img src='https://cdn.cloudkibo.com/public/icons/card.png' alt='Card' style={{maxHeight: 25}} />
                                <h6>Card</h6>
                              </div>
                            </div>
                          </div>
                          <div className='col-3'>
                            <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({list: [...temp, <Gallery id={timeStamp} pageId={this.state.pageId} pages={this.props.location.state.pages} key={timeStamp} handleGallery={this.handleGallery} onRemove={this.removeComponent} />]}); this.handleGallery({id: timeStamp, componentType: 'gallery', cards: []}) }}>
                              <div className='align-center'>
                                <img src='https://cdn.cloudkibo.com/public/icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                                <h6>Gallery</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-3'>
                            <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Audio Component Added'); this.setState({list: [...temp, <Audio id={timeStamp} pages={this.props.location.state.pages} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />]}); this.handleFile({id: timeStamp, componentType: 'audio', fileurl: ''}) }}>
                              <div className='align-center'>
                                <img src='https://cdn.cloudkibo.com/public/icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                                <h6>Audio</h6>
                              </div>
                            </div>
                          </div>
                          <div className='col-3'>
                            <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Video Component Added'); this.setState({list: [...temp, <Video id={timeStamp} pages={this.props.location.state.pages} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />]}); this.handleFile({id: timeStamp, componentType: 'video', fileurl: ''}) }}>
                              <div className='align-center'>
                                <img src='https://cdn.cloudkibo.com/public/icons/video.png' alt='Video' style={{maxHeight: 25}} />
                                <h6>Video</h6>
                              </div>
                            </div>
                          </div>
                          <div className='col-3'>
                            <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({list: [...temp, <File id={timeStamp} pages={this.props.location.state.pages} key={timeStamp} handleFile={this.handleFile} onRemove={this.removeComponent} />]}); this.handleFile({id: timeStamp, componentType: 'file', fileurl: ''}) }}>
                              <div className='align-center'>
                                <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='File' style={{maxHeight: 25}} />
                                <h6>File</h6>
                              </div>
                            </div>
                          </div>
                          <div className='col-3'>
                            <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New List Component Added'); this.setState({list: [...temp, <List id={timeStamp} pageId={this.state.pageId} pages={this.props.location.state.pages} key={timeStamp} handleList={this.handleList} onRemove={this.removeComponent} />]}); this.handleList({id: timeStamp, componentType: 'list', listItems: [], topElementStyle: 'compact'}) }}>
                              <div className='align-center'>
                                <img src='https://cdn.cloudkibo.com/public/icons/list.png' alt='List' style={{maxHeight: 25}} />
                                <h6>List</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-3'>
                            <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Media Component Added'); this.setState({list: [...temp, <Media id={timeStamp} pageId={this.state.pageId} pages={this.props.location.state.pages} key={timeStamp} handleMedia={this.handleMedia} onRemove={this.removeComponent} />]}); this.handleMedia({id: timeStamp, componentType: 'media', fileurl: '', buttons: []}) }}>
                              <div className='align-center'>
                                <img src='https://cdn.cloudkibo.com/public/icons/media.png' alt='Media' style={{maxHeight: 25}} />
                                <h6>Media</h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                          {this.state.list}
                        </div>

                      </div>
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

export default GenericMessage
