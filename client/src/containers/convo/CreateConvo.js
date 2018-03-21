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
import { loadCustomerLists } from '../../redux/actions/customerLists.actions'
import {createWelcomeMessage} from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import { addPages, removePage } from '../../redux/actions/pages.actions'
import { Link } from 'react-router'
import Image from './Image'
import Video from './Video'
import Audio from './Audio'
import File from './File'
import Text from './Text'
import Card from './Card'
import Gallery from './Gallery'
// import DragSortableList from 'react-drag-sortable'
import AlertContainer from 'react-alert'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import StickyDiv from 'react-stickydiv'
import { getuserdetails, getFbAppId, getAdminSubscriptions } from '../../redux/actions/basicinfo.actions'
import _ from 'underscore'
import { registerAction } from '../../utility/socketio'
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
      pageValue: [],
      genderValue: [],
      localeValue: [],
      isShowingModal: false,
      isShowingModalGuideLines: false,
      isShowingModalResetAlert: false,
      convoTitle: 'Broadcast Title',
      steps: [],
      showMessengerModal: false,
      selectedRadio: '',
      listSelected: '',
      isList: false,
      lists: [],
      tabActive: 'broadcast'
    }
    props.getuserdetails()
    props.getFbAppId()
    props.getAdminSubscriptions()
    this.showGuideLinesDialog = this.showGuideLinesDialog.bind(this)
    this.closeGuideLinesDialog = this.closeGuideLinesDialog.bind(this)
    this.showResetAlertDialog = this.showResetAlertDialog.bind(this)
    this.closeResetAlertDialog = this.closeResetAlertDialog.bind(this)
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.initializeGenderSelect = this.initializeGenderSelect.bind(this)
    this.initializeLocaleSelect = this.initializeLocaleSelect.bind(this)
    this.initializeListSelect = this.initializeListSelect.bind(this)
    this.handleSendBroadcast = this.handleSendBroadcast.bind(this)
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
    this.goBack = this.goBack.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.checkConditions = this.checkConditions.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrevious = this.onPrevious.bind(this)
    this.initTab = this.initTab.bind(this)
    this.onTargetClick = this.onTargetClick.bind(this)
    this.onBroadcastClick = this.onBroadcastClick.bind(this)
    props.loadCustomerLists()
  }
