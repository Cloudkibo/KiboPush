import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadBroadcastsByDays } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'

class BroadcastsInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    //  props.loadBroadcastsByDays({last_id: 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: '', days: 10}})
    this.state = {
      BroadcastData: [],
      totalLength: 0,
      filterOptions: [
        { value: 10, label: '10 days' },
        { value: 30, label: '30 days' }],
      selectedFilterValue: 10,
      selectedDays: 10,
      searchValue: '',
      filter: true,
      pageNumber: 0,
      showBroadcasts: false
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchBroadcasts = this.searchBroadcasts.bind(this)
    this.onBroadcastClick = this.onBroadcastClick.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.props.loadBroadcastsByDays({last_id: 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: '', days: 10}})
    this.setState({showBroadcasts: !this.state.showBroadcasts})
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Broadcasts By Days`
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
    this.setState({BroadcastData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadBroadcastsByDays({last_id: 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, days: parseInt(this.state.selectedDays)}})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadBroadcastsByDays({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, days: parseInt(this.state.selectedDays)}})
    } else {
      this.props.loadBroadcastsByDays({current_page: this.state.pageNumber, requested_page: data.selected, last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[0]._id : 'none', number_of_records: 10, first_page: 'previous', filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, days: parseInt(this.state.selectedDays)}})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.broadcasts)
  }
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps in broadcastbydays', nextProps)
    if (nextProps.broadcasts && nextProps.count) {
      this.displayData(0, nextProps.broadcasts)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({BroadcastData: [], totalLength: 0})
    }
  }
  searchBroadcasts (event) {
    this.setState({searchValue: event.target.value.toLowerCase()})
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.loadBroadcastsByDays({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: event.target.value.toLowerCase(), days: parseInt(this.state.selectedDays)}})
    } else {
      this.props.loadBroadcastsByDays({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: this.state.filter, filter_criteria: {search_value: '', days: parseInt(this.state.selectedDays)}})
    }
  }
  onDaysChange (event) {
    this.setState({selectedDays: event.target.value, pageNumber: 0})
    if (event.target.value !== '') {
      this.setState({filter: true})
      this.props.loadBroadcastsByDays({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, days: parseInt(event.target.value)}})
    } else {
      this.props.loadBroadcastsByDays({last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter: true, filter_criteria: {search_value: this.state.searchValue, days: ''}})
    }
    // var defaultVal = 10
    // var value = e.target.value
    // this.setState({selectedDays: value})
    // if (value && value !== '') {
    //   if (value.indexOf('.') !== -1) {
    //     value = Math.floor(value)
    //   }
    //   this.props.loadBroadcastsByDays(value)
    // } else if (value === '') {
    //   this.setState({selectedDays: defaultVal})
    //   this.props.loadBroadcastsByDays(defaultVal)
    // }
  }
  onBroadcastClick (broadcast) {
    this.props.browserHistory.push({
      pathname: `/viewBroadcastDetail`,
      state: {title: broadcast.title, payload: broadcast.payload, data: broadcast}
    })
  }

  render () {
    console.log('broadcastsByDays state', this.state)
    return (
      <div className='row'>
        <div
          className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Broadcasts
                  </h3>
                </div>
              </div>
              <div className='m-portlet__head-tools'>
                <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                  <li className='nav-item m-tabs__item' />
                  <li className='nav-item m-tabs__item' />
                  <li className='m-portlet__nav-item'>
                    <a data-portlet-tool='toggle' className='m-portlet__nav-link m-portlet__nav-link--icon' title='' data-original-title='Collapse' onClick={this.toggle}>
                      {this.state.showBroadcasts
                      ? <i className='la la-angle-up' style={{cursor: 'pointer'}} />
                    : <i className='la la-angle-down' style={{cursor: 'pointer'}} />
                  }
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            {this.state.showBroadcasts &&
            <div className='m-portlet__body'>
              <div className='row align-items-center'> <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                <div className='form-row'>
                  <div className='form-group col-md-6' ><input type='text' placeholder='Search by Title...' className='form-control m-input m-input--solid' onChange={this.searchBroadcasts} />
                    <span className='m-input-icon__icon m-input-icon__icon--left' />
                  </div>
                  <div className='form-group col-md-6' style={{display: 'flex', float: 'right'}}>
                    <span style={{marginLeft: '70px'}} htmlFor='example-text-input' className='col-form-label'>
                      Show records for last:&nbsp;&nbsp;
                    </span>
                    <div style={{width: '200px'}}>
                      <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                    </div>
                    <span htmlFor='example-text-input' className='col-form-label'>
                    &nbsp;&nbsp;days
                    </span>
                  </div>
                </div>
                {
                  this.state.BroadcastData && this.state.BroadcastData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table'
                      id='m-datatable--27866229129' style={{
                        display: 'block',
                        height: 'auto',
                        overflowX: 'auto'
                      }}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='title'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Title</span></th>
                          <th data-field='user'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>User/Company Name</span></th>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Page</span></th>
                          <th data-field='created'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>Created At</span></th>
                          <th data-field='sent'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '50px'}}>Sent</span></th>
                          {/* <th data-field='seen'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '50px'}}>Seen</span></th> */}
                          <th data-field='more'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}} /></th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                        {
                          this.state.BroadcastData.map((broadcast, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                              <td data-field='title'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{broadcast.title}</span></td>
                              <td data-field='user' className='m-datatable__cell'>
                                <span style={{width: '120px'}}>{broadcast.user.name}</span></td>
                              <td data-field='page' className='m-datatable__cell'>
                                <span style={{width: '120px'}}>{broadcast.page.join(',')}</span></td>
                              <td data-field='created'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>{handleDate(broadcast.datetime)}</span></td>
                              <td data-field='sent'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '50px'}}>{broadcast.sent}</span></td>
                              {/* <td data-field='seen'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '50px'}}>{broadcast.seen}</span></td> */}
                              <td data-field='more'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '120px'}}>
                                  <button onClick={() => this.onBroadcastClick(broadcast)} className='btn btn-primary btn-sm' style={{float: 'left', margin: 2}}>
                                    View
                                </button></span>
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
                      pageCount={Math.ceil(this.state.totalLength / 10)}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'}
                      forcePage={this.state.pageNumber} />
                  </div>
                  : <p> No data to display. </p>
                }
              </div>
              </div>
            </div>
          }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    broadcasts: state.backdoorInfo.broadcasts,
    count: state.backdoorInfo.broadcastsCount
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadBroadcastsByDays: loadBroadcastsByDays}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(BroadcastsInfo)
