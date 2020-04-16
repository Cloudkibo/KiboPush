/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import {deleteSponsoredMessage,
  createSponsoredMessage,
  fetchSponsoredMessages,
  showUpdatedData,
  send,
  saveDraft} from '../../redux/actions/sponsoredMessaging.actions'
import AlertContainer from 'react-alert'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import YouTube from 'react-youtube'
import {deleteFiles} from '../../utility/utils'
import ConfirmationModal from '../../components/extras/confirmationModal'
import { formatAMPM } from '../../utility/utils'

class SponsoredMessaging extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      sponsoredMessages: [],
      totalLength: 0,
      deleteid: '',
      showVideo: false,
      pageSelected: {},
      searchValue: '',
      status: '',
      pageNumber: 0,
      page_value: '',
      filter: false,
      openVideo: false,
      selectedSponsoredMessage: ''
    }
   props.loadMyPagesList()
   props.fetchSponsoredMessages({last_id: 'none',
     number_of_records: 10,
     first_page: 'first',
     search_value: '',
     status_value: '',
     page_value: ''})

   this.displayData = this.displayData.bind(this)
   this.showDialogDelete = this.showDialogDelete.bind(this)
   this.onEdit = this.onEdit.bind(this)
   this.gotoCreate = this.gotoCreate.bind(this)
   this.onInsights = this.onInsights.bind(this)
   this.changePage = this.changePage.bind(this)
   this.createAd = this.createAd.bind(this)
   this.onStatusFilter = this.onStatusFilter.bind(this)
   this.onPageFilter = this.onPageFilter.bind(this)
   this.isAnyFilter = this.isAnyFilter.bind(this)
   this.searchAds = this.searchAds.bind(this)
   this.handlePageClick = this.handlePageClick.bind(this)
   this.getStatusValue = this.getStatusValue.bind(this)
   this.publish = this.publish.bind(this)
   this.handlePublishResponse = this.handlePublishResponse.bind(this)
   this.openVideoTutorial = this.openVideoTutorial.bind(this)
   this.openPublishModal = this.openPublishModal.bind(this)
   this.saveSchedule = this.saveSchedule.bind(this)
   this.handleSaveResponse = this.handleSaveResponse.bind(this)
  }

  saveSchedule (date, time) {
    let combinedDateTime = new Date(date + ' ' + time)
    let currentDate = new Date()
    if (combinedDateTime < currentDate) {
      this.msg.error('Sheduled Date and Time cannot be less than the current Date and Time')
    } else {
      let sponsoredMessage = this.state.selectedSponsoredMessage
      sponsoredMessage.scheduleDateTime = combinedDateTime
      this.props.saveDraft(this.state.selectedSponsoredMessage._id, sponsoredMessage, this.msg, this.handleSaveResponse)
    }
  }

  handleSaveResponse () {
    this.refs.sponsoredMessage.click()
  }

  openPublishModal (sponsoredMessage) {
    this.setState({selectedSponsoredMessage: sponsoredMessage}, () => {
      if (sponsoredMessage.status === 'scheduled') {
        this.refs.confirmPublish.click()
      } else {
        this.publish()
      }
    })
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoSponsored.click()
  }

  publish () {
    let sponsoredMessage = this.state.selectedSponsoredMessage
    let pageId = this.props.pages && this.props.pages.filter(p => p._id === sponsoredMessage.pageId)[0].pageId
    sponsoredMessage.pageFbId = pageId
    this.props.send(sponsoredMessage, this.handlePublishResponse)
  }

  handlePublishResponse (res) {
    if (res.status === 'success') {
      this.msg.success('Ad has been sent to Ads Manager')
    } else {
      this.msg.error(res.payload)
    }
  }

  getStatusValue (status, datetime) {
    let statusValue = ''
    if (status.toLowerCase() === 'draft') {
      statusValue = 'Draft'
    } else if (status.toLowerCase() === 'sent_to_fb') {
      statusValue = 'Sent to Facebook'
    } else if (status.toLowerCase() === 'pending_review') {
      statusValue = 'Pending Review'
    } else if (status.toLowerCase() === 'active') {
      statusValue = 'Active'
    } else if (status.toLowerCase() === 'rejected') {
      statusValue = 'Rejected'
    } else if (status.toLowerCase() === 'scheduled') {
      let date = new Date(datetime)
      statusValue = `Scheduled on ${date.toDateString()} at ${formatAMPM(date)}`
    } else if (status.toLowerCase() === 'failed') {
      statusValue = 'Failed'
    } else if (status.toLowerCase() === 'with_issues') {
      statusValue = 'With Issues'
    }
    return statusValue
  }

  isAnyFilter(search, page, status) {
    if (search !== '' || page !== '' || status !== '') {
      this.setState({
        filter: true
      })
    } else {
      this.setState({
        filter: false
      })
    }
  }

  onPageFilter (e) {
    this.setState({page_value: e.target.value, pageNumber: 0})
    this.isAnyFilter(this.state.searchValue, e.target.value, this.state.status, this.state.type_value)
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({pageNumber: 0})
      this.props.fetchSponsoredMessages({
        last_id: this.props.sponsoredMessages.length > 0 ? this.props.sponsoredMessages[this.props.sponsoredMessages.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'first',
        search_value: this.state.searchValue === 'all' ? '' : this.state.searchValue,
        status_value: this.state.status === 'all' ? '' : this.state.status,
        page_value: e.target.value})
    } else {
      this.props.fetchSponsoredMessages({
        last_id: this.props.sponsoredMessages.length > 0 ? this.props.sponsoredMessages[this.props.sponsoredMessages.length - 1]._id : 'none',
        number_of_records: 10, first_page: 'first',
        search_value: this.state.searchValue === 'all' ? '' : this.state.searchValue,
        status_value: this.state.status === 'all' ? '' : this.state.status,
        page_value: ''})
    }
  }
  onStatusFilter (e) {
    this.setState({status: e.target.value, pageNumber: 0})
    this.isAnyFilter(this.state.searchValue, this.state.page_value, e.target.value)
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({pageNumber: 0})
      this.props.fetchSponsoredMessages({
        last_id: this.props.sponsoredMessages.length > 0 ? this.props.sponsoredMessages[this.props.sponsoredMessages.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'first',
        search_value: this.state.searchValue === 'all' ? '' : this.state.searchValue,
        status_value: e.target.value,
        page_value: this.state.page_value === 'all' ? '' : this.state.page_value })
    } else {
      this.props.fetchSponsoredMessages({
        last_id: this.props.sponsoredMessages.length > 0 ? this.props.sponsoredMessages[this.props.sponsoredMessages.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'first',
        search_value: this.state.searchValue === 'all' ? '' : this.state.searchValue,
        status_value: '',
        page_value: this.state.page_value === 'all' ? '' : this.state.page_value })
    }
  }
  searchAds (event) {
    this.setState({
      searchValue: event.target.value, pageNumber:0
    })
    this.isAnyFilter(event.target.value, this.state.page_value, this.state.status)
    if (event.target.value !== '') {
      this.props.fetchSponsoredMessages({
        last_id: this.props.sponsoredMessages.length > 0 ? this.props.sponsoredMessages[this.props.sponsoredMessages.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'first',
        search_value: event.target.value.toLowerCase(),
        status_value: this.state.status === 'all' ? '' : this.state.status,
        page_value: this.state.page_value === 'all' ? '' : this.state.page_value})
    } else {
      this.props.fetchSponsoredMessages({
        last_id: this.props.sponsoredMessages.length > 0 ? this.props.sponsoredMessages[this.props.sponsoredMessages.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'first',
        search_value: '',
        status_value: this.state.status === 'all' ? '' : this.state.status,
        page_value: this.state.page_value === 'all' ? '' : this.state.page_value})
    }
  }

  handlePageClick(data) {
    console.log('data.selected', data.selected)
    if (data.selected === 0) {
      this.props.fetchSponsoredMessages({
        last_id: 'none',
        number_of_records: 10,
        first_page: 'first',
        search_value: this.state.searchValue === 'all' ? '' : this.state.searchValue,
        status_value: this.state.status === 'all' ? '' : this.state.status,
        page_value: this.state.page_value === 'all' ? '' : this.state.page_value
      })
    } else if (this.state.pageNumber < data.selected) {
      this.props.fetchSponsoredMessages({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.sponsoredMessages.length > 0 ? this.props.sponsoredMessages[this.props.sponsoredMessages.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        search_value: this.state.searchValue === 'all' ? '' : this.state.searchValue,
        status_value: this.state.status === 'all' ? '' : this.state.status,
        page_value: this.state.page_value === 'all' ? '' : this.state.page_value
      })
    } else {
      this.props.fetchSponsoredMessages({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.sponsoredMessages.length > 0 ? this.props.sponsoredMessages[this.props.sponsoredMessages.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        search_value: this.state.searchValue === 'all' ? '' : this.state.searchValue,
        status_value: this.state.status === 'all' ? '' : this.state.status,
        page_value: this.state.page_value === 'all' ? '' : this.state.page_value
      })
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.sponsoredMessages)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Sponsored Messaging`
  }

  changePage (e) {
    this.setState({ pageSelected: e.target.value })
  }

  showDialogDelete (id) {
    this.setState({deleteid: id})
  }

  createAd () {
    let data = {
      status: 'draft',
      adName: 'New Ad',
      pageId: this.state.pageSelected
    }
    this.props.createSponsoredMessage(data, this.gotoCreate)
  }

  gotoCreate () {
    this.props.history.push({
      pathname: `/createSponsoredMessage`,
    })
  }

  onEdit (sponsoredMessage) {
    sponsoredMessage.campaignType = 'existing'
    sponsoredMessage.adSetType = 'existing'
    this.props.showUpdatedData(sponsoredMessage)
    this.props.history.push({
      pathname: '/editSponsoredMessage',
      state: {module: 'edit', sponsoredMessage: sponsoredMessage}
    })
  }

  onInsights (sponsoredMessage) {
    this.props.history.push({
      pathname:'/sponsoredMessagingInsights',
      state: {sponsoredMessage: sponsoredMessage}
    })
  }

  displayData (n, sponsoredMessages) {
    console.log('in displayData', sponsoredMessages)
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > sponsoredMessages.length) {
      limit = sponsoredMessages.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = sponsoredMessages[i]
      index++
    }
    this.setState({sponsoredMessages: data})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('nextProps in sponsored', nextProps)
    if (nextProps.sponsoredMessages) {
      this.displayData(0, nextProps.sponsoredMessages)
    }
    if (nextProps.count) {
      this.setState({ totalLength: nextProps.count })
    }
    if (nextProps.pages) {
      this.setState({pageSelected: nextProps.pages[0]._id})
    }
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <button ref='confirmPublish' style={{display: 'none'}} data-toggle="modal" data-target="#confirmPublish"></button>
          <ConfirmationModal
            id='confirmPublish'
            title='Publish Sponsored Message'
            description='This will immediately send your Sheduled Sponsored Message and will remove the sheduling done for later. Are you sure you want to continue?'
            onConfirm={this.publish}
          />
        <a href='#/' style={{ display: 'none' }} ref='videoSponsored' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoSponsored">videoSponsored</a>
            <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoSponsored" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
                <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Sponsored Broadcast Video Tutorial
                  </h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => {
                    this.setState({
                      openVideo: false
                    })}}>
                    <span aria-hidden="true">
                      &times;
                      </span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                  {this.state.openVideo && <YouTube
                    videoId='ZrZJs_n-wOg'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: { // https://developers.google.com/youtube/player_parameters
                        autoplay: 0
                      }
                    }}
                  />
                }
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Create Sponsored Message
                  </h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
                      </span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                  <div className='m-form'>
                  <div className='form-group m-form__group'>
                    <label className='control-label'>Select Page:&nbsp;&nbsp;&nbsp;</label>
                    <select className='custom-select' id='m_form_type' style={{ width: '250px' }} tabIndex='-98' value={this.state.pageSelected} onChange={this.changePage}>
                      {
                        this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                          <option key={i} value={page._id}>{page.pageName}</option>
                        ))
                      }
                    </select>
                  </div>
              </div>
            <div style={{ width: '100%', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', padding: '5px', float: 'right' }}>
                  <button className='btn btn-primary' disabled={this.state.pageSelected === ''} onClick={this.createAd} data-dismiss='modal'>
                    Create
                  </button>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Delete Sponsored Message?
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to delete this sponsored message?</p>
                <button style={{ float: 'right' }}
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    let messagePayload = this.state.sponsoredMessages.find(sm => sm._id === this.state.deleteid).payload
                    deleteFiles(messagePayload)
                    this.props.deleteSponsoredMessage(this.state.deleteid, this.msg, this.state.searchValue, this.state.status, this.state.page_value)
                  }} data-dismiss='modal'>Delete
              </button>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Sponsored Messages</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Sponsored Messages? Here is the <a href='https://kibopush.com/sponsored-broadcast/' target='_blank' rel='noopener noreferrer'> documentation </a>
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Sponsored Messages
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    {this.props.pages && this.props.pages.length > 0 && !this.props.reconnectFbRequired
                      ? <a href='#/' data-toggle="modal" data-target="#create" onClick={this.showCreateDialog} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Create New
                      </span>
                        </span>
                      </a>
                      : <a href='#/' disabled className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Create New
                    </span>
                        </span>
                      </a>
                    }
                  </div>
                </div>
                <div className='m-portlet__body'>
                  {
                    !this.props.reconnectFbRequired &&
                    <div className='row' style={{marginBottom: '28px'}}>
                      <div className='col-md-4'>
                        <input type='text' placeholder='Search By Ad Name..' className='form-control' value={this.state.searchValue} onChange={this.searchAds} />
                      </div>
                      <div className='col-md-4'>
                        <select className='custom-select' style={{width: '100%'}} value= {this.state.page_value} onChange={this.onPageFilter}>
                          <option value='' disabled>Filter by Page...</option>
                          <option value='all'>All</option>
                          {
                            this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                              <option key={page._id} value={page._id} selected={page._id === this.state.page_value}>{page.pageName}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div className='col-md-4'>
                        <select className='custom-select' style={{width: '100%'}} value= {this.state.status} onChange={this.onStatusFilter}>
                          <option value='' disabled>Filter by Status...</option>
                          <option value='all'>All</option>
                          <option value='draft'>Draft</option>
                          <option value='sent_to_fb'>Sent to Facebook</option>
                          <option value='pending_review'>Pending Review</option>
                          <option value='scheduled'>Scheduled</option>
                          <option value='active'>Active</option>
                          <option value='rejected'>Rejected</option>
                          <option value='failed'>Failed</option>
                          <option value='with_issues'>With Issues</option>
                        </select>
                      </div>
                    </div>
                  }
                    {
                      this.props.reconnectFbRequired &&
                      <div className="m-alert m-alert--icon alert alert-info" role="alert">
                        <div className="m-alert__text">
                          Please reconnect your facebook account to grant KiboPush permission to your ad accounts.
											  </div>
                        <div className="m-alert__actions" style={{width: "220px"}}>
                          <a href='/auth/facebook/reauth/sponsoredmessages'
                            className="btn btn-focus m-btn m-btn--pill m-btn--custom m-btn--air"
                            data-dismiss="alert1"
                            aria-label="Close">
													  Reconnect Facebook
												  </a>
                        </div>
                      </div>
                    }
                    {
                      this.props.refreshRequired &&
                      <div className="m-alert m-alert--icon alert alert-danger" role="alert">
                        <div className="m-alert__text">
                          {this.props.refreshMessage}
											  </div>
                        <div className="m-alert__actions" style={{width: "220px"}}>
                          <button type="button"
                            className="btn btn-outline-light btn-sm m-btn m-btn--hover-primary"
                            data-dismiss="alert1"
                            aria-label="Close"
                            onClick={() => {
                              this.props.fetchSponsoredMessages({last_id: 'none',
                              number_of_records: 10,
                              first_page: 'first',
                              search_value: '',
                              status_value: '',
                              page_value: ''})
                            }}>
													  Refresh
												  </button>
											  </div>
                      </div>
                    }
                  {
                    !this.props.reconnectFbRequired &&
                    <div className='form-row'>
                      { this.state.sponsoredMessages && this.state.sponsoredMessages.length > 0
                    ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                      <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                        <thead className='m-datatable__head'>
                          <tr className='m-datatable__row'
                            style={{height: '53px'}}>
                            <th data-field='adName'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '150px'}}>Ad Name</span>
                            </th>
                            <th data-field='pageName'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '150px'}}>Page Name</span>
                            </th>
                            <th data-field='status'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '150px'}}>Status</span>
                            </th>
                            <th data-field='actions'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '300px'}}>Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className='m-datatable__body'>
                          {
                          this.state.sponsoredMessages.map((sponsoredMessage, i) => (
                            <tr data-row={i}
                              className="m-datatable__row m-datatable__row--even" key={i}>
                              <td data-field='adName' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{width: '150px'}}>{sponsoredMessage.adName}</span>
                              </td>
                              <td data-field='pageName' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{width: '150px'}}>{this.props.pages.filter((page) => page._id === sponsoredMessage.pageId)[0] ? this.props.pages.filter((page) => page._id === sponsoredMessage.pageId)[0].pageName : '-'}</span>
                              </td>
                              <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{width: '150px'}}>{this.getStatusValue(sponsoredMessage.status, sponsoredMessage.scheduleDateTime)}</span>
                              </td>
                              <td data-field='actions' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{width: '300px'}}>
                                  {sponsoredMessage.status.toLowerCase() === 'active' &&
                                    <button className='btn btn-primary btn-sm' style={{float: 'left', margin: 2, marginLeft: '40px'}} onClick={() => this.onInsights(sponsoredMessage)}>
                                        Insights
                                    </button>
                                  }
                                  {(sponsoredMessage.status === 'draft' || sponsoredMessage.status === 'scheduled' || sponsoredMessage.status === 'failed' || sponsoredMessage.status.toLowerCase() === 'with_issues') &&
                                    <button className='btn btn-primary btn-sm' style={{margin: 2}} onClick={() => this.onEdit(sponsoredMessage)}>
                                      Edit
                                    </button>
                                  }
                                  {(sponsoredMessage.status === 'draft' || sponsoredMessage.status === 'scheduled' || sponsoredMessage.status === 'failed') &&
                                    <button className='btn btn-primary btn-sm' style={{margin: 2}} data-toggle="modal" data-target="#delete" onClick={() => this.showDialogDelete(sponsoredMessage._id)}>
                                      Delete
                                  </button>
                                  }
                                  {sponsoredMessage.adSetId && sponsoredMessage.payload && sponsoredMessage.payload.length > 0 && (sponsoredMessage.status === 'draft' || sponsoredMessage.status === 'scheduled' || sponsoredMessage.status === 'failed' || sponsoredMessage.status.toLowerCase() === 'with_issues') &&
                                    <button className='btn btn-primary btn-sm' style={{margin: 2}} onClick={() => this.openPublishModal(sponsoredMessage)}>
                                      {sponsoredMessage.status === 'scheduled' ? 'Publish Now' : 'Publish'}
                                    </button>
                                  }
                                </span>
                              </td>
                            </tr>
                          ))
                        }
                        </tbody>
                      </table>
                      <div className='pagination'>
                        <ReactPaginate
                          previousLabel={'previous'}
                          nextLabel={'next'}
                          breakLabel={<a href='#/'>...</a>}
                          breakClassName={'break-me'}
                          pageCount={Math.ceil(this.state.totalLength / 10)}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={3}
                          forcePage={this.state.pageNumber}
                          onPageChange={this.handlePageClick}
                          containerClassName={'pagination'}
                          subContainerClassName={'pages pagination'}
                          activeClassName={'active'} />
                      </div>
                    </div>
                    : <div className='col-12'>
                      <p> No data to display </p>
                    </div>
                  }
                    </div>
                  }
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
    sponsoredMessages: (state.sponsoredMessagingInfo.sponsoredMessages),
    refreshRequired: (state.sponsoredMessagingInfo.refreshRequired),
    refreshMessage: (state.sponsoredMessagingInfo.refreshMessage),
    pages: (state.pagesInfo.pages),
    reconnectFbRequired: (state.sponsoredMessagingInfo.reconnectFbRequired),
    count: (state.sponsoredMessagingInfo.count)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchSponsoredMessages: fetchSponsoredMessages,
    createSponsoredMessage: createSponsoredMessage,
    deleteSponsoredMessage: deleteSponsoredMessage,
    loadMyPagesList: loadMyPagesList,
    showUpdatedData: showUpdatedData,
    send: send,
    saveDraft: saveDraft
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SponsoredMessaging)
