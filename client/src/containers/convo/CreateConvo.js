/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import {
  createbroadcast,
  loadBroadcastsList,
  updatefileuploadStatus,
  uploadBroadcastfile,
  sendBroadcast
} from '../../redux/actions/broadcast.actions'
import { Link } from 'react-router'
import {createWelcomeMessage} from '../../redux/actions/welcomeMessage.actions'
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
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'
import { getuserdetails, convoTourCompleted, getFbAppId } from '../../redux/actions/basicinfo.actions'
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
        options: [{id: 'male', text: 'male'},
          {id: 'female', text: 'female'},
          {id: 'other', text: 'other'}
        ]
      },
      Locale: {
        options: [{id: 'en_US', text: 'en_US'},
          {id: 'af_ZA', text: 'af_ZA'},
          {id: 'ar_AR', text: 'ar_AR'},
          {id: 'az_AZ', text: 'az_AZ'},
          {id: 'pa_IN', text: 'pa_IN'}
        ]
      },
      stayOpen: false,
      disabled: false,
      pageValue: '',
      genderValue: [],
      localeValue: [],
      isShowingModal: false,
      convoTitle: 'Broadcast Title',
      steps: [],
      showMessengerModal: false
    }
    props.getuserdetails()
    props.getFbAppId()
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.initializeGenderSelect = this.initializeGenderSelect.bind(this)
    this.initializeLocaleSelect = this.initializeLocaleSelect.bind(this)
    this.handleText = this.handleText.bind(this)
    this.handleCard = this.handleCard.bind(this)
    this.handleGallery = this.handleGallery.bind(this)
    this.handleImage = this.handleImage.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.removeComponent = this.removeComponent.bind(this)
    this.sendConvo = this.sendConvo.bind(this)
    this.testConvo = this.testConvo.bind(this)
    this.newConvo = this.newConvo.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
    this.handleLocaleChange = this.handleLocaleChange.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.renameTitle = this.renameTitle.bind(this)
    this.addSteps = this.addSteps.bind(this)
    this.addTooltip = this.addTooltip.bind(this)
    this.tourFinished = this.tourFinished.bind(this)
    this.goBack = this.goBack.bind(this)
  }