//  sddsdfas
  componentWillMount () {
    // this.props.loadMyPagesList();
    // if(this.props.pages.length > 0){
    //   this.setState({pageValue: this.props.pages[0].pageId})
    // }
  }
  onNext () {
    /* eslint-disable */
    $('[href="#tab_1"]').removeClass('active')
    $('[href="#tab_2"]').tab('show')
    /* eslint-enable */
    this.setState({tabActive: 'target'})
  }
  onPrevious () {
    /* eslint-disable */
    $('[href="#tab_2"]').removeClass('active')
    $('[href="#tab_1"]').tab('show')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }
  initTab () {
    /* eslint-disable */
    $('[href="#tab_2"]').removeClass('active')
    $('[href="#tab_1"]').tab('show')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }
  onBroadcastClick () {
    /* eslint-disable */
    $('[href="#tab_2"]').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }
  onTargetClick () {
    /* eslint-disable */
    $('[href="#tab_1"]').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'target'})
  }
  handleSendBroadcast (res) {
    this.initTab()
    if (res.status === 'success') {
      this.setState({broadcast: [], list: []})
    }
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentDidMount () {
    document.title = 'KiboPush | Create Broadcast'
    this.scrollToTop()
    let options = []
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {id: this.props.pages[i].pageId, text: this.props.pages[i].pageName}
    }

    this.setState({page: {options: options}})
    this.initializeGenderSelect(this.state.Gender.options)
    this.initializeLocaleSelect(this.state.Locale.options)
    this.initializePageSelect(options)
    this.initTab()
    // if (this.props.pages.length > 0) {
    //   var temp = []
    //   for (var j = 0; j < this.props.pages.length; j++) {
    //     temp.push(this.props.pages[j].pageId)
    //   }
    //   this.setState({pageValue: temp})
    // }

    var compProp = this.props
    var comp = this
    registerAction({
      event: 'admin_subscriber',
      action: function (data) {
        compProp.getAdminSubscriptions()
        comp.setState({showMessengerModal: false})
        comp.msg.success('Subscribed successfully. Click on the test button again to test')
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.broadcasts) {
    }
    if (nextProps.customerLists) {
      let options = []
      for (var j = 0; j < nextProps.customerLists.length; j++) {
        if (!(nextProps.customerLists[j].initialList)) {
          options.push({id: nextProps.customerLists[j]._id, text: nextProps.customerLists[j].listName})
        } else {
          if (nextProps.customerLists[j].content && nextProps.customerLists[j].content.length > 0) {
            options.push({id: nextProps.customerLists[j]._id, text: nextProps.customerLists[j].listName})
          }
        }
      }
      this.setState({lists: options})
      this.initializeListSelect(options)
      if (options.length === 0) {
        this.state.selectedRadio = 'segmentation'
      }
    }
    // if(nextProps.pages.length > 0){
    //   this.setState({pageValue: nextProps.pages[0].pageId})
    // }
  }
  showGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: true})
  }

  closeGuideLinesDialog () {
    this.setState({isShowingModalGuideLines: false})
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
    if (this.titleConvo.value === '') {
      return
    }
    this.setState({convoTitle: this.titleConvo.value})
    this.closeDialog()
  }

  gotoView (event) {
    this.props.history.push({
      pathname: `/broadcasts`

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
  }

  removeComponent (obj) {
    var temp = this.state.list.filter((component) => { return (component.props.id !== obj.id) })
    var temp2 = this.state.broadcast.filter((component) => { return (component.id !== obj.id) })
    this.setState({list: temp, broadcast: temp2})
  }
  checkConditions (pageValue, genderValue, localeValue) {
    let subscribersMatchPages = []
    let subscribersMatchLocale = []
    let subscribersMatchGender = []
    if (pageValue.length > 0) {
      for (var i = 0; i < pageValue.length; i++) {
        for (var j = 0; j < this.props.location.state.subscribers.length; j++) {
          if (this.props.location.state.subscribers[j].pageId.pageId === pageValue[i]) {
            subscribersMatchPages.push(this.props.location.state.subscribers[j])
          }
        }
      }
    }
    if (genderValue.length > 0) {
      for (var k = 0; k < this.props.location.state.subscribers.length; k++) {
        for (var l = 0; l < genderValue.length; l++) {
          if (this.props.location.state.subscribers[k].gender === genderValue[l]) {
            subscribersMatchGender.push(this.props.location.state.subscribers[k])
          }
        }
      }
    }
    if (localeValue.length > 0) {
      for (var m = 0; m < this.props.location.state.subscribers.length; m++) {
        for (var n = 0; n < localeValue.length; n++) {
          if (this.props.location.state.subscribers[m].locale === localeValue[n]) {
            subscribersMatchLocale.push(this.props.location.state.subscribers[m])
          }
        }
      }
    }
    if (pageValue.length > 0 && genderValue.length > 0 && localeValue.length > 0) {
      var result = _.intersection(subscribersMatchPages, subscribersMatchLocale, subscribersMatchGender)
      if (result.length === 0) {
        return false
      }
    } else if (pageValue.length > 0 && genderValue.length) {
      if (_.intersection(subscribersMatchPages, subscribersMatchGender).length === 0) {
        return false
      }
    } else if (pageValue.length > 0 && localeValue.length) {
      if (_.intersection(subscribersMatchPages, subscribersMatchLocale).length === 0) {
        return false
      }
    } else if (genderValue.length > 0 && localeValue.length) {
      if (_.intersection(subscribersMatchGender, subscribersMatchLocale).length === 0) {
        return false
      }
    } else if (pageValue.length > 0 && subscribersMatchPages.length === 0) {
      return false
    } else if (genderValue.length > 0 && subscribersMatchGender.length === 0) {
      return false
    } else if (localeValue.length > 0 && subscribersMatchLocale.length === 0) {
      return false
    }
    return true
  }
  sendConvo () {
    if (this.state.broadcast.length === 0) {
      return
    }
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    var isSegmentedValue = false
    if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 || this.state.localeValue.length > 0) {
      isSegmentedValue = true
    }
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
      var res = this.checkConditions(this.state.pageValue, this.state.genderValue, this.state.localeValue)
      if (res === false) {
        this.msg.error('No subscribers match the selected criteria')
      } else {
        var data = {
          platform: 'facebook',
          payload: this.state.broadcast,
          isSegmented: isSegmentedValue,
          segmentationPageIds: this.state.pageValue,
          segmentationLocale: this.state.localeValue,
          segmentationGender: this.state.genderValue,
          segmentationTimeZone: '',
          title: this.state.convoTitle,
          segmentationList: this.state.listSelected,
          isList: isListValue
        }
        this.props.sendBroadcast(data, this.msg, this.handleSendBroadcast)
        // this.setState({broadcast: [], list: []})
      }
    }
  }

  testConvo () {
    if (this.state.pageValue.length > 1 || this.state.pageValue.length === 0) {
      this.msg.error('Only one page should be selected to test the broadcast')
    } else {
      var check = this.props.adminPageSubscription.filter((obj) => { return obj.pageId.pageId === this.state.pageValue[0] })
      if (check.length <= 0) {
        this.setState({showMessengerModal: true})
        return
      }
      // for (let i = 0; i < this.props.pages.length; i++) {
      //   if (this.props.pages[i].pageId === this.state.pageValue) {
      //     if (!this.props.pages[i].adminSubscriberId) {
            // this.setState({showMessengerModal: true})
            // return
      //     }
      //   }
      // }
      //
      if (this.state.broadcast.length === 0) {
        return
      }
      var isListValue = false
      if (this.state.listSelected.length > 0) {
        isListValue = true
      }
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 || this.state.localeValue.length > 0) {
        isSegmentedValue = true
      }
      var data = {
        platform: 'facebook',
        self: true,
        payload: this.state.broadcast,
        title: this.state.convoTitle,
        isSegmented: isSegmentedValue,
        segmentationPageIds: this.state.pageValue,
        segmentationLocale: this.state.localeValue,
        segmentationGender: this.state.genderValue,
        segmentationTimeZone: '',
        segmentationList: this.state.listSelected,
        isList: isListValue

      }
      this.props.sendBroadcast(data, this.msg)
    }
  }

  newConvo () {
    this.setState({broadcast: [], list: []})
  }

  initializeListSelect (lists) {
    var self = this
    /* eslint-disable */
    $('#selectLists').select2({
    /* eslint-enable */
      data: lists,
      placeholder: 'Select Lists',
      allowClear: true,
      tags: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectLists').on('change', function (e) {
    /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ listSelected: selected })
      }
    })
