/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Image from '../convo/Image'
import Video from '../convo/Video'
import Audio from '../convo/Audio'
import File from '../convo/File'
import Text from '../convo/Text'
import Card from '../convo/Card'
import Gallery from '../convo/Gallery'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
var MessengerPlugin = require('react-messenger-plugin').default

class CreateMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      list: [],
      message: [],
      stayOpen: false,
      disabled: false,
      pageValue: '',
      isShowingModal: false,
      messageTitle: 'Message Title',
      showMessengerModal: false
    }
    // props.getuserdetails()
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://unpkg.com/react-select/dist/react-select.js')
    document.body.appendChild(addScript)
    let options = []
    this.setState({ page: { options: options } })
  }

  showDialog () {
    this.setState({ isShowingModal: true })
  }

  closeDialog () {
    this.setState({ isShowingModal: false })
  }

  renameTitle () {
    this.setState({ messageTitle: this.titleMessage.value })
    this.closeDialog()
  }

  handleText (obj) {
    var temp = this.state.message
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data.text = obj.text
        if (obj.button.length > 0) {
          data.buttons = obj.button
        }
        isPresent = true
      }
    })

    if (!isPresent) {
      if (obj.button.length > 0) {
        temp.push({ id: obj.id, text: obj.text, componentType: 'text', buttons: obj.button })
      } else {
        temp.push({ id: obj.id, text: obj.text, componentType: 'text' })
      }
    }

    this.setState({ message: temp })
  }

  handleCard (obj) {
    var temp = this.state.message
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data.fileName = obj.fileName
        data.fileurl = obj.fileurl
        data.size = obj.size
        data.type = obj.type
        data.title = obj.title
        data.buttons = obj.buttons
        data.description = obj.description
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({ message: temp })
  }

  handleGallery (obj) {
    var temp = this.state.message
    var isPresent = false
    obj.cards.forEach((d) => {
      delete d.id
    })
    temp.map((data) => {
      if (data.id === obj.id) {
        data.cards = obj.cards
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({ message: temp })
  }

  handleImage (obj) {
    var temp = this.state.message
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({ message: temp })
        // console.log("Image Uploaded", obj)
  }

  handleFile (obj) {
    var temp = this.state.message
    var isPresent = false
    temp.map((data) => {
      if (data.id === obj.id) {
        data = obj
        isPresent = true
      }
    })

    if (!isPresent) {
      temp.push(obj)
    }

    this.setState({ message: temp })
        // console.log("Image Uploaded", obj)
  }

  removeComponent (obj) {
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.message.filter((component) => { return (component.id !== obj.id) })
    this.setState({ list: temp, message: temp2 })
  }

  render () {
    console.log('Pages ', this.props.pages)

    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='container'>
          <br />
          <br />
          <br />

          <div className='row'>
            <div className='col-lg-3 col-md-3 col-sm-3 col-xs-3' style={{ padding: '55px' }}>
              <button style={{ float: 'left' }} className='btn btn-primary btn-md'> New Message</button>
              <button style={{ float: 'left' }} className='btn btn-primary btn-md' disabled={(this.state.pageValue === '')}> Test Message</button>
              <button style={{ float: 'left' }} id='send' className='btn btn-primary btn-md'>Send Message </button>
            </div>

            <div className='col-lg-9 col-md-9 col-sm-9 col-xs-9'>
              <div style={{ padding: '25px' }} />
              <div style={{ border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea' }} className='ui-block'>
                <div style={{ padding: '5px', textAlign: 'center' }}>
                  <h3>{this.state.messageTitle} <i onClick={this.showDialog} id='messageTitle' style={{ cursor: 'pointer' }} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
                </div>
              </div>
              {
                                this.state.isShowingModal &&
                                <ModalContainer style={{ width: '500px' }}
                                  onClose={this.closeDialog}>
                                  <ModalDialog style={{ width: '500px' }}
                                    onClose={this.closeDialog}>
                                    <h3>Rename:</h3>
                                    <input style={{ maxWidth: '300px', float: 'left', margin: 2 }} ref={(c) => { this.titleMessage = c }} type='text' className='form-control' />
                                    <button style={{ float: 'left', margin: 2 }} onClick={this.renameTitle} className='btn btn-primary btn-sm' type='button'>Save</button>
                                  </ModalDialog>
                                </ModalContainer>
                            }

              {
                                this.state.showMessengerModal &&
                                <ModalContainer style={{ width: '500px' }}
                                  onClose={() => { this.setState({ showMessengerModal: false }) }}>
                                  <ModalDialog style={{ width: '500px' }}
                                    onClose={() => { this.setState({ showMessengerModal: false }) }}>
                                    <h3>Connect to Messenger:</h3>
                                    <MessengerPlugin
                                      appId='1429073230510150'
                                      pageId={this.state.pageValue}
                                      passthroughParams={this.props.user._id}
                                      onClick={() => { this.setState({ showMessengerModal: false }) }}
                                        />
                                  </ModalDialog>
                                </ModalContainer>
                            }
              <div className='ui-block' style={{ maxHeight: 350, overflowY: 'scroll', marginTop: '-15px', padding: 75, borderRadius: '0px', border: '1px solid #ccc' }}>
                {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}
                <DragSortableList items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' />

              </div>

              <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12' style={{ margin: 'auto' }}>
                  <div className='row' />
                  <div>
                    <div className='row' >
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({ list: [...temp, { content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} />) }] }) }}>
                          <div className='align-center' style={{ margin: 5 }}>
                            <img src='icons/text.png' alt='Text' style={{ maxHeight: 25 }} />
                            <h6>Text</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Image Component Added'); this.setState({ list: [...temp, { content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} />) }] }) }}>
                          <div className='align-center' style={{ margin: 5 }}>
                            <img src='icons/picture.png' alt='Image' style={{ maxHeight: 25 }} />
                            <h6>Image</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({ list: [...temp, { content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} />) }] }) }}>
                          <div className='align-center' style={{ margin: 5 }}>
                            <img src='icons/card.png' alt='Card' style={{ maxHeight: 25 }} />
                            <h6>Card</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({ list: [...temp, { content: (<Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} />) }] }) }}>
                          <div className='align-center' style={{ margin: 5 }}>
                            <img src='icons/layout.png' alt='Gallery' style={{ maxHeight: 25 }} />
                            <h6>Gallery</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Audio Component Added'); this.setState({ list: [...temp, { content: (<Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />) }] }) }}>
                          <div className='align-center' style={{ margin: 5 }}>
                            <img src='icons/speaker.png' alt='Audio' style={{ maxHeight: 25 }} />
                            <h6>Audio</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Video Component Added'); this.setState({ list: [...temp, { content: (<Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />) }] }) }}>
                          <div className='align-center' style={{ margin: 5 }}>
                            <img src='icons/video.png' alt='Video' style={{ maxHeight: 25 }} />
                            <h6>Video</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({ list: [...temp, { content: (<File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />) }] }) }}>
                          <div className='align-center' style={{ margin: 5 }}>
                            <img src='icons/file.png' alt='File' style={{ maxHeight: 25 }} />
                            <h6>File</h6>
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

function mapStateToProps (state) {
  // console.log(state)
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
    },
        dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateMessage)