//  sddsdfas
  componentWillMount () {
    // this.props.loadMyPagesList();
    // if(this.props.pages.length > 0){
    //   console.log("componentDidMount pageValue set")
    //   this.setState({pageValue: this.props.pages[0].pageId})
    // }
  }

  componentDidMount () {
    document.title = 'KiboPush | Create Broadcast'
    let options = []
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {id: this.props.pages[i].pageId, text: this.props.pages[i].pageName}
    }

    this.setState({page: {options: options}})
    this.initializeGenderSelect(this.state.Gender.options)
    this.initializeLocaleSelect(this.state.Locale.options)
    this.initializePageSelect(options)
    if (this.props.pages.length > 0) {
      console.log('componentDidMount pageValue set')
      this.setState({pageValue: this.props.pages[0].pageId})
    }

    this.addSteps([{
      title: 'Component',
      text: 'You can add components to your broadcast using these button',
      selector: 'div#text',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Edit Title',
      text: 'You can edit the title of your broadcast by clicking the pencil icon',
      selector: 'i#convoTitle',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true},
    {
      title: 'Send broadcast',
      text: 'You can send your broadcast using these buttons',
      selector: 'button#send',
      position: 'bottom-left',
      type: 'hover',
      isFixed: true}])
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.broadcasts) {
      console.log('Broadcasts Updated', nextProps.broadcasts)
    }
    // if(nextProps.pages.length > 0){
    //   console.log("componentWillReceiveProps pageValue set")
    //   this.setState({pageValue: nextProps.pages[0].pageId})
    // }
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  renameTitle () {
    if (this.titleConvo.value === '') {
      return
    }
    this.setState({convoTitle: this.titleConvo.value})
    this.closeDialog()
  }

  gotoView (event) {
    this.props.history.push({
      pathname: `/convos`

    })
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
    console.log('handleCard in CreateConvo is called: ')
    console.log(obj)
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
    if (this.props.location.state && this.props.location.state.module === 'welcome') {
      this.props.createWelcomeMessage({_id: this.props.location.state._id, welcomeMessage: this.state.broadcast}, this.msg)
    } else {
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
  }

  testConvo () {
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageId === this.state.pageValue) {
        if (!this.props.pages[i].adminSubscriberId) {
          this.setState({showMessengerModal: true})
          console.log('Setting Messenger Modal to True')
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

  tourFinished (data) {
    console.log('Next Tour Step')
    if (data.type === 'finished') {
      this.props.convoTourCompleted({
        'convoTourSeen': true
      })
    }
  }

  initializePageSelect (pageOptions) {
    console.log(pageOptions)
    var self = this
    /* eslint-disable */
    $('#selectPage').select2({
      /* eslint-enable */
      data: pageOptions,
      placeholder: 'Select Pages',
      allowClear: false
    })

    console.log('In initializePageSelect')
    // this.setState({pageValue: pageOptions[0].id})
    // console.log("Setting pageValue in InitPage Select", this.state.pageValue)

    /* eslint-disable */
    $('#selectPage').on('change', function (e) {
      /* eslint-enable */
      // var selectedIndex = e.target.selectedIndex
      // if (selectedIndex !== '-1') {
      var selectedOptions = e.target.selectedOptions[0].value
      // var selected = []
      // for (var i = 0; i < selectedOptions.length; i++) {
      //   var selectedOption = selectedOptions[i].value
      //   selected.push(selectedOption)
      // }
      console.log('Setting a new pageValue', selectedOptions)
      self.setState({ pageValue: selectedOptions })
      // }
      console.log('change Page', selectedOptions)
    })
  }

  initializeGenderSelect (genderOptions) {
    var self = this
    /* eslint-disable */
    $('#selectGender').select2({
      /* eslint-enable */
      data: genderOptions,
      placeholder: 'Select Gender',
      allowClear: true,
      multiple: true
    })

    console.log('In Initialize Gender Select', genderOptions)
    /* eslint-disable */
    $('#selectGender').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ genderValue: selected })
      }
      console.log('change Gender', selected)
    })
  }

  initializeLocaleSelect (localeOptions) {
    var self = this
    /* eslint-disable */
    $('#selectLocale').select2({
      /* eslint-enable */
      data: localeOptions,
      placeholder: 'Select Locale',
      allowClear: true,
      multiple: true
    })

    /* eslint-disable */
    $('#selectLocale').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ localeValue: selected })
      }
      console.log('change Locale', selected)
    })
  }
  goBack () {
    this.props.history.push({
      pathname: `/welcomeMessage`
    })
  }
  render () {
    console.log('Pages ', this.props.pages)
    console.log('Page Value', this.state.pageValue)
    console.log('List', this.state.list)

    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    // const { disabled, stayOpen } = this.state

    return (
      <div>
        {
          /*
           !(this.props.user && this.props.user.convoTourSeen) &&
           <Joyride ref='joyride' run steps={this.state.steps} scrollToSteps debug={false} type={'continuous'} callback={this.tourFinished} showStepsProgress showSkipButton />

           */
        }
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>

                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div style={{padding: '25px'}} className='row' />
                  <div>
                    <div className='row' >
                      <div className='col-3'>
                        <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, <Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} />]}) }}>
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
                    {this.props.location.state && this.props.location.state.module === 'welcome' &&
                    <div className='row'>
                      <br />
                      <br />
                      <button style={{float: 'left', marginLeft: 20}} className='btn btn-primary btn-sm' disabled={(this.state.broadcast.length === 0)} onClick={this.sendConvo}>Save</button>
                      <button style={{float: 'left', marginLeft: 20}} className='btn btn-primary btn-sm' onClick={() => this.goBack()}>Back</button>
                    </div>
                  }
                    {
                      this.props.location.state.module === 'convo' &&
                      <div>
                        <fieldset>
                          <br />
                          <h3>Set Targeting:</h3>
                          <br />
                          <div className='m-form'>
                            <div className='form-group m-form__group'>
                              <select id='selectPage' style={{minWidth: 75 + '%'}} />
                            </div>
                            <div className='form-group m-form__group'>
                              <select id='selectGender' style={{minWidth: 75 + '%'}} />
                            </div>
                            <div className='form-group m-form__group'>
                              <select id='selectLocale' style={{minWidth: 75 + '%'}} />
                            </div>
                          </div>
                          <br />
                        </fieldset>
                        <br />
                        <div className='row'>
                          <br />
                          <br />
                          <button style={{float: 'left', marginLeft: 20}} onClick={this.newConvo} className='btn btn-primary btn-sm'> New<br /> Broadcast </button>
                          <button style={{float: 'left', marginLeft: 20}} className='btn btn-primary btn-sm' disabled={(this.state.pageValue === '' || (this.state.broadcast.length === 0))} onClick={this.testConvo}> Test<br /> Broadcast </button>
                          <button style={{float: 'left', marginLeft: 20}} id='send' onClick={this.sendConvo} className='btn m-btn m-btn--gradient-from-primary m-btn--gradient-to-accent' disabled={(this.state.broadcast.length === 0)}>Send<br /> Broadcast </button>
                        </div>
                      </div>
                    }
                  </div>
                </div>
                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div style={{padding: '25px'}} className='row' />
                  <StickyDiv offsetTop={70} zIndex={1}>
                    <div style={{border: '1px solid #ccc', borderRadius: '0px', backgroundColor: '#e1e3ea'}} className='ui-block'>
                      <div style={{padding: '5px'}}>
                        {this.props.location.state.module === 'welcome'
                        ? <h3>Welcome Message</h3>
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
                    this.state.showMessengerModal &&
                    <ModalContainer style={{width: '500px'}}
                      onClose={() => { this.setState({showMessengerModal: false}) }}>
                      <ModalDialog style={{width: '500px'}}
                        onClose={() => { this.setState({showMessengerModal: false}) }}>
                        <h3>Connect to Messenger:</h3>
                        <MessengerPlugin
                          appId={this.props.fbAppId}
                          pageId={this.state.pageValue}
                          passthroughParams={this.props.user._id}
                          onClick={() => { this.setState({showMessengerModal: false}) }}
                        />
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
    fbAppId: state.basicInfo.fbAppId
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
      sendBroadcast: sendBroadcast,
      getuserdetails: getuserdetails,
      convoTourCompleted: convoTourCompleted,
      getFbAppId: getFbAppId,
      createWelcomeMessage: createWelcomeMessage
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConvo)
