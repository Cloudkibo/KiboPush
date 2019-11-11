/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadSubscribersCount } from '../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  allBroadcasts
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import YouTube from 'react-youtube'
import AlertMessageModal from '../../components/alertMessages/alertMessageModal'
import AlertMessage from '../../components/alertMessages/alertMessage'
import SubscriptionPermissionALert from '../../components/alertMessages/subscriptionPermissionAlert'

class Convo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      alertMessage: '',
      type: '',
      broadcastsData: [],
      totalLength: 0,
      filterValue: '',
      selectedDays: '0',
      searchValue: '',
      filter: false,
      pageNumber: 0,
      pageValue: '',
      messageType:''
    }
    props.allBroadcasts({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: '', type_value: '', days: '0', messageType:''}})
    props.loadSubscribersCount({})
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchBroadcast = this.searchBroadcast.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.onMessageTypeFilter = this.onMessageTypeFilter.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.gotoTemplates = this.gotoTemplates.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.initializePageSelect = this.initializePageSelect.bind(this)
  }
  goToSettings () {
    this.props.history.push({
      pathname: `/settings`,
      state: {module: 'pro'}
    })
  }
  onDaysChange (e) {
    var value = e.target.value
    this.setState({selectedDays: value})
    if (value && value !== '') {
      if (value.indexOf('.') !== -1) {
        value = Math.floor(value)
      }
      if (value === '0') {
        this.setState({
          selectedDays: '0'
        })
      }
      this.setState({filter: true, pageNumber: 0})
      this.props.allBroadcasts({last_id: 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue, days: value, messageType: this.state.messageType}})
    } else if (value === '') {
      this.setState({selectedDays: '0', filter: false})
      this.props.allBroadcasts({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue, days: '0', messageType: this.state.messageType}})
    }
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  showDialog () {
    this.setState({pageValue: ''})
  }
  componentDidMount () {
    this.scrollToTop()

    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Broadcast`
  }

  displayData (n, broadcasts) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > broadcasts.length) {
      limit = broadcasts.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = broadcasts[i]
      index++
    }
    this.setState({broadcastsData: data})
  }

  handlePageClick (data) {
    console.log('data.selected', data.selected)
    if (data.selected === 0) {
      this.props.allBroadcasts({
        last_id: 'none',
        number_of_records: 10,
        first_page: 'first',
        filter: this.state.filter,
        filter_criteria: {
          search_value: this.state.searchValue,
          messageType: this.state.messageType,
          type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue,
          days: this.state.selectedDays
        }})
    } else if (this.state.pageNumber < data.selected) {
      this.props.allBroadcasts({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        filter: this.state.filter,
        filter_criteria: {
          search_value: this.state.searchValue,
          messageType: this.state.messageType,
          type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue,
          days: this.state.selectedDays
        }}
      )
    } else {
      this.props.allBroadcasts({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[0]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        filter: this.state.filter,
        filter_criteria: {
          search_value: this.state.searchValue,
          messageType: this.state.messageType,
          type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue,
          days: this.state.selectedDays
        }
      })
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.broadcasts)
  }

  gotoEdit (broadcast) {
    this.props.history.push({
      pathname: `/editbroadcast`,
      state: broadcast._id
    })
  }

  gotoCreate (broadcast) {
    this.props.history.push({
      pathname: `/createBroadcast`,
      state: {module: 'convo', pages: this.state.pageValue}
    })
  }

  gotoTemplates () {
    this.props.history.push(
      {
        pathname: '/showTemplateBroadcasts',
        state: {pages: this.state.pageValue}
      })
  }

  componentDidUpdate (nextProps) {
    if (this.props.pages && this.state.pageValue === '') {
      let options = []
      if (this.props.pages) {
        for (var i = 0; i < this.props.pages.length; i++) {
          options[i] = {id: this.props.pages[i]._id, text: this.props.pages[i].pageName}
        }
        this.initializePageSelect(options)
      }
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.broadcasts) {
      this.displayData(0, nextProps.broadcasts)
    }
    if (nextProps.count) {
      this.setState({ totalLength: nextProps.count })
    }
    if (nextProps.successMessage) {
      this.setState({
        alertMessage: nextProps.successMessage,
        type: 'success'
      })
    } else if (nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.errorMessage,
        type: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        type: ''
      })
    }
    if (((nextProps.subscribers && nextProps.subscribers.length === 0) ||
      (nextProps.pages && nextProps.pages.length === 0))
    ) {
      this.refs.zeroModal.click()
    }
  }
  initializePageSelect (pageOptions) {
    console.log('pageOptions: ', pageOptions)
    var self = this
    /* eslint-disable */
    $('#selectPages').select2({
      /* eslint-enable */
      data: pageOptions,
      placeholder: 'Select page(s)',
      allowClear: true,
      multiple: false
    })

    this.setState({pageValue: [pageOptions[0].id]})

    /* eslint-disable */
    $('#selectPages').on('change', function (e) {
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
  searchBroadcast (event) {
    this.setState({
      searchValue: event.target.value, pageNumber:0
    })
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.allBroadcasts({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: event.target.value.toLowerCase(), type_value: this.state.filterValue, days: this.state.selectedDays, messageType:this.state.messageType}})
    } else {
      this.props.allBroadcasts({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: '', type_value: this.state.filterValue, days: this.state.selectedDays, messageType:this.state.messageType}})
    }
  }

  onFilter (e) {
    this.setState({filterValue: e.target.value})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true, pageNumber: 0})
      this.props.allBroadcasts({last_id: (this.props.broadcasts && this.props.broadcasts.length) > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, type_value: e.target.value, days: this.state.selectedDays, messageType:this.state.messageType}})
    } else {
      this.setState({filter: false, pageNumber: 0})
      this.props.allBroadcasts({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: this.state.searchValue, type_value: '', days: this.state.selectedDays, messageType:this.state.messageType}})
    }
  }

  onMessageTypeFilter(e) {
    console.log('e.targetMessageType', e.target.value)
    this.setState({messageType: e.target.value})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true, pageNumber: 0})
      this.props.allBroadcasts({last_id: (this.props.broadcasts && this.props.broadcasts.length) > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue, days: this.state.selectedDays, messageType: e.target.value}})
    } else {
      this.setState({filter: false, pageNumber: 0})
      this.props.allBroadcasts({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue, days: this.state.selectedDays, messageType:''}})
    }

  }

  doesPageHaveSubscribers (pageId) {
    console.log('doesPageHaveSubscribers pageId', pageId[0])
    if (this.props.pages && pageId[0]) {
      let result = this.props.pages.find(page => {
        return page._id === pageId[0]
      })
      console.log('doesPageHaveSubscribers result', result)
      if (result) {
        return result.subscribers > 0
      }
    }
    return false
  }

  render () {
    console.log('this.state.broadcastsData in convo.js method', this.state.broadcastsData)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <SubscriptionPermissionALert />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
           <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Broadcast Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <YouTube
                  videoId='p3BPp3fHBBc'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
              />
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="upgrade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Upgrade to Pro
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>This feature is not available in free account. Kindly updrade your account to use this feature.</p>
              <div style={{width: '100%', textAlign: 'center'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-primary' onClick={() => this.goToSettings()}>
                    Upgrade to Pro
                  </button>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="create" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Create Broadcast
								</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
								  </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>To create a new broadcast from scratch, click on Create New Broadcast. To use a template broadcast and modify it, click on Use Template</p>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div className='form-group m-form__group'>
                    <select id='selectPages' style={{ minWidth: '100%' }} />
                  </div>
                  <br />
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button style={{ color: 'white' }} disabled={!this.doesPageHaveSubscribers(this.state.pageValue) ? true : null} onClick={this.gotoCreate} className='btn btn-primary'>
                      Create New Broadcast
                    </button>
                  </div>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    {/* this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C' */}
                    <button disabled={!this.doesPageHaveSubscribers(this.state.pageValue) ? true : null} onClick={this.gotoTemplates} className='btn btn-primary'>
                      Use Template
                    </button>
                    { /* add paid plan check later
                      : <button onClick={this.showProDialog} className='btn btn-primary'>
                        Use Template&nbsp;&nbsp;&nbsp;
                        <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                           <span style={{color: '#34bfa3'}}>PRO</span>
                          </span>
                        </button>
                      */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href='#/' style={{ display: 'none' }} ref='zeroModal' data-toggle="modal" data-target="#zeroModal">ZeroModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="zeroModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                {(this.props.pages && this.props.pages.length === 0)
                  ? <AlertMessageModal type='page' />
                  : <AlertMessageModal type='subscriber' />
                }
                <button style={{ marginTop: '-60px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
                    </span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <div>
                  <YouTube
                    videoId='9kY3Fmj_tbM'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: {
                        autoplay: 0
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Broadcasts</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            this.props.pages && this.props.pages.length === 0
            ? <AlertMessage type='page' />
          : this.props.subscribersCount === 0 &&
            <AlertMessage type='subscriber' />
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding broadcasts? Here is the <a href='http://kibopush.com/broadcasts/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' data-toggle="modal" data-target="#video">video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Broadcasts
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled={this.props.subscribersCount === 0}  data-toggle="modal" data-target="#create" onClick={this.showDialog}>
                      <span>
                        <i className='la la-plus' />
                        <span>
                              Create New
                            </span>
                      </span>
                    </button>

                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-xl-8 order-2 order-xl-1' />
                    <div className='col-xl-4 order-1 order-xl-2 m--align-right'>

                    </div>
                  </div>
                  <div className='form-row'>
                    {/* <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <input type='text' placeholder='Search broadcasts by title' className='form-control' value={this.state.searchValue} onChange={this.searchBroadcast} />
                    </div> */}
                      <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <select className='custom-select' style={{width: '100%'}} value= {this.state.messageType} onChange={this.onMessageTypeFilter}>
                        <option value='' disabled>Filter by Message type...</option>
                        <option value='promotional'>Promotional</option>
                        <option value='non promotional'>Non Promotional</option>
                        <option value='all'>all</option>
                      </select>
                    </div>
                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <select className='custom-select' style={{width: '100%'}} value={this.state.filterValue} onChange={this.onFilter} >
                        <option value='' disabled>Filter by type...</option>
                        <option value='text'>text</option>
                        <option value='image'>image</option>
                        <option value='card'>card</option>
                        <option value='gallery'>gallery</option>
                        <option value='audio'>audio</option>
                        <option value='video'>video</option>
                        <option value='file'>file</option>
                        <option value='media'>media</option>
                        <option value='miscellaneous'>miscellaneous</option>
                        <option value='all'>all</option>
                      </select>
                    </div>
                    <div className='form-group col-md-6' style={{display: 'flex', float: 'right'}}>
                      <span style={{marginLeft: '70px'}} htmlFor='example-text-input' className='col-form-label'>
                        Show records for last:&nbsp;&nbsp;
                      </span>
                      <div style={{width: '200px'}}>
                        <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays === '0' ? '' : this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                      </div>
                      <span htmlFor='example-text-input' className='col-form-label'>
                      &nbsp;&nbsp;days
                      </span>
                    </div>
                  </div>
                  {/* <div className='form-row'>
                    <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <input type='text' placeholder='Search broadcasts by title' className='form-control' value={this.state.searchValue} onChange={this.searchBroadcast} />
                    </div>

                    </div> */}

                <div style={{ marginTop: '15px' }} className='form-group m-form__group row align-items-center'>
                  <div className='col-md-8'>
                      <div className='m-input-icon m-input-icon--left'>
                          <input type='text' className='form-control m-input m-input--solid' value={this.state.searchValue} placeholder='Search broadcasts by title' onChange={this.searchBroadcast} />
                          <span className='m-input-icon__icon m-input-icon__icon--left'>
                            <span><i className='la la-search' /></span>
                          </span>
                      </div>
                    </div>
                    </div>
                  <div>

                    { this.state.broadcastsData && this.state.broadcastsData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='platform'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Title</span>
                          </th>
                          <th data-field='statement'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Type</span>
                          </th>
                          <th data-field='datetime'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Created At</span>
                          </th>
                          <th data-field='sent'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Sent</span>
                          </th>
                          {/* <th data-field='seen'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Seen</span>
                          </th> */}
                          <th data-field='clicks'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Clicks</span>
                          </th>
                          <th data-field='clicks'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Message Type</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                        this.state.broadcastsData.map((broadcast, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='platform' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.title}</span></td>
                            <td data-field='type' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '120px'}}>{(broadcast.payload.length > 1) ? 'Miscellaneous' : broadcast.payload[0].componentType}</span></td>
                            <td data-field='datetime' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{handleDate(broadcast.datetime)}</span></td>
                            <td data-field='sent' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.sent}</span></td>
                            <td data-field='clicks' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.clicks ? broadcast.clicks : 0}</span></td>
                           <td data-field='MessageType' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.messageType ? broadcast.messageType === 'promotional'? 'Promotional' : 'Non Promotional'  :'Non Promotional'}</span></td>
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
                  : <span>
                    <p> No data to display </p>
                  </span>
                }

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
    pages: (state.pagesInfo.pages),
    broadcasts: (state.broadcastsInfo.broadcasts),
    count: (state.broadcastsInfo.count),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage),
    subscribersCount: (state.subscribersInfo.subscribersCount),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    addBroadcast: addBroadcast,
    clearAlertMessage: clearAlertMessage,
    loadSubscribersCount: loadSubscribersCount,
    allBroadcasts: allBroadcasts
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Convo)
