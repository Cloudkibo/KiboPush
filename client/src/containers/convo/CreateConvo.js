/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Joyride from 'react-joyride'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import {
  createbroadcast,
  loadBroadcastsList,
  updatefileuploadStatus,
  uploadBroadcastfile,
  sendBroadcast
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'
import { addPages, removePage } from '../../redux/actions/pages.actions'
import Image from './Image'
import Video from './Video'
import Audio from './Audio'
import File from './File'
import Text from './Text'
import Card from './Card'
import Gallery from './Gallery'
import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import Select from 'react-select'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'
var MessengerPlugin = require('react-messenger-plugin').default

class CreateConvo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      list: [],
      broadcast: [],
      page: {
        options: []
      },
      Gender: {
        options: [{label: 'Male', value: 'Male'},
                  {label: 'Female', value: 'Female'},
                  {label: 'Other', value: 'Other'}
        ]
      },
      Locale: {
        options: [{label: 'en_US', value: 'en_US'},
                  {label: 'af_ZA', value: 'af_ZA'},
                  {label: 'ar_AR', value: 'ar_AR'},
                  {label: 'pa_IN', value: 'pa_IN'}
        ]
      },
      stayOpen: false,
      disabled: false,
      pageValue: '',
      genderValue: [],
      localeValue: [],
      isShowingModal: false,
      convoTitle: 'Conversation Title',
      steps: [],
      showMessengerModal: false
    }
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.testConvo = this.testConvo.bind(this)
    this.newConvo = this.newConvo.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
    this.handleLocaleChange = this.handleLocaleChange.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
  }

  componentWillMount () {
    // this.props.loadMyPagesList();

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
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {label: this.props.pages[i].pageName, value: this.props.pages[i].pageId}
    }
    this.setState({page: {options: options}})

    this.addSteps([{
      title: 'Component',
      text: 'You can add components to your conversation using these button',
      selector: 'div#text',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Edit Title',
      text: 'You can edit the title of your conversation by clicking the pencil icon',
      selector: 'i#convoTitle',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Send Conversation',
      text: 'You can send your conversation using these buttons',
      selector: 'button#send',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true}])
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.broadcasts) {
      console.log('Broadcasts Updated', nextProps.broadcasts)
    }
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  renameTitle () {
    this.setState({convoTitle: this.titleConvo.value})
    this.closeDialog()
  }

  gotoView (event) {
    this.props.history.push({
      pathname: `/convos`

    })
  }

  handlePageChange (value) {
    this.setState({ pageValue: value })
  }

  handleGenderChange (value) {
    var temp = value.split(',')
    this.setState({ genderValue: temp })
  }

  handleLocaleChange (value) {
    var temp = value.split(',')
    this.setState({ localeValue: temp })
  }

  handleText (obj) {
    var temp = this.state.broadcast
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
        temp.push({id: obj.id, text: obj.text, componentType: 'text', buttons: obj.button})
      } else {
        temp.push({id: obj.id, text: obj.text, componentType: 'text'})
      }
    }

    this.setState({broadcast: temp})
  }

  handleCard (obj) {
    var temp = this.state.broadcast
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
    this.setState({broadcast: temp})
  }

  handleGallery (obj) {
    var temp = this.state.broadcast
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
    this.setState({broadcast: temp})
  }

  handleImage (obj) {
    var temp = this.state.broadcast
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

    this.setState({broadcast: temp})
    // console.log("Image Uploaded", obj)
  }

  handleFile (obj) {
    var temp = this.state.broadcast
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
    var isSegmentedValue = false
    if (this.state.pageValue !== '' || this.state.genderValue.length > 0 || this.state.localeValue.length > 0) {
      isSegmentedValue = true
    }
    console.log(this.state.broadcast)
    var data = {
      platform: 'facebook',
      payload: this.state.broadcast,
      isSegmented: isSegmentedValue,
      segmentationPageIds: [this.state.pageValue],
      segmentationLocale: this.state.localeValue,
      segmentationGender: this.state.genderValue,
      segmentationTimeZone: '',
      title: this.state.convoTitle

    }
    console.log('Data sent: ', data)
    this.props.sendBroadcast(data, this.msg)
    this.setState({broadcast: [], list: []})
  }

  testConvo () {
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageId === this.state.pageValue) {
        if (!this.props.pages[i].adminSubscriberId) {
          this.setState({showMessengerModal: true})
          return
        }
      }
    }

    if (this.state.broadcast.length === 0) {
      return
    }
    console.log(this.state.broadcast)
    var data = {
      platform: 'facebook',
      self: 'true',
      payload: this.state.broadcast,
      title: this.state.convoTitle

    }
    console.log('Data sent: ', data)
    this.props.sendBroadcast(data, this.msg)
    this.setState({broadcast: [], list: []})
  }

  newConvo () {
    this.setState({broadcast: [], list: []})
  }

  addSteps (steps) {
    // let joyride = this.refs.joyride

    if (!Array.isArray(steps)) {
      steps = [steps]
    }

    if (!steps.length) {
      return false
    }
    var temp = this.state.steps
    this.setState({
      steps: temp.concat(steps)
    })
  }

  addTooltip (data) {
    this.refs.joyride.addTooltip(data)
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
    const { disabled, stayOpen } = this.state

    return (
      <div>
        <Joyride ref='joyride' run steps={this.state.steps} debug={false} type={'continuous'} showStepsProgress showSkipButton />
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
            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div style={{padding: '25px'}} className='row' />
              <div>
                <div className='row' >
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, {content: (<Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} />)}]}) }}>
                      <div className='align-center' style={{margin: 5}}>
                        <img src='icons/text.png' alt='Text' style={{maxHeight: 25}} />
                        <h6>Text</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Image Component Added'); this.setState({list: [...temp, {content: (<Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} />)}]}) }}>
                      <div className='align-center' style={{margin: 5}}>
                        <img src='icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                        <h6>Image</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, {content: (<Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} />)}]}) }}>
                      <div className='align-center' style={{margin: 5}}>
                        <img src='icons/card.png' alt='Card' style={{maxHeight: 25}} />
                        <h6>Card</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({list: [...temp, {content: (<Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} />)}]}) }}>
                      <div className='align-center' style={{margin: 5}}>
                        <img src='icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                        <h6>Gallery</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Audio Component Added'); this.setState({list: [...temp, {content: (<Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                      <div className='align-center' style={{margin: 5}}>
                        <img src='icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                        <h6>Audio</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Video Component Added'); this.setState({list: [...temp, {content: (<Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                      <div className='align-center' style={{margin: 5}}>
                        <img src='icons/video.png' alt='Video' style={{maxHeight: 25}} />
                        <h6>Video</h6>
                      </div>
                    </div>
                  </div>
                  <div className='col-3'>
                    <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({list: [...temp, {content: (<File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />)}]}) }}>
                      <div className='align-center' style={{margin: 5}}>
                        <img src='icons/file.png' alt='File' style={{maxHeight: 25}} />
                        <h6>File</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <fieldset className='form-group'>
                  <h3>Set Targeting:</h3>
                  <div className='form-group'>
                    <Select
                      closeOnSelect={!stayOpen}
                      disabled={disabled}
                      multi={false}
                      onChange={this.handlePageChange}
                      options={this.state.page.options}
                      placeholder='Select page(s)'
                      simpleValue
                      value={this.state.pageValue}
                    />
                  </div>
                  <div className='form-group'>
                    <Select
                      closeOnSelect={!stayOpen}
                      disabled={disabled}
                      multi
                      onChange={this.handleGenderChange}
                      options={this.state.Gender.options}
                      placeholder='Select Gender'
                      simpleValue
                      value={this.state.genderValue}
                    />
                  </div>
                  <div className='form-group'>
                    <Select
                      closeOnSelect={!stayOpen}
                      disabled={disabled}
                      multi
                      onChange={this.handleLocaleChange}
                      options={this.state.Locale.options}
                      placeholder='Select Locale(s)'
                      simpleValue
                      value={this.state.localeValue}
                    />
                  </div>
                </fieldset>
                <div className='row'>
                  <button style={{float: 'left', marginLeft: 20}} onClick={this.newConvo} className='btn btn-primary btn-sm'> New<br /> Conversation </button>
                  <button style={{float: 'left', marginLeft: 20}} className='btn btn-primary btn-sm' disabled={(this.state.pageValue === '')} onClick={this.testConvo}> Test<br /> Conversation </button>
                  <button style={{float: 'left', marginLeft: 20}} id='send' onClick={this.sendConvo} className='btn btn-primary btn-sm' disabled={(this.state.broadcast.length === 0)}>Send<br /> Conversation </button>

                </div>
              </div>
            </div>
            <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
              <div style={{padding: '25px'}} className='row' />
              <StickyDiv offsetTop={70}>
                <div style={{border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea'}} className='ui-block'>
                  <div style={{padding: '5px'}}>
                    <h3>{this.state.convoTitle} <i onClick={this.showDialog} id='convoTitle' style={{cursor: 'pointer'}} className='fa fa-pencil-square-o' aria-hidden='true' /></h3>
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
                      <input style={{maxWidth: '300px', float: 'left', margin: 2}} ref={(c) => { this.titleConvo = c }} type='text' className='form-control' />
                      <button style={{float: 'left', margin: 2}} onClick={this.renameTitle} className='btn btn-primary btn-sm' type='button'>Save</button>
                    </ModalDialog>
                  </ModalContainer>
                }

              {
                  this.state.showMessengerModal &&
                  <ModalContainer style={{width: '500px'}}
                    onClose={() => { this.setState({showMessengerModal: false}) }}>
                    <ModalDialog style={{width: '500px'}}
                      onClose={() => { this.setState({showMessengerModal: false}) }}>
                      <h3>Connect to Messenger:</h3>
                      <MessengerPlugin
                        appId='1429073230510150'
                        pageId={this.state.pageValue}
                        passthroughParams={this.props.user._id}
                        onClick={() => { this.setState({showMessengerModal: false}) }}
                      />
                    </ModalDialog>
                  </ModalContainer>
                }
              <div className='ui-block' style={{maxHeight: 350, overflowY: 'scroll', marginTop: '-15px', padding: 75, borderRadius: '0px', border: '1px solid #ccc'}}>
                {/* <h4  className="align-center" style={{color: '#FF5E3A', marginTop: 100}}> Add a component to get started </h4> */}
                <DragSortableList items={this.state.list} dropBackTransitionDuration={0.3} type='vertical' />

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
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadBroadcastsList: loadBroadcastsList,
      uploadBroadcastfile: uploadBroadcastfile,
      createbroadcast: createbroadcast,
      updatefileuploadStatus: updatefileuploadStatus,
      removePage: removePage,
      addPages: addPages,
      sendBroadcast: sendBroadcast

    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConvo)
