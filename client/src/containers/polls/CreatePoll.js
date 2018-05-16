/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { addPoll, loadPollsList, sendpoll, sendPollDirectly, getAllPollResults } from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import AlertContainer from 'react-alert'
import { loadCustomerLists } from '../../redux/actions/customerLists.actions'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import { checkConditions } from './utility'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { loadTags } from '../../redux/actions/tags.actions'

class CreatePoll extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.createPoll = this.createPoll.bind(this)
    props.getuserdetails()
    props.loadSubscribersList()
    props.loadCustomerLists()
    props.loadTags()
    this.state = {
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
      tagValue: [],
      alert: false,
      statement: '',
      option1: '',
      option2: '',
      option3: '',
      steps: [],
      selectedRadio: '',
      listSelected: '',
      isList: false,
      isShowingModal: false,
      lists: [],
      pollValue: [],
      showDropDown: false
    }
    this.updateStatment = this.updateStatment.bind(this)
    this.updateOptions = this.updateOptions.bind(this)
    this.handlePageChange = this.handlePageChange.bind(this)
    this.handleGenderChange = this.handleGenderChange.bind(this)
    this.handleLocaleChange = this.handleLocaleChange.bind(this)
    this.initializePageSelect = this.initializePageSelect.bind(this)
    this.initializeGenderSelect = this.initializeGenderSelect.bind(this)
    this.initializeTagSelect = this.initializeTagSelect.bind(this)
    this.initializeLocaleSelect = this.initializeLocaleSelect.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.initializeListSelect = this.initializeListSelect.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.goToSend = this.goToSend.bind(this)
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.initializePollSelect = this.initializePollSelect.bind(this)
  }
  showDropDown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }

  componentDidMount () {
    document.title = 'KiboPush | Create Poll'
    let options = []
    for (var i = 0; i < this.props.pages.length; i++) {
      options[i] = {id: this.props.pages[i].pageId, text: this.props.pages[i].pageName}
    }
    let pollOptions = []
    for (var j = 0; j < this.props.polls.length; j++) {
      pollOptions[j] = {id: this.props.polls[j]._id, text: this.props.polls[j].statement}
    }
    this.props.getAllPollResults()
    this.setState({page: {options: options}})
    this.initializeGenderSelect(this.state.Gender.options)
    this.initializeLocaleSelect(this.state.Locale.options)
    this.initializePageSelect(options)
    this.initializePollSelect(pollOptions)
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }

  initializePollSelect (pollOptions) {
    var self = this
    /* eslint-disable */
    $('#selectPoll').select2({
    /* eslint-enable */
      data: pollOptions,
      placeholder: 'Select Poll',
      allowClear: true,
      multiple: true
    })
    /* eslint-disable */
    $('#selectPoll').on('change', function (e) {
    /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ pollValue: selected })
        console.log('pollValue', self.state.pollValue)
      }
    })
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

      /* eslint-disable */
    $('#selectLists').val('').trigger('change')
      /* eslint-enable */
  }
  initializePageSelect (pageOptions) {
    var self = this
      /* eslint-disable */
    $('#selectPage').select2({
      /* eslint-enable */
      data: pageOptions,
      placeholder: 'Default: All Pages',
      allowClear: true,
      multiple: true
    })
      /* eslint-disable */
    $('#selectPage').on('change', function (e) {
      /* eslint-enable */
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

  initializeTagSelect (tagOptions) {
    let remappedOptions = []

    for (let i = 0; i < tagOptions.length; i++) {
      let temp = {
        id: tagOptions[i].tag,
        text: tagOptions[i].tag
      }
      remappedOptions[i] = temp
    }
    var self = this
      /* eslint-disable */
    $('#selectTags').select2({
      /* eslint-enable */
      data: remappedOptions,
      placeholder: 'Select Tags',
      allowClear: true,
      multiple: true
    })
      /* eslint-disable */
    $('#selectTags').on('change', function (e) {
      /* eslint-enable */
      var selectedIndex = e.target.selectedIndex
      if (selectedIndex !== '-1') {
        var selectedOptions = e.target.selectedOptions
        var selected = []
        for (var i = 0; i < selectedOptions.length; i++) {
          var selectedOption = selectedOptions[i].value
          selected.push(selectedOption)
        }
        self.setState({ tagValue: selected })
      }
    })
      /* eslint-disable */
    $('#selectTags').val('').trigger('change')
      /* eslint-enable */
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
  componentWillReceiveProps (nextProps) {
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
    if (this.props.tags) {
      this.initializeTagSelect(this.props.tags)
    }
    if (nextProps.pollCreated) {
      this.props.history.push({
        pathname: '/poll'
      })
    }
  }
  handlePageChange (value) {
    var temp = value.split(',')
    this.setState({ pageValue: temp })
  }

  handleGenderChange (value) {
    var temp = value.split(',')
    this.setState({ genderValue: temp })
  }

  handleLocaleChange (value) {
    var temp = value.split(',')
    this.setState({ localeValue: temp })
  }
  createPoll () {
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    var options = []
    if (this.state.option1 === '' || this.state.option2 === '' ||
      this.state.option3 === '' || this.state.statement === '') {
      this.setState({alert: true})
    } else {
      if (this.state.option1 !== '') {
        options.push(this.state.option1)
      }
      if (this.state.option2 !== '') {
        options.push(this.state.option2)
      }
      if (this.state.option3 !== '') {
        options.push(this.state.option3)
      }
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 ||
                    this.state.localeValue.length > 0 || this.state.tagValue.length > 0 || this.state.pollValue.length > 0) {
        isSegmentedValue = true
      }
      let tagIDs = []
      for (let i = 0; i < this.props.tags.length; i++) {
        for (let j = 0; j < this.state.tagValue.length; j++) {
          if (this.props.tags[i].tag === this.state.tagValue[j]) {
            tagIDs.push(this.props.tags[i]._id)
          }
        }
      }
      this.props.addPoll('', {
        platform: 'Facebook',
        datetime: Date.now(),
        statement: this.state.statement,
        sent: 0,
        options: options,
        isSegmented: isSegmentedValue,
        segmentationPageIds: this.state.pageValue,
        segmentationGender: this.state.genderValue,
        segmentationLocale: this.state.localeValue,
        segmentationTags: tagIDs,
        segmentationPoll: this.state.pollValue,
        isList: isListValue,
        segmentationList: this.state.listSelected
      })
    }
  }

  updateStatment (e) {
    this.setState({statement: e.target.value})
  }

  updateOptions (e, opt) {
    switch (opt) {
      case 1:
        this.setState({option1: e.target.value})
        break
      case 2:
        this.setState({option2: e.target.value})
        break
      case 3:
        this.setState({option3: e.target.value})
        break

      default:
        break
    }
  }

  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'list') {
      this.setState({genderValue: [], localeValue: [], tagValue: []})
      /* eslint-disable */
        $('#selectLocale').val('').trigger('change')
        $('#selectGender').val('').trigger('change')
        $('#selectTags').val('').trigger('change')
      /* eslint-enable */
    } if (e.currentTarget.value === 'segmentation') {
      this.setState({listSelected: [], isList: false})
      /* eslint-disable */
        $('#selectLists').val('').trigger('change')
      /* eslint-enable */
    }
  }
  goToSend () {
    var isListValue = false
    if (this.state.listSelected.length > 0) {
      isListValue = true
    }
    var options = []
    if (this.state.option1 === '' || this.state.option2 === '' ||
      this.state.option3 === '' || this.state.statement === '') {
      this.setState({alert: true})
    } else {
      if (this.state.option1 !== '') {
        options.push(this.state.option1)
      }
      if (this.state.option2 !== '') {
        options.push(this.state.option2)
      }
      if (this.state.option3 !== '') {
        options.push(this.state.option3)
      }
      var isSegmentedValue = false
      if (this.state.pageValue.length > 0 || this.state.genderValue.length > 0 ||
                    this.state.localeValue.length > 0 || this.state.tagValue.length > 0 || this.state.pollValue.length > 0) {
        isSegmentedValue = true
      }
      let polls = {
        selectedPolls: this.state.pollValue,
        pollResponses: this.props.allResponses
      }
      var res = checkConditions(this.state.pageValue, this.state.genderValue, this.state.localeValue, this.state.tagValue, this.props.subscribers, polls)
      if (res === false) {
        this.msg.error('No subscribers match the selected criteria')
      } else {
        let tagIDs = []
        for (let i = 0; i < this.props.tags.length; i++) {
          for (let j = 0; j < this.state.tagValue.length; j++) {
            if (this.props.tags[i].tag === this.state.tagValue[j]) {
              tagIDs.push(this.props.tags[i]._id)
            }
          }
        }
        this.props.sendPollDirectly({
          platform: 'Facebook',
          datetime: Date.now(),
          statement: this.state.statement,
          sent: 0,
          options: options,
          isSegmented: isSegmentedValue,
          segmentationPageIds: this.state.pageValue,
          segmentationGender: this.state.genderValue,
          segmentationLocale: this.state.localeValue,
          segmentationTags: tagIDs,
          isList: isListValue,
          segmentationPoll: this.state.pollValue,
          segmentationList: this.state.listSelected
        }, this.msg)
      }
    }
  }
  render () {
    // const { disabled, stayOpen } = this.state
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Create Poll</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='row'>
                <div className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
                  <div className='m-portlet' style={{height: '100%'}}>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                          Ask Facebook Subscribers a Question
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        <div className='col-xl-8 order-2 order-xl-1' />
                        <div className='col-xl-4 order-1 order-xl-2 m--align-right'>
                          {
                            this.state.isShowingModal &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialog}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialog}>
                                <p>Do you want to send this poll right away or save it for later use? </p>
                                <div style={{width: '100%', textAlign: 'center'}}>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    <button className='btn btn-primary' onClick={() => {
                                      this.closeDialog()
                                      this.goToSend()
                                    }}>
                                      Send
                                    </button>
                                  </div>
                                  <div style={{display: 'inline-block', padding: '5px'}}>
                                    <button className='btn btn-primary' onClick={() => {
                                      this.createPoll()
                                    }}>
                                      Save
                                    </button>
                                  </div>
                                </div>
                              </ModalDialog>
                            </ModalContainer>
                          }
                        </div>
                      </div>
                      <div className='m-form'>
                        <div id='question' className='form-group m-form__group'>
                          <label className='control-label'>Ask something...</label>
                          <textarea className='form-control'
                            value={this.state.statement}
                            placeholder='Enter Question'
                            onChange={(e) => this.updateStatment(e)} />
                        </div>
                        <div style={{top: '10px'}}>
                          <label className='control-label'> Add 3 responses</label>
                          <fieldset className='input-group-vertical'>
                            <div id='responses' className='form-group m-form__group'>
                              <label className='sr-only'>Response1</label>
                              <input type='text' className='form-control'
                                value={this.state.option1}
                                onChange={(e) => this.updateOptions(e, 1)}
                                placeholder='Response 1' maxLength='20' />
                            </div>
                            <div className='form-group m-form__group'>
                              <label className='sr-only'>Response2</label>
                              <input type='text' className='form-control'
                                value={this.state.option2}
                                onChange={(e) => this.updateOptions(e, 2)}
                                placeholder='Response 2' maxLength='20' />
                            </div>
                            <div className='form-group m-form__group'>
                              <label className='sr-only'>Response3</label>
                              <input type='text' className='form-control'
                                value={this.state.option3}
                                onChange={(e) => this.updateOptions(e, 3)}
                                placeholder='Response 3' maxLength='20' />
                            </div>
                          </fieldset>
                        </div>
                      </div>
                      { this.state.alert &&
                        <center>
                          <Alert type='danger' style={{marginTop: '30px'}}>
                            You have either left one or more responses empty or you
                            have not asked anything. Please ask something and fill all
                            three responses in order to create the poll.
                          </Alert>
                        </center>
                      }
                    </div>
                    <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                      <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px'}}>
                        <button className='btn btn-primary'
                          onClick={this.showDialog}> Create Poll
                        </button>
                        <Link
                          to='/poll'
                          className='btn btn-secondary' style={{'marginLeft': '10px'}}>
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div id='target' className='col-lg-4 col-md-4 col-sm-4 col-xs-12'>
                  <div className='m-portlet' style={{height: '100%'}}>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                          Targeting
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <label>Select Page:</label>
                      <div className='form-group m-form__group'>
                        <select id='selectPage' style={{minWidth: 75 + '%'}} />
                      </div>
                      <label>Select Segmentation:</label>
                      <div className='radio-buttons' style={{marginLeft: '20px'}}>
                        <div className='radio'>
                          <input id='segmentAll'
                            type='radio'
                            value='segmentation'
                            name='segmentationType'
                            onChange={this.handleRadioButton}
                            checked={this.state.selectedRadio === 'segmentation'} />
                          <label>Apply Basic Segmentation</label>
                          { this.state.selectedRadio === 'segmentation'
                          ? <div className='m-form'>
                            <div className='form-group m-form__group' style={{marginTop: '10px'}}>
                              <select id='selectGender' style={{minWidth: 75 + '%'}} />
                            </div>
                            <div className='form-group m-form__group' style={{marginTop: '-18px'}}>
                              <select id='selectLocale' style={{minWidth: 75 + '%'}} />
                            </div>
                            <div className='form-group m-form__group' style={{marginTop: '-18px'}}>
                              <select id='selectTags' style={{minWidth: 75 + '%'}} />
                            </div>
                            <div className='form-group m-form__group row' style={{marginTop: '-18px', marginBottom: '20px'}}>
                              <div className='col-lg-8 col-md-8 col-sm-8'>
                                <select id='selectPoll' style={{minWidth: 75 + '%'}} />
                              </div>
                              <div className='m-dropdown m-dropdown--inline m-dropdown--arrow col-lg-4 col-md-4 col-sm-4' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDown}>
                                <a href='#' className='m-portlet__nav-link m-dropdown__toggle btn m-btn m-btn--link'>
                                  <i className='la la-info-circle' />
                                </a>
                                {
                                  this.state.showDropDown &&
                                  <div className='m-dropdown__wrapper' style={{marginLeft: '-170px'}}>
                                    <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                                    <div className='m-dropdown__inner'>
                                      <div className='m-dropdown__body'>
                                        <div className='m-dropdown__content'>
                                          <label>Select a poll to send this newly created poll to only those subscribers who responded to the selected polls.</label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                }
                              </div>
                            </div>
                          </div>
                          : <div className='m-form'>
                            <div className='form-group m-form__group' style={{marginTop: '10px'}}>
                              <select id='selectGender' style={{minWidth: 75 + '%'}} disabled />
                            </div>
                            <div className='form-group m-form__group' style={{marginTop: '-18px'}}>
                              <select id='selectLocale' style={{minWidth: 75 + '%'}} disabled />
                            </div>
                            <div className='form-group m-form__group' style={{marginTop: '-18px'}}>
                              <select id='selectTags' style={{minWidth: 75 + '%'}} disabled />
                            </div>
                            <div className='form-group m-form__group row' style={{marginTop: '-18px', marginBottom: '20px'}}>
                              <div className='col-lg-8 col-md-8 col-sm-8'>
                                <select id='selectPoll' style={{minWidth: 75 + '%'}} disabled />
                              </div>
                              <div className='m-dropdown m-dropdown--inline m-dropdown--arrow col-lg-4 col-md-4 col-sm-4' data-dropdown-toggle='click' aria-expanded='true' onClick={this.showDropDown}>
                                <a href='#' className='m-portlet__nav-link m-dropdown__toggle btn m-btn m-btn--link'>
                                  <i className='la la-info-circle' />
                                </a>
                                {
                                  this.state.showDropDown &&
                                  <div className='m-dropdown__wrapper' style={{marginLeft: '-170px'}}>
                                    <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                                    <div className='m-dropdown__inner'>
                                      <div className='m-dropdown__body'>
                                        <div className='m-dropdown__content'>
                                          <label>Select a poll to send this newly created poll to only those subscribers who responded to the selected polls.</label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                }
                              </div>
                            </div>
                          </div>
                          }
                        </div>
                        { this.state.lists.length === 0
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
                          ? <div className='form-group m-form__group'><select id='selectLists' /></div>
                          : <div className='form-group m-form__group'><select id='selectLists' disabled /></div>
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
    )
  }
}

function mapStateToProps (state) {
  console.log('CreatePoll state', state)
  return {
    pollCreated: (state.pollsInfo.pollCreated),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    customerLists: (state.listsInfo.customerLists),
    subscribers: (state.subscribersInfo.subscribers),
    tags: (state.tagsInfo.tags),
    polls: (state.pollsInfo.polls),
    allResponses: (state.pollsInfo.allResponses)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getAllPollResults: getAllPollResults,
    loadPollsList: loadPollsList,
    addPoll: addPoll,
    getuserdetails: getuserdetails,
    loadCustomerLists: loadCustomerLists,
    sendpoll: sendpoll,
    loadSubscribersList: loadSubscribersList,
    sendPollDirectly: sendPollDirectly,
    loadTags: loadTags
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePoll)