<<<<<<< HEAD
    /* eslint-disable */
    $('#selectLists').val('').trigger('change')
    /* eslint-enable */
=======

    $('#selectLists').val('').trigger('change')
>>>>>>> 64dfe80d7c0cfca5c21655fe559fcf7ea3dbcc94
  }
  initializePageSelect (pageOptions) {
    var self = this
    /* eslint-disable */
    $('#selectPage').select2({
      /* eslint-enable */
      data: pageOptions,
      placeholder: 'Select Pages - Default: All Pages',
      allowClear: true,
      multiple: true
    })

    // this.setState({pageValue: pageOptions[0].id})

    /* eslint-disable */
    $('#selectPage').on('change', function (e) {
      /* eslint-enable */
      // var selectedIndex = e.target.selectedIndex
      // if (selectedIndex !== '-1') {
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ pageValue: selected })
      }
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
    })
  }
  goBack () {
    this.props.history.push({
      pathname: `/welcomeMessage`
    })
  }
  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'list') {
      this.setState({genderValue: [], localeValue: [], isList: true})
    } if (e.currentTarget.value === 'segmentation') {
      this.setState({listSelected: [], isList: false})
    }
  }
  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
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
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-exclamation m--font-brand' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding how to create broadcasts? Here is the <a href='http://kibopush.com/broadcasts/' target='_blank'>documentation</a>.
                  <br />
                  View Facebook guidelines regarding types of messages here: <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}} onClick={this.showGuideLinesDialog} >Message Types</Link>
                </div>
              </div>
              <div className='row'>
                <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                  <div className='m-portlet m-portlet--mobile'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Create Broadcast
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row'>
                        <div className='col-12'>
                          { this.props.location.state && this.props.location.state.module === 'welcome' &&
                            <div className='pull-right'>
                              <button className='btn btn-primary' style={{marginRight: '10px'}} disabled={(this.state.broadcast.length === 0)} onClick={this.sendConvo}>Save</button>
                              <button className='btn btn-primary' onClick={() => this.goBack()}>Back</button>
                            </div>
                          }
                          {
                            this.state.tabActive === 'broadcast' && this.props.location.state.module === 'convo' &&
                            <div className='pull-right'>
                              <button className='btn btn-primary' style={{marginRight: '10px'}} onClick={this.showResetAlertDialog}>
                                Reset
                              </button>
                              <button className='btn btn-primary' onClick={this.onNext}>
                                Next
                              </button>
                            </div>
                          }
                          {
                            this.state.tabActive === 'target' && this.props.location.state.module === 'convo' &&
                            <div className='pull-right'>
                              <button className='btn btn-primary' style={{marginRight: '10px'}} onClick={this.onPrevious}>
                                Previous
                              </button>
                              <button className='btn btn-primary' style={{marginRight: '10px'}} disabled={(this.state.pageValue === '' || (this.state.broadcast.length === 0))} onClick={this.testConvo}>
                                Test
                              </button>
                              <button id='send' onClick={this.sendConvo} disabled={(this.state.broadcast.length === 0)} className='btn btn-primary'>
                                Send
                              </button>
                            </div>
                          }
                        </div>
                      </div>
                      <div className='row'>
                        <div className='col-12'>
                          <ul className='nav nav-tabs'>
                            <li>
                              <a href='#tab_1' data-toggle='tab' aria-expanded='true' className='broadcastTabs' onClick={this.onBroadcastClick}>Broadcast </a>
                            </li>
                            {
                              this.props.location.state.module === 'convo' &&
                              <li>
                                <a href='#tab_2' data-toggle='tab' aria-expanded='false'className='broadcastTabs' onClick={this.onTargetClick}>Targeting </a>
                              </li>
                            }
                          </ul>
                          <div className='tab-content'>
                            <div className='tab-pane fade active in' id='tab_1'>
                              <div className='row'>
                                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                                  <div className='row' >
                                    <div className='col-3'>
                                      <div className='ui-block hoverbordercomponent' id='text' onClick={() => { var temp = this.state.list; this.msg.info('New Text Component Added'); this.setState({list: [...temp, <Text id={temp.length} key={temp.length} handleText={this.handleText} onRemove={this.removeComponent} removeState />]}) }}>
                                        <div className='align-center'>
                                          <img src='icons/text.png' alt='Text' style={{maxHeight: 25}} />
                                          <h6>Text</h6>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-3'>
                                      <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Image Component Added'); this.setState({list: [...temp, <Image id={temp.length} key={temp.length} handleImage={this.handleImage} onRemove={this.removeComponent} />]}) }}>
                                        <div className='align-center'>
                                          <img src='icons/picture.png' alt='Image' style={{maxHeight: 25}} />
                                          <h6>Image</h6>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-3'>
                                      <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Card Component Added'); this.setState({list: [...temp, <Card id={temp.length} key={temp.length} handleCard={this.handleCard} onRemove={this.removeComponent} />]}) }}>
                                        <div className='align-center'>
                                          <img src='icons/card.png' alt='Card' style={{maxHeight: 25}} />
                                          <h6>Card</h6>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-3'>
                                      <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Gallery Component Added'); this.setState({list: [...temp, <Gallery id={temp.length} key={temp.length} handleGallery={this.handleGallery} onRemove={this.removeComponent} />]}) }}>
                                        <div className='align-center'>
                                          <img src='icons/layout.png' alt='Gallery' style={{maxHeight: 25}} />
                                          <h6>Gallery</h6>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='row'>
                                    <div className='col-3'>
                                      <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Audio Component Added'); this.setState({list: [...temp, <Audio id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />]}) }}>
                                        <div className='align-center'>
                                          <img src='icons/speaker.png' alt='Audio' style={{maxHeight: 25}} />
                                          <h6>Audio</h6>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-3'>
                                      <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New Video Component Added'); this.setState({list: [...temp, <Video id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />]}) }}>
                                        <div className='align-center'>
                                          <img src='icons/video.png' alt='Video' style={{maxHeight: 25}} />
                                          <h6>Video</h6>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-3'>
                                      <div className='ui-block hoverbordercomponent' onClick={() => { var temp = this.state.list; this.msg.info('New File Component Added'); this.setState({list: [...temp, <File id={temp.length} key={temp.length} handleFile={this.handleFile} onRemove={this.removeComponent} />]}) }}>
                                        <div className='align-center'>
                                          <img src='icons/file.png' alt='File' style={{maxHeight: 25}} />
                                          <h6>File</h6>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className='col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                                  <StickyDiv zIndex={1}>
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
                                  {
                                    this.state.isShowingModalGuideLines &&
                                    <ModalContainer style={{width: '500px'}}
                                      onClose={this.closeGuideLinesDialog}>
                                      <ModalDialog style={{width: '500px'}}
                                        onClose={this.closeGuideLinesDialog}>
                                        <h4>Message Types</h4>
                                        <p> Following are the types of broadcasts that can be sent to facebook messenger.</p>
                                        <div className='panel-group accordion' id='accordion1'>
                                          <div className='panel panel-default'>
                                            <div className='panel-heading guidelines-heading'>
                                              <h4 className='panel-title'>
                                                <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Subscription Broadcasts</a>
                                              </h4>
                                            </div>
                                            <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                                              <div className='panel-body'>
                                                <p>Subscription broadcast messages can&#39;t contain ads or promotional materials, but can be sent at any time regardless of time passed since last user activity.</p>
                                              </div>
                                            </div>
                                          </div>
                                          <div className='panel panel-default'>
                                            <div className='panel-heading guidelines-heading'>
                                              <h4 className='panel-title'>
                                                <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Promotional Broadcasts</a>
                                              </h4>
                                            </div>
                                            <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                                              <div className='panel-body'>
                                                Promotional broadcast messages can contain ads and promotional materials, but can only be sent to subscribers who were active in the past 24 hours.
                                              </div>
                                            </div>
                                          </div>
                                          <div className='panel panel-default'>
                                            <div className='panel-heading guidelines-heading'>
                                              <h4 className='panel-title'>
                                                <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_3' aria-expanded='false'>Follow-Up Broadcasts</a>
                                              </h4>
                                            </div>
                                            <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                                              <div className='panel-body'>
                                                After the end of the 24 hours window you have an ability to send "1 follow up message" to these recipients. After that you won&#39;t be able to send them ads or promotional messages until they interact with you again.
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </ModalDialog>
                                    </ModalContainer>
                                  }

                                  {
                                    this.state.showMessengerModal &&
                                    <ModalContainer style={{width: '500px'}}
                                      onClick={() => { this.setState({showMessengerModal: false}) }}
                                      onClose={() => { this.setState({showMessengerModal: false}) }}>
                                      <ModalDialog style={{width: '500px'}}
                                        onClick={() => { this.setState({showMessengerModal: false}) }}
                                        onClose={() => { this.setState({showMessengerModal: false}) }}>
                                        <h3 onClick={() => { this.setState({showMessengerModal: false}) }} >Connect to Messenger:</h3>
                                        <MessengerPlugin
                                          appId={this.props.fbAppId}
                                          pageId={JSON.stringify(this.state.pageValue[0])}
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
                            {
                              this.props.location.state.module === 'convo' &&
                              <div className='tab-pane' id='tab_2'>
                                <div className='row'>
                                  <div className='col-12' style={{paddingLeft: '20px'}}>
                                    <label>Select Page:</label>
                                    <div className='form-group m-form__group'>
                                      <select id='selectPage' style={{width: 200 + '%'}} />
                                    </div>
                                    <label>Select Segmentation:</label>
                                    <div className='radio-buttons' style={{marginLeft: '37px'}}>
                                      <div className='radio'>
                                        <input id='segmentAll'
                                          type='radio'
                                          value='segmentation'
                                          name='segmentationType'
                                          onChange={this.handleRadioButton}
                                          checked={this.state.selectedRadio === 'segmentation'} />
                                        <label>Apply Basic Segmentation</label>
                                      </div>
                                      { this.state.selectedRadio === 'segmentation'
                                        ? <div className='m-form'>
                                          <div className='form-group m-form__group'>
                                            <select id='selectGender' style={{minWidth: 75 + '%'}} />
                                          </div>
                                          <div className='form-group m-form__group' style={{marginTop: '-10px'}}>
                                            <select id='selectLocale' style={{minWidth: 75 + '%'}} />
                                          </div>
                                        </div>
                                      : <div className='m-form'>
                                        <div className='form-group m-form__group'>
                                          <select id='selectGender' style={{minWidth: 75 + '%'}} disabled />
                                        </div>
                                        <div className='form-group m-form__group' style={{marginTop: '-10px'}}>
                                          <select id='selectLocale' style={{minWidth: 75 + '%'}} disabled />
                                        </div>
                                      </div>
                                      }
                                      { (this.state.lists.length === 0)
                                      ? <div className='radio'>
                                        <input id='segmentList'
                                          type='radio'
                                          value='list'
                                          name='segmentationType'
                                          disabled />
                                        <label>Use Segmented Subscribers List</label>
                                        <div style={{marginLeft: '20px'}}><Link to='/segmentedLists' style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}> See Segmentation Here</Link></div>
                                      </div>
                                      : <div className='radio'>
                                        <input id='segmentList'
                                          type='radio'
                                          value='list'
                                          name='segmentationType'
                                          onChange={this.handleRadioButton}
                                          checked={this.state.selectedRadio === 'list'} />
                                        <label>Use Segmented Subscribers List</label>
                                        <div style={{marginLeft: '20px'}}><Link to='/segmentedLists' style={{color: '#5867dd', cursor: 'pointer', fontSize: 'small'}}> See Segmentation Here</Link></div>
                                      </div>
                                      }
                                      <div className='m-form'>
                                        { this.state.selectedRadio === 'list'
                                      ? <div className='form-group m-form__group'>
                                        <select id='selectLists' style={{minWidth: 75 + '%'}} />
                                      </div>
                                      : <div className='form-group m-form__group'>
                                        <select id='selectLists' style={{minWidth: 75 + '%'}} disabled />
                                      </div>
                                      }
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              }
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
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    showFileUploading: (state.broadcastsInfo.showFileUploading),
    pages: (state.pagesInfo.pages),
    fileInfo: (state.convosInfo.fileInfo),
    user: (state.basicInfo.user),
    fbAppId: state.basicInfo.fbAppId,
    adminPageSubscription: state.basicInfo.adminPageSubscription,
    customerLists: (state.listsInfo.customerLists)
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
      getFbAppId: getFbAppId,
      createWelcomeMessage: createWelcomeMessage,
      getAdminSubscriptions: getAdminSubscriptions,
      loadCustomerLists: loadCustomerLists
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateConvo)
