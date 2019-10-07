/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadBroadcastsList } from '../../redux/actions/whatsAppBroadcasts.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { browserHistory, Link } from 'react-router'
import { loadWhatsAppContactsList } from '../../redux/actions/uploadContacts.actions'

class WhatsAppBroadcast extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      broadcastsData: [],
      filterValue: '',
      totalLength: 0,
      pageNumber: 0,
      searchValue: '',
      selectedDays: '0',
      filter:false
    }

    props.loadWhatsAppContactsList({last_id: 'none', number_of_records: 10, first_page: 'first'})
    props.loadBroadcastsList({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: '', type_value: '', days: '0'}})
    this.displayData = this.displayData.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.onFilter = this.onFilter.bind(this)
    this.searchBroadcast = this.searchBroadcast.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
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
      this.props.loadBroadcastsList({last_id: 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue, days: value}})
    } else if (value === '') {
      this.setState({selectedDays: '0', filter: false})
      this.props.loadBroadcastsList({last_id: 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue, days: '0'}})
    }
}

searchBroadcast (event) {
  this.setState({
    searchValue: event.target.value, pageNumber:0
  })
  if (event.target.value !== '') {
    this.setState({filter: true})
    this.props.loadBroadcastsList({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: event.target.value.toLowerCase(), type_value: this.state.filterValue, days: this.state.selectedDays}})
  } else {
    this.props.loadBroadcastsList({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: '', type_value: this.state.filterValue, days: this.state.selectedDays}})
  }
}
onFilter (e) {
  this.setState({filterValue: e.target.value})
  if (e.target.value !== '' && e.target.value !== 'all') {
    this.setState({filter: true, pageNumber: 0})
    this.props.loadBroadcastsList({last_id: (this.props.broadcasts && this.props.broadcasts.length) > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, type_value: e.target.value, days: this.state.selectedDays}})
  } else {
    this.setState({filter: false, pageNumber: 0})
    this.props.loadBroadcastsList({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: false, filter_criteria: {search_value: this.state.searchValue, type_value: '', days: this.state.selectedDays}})
  }
}

  gotoCreate (broadcast) {
    browserHistory.push({
      pathname: `/createWhatsAppBroadcast`
    })
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
    if (data.selected === 0) {
      this.props.loadBroadcastsList({
        last_id: 'none',
        number_of_records: 10, 
        first_page: 'first',
        filter: this.state.filter,
        filter_criteria: {
          search_value: this.state.searchValue,
          type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue,
          days: this.state.selectedDays
        }})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadBroadcastsList({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        filter: this.state.filter,
        filter_criteria: {
          search_value: this.state.searchValue,
          type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue,
          days: this.state.selectedDays
        }})
    } else {
      this.props.loadBroadcastsList({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[0]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        filter: this.state.filter,
        filter_criteria: {
          search_value: this.state.searchValue,
          type_value: this.state.filterValue === 'all' ? '' : this.state.filterValue,
          days: this.state.selectedDays
        }})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.broadcasts)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Broadcasts`
  }

  componentWillReceiveProps (nextProps) {
    console.log('in componentWillReceiveProps of smsBroadcasts', nextProps)
    if (nextProps.broadcasts && nextProps.count) {
      this.displayData(0, nextProps.broadcasts)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({ broadcastsData: [], totalLength: 0 })
    }
    if (nextProps.twilioNumbers && nextProps.twilioNumbers.length > 0) {
      console.log('inside', nextProps.twilioNumbers[0])
      this.setState({numberValue: nextProps.twilioNumbers[0]})
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          {
            this.props.contacts && this.props.contacts.length === 0 &&
            <div className='m-alert m-alert--icon m-alert--icon-solid m-alert--outline alert alert-warning alert-dismissible fade show' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation-1' style={{color: 'white'}} />
                <span />
              </div>
              <div className='m-alert__text'>
                <strong>
                0 Subscribers!&nbsp;
                </strong>
                You do not have any subscribers. Please click <Link style={{cursor: 'pointer'}} to='/uploadContacts' >here</Link> to add subscribers
              </div>
            </div>
          }
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Manage Broadcasts</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding broadcasts? Here is the <a href='https://kibopush.com/twilio/' target='_blank'>documentation</a>.
            </div>
          </div>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <h3 className='m-portlet__head-text'>
                          Broadcasts
                        </h3>
                      </div>
                    </div>
                    <div className='m-portlet__head-tools'>
                      <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.gotoCreate} disabled={this.props.contacts && this.props.contacts.length === 0}>
                        <span>
                          <i className='la la-plus' />
                          <span>Create New</span>
                        </span>
                      </button>

                    </div>
                  </div>
                  <div className='m-portlet__body'>
                  <div className='form-row'>
                  <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                    <input type='text' placeholder='Search broadcasts by title' className='form-control' value={this.state.searchValue} onChange={this.searchBroadcast} />
                  </div>
                  <div style={{display: 'inline-block'}} className='form-group col-md-3'>
                      <select className='custom-select' style={{width: '100%'}} value={this.state.filterValue} onChange={this.onFilter} >
                        <option value='' disabled>Filter by type...</option>
                        <option value='text'>text</option>
                        <option value='audio'>audio</option>
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
                    { this.state.broadcastsData && this.state.broadcastsData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='title'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Title</span>
                          </th>
                          <th data-field='type'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Type</span>
                          </th>
                          <th data-field='createdAt'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Created At</span>
                          </th>
                          <th data-field='sent'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Sent From</span>
                          </th>
                          <th data-field='delivered'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Delivered</span>
                          </th>
                          <th data-field='seen'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Seen</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {this.state.broadcastsData.map((broadcast, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='title' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.title}</span></td>
                            <td data-field='type' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{(broadcast.payload.length > 1) ? 'Miscellaneous' : broadcast.payload[0].componentType}</span></td>
                            <td data-field='createAt' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.datetime}</span></td>
                            <td data-field='sent' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{this.props.automated_options.twilioWhatsApp.sandboxNumber}</span></td>
                            <td data-field='delivered' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.sent}</span></td>
                            <td data-field='seen' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{broadcast.seen}</span></td>
                          </tr>
                        ))
                      }
                      </tbody>
                    </table>
                    <div className='pagination'>
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.state.pageNumber} />
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
  return {
    broadcasts: (state.whatsAppBroadcastsInfo.broadcasts),
    count: (state.whatsAppBroadcastsInfo.count),
    contacts: (state.contactsInfo.contacts),
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList,
    loadWhatsAppContactsList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppBroadcast)
