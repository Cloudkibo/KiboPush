/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Header from './header'
import { connect } from 'react-redux'
import {
  createbroadcast,
  loadBroadcastsList,
  updatefileuploadStatus,
  uploadBroadcastfile,
  sendBroadcast
} from '../../redux/actions/broadcast.actions'
import { Link } from 'react-router'
import { loadCustomerLists } from '../../redux/actions/customerLists.actions'
import { loadBroadcastDetails, saveBroadcastInformation } from '../../redux/actions/templates.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { createWelcomeMessage, isWelcomeMessageEnabled } from '../../redux/actions/welcomeMessage.actions'
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
import StickyDiv from 'react-stickydiv'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import ViewMessage from '../../components/ViewMessage/viewMessage'

class EditTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      list: [],
      broadcast: [],
      stayOpen: false,
      disabled: false,
      pageValue: '',
      stay: false,
      previewMessage: ''
    }
    props.getuserdetails()
    props.loadSubscribersList()
    props.loadCustomerLists()
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.setEditComponents = this.setEditComponents.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.viewGreetingMessage = this.viewGreetingMessage.bind(this)
    this.closePreviewDialog = this.closePreviewDialog.bind(this)
    this.pageChange = this.pageChange.bind(this)
  }
  componentWillReceiveProps (nextprops) {
    console.log('nextprops in', nextprops)
    if (this.state.pageValue === '') {
      this.setState({ pageValue: nextprops.pages[0]._id, pageName: nextprops.pages[0].pageName })
      this.setEditComponents(nextprops.pages[0].welcomeMessage)
    }
    //  this.setEditComponents(nextprops.pages[0].welcomeMessage)
  }
  pageChange (event) {
    console.log('Selected: ', event.target.value)
    if (event === null) {
      this.setState({pageValue: event})
      return
    }
    this.setState({pageValue: event.target.value})
    for (var i = 0; i < this.props.pages.length; i++) {
      if (event.target.value === this.props.pages[i]._id) {
        this.setEditComponents(this.props.pages[i].welcomeMessage)
      }
    }
  }
  setEditComponents (payload) {
    var temp = []
    var message = []
    for (var i = 0; i < payload.length; i++) {
      payload[i].id = temp.length
      if (payload[i].componentType === 'text') {
        console.log('paload[i].text', payload[i].text)
        console.log('paload[i].buttons', payload[i].buttons)
        temp.push({content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} message={payload[i].text} buttons={payload[i].buttons} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'image') {
        temp.push({content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} image={payload[i].image_url} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'audio') {
        temp.push({content: (<Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'video') {
        temp.push({content: (<Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'file') {
        temp.push({content: (<File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} file={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'card') {
        temp.push({content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} cardDetails={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      } else if (payload[i].componentType === 'gallery') {
        temp.push({content: (<Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} galleryDetails={payload[i]} />)})
        this.setState({list: temp})
        message.push(payload[i])
        this.setState({broadcast: message})
      }
    }
  }
  componentDidMount () {
    document.title = 'KiboPush | Create Broadcast'
    let options = []
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {id: this.props.pages[i].pageId, text: this.props.pages[i].pageName}
    }

    this.setState({page: {options: options}})
    //  this.initializePageSelect(options)
    // if (this.props.pages.length > 0) {
    //   console.log('componentDidMount pageValue set')
    //   this.setState({pageValue: this.props.pages[0].pageId})
    //   this.setEditComponents(this.props.pages[0].welcomeMessage)
    // }
  }
  handleText (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].text = obj.text
        if (obj.button.length > 0) {
          temp[i].buttons = obj.button
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
  }

  handleCard (obj) {
    console.log('handleCard in CreateConvo is called: ')
    console.log(obj)
    var temp = this.state.broadcast
    var isPresent = false
    temp.map((data, i) => {
      if (data.id === obj.id) {
        temp[i].fileName = obj.fileName
        temp[i].image_url = obj.image_url
        temp[i].fileurl = obj.fileurl
        temp[i].size = obj.size
        temp[i].type = obj.type
        temp[i].title = obj.title
        temp[i].buttons = obj.buttons
        temp[i].description = obj.description
        isPresent = true
      }
    })
    if (!isPresent) {
      temp.push(obj)
    }
    this.setState({broadcast: temp})
  }

  handleGallery (obj) {
    var temp = this.state.broadcast
    var isPresent = false
    obj.cards.forEach((d) => {
      delete d.id
    })
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
    console.log('Image Uploaded', this.state.broadcast)
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

    this.setState({broadcast: temp})
    // console.log("Image Uploaded", obj)
  }

  removeComponent (obj) {
    var temp = this.state.list.filter((component) => { return (component.content.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    this.setState({list: temp, broadcast: temp2})
  }

  sendConvo () {
    if (this.state.broadcast.length === 0) {
      return
    }
    console.log(this.state.broadcast)
    for (let i = 0; i < this.state.broadcast.length; i++) {
      if (this.state.broadcast[i].componentType === 'card') {
        if (!this.state.broadcast[i].buttons) {
          return this.msg.error('Card must have at least one button.')
        } else if (this.state.broadcast[i].buttons.length === 0) {
          return this.msg.error('Card must have at least one button.')
        }
      }
      if (this.state.broadcast[i].componentType === 'gallery') {
        for (let j = 0; j < this.state.broadcast[i].cards.length; j++) {
          if (!this.state.broadcast[i].cards[j].buttons) {
            return this.msg.error('Card in gallery must have at least one button.')
          } else if (this.state.broadcast[i].cards[j].buttons.length === 0) {
            return this.msg.error('Card in gallery must have at least one button.')
          }
        }
      }
    }
    this.props.createWelcomeMessage({_id: this.state.pageValue, welcomeMessage: this.state.broadcast}, this.msg)
    this.props.isWelcomeMessageEnabled({_id: this.state.pageValue, isWelcomeMessageEnabled: true})
    this.setState({stay: true})
  }

  initializePageSelect (pageOptions) {
    console.log(pageOptions)
    var self = this
    $('#selectPage').select2({
      data: pageOptions,
      placeholder: 'Select Pages',
      allowClear: true
    })

    console.log('In initializePageSelect')
    // this.setState({pageValue: pageOptions[0].id})
    // console.log("Setting pageValue in InitPage Select", this.state.pageValue)

    $('#selectPage').on('change', function (e) {
      var selectedIndex = e.target.selectedIndex
      // if (selectedIndex !== '-1') {
      var selectedOptions = e.target.selectedOptions[0].value
      // var selected = []
      // for (var i = 0; i < selectedOptions.length; i++) {
      //   var selectedOption = selectedOptions[i].value
      //   selected.push(selectedOption)
      // }
      console.log('Setting a new pageValue', selectedOptions)
      self.setState({ pageValue: selectedOptions })
      for (var i = 0; i < self.props.pages.length; i++) {
        if (selectedOptions === self.props.pages[i].pageId) {
          self.setEditComponents(this.props.pages[0].welcomeMessage)
        }
      }
      console.log('change Page', selectedOptions)
    })
  }
  viewGreetingMessage (e) {
    this.setState({showPreview: true})
  }
  closePreviewDialog () {
    this.setState({showPreview: false})
  }
  render () {
    console.log('Pages ', this.props.pages)
    console.log('Page Value', this.state.pageValue)

    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    const { disabled, stayOpen } = this.state

    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
          {
            this.state.showPreview &&
            <ModalContainer style={{top: '100px'}}
              onClose={this.closePreviewDialog}>
              <ModalDialog style={{top: '100px'}}
                onClose={this.closePreviewDialog}>
                <h3>Greeting Message Preview</h3>
                <ViewMessage payload={this.state.broadcast} />
              </ModalDialog>
            </ModalContainer>
          }
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Welcome Message</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='row'>

                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div className='row' />
                  <div>
                    <div className='row' >
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, {content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/text.png' alt='Text' style={{maxHeight: 25}} />
                            <h6>Text</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Image Component Added'); this.setState({list: [...temp, {content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                            <h6>Image</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, {content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/card.png' alt='Card' style={{maxHeight: 25}} />
                            <h6>Card</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({list: [...temp, {content: (<Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                            <h6>Gallery</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Audio Component Added'); this.setState({list: [...temp, {content: (<Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                            <h6>Audio</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Video Component Added'); this.setState({list: [...temp, {content: (<Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/video.png' alt='Video' style={{maxHeight: 25}} />
                            <h6>Video</h6>
                          </div>
                        </div>
                      </div>
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({list: [...temp, {content: (<File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                          <div className='align-center'>
                            <img src='icons/file.png' alt='File' style={{maxHeight: 25}} />
                            <h6>File</h6>
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className='row'>
                      <div className='col-12'>
                        <div className='m-portlet m-portlet--skin-light'>
                          <div className='m-portlet__body'>
                            <label>Select Page:</label>
                            <select style={{marginLeft: '20px'}}
                              className='custom-select'
                              placeholder='Select a page...'
                              onChange={this.pageChange}>
                              { this.props.pages.map((page, i) => (
                              (
                                page.connected &&
                                <option
                                  value={page._id} name={page.pageName} key={page.pageId} selected={page._id === this.state.pageValue}>{page.pageName}</option>
                              )
                            ))
                            }
                            </select>
                            <br /><br /><br />
                              <button style={{float: 'left', marginLeft: 20}} className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.sendConvo}>Save</button>
                              <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer', margin: '10px', display: 'inline-block'}} onClick={this.viewGreetingMessage}>See how it looks </Link>
                            <br />
                            <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                              <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px'}}>
                                <Link to='/greetingTextWizard' className='btn m-btn--pill    btn-link'> Back
                                </Link>
                                <Link to='/autopostingWizard' className='btn m-btn--pill    btn-link'> Continue
                                </Link>
                                <Link to='/dashboard' className='btn m-btn--pill    btn-link' style={{'marginLeft': '10px'}}> Cancel
                                </Link>
                              </div>
                            </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div className='row' />
                  <StickyDiv offsetTop={70} zIndex={1}>
                    <div style={{border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea'}} className='ui-block'>
                      <div style={{padding: '5px'}}>
                        <h3>Welcome Message</h3>
                      </div>
                    </div>
                  </StickyDiv>
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
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    showFileUploading: (state.broadcastsInfo.showFileUploading),
    pages: (state.pagesInfo.pages),
    fileInfo: (state.convosInfo.fileInfo),
    user: (state.basicInfo.user),
    broadcastDetails: (state.templatesInfo.broadcastDetails),
    currentBroadcast: (state.templatesInfo.currentBroadcast),
    customerLists: (state.listsInfo.customerLists),
    subscribers: (state.subscribersInfo.subscribers)

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBroadcastsList: loadBroadcastsList,
      uploadBroadcastfile: uploadBroadcastfile,
      createbroadcast: createbroadcast,
      updatefileuploadStatus: updatefileuploadStatus,
      sendBroadcast: sendBroadcast,
      getuserdetails: getuserdetails,
      loadBroadcastDetails: loadBroadcastDetails,
      saveBroadcastInformation: saveBroadcastInformation,
      createWelcomeMessage: createWelcomeMessage,
      loadCustomerLists: loadCustomerLists,
      loadSubscribersList: loadSubscribersList,
      isWelcomeMessageEnabled: isWelcomeMessageEnabled
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplate)
