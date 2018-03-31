/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { assignTags, unassignTags, loadTags, createTag } from '../../redux/actions/tags.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import fileDownload from 'js-file-download'
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Popover, PopoverHeader, PopoverBody, UncontrolledTooltip } from 'reactstrap'
import Select from 'react-select'
import AlertContainer from 'react-alert'
var json2csv = require('json2csv')

class Subscriber extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      subscribersData: [],
      subscribersDataAll: [],
      totalLength: 0,
      filterByGender: '',
      filterByLocale: '',
      filterByPage: '',
      filteredData: '',
      filterByTag: '',
      searchValue: '',
      selectedSubscribers: [],
      dropdownActionOpen: false,
      popoverAddTagOpen: false,
      popoverRemoveTagOpen: false,
      addTag: '',
      removeTag: '',
      options: [],
      selectAllChecked: null,
      saveEnable: false
    }
    props.loadMyPagesList()
    props.loadSubscribersList()
    props.loadTags()
    this.handleAdd = this.handleAdd.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.toggleTag = this.toggleTag.bind(this)
    this.toggleAdd = this.toggleAdd.bind(this)
    this.toggleRemove = this.toggleRemove.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handleFilterByGender = this.handleFilterByGender.bind(this)
    this.handleFilterByLocale = this.handleFilterByLocale.bind(this)
    this.handleFilterByPage = this.handleFilterByPage.bind(this)
    this.handleFilterByTag = this.handleFilterByTag.bind(this)
    this.stackGenderFilter = this.stackGenderFilter.bind(this)
    this.stackPageFilter = this.stackPageFilter.bind(this)
    this.stackLocaleFilter = this.stackLocaleFilter.bind(this)
    this.exportRecords = this.exportRecords.bind(this)
    this.prepareExportData = this.prepareExportData.bind(this)
    this.handleSubscriberClick = this.handleSubscriberClick.bind(this)
    this.showAddTag = this.showAddTag.bind(this)
    this.showRemoveTag = this.showRemoveTag.bind(this)
    this.addTags = this.addTags.bind(this)
    this.handleSaveTags = this.handleSaveTags.bind(this)
    this.createAssignPayload = this.createAssignPayload.bind(this)
    this.createUnassignPayload = this.createUnassignPayload.bind(this)
    this.removeTags = this.removeTags.bind(this)
    this.handleCreateTag = this.handleCreateTag.bind(this)
  }
  handleAdd (value) {
    var index = 0
    if (value) {
      for (var i = 0; i < this.props.tags.length; i++) {
        if (this.props.tags[i].tag !== value.label) {
          index++
        }
      }
      if (index === this.props.tags.length) {
        this.props.createTag(value.label, this.handleCreateTag, this.msg)
      } else {
        this.setState({
          saveEnable: true,
          addTag: value
        })
      }
    } else {
      this.setState({
        saveEnable: false,
        addTag: value
      })
    }
  }
  handleCreateTag () {
    this.setState({
      saveEnable: false
    })
  }
  createUnassignPayload () {
    var payload = {}
    var selectedIds = []
    var subscribers = this.state.subscribersData
    for (var i = 0; i < subscribers.length; i++) {
      var index = 0
      if (subscribers[i].selected && subscribers[i].tags) {
        for (var j = 0; j < subscribers[i].tags.length; j++) {
          if (subscribers[i].tags[j] !== this.state.removeTag.label) {
            index++
          }
        }
        if (index !== subscribers[i].tags.length) {
          selectedIds.push(subscribers[i]._id)
        }
      }
    }
    payload.subscribers = selectedIds
    payload.tagId = this.state.removeTag.value
    this.setState({
      selectedSubscribers: selectedIds
    })
    return payload
  }
  createAssignPayload () {
    var payload = {}
    var selectedIds = []
    var subscribers = this.state.subscribersData
    for (var i = 0; i < subscribers.length; i++) {
      var index = 0
      if (subscribers[i].selected && subscribers[i].tags) {
        for (var j = 0; j < subscribers[i].tags.length; j++) {
          if (subscribers[i].tags[j] !== this.state.addTag.label) {
            index++
          }
        }
        if (index === subscribers[i].tags.length) {
          selectedIds.push(subscribers[i]._id)
        }
      }
    }
    payload.subscribers = selectedIds
    payload.tagId = this.state.addTag.value
    this.setState({
      selectedSubscribers: selectedIds
    })
    return payload
  }
  addTags () {
    var payload = this.createAssignPayload()
    if (payload.subscribers.length > 0) {
      this.props.assignTags(payload, this.handleSaveTags, this.msg)
    } else {
      this.msg.error('Select relevant subscribers')
    }
  }
  handleSaveTags () {
    this.props.loadSubscribersList()
    this.setState({
      selectAllChecked: false
    })
  }

  removeTags () {
    var payload = this.createUnassignPayload()
    if (payload.subscribers.length > 0) {
      this.props.unassignTags(payload, this.handleSaveTags, this.msg)
    } else {
      this.msg.error('Select relevant subscribers')
    }
  }
  handleRemove (value) {
    this.setState({ removeTag: value })
  }
  componentDidMount () {
    document.title = 'KiboPush | Subscribers'
  }
  componentDidUpdate () {
  }
  toggleTag () {
    this.setState({
      dropdownActionOpen: !this.state.dropdownActionOpen
    })
    if (this.state.popoverAddTagOpen) {
      this.setState({
        popoverAddTagOpen: false
      })
    }
    if (this.state.popoverRemoveTagOpen) {
      this.setState({
        popoverRemoveTagOpen: false
      })
    }
  }
  toggleAdd () {
    this.setState({
      popoverAddTagOpen: !this.state.popoverAddTagOpen
    })
  }
  toggleRemove () {
    this.setState({
      popoverRemoveTagOpen: !this.state.popoverRemoveTagOpen
    })
  }
  showAddTag () {
    this.setState({
      addTag: null,
      popoverAddTagOpen: true
    })
  }
  showRemoveTag () {
    this.setState({
      removeTag: null,
      popoverRemoveTagOpen: true
    })
  }

  searchSubscriber (event) {
    this.setState({searchValue: event.target.value})
    var filtered = []
    var data = this.props.subscribers
    if (this.state.filteredData !== '') {
      data = this.state.filteredData
    }
    for (let i = 0; i < data.length; i++) {
      var fullName = data[i].firstName + ' ' + data[i].lastName
      if (data[i].firstName.toLowerCase().includes((event.target.value).toLowerCase()) || data[i].lastName.toLowerCase().includes((event.target.value).toLowerCase()) || fullName.toLowerCase().includes((event.target.value).toLowerCase())) {
        filtered.push(data[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  displayData (n, subscribers) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > subscribers.length) {
      limit = subscribers.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = subscribers[i]
      index++
    }
    this.setState({subscribersData: data, subscribersDataAll: subscribers})
  }
  handleSubscriberClick (e) {
    var subscribers = this.state.subscribersData
    if (e.target.value === 'All') {
      if (e.target.checked) {
        this.setState({
          selectAllChecked: true
        })
        for (var i = 0; i < this.state.subscribersData.length; i++) {
          subscribers[i].selected = true
        }
      } else {
        this.setState({
          selectAllChecked: false
        })
        for (var j = 0; j < this.state.subscribersData.length; j++) {
          subscribers[j].selected = false
        }
      }
      this.setState({subscribersData: subscribers})
      return
    }
    if (e.target.value !== '') {
      if (e.target.checked) {
        subscribers[e.target.value].selected = true
        this.setState({subscribersData: subscribers})
      } else {
        subscribers[e.target.value].selected = false
        this.setState({subscribersData: subscribers})
      }
    }
  }
  prepareExportData () {
    var data = []
    var subscriberObj = {}
    for (var i = 0; i < this.state.subscribersData.length; i++) {
      var subscriber = this.state.subscribersData[i]
      subscriberObj = {
        'Profile Picture': subscriber.profilePic,
        'Name': `${subscriber.firstName} ${subscriber.lastName}`,
        'Page': subscriber.pageId.pageName,
        'PhoneNumber': subscriber.phoneNumber,
        'Email': subscriber.email,
        'Source': subscriber.isSubscribedByPhoneNumber ? 'PhoneNumber' : 'Other',
        'Locale': subscriber.locale,
        'Gender': subscriber.gender
      }
      data.push(subscriberObj)
    }
    return data
  }
  exportRecords () {
    var data = this.prepareExportData()
    var info = data
    var keys = []
    var val = info[0]

    for (var j in val) {
      var subKey = j
      keys.push(subKey)
    }
    json2csv({ data: info, fields: keys }, function (err, csv) {
      if (err) {
      } else {
        fileDownload(csv, 'SubscriberList.csv')
      }
    })
  }
  handlePageClick (data) {
    this.displayData(data.selected, this.state.subscribersDataAll)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.subscribers) {
      this.displayData(0, nextProps.subscribers)
      this.setState({ totalLength: nextProps.subscribers.length })
    }
    if (nextProps.tags) {
      var tagOptions = []
      for (var i = 0; i < nextProps.tags.length; i++) {
        tagOptions.push({'value': nextProps.tags[i]._id, 'label': nextProps.tags[i].tag})
      }
      this.setState({
        options: tagOptions
      })
    }
  }
  stackGenderFilter (filteredData) {
    if (this.state.filterByGender !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].gender === this.state.filterByGender) {
          filtered.push(this.props.subscribers[i])
        }
      }
      filteredData = filtered
    }
    return filteredData
  }

  stackLocaleFilter (filteredData) {
    if (this.state.filterByLocale !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].locale === this.state.filterByLocale) {
          filtered.push(this.props.subscribers[i])
        }
      }
      filteredData = filtered
    }
    return filteredData
  }
  stackPageFilter (filteredData) {
    if (this.state.filterByPage !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].pageId && (filteredData[i].pageId.pageId === this.state.filterByPage)) {
          filtered.push(this.props.subscribers[i])
        }
      }
      filteredData = filtered
    }
    return filteredData
  }
  stackTagFilter (filteredData) {
    if (this.state.filterByTag !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].tags) {
          for (var j = 0; j < filteredData[i].tags.length; j++) {
            if (filteredData[i].tags[j] === this.state.filterByTag) {
              filtered.push(filteredData[i])
              break
            }
          }
        }
      }
      filteredData = filtered
    }
    return filteredData
  }

  handleFilterByTag (e) {
    this.setState({filterByTag: e.target.value, searchValue: ''})
    var filteredData = this.props.subscribers
    filteredData = this.stackGenderFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
    filteredData = this.stackPageFilter(filteredData)
    var filtered = []
    if (e.target.value !== '') {
      for (var k = 0; k < filteredData.length; k++) {
        if (filteredData[k].tags) {
          for (var i = 0; i < filteredData[k].tags.length; i++) {
            if (filteredData[k].tags[i] === e.target.value) {
              filtered.push(filteredData[k])
              break
            }
          }
        }
      }
      filteredData = filtered
    }
    this.setState({filteredData: filteredData})
    this.displayData(0, filteredData)
    this.setState({ totalLength: filteredData.length })
  }
  handleFilterByPage (e) {
    this.setState({filterByPage: e.target.value, searchValue: ''})
    var filteredData = this.props.subscribers
    filteredData = this.stackGenderFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
    filteredData = this.stackTagFilter(filteredData)
    var filtered = []
    if (e.target.value !== '') {
      for (var k = 0; k < filteredData.length; k++) {
        if (filteredData[k].pageId && (filteredData[k].pageId.pageId === e.target.value)) {
          filtered.push(filteredData[k])
        }
      }
      filteredData = filtered
    }
    this.setState({filteredData: filteredData})
    this.displayData(0, filteredData)
    this.setState({ totalLength: filteredData.length })
  }

  handleFilterByGender (e) {
    this.setState({filterByGender: e.target.value, searchValue: ''})
    var filteredData = this.props.subscribers
    filteredData = this.stackPageFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
    filteredData = this.stackTagFilter(filteredData)
    var filtered = []
    if (e.target.value !== '') {
      for (var k = 0; k < filteredData.length; k++) {
        if (filteredData[k].gender && (filteredData[k].gender === e.target.value)) {
          filtered.push(filteredData[k])
        }
      }
      filteredData = filtered
    }
    this.setState({filteredData: filteredData})
    this.displayData(0, filteredData)
    this.setState({ totalLength: filteredData.length })
  }

  handleFilterByLocale (e) {
    this.setState({filterByLocale: e.target.value, searchValue: ''})
    var filteredData = this.props.subscribers
    filteredData = this.stackPageFilter(filteredData)
    filteredData = this.stackGenderFilter(filteredData)
    filteredData = this.stackTagFilter(filteredData)
    var filtered = []
    if (e.target.value !== '') {
      for (var k = 0; k < filteredData.length; k++) {
        if (filteredData[k].locale && (filteredData[k].locale === e.target.value)) {
          filtered.push(filteredData[k])
        }
      }
      filteredData = filtered
    }
    this.setState({filteredData: filteredData})
    this.displayData(0, filteredData)
    this.setState({ totalLength: filteredData.length })
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }

    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Manage Subscribers</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
                this.props.pages && this.props.pages.length === 0 &&
                <div className='alert alert-success'>
                  <h4 className='block'>0 Connected Pages</h4>
                    You do not have any connected pages. Unless you do not connect any pages, you won't be able to invite subscribers. PLease click <Link to='/addPages' style={{color: 'blue', cursor: 'pointer'}}> here </Link> to connect your facebook page.
                  </div>
              }
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  <a href='http://kibopush.com/subscribers/' target='_blank'>Click Here </a> to learn how you can get more subscribers.
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                  <div className='m-portlet m-portlet--mobile'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Page Subscribers
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        {this.props.pages && this.props.pages.length > 0
                          ? <Link to='/invitesubscribers' disabled>
                            <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                              <span>
                                <i className='la la-user-plus' />
                                <span>
                                  Invite Subscribers
                                </span>
                              </span>
                            </button>
                          </Link>
                          : <Link disabled>
                            <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled>
                              <span>
                                <i className='la la-user-plus' />
                                <span>
                                  Invite Subscribers
                                </span>
                              </span>
                            </button>
                          </Link>
                      }
                      </div>
                    </div>

                    <div className='m-portlet__body'>
                      { this.props.subscribers && this.props.subscribers.length > 0
                        ? <div>
                          <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                            <div className='row align-items-center'>
                              <div className='col-xl-12 order-2 order-xl-1'>
                                <div className='form-group m-form__group row align-items-center'>
                                  <div className='col-md-12'>
                                    <div className='m-input-icon m-input-icon--left'>
                                      <input type='text' style={{width: '33%'}} className='form-control m-input m-input--solid' value={this.state.searchValue} placeholder='Search...' id='generalSearch' onChange={this.searchSubscriber} />
                                      <span className='m-input-icon__icon m-input-icon__icon--left'>
                                        <span><i className='la la-search' /></span>
                                      </span>
                                    </div>
                                  </div>
                                  <div className='row filters' style={{marginTop: '25px', display: 'flex'}}>

                                    <div className='col-md-6'>
                                      <div className='m-form__group m-form__group--inline'>
                                        <div className='col-md-2' style={{marginTop: '10px'}}>
                                          <label style={{width: '60px'}}>Gender:</label>
                                        </div>
                                        {/* <div className='m-form__control'>
                                      <div className='btn-group bootstrap-select form-control m-bootstrap-select m-bootstrap-select--solid dropup'><button type='button' className='btn dropdown-toggle bs-placeholder btn-default' data-toggle='dropdown' role='button' data-id='m_form_status' title='All' aria-expanded='false'><span className='filter-option pull-left'>All</span>&nbsp;<span className='bs-caret'><span className='caret' /></span></button><div className='dropdown-menu open' role='combobox'><ul className='dropdown-menu inner' role='listbox' aria-expanded='false'><li data-original-index='0' className='selected'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='true'><span className='text'>All</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='1'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>Male</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='2'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>Female</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='3'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>Other</span><span className='glyphicon glyphicon-ok check-mark' /></a></li></ul>
                                      </div> */}
                                        <div className='col-md-4 m-form__control'>
                                          <select className='custom-select' id='m_form_status' style={{width: '250px'}} tabIndex='-98' value={this.state.filterByGender} onChange={this.handleFilterByGender}>
                                            <option key='' value='' disabled>Filter by Gender...</option>
                                            <option key='ALL' value=''>All</option>
                                            <option key='male' value='male'>Male</option>
                                            <option key='female' value='female'>Female</option>
                                            <option key='other' value='other'>Other</option>
                                          </select>
                                        </div>
                                      </div>
                                      <div className='d-md-none m--margin-bottom-10' />
                                    </div>
                                    <div className='col-md-6'>
                                      <div className='m-form__group m-form__group--inline'>
                                        <div className='col-md-2' style={{marginTop: '10px'}}>
                                          <label style={{width: '60px'}}>Page:</label>
                                        </div>
                                        <div className='col-md-4 m-form__control'>
                                          <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.filterByPage} onChange={this.handleFilterByPage}>
                                            <option key='' value='' disabled>Filter by Page...</option>
                                            <option key='ALL' value=''>ALL</option>
                                            {
                                              this.props.pages.map((page, i) => (
                                                <option key={i} value={page.pageId}>{page.pageName}</option>
                                              ))
                                            }
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-md-6' style={{marginTop: '20px'}}>
                                      <div className='m-form__group m-form__group--inline'>
                                        <div className='col-md-2' style={{marginTop: '10px'}}>
                                          <label style={{width: '60px'}}>Locale:</label>
                                        </div>
                                        <div className='col-md-4 m-form__control'>
                                          {/* <div className='btn-group bootstrap-select form-control m-bootstrap-select m-bootstrap-select--solid'>
                                        <button type='button' className='btn dropdown-toggle bs-placeholder btn-default' data-toggle='dropdown' role='button' data-id='m_form_type' title='All'><span className='filter-option pull-left'>All</span>&nbsp;<span className='bs-caret'><span className='caret' /></span></button>
                                        <div className='dropdown-menu open' role='combobox'>
                                          <ul className='dropdown-menu inner' role='listbox' aria-expanded='false'><li data-original-index='0' className='selected'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='true'><span className='text'>All</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='1'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>en_US</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='2'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>en_GB</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='3'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>en_AZ</span><span className='glyphicon glyphicon-ok check-mark' /></a></li></ul></div>
                                        */}<select className='custom-select' style={{width: '250px'}} id='m_form_type' tabIndex='-98' value={this.state.filterByLocale} onChange={this.handleFilterByLocale}>
                                          <option key='' value='' disabled>Filter by Locale...</option>
                                          <option key='ALL' value=''>ALL</option>
                                          {
                                            this.props.locales.map((locale, i) => (
                                              <option key={i} value={locale}>{locale}</option>
                                            ))
                                          }
                                        </select>{/* </div> */}
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-md-6' style={{marginTop: '20px'}}>
                                      <div className='m-form__group m-form__group--inline'>
                                        <div className='col-md-2' style={{marginTop: '10px'}}>
                                          <label style={{width: '60px'}}>Tags:</label>
                                        </div>
                                        <div className='col-md-4 m-form__control'>
                                          <select className='custom-select'style={{width: '250px'}} id='m_form_type' tabIndex='-98' value={this.state.filterByTag} onChange={this.handleFilterByTag}>
                                            <option key='' value='' disabled>Filter by Tags...</option>
                                            <option key='ALL' value=''>ALL</option>
                                            {
                                              this.state.options.map((tag, i) => (
                                                <option key={i} value={tag.label}>{tag.label}</option>
                                              ))
                                            }
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-md-12' style={{marginTop: '25px'}}>
                                    <div className='pull-right'>
                                      <Dropdown id='assignTag' isOpen={this.state.dropdownActionOpen} toggle={this.toggleTag}>
                                        <DropdownToggle caret>
                                           Assign Tags in bulk
                                        </DropdownToggle>
                                        <DropdownMenu>
                                          <DropdownItem onClick={this.showAddTag}>Add Tags</DropdownItem>
                                          <DropdownItem onClick={this.showRemoveTag}>Remove Tags</DropdownItem>
                                        </DropdownMenu>
                                      </Dropdown>
                                      <Popover placement='left' isOpen={this.state.popoverAddTagOpen} target='assignTag' toggle={this.toggleAdd}>
                                        <PopoverHeader>Add Tags</PopoverHeader>
                                        <PopoverBody>
                                          <div className='row' style={{minWidth: '250px'}}>
                                            <div className='col-12'>
                                              <label>Select Tags</label>
                                              <Select.Creatable
                                                options={this.state.options}
                                                onChange={this.handleAdd}
                                                value={this.state.addTag}
                                                placeholder='Add User Tags'
                                              />
                                            </div>
                                            {this.state.saveEnable
                                            ? <div className='col-12'>
                                              <button style={{float: 'right', margin: '15px'}}
                                                className='btn btn-primary btn-sm'
                                                onClick={() => {
                                                  this.addTags()
                                                  this.toggleAdd()
                                                }}>Save
                                              </button>
                                            </div>
                                            : <div className='col-12'>
                                              <button style={{float: 'right', margin: '15px'}}
                                                className='btn btn-primary btn-sm'
                                                disabled>
                                                 Save
                                              </button>
                                            </div>
                                          }
                                          </div>
                                        </PopoverBody>
                                      </Popover>
                                      <Popover placement='left' isOpen={this.state.popoverRemoveTagOpen} target='assignTag' toggle={this.toggleRemove}>
                                        <PopoverHeader>Remove Tags</PopoverHeader>
                                        <PopoverBody>
                                          <div className='row' style={{minWidth: '250px'}}>
                                            <div className='col-12'>
                                              <label>Select Tags</label>
                                              <Select
                                                options={this.state.options}
                                                onChange={this.handleRemove}
                                                value={this.state.removeTag}
                                                placeholder='Remove User Tags'
                                              />
                                            </div>
                                            <div className='col-12'>
                                              <button style={{float: 'right', margin: '15px'}}
                                                className='btn btn-primary btn-sm'
                                                onClick={() => {
                                                  this.removeTags()
                                                  this.toggleRemove()
                                                }}>Save
                                              </button>
                                            </div>
                                          </div>
                                        </PopoverBody>
                                      </Popover>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                            <table className='m-datatable__table'
                              id='m-datatable--27866229129' style={{
                                display: 'block',
                                height: 'auto',
                                overflowX: 'auto'
                              }}>
                              <thead className='m-datatable__head'>
                                <tr className='m-datatable__row'
                                  style={{height: '53px'}}>
                                  <th data-field='Select All'
                                    className='m-datatable__cell--center m-datatable__cell'>
                                    <input type='checkbox' name='Select All' value='All' checked={this.state.selectAllChecked} onChange={this.handleSubscriberClick} /></th>
                                  <th data-field='Profile Picture'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Profile Picture</span>
                                  </th>
                                  <th data-field='Name'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Name</span>
                                  </th>
                                  <th data-field='Page'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Page</span>
                                  </th>
                                  <th data-field='PhoneNumber'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>PhoneNumber</span>
                                  </th>
                                  <th data-field='Source'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Source</span>
                                  </th>
                                  <th data-field='Locale'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Locale</span>
                                  </th>
                                  <th data-field='Gender'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '100px', overflow: 'inherit'}}>Gender</span>
                                  </th>
                                  <th data-field='Tag'
                                    className='m-datatable__cell--center m-datatable__cell' />
                                </tr>
                              </thead>

                              <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                                {
                              this.state.subscribersData.map((subscriber, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even subscriberRow'
                                  style={{height: '55px'}} key={i}>
                                  <td data-field='Select All'
                                    className='m-datatable__cell'><input type='checkbox' name={subscriber._id} value={i} onChange={this.handleSubscriberClick} checked={subscriber.selected} /></td>
                                  <td data-field='Profile Picture'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      <img alt='pic'
                                        src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                        className='m--img-rounded m--marginless m--img-centered' width='60' height='60'
                                    />
                                    </span>
                                  </td>

                                  <td data-field='Name'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>{subscriber.firstName} {subscriber.lastName}</span>
                                  </td>

                                  <td data-field='Page'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.pageId.pageName}
                                    </span>
                                  </td>
                                  <td data-field='phoneNumber'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.phoneNumber}
                                    </span>
                                  </td>
                                  <td data-field='source'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.isSubscribedByPhoneNumber ? 'PhoneNumber' : 'Other'}
                                    </span>
                                  </td>
                                  <td data-field='Locale' className='m-datatable__cell'><span style={{width: '100px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.locale}</span></td>
                                  <td data-field='Gender' className='m-datatable__cell'><span style={{width: '100px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.gender}</span></td>
                                  <td data-field='Tag' id={'tag-' + i} className='m-datatable__cell'>
                                    {
                                      subscriber.tags && subscriber.tags.length > 0 ? (<i className='la la-tags' style={{color: '#716aca'}} />) : <span />
                                    }
                                    {subscriber.tags && subscriber.tags.length > 0 &&
                                      <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} placement='left' target={'tag-' + i}>
                                          {
                                              subscriber.tags.map((tag, i) => (
                                                <span key={i} style={{display: 'block'}}>{tag}</span>
                                              ))
                                          }
                                        </UncontrolledTooltip>
                                    }
                                  </td>
                                </tr>
                              ))
                            }
                              </tbody>
                            </table>
                            <ReactPaginate previousLabel={'previous'}
                              nextLabel={'next'}
                              breakLabel={<a>...</a>}
                              breakClassName={'break-me'}
                              pageCount={Math.ceil(this.state.totalLength / 4)}
                              marginPagesDisplayed={1}
                              pageRangeDisplayed={3}
                              onPageChange={this.handlePageClick}
                              containerClassName={'pagination'}
                              subContainerClassName={'pages pagination'}
                              activeClassName={'active'} />

                          </div>
                          <div className='m-form m-form--label-align-right m--margin-bottom-30'>
                            <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.exportRecords}>
                              <span>
                                <i className='fa fa-download' />
                                <span>
                                  Export Records in CSV File
                                </span>
                              </span>
                            </button>
                          </div>
                        </div>
                      : <div className='table-responsive'>
                        <p> No data to display </p>
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

    )
  }
}

function mapStateToProps (state) {
  return {
    subscribers: (state.subscribersInfo.subscribers),
    locales: (state.subscribersInfo.locales),
    pages: (state.pagesInfo.pages),
    tags: (state.tagsInfo.tags)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadSubscribersList: loadSubscribersList,
    loadMyPagesList: loadMyPagesList,
    assignTags: assignTags,
    unassignTags: unassignTags,
    loadTags: loadTags,
    createTag: createTag},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Subscriber)
