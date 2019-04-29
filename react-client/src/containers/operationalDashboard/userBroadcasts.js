import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadBroadcastsList } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
class BroadcastsInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadBroadcastsList(props.userID, {first_page: 'first', last_id: 'none', number_of_records: 10, filter_criteria: {search_value: '', type_value: ''}})
    this.state = {
      broadcastsData: [],
      broadcastsDataAll: [],
      totalLength: 0,
      filterValue: '',
      pageNumber: 0,
      searchValue: ''
    }
    //  props.loadBroadcastsList(props.location.this.state)
    // this.submitSurvey = this.submitSurvey.bind(this);
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchBroadcast = this.searchBroadcast.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }
  componentDidMount () {
    // this.scrollToTop();

    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | User Broadcasts`
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
    this.setState({broadcastsData: data, broadcastsDataAll: broadcasts})
  }
  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadBroadcastsList(this.props.userID, {first_page: 'first', last_id: 'none', number_of_records: 10, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue}})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadBroadcastsList(this.props.userID, {current_page: this.state.pageNumber, requested_page: data.selected, first_page: 'next', last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue}})
    } else {
      this.props.loadBroadcastsList(this.props.userID, {current_page: this.state.pageNumber, requested_page: data.selected, first_page: 'previous', last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[0]._id : 'none', number_of_records: 10, filter_criteria: {search_value: this.state.searchValue, type_value: this.state.filterValue}})
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.state.broadcastsDataAll)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.broadcasts && nextProps.count) {
      this.displayData(0, nextProps.broadcasts)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({broadcastsData: [], broadcastsDataAll: [], totalLength: 0})
    }
  }
  searchBroadcast (event) {
    this.setState({searchValue: event.target.value.toLowerCase()})
    this.props.loadBroadcastsList(this.props.userID, {first_page: 'first', last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, filter_criteria: {search_value: event.target.value.toLowerCase(), type_value: this.state.filterValue}})

    // var filtered = []
    // if (event.target.value !== '') {
    //   for (let i = 0; i < this.props.broadcasts.length; i++) {
    //     if (this.props.broadcasts[i].title && this.props.broadcasts[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
    //       filtered.push(this.props.broadcasts[i])
    //     }
    //   }
    // } else {
    //   filtered = this.props.broadcasts
    // }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    this.setState({filterValue: e.target.value})
    this.props.loadBroadcastsList(this.props.userID, {first_page: 'first', last_id: this.props.broadcasts.length > 0 ? this.props.broadcasts[this.props.broadcasts.length - 1]._id : 'none', number_of_records: 10, filter_criteria: {search_value: this.state.searchValue, type_value: e.target.value}})

    // var filtered = []
    // if (e.target.value !== '') {
    //   for (let i = 0; i < this.props.broadcasts.length; i++) {
    //     if (e.target.value === 'miscellaneous') {
    //       if (this.props.broadcasts[i].payload.length > 1) {
    //         filtered.push(this.props.broadcasts[i])
    //       }
    //     } else {
    //       if (this.props.broadcasts[i].payload.length === 1 && this.props.broadcasts[i].payload[0].componentType === e.target.value) {
    //         filtered.push(this.props.broadcasts[i])
    //       }
    //     }
    //   }
    // } else {
    //   filtered = this.props.broadcasts
    // }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }

  render () {
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
            </div>
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
                  <div className='form-group m-form__group row align-items-center'>
                    <div className='m-input-icon m-input-icon--left col-md-4 col-lg-4 col-xl-4' style={{marginLeft: '15px'}}>
                      <input type='text' placeholder='Search by Title...' className='form-control m-input m-input--solid' onChange={(event) => { this.searchBroadcast(event) }} />
                      <span className='m-input-icon__icon m-input-icon__icon--left'>
                        <span><i className='la la-search' /></span>
                      </span>
                    </div>
                    <div className='col-md-4 col-lg-4 col-xl-4 row align-items-center' />
                    <div className='m-form__group m-form__group--inline col-md-4 col-lg-4 col-xl-4 row align-items-center'>
                      <div className='m-form__label'>
                        <label>Type:&nbsp;&nbsp;</label>
                      </div>
                      <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.filterValue} onChange={this.onFilter}>
                        <option value=''>All</option>
                        <option value='text'>Text</option>
                        <option value='image'>Image</option>
                        <option value='card'>Card</option>
                        <option value='gallery'>Gallery</option>
                        <option value='audio'>Audio</option>
                        <option value='video'>Video</option>
                        <option value='file'>File</option>
                        <option value='miscellaneous'>Miscellaneous</option>
                      </select>
                    </div>
                  </div>
                  {
                    this.state.broadcastsData && this.state.broadcastsData.length > 0
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
                              <span style={{width: '150px'}}>Title</span>
                            </th>
                            <th data-field='type'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '150px'}}>Type</span>
                            </th>
                            <th data-field='created'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '150px'}}>Created At</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                          {
                            this.state.broadcastsData.map((broadcast, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='title'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>{broadcast.title}</span></td>
                                <td data-field='type' className='m-datatable__cell'>
                                  <span style={{width: '150px'}}>{broadcast.payload.length > 1 ? 'miscellaneous' : broadcast.payload[0].componentType}</span>
                                </td>
                                <td data-field='created'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>{handleDate(broadcast.datetime)}</span></td>
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
                    : <p> No search results found. </p>
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
  return {
    broadcasts: state.backdoorInfo.broadcasts,
    count: state.backdoorInfo.broadcastsUserCount
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadBroadcastsList: loadBroadcastsList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(BroadcastsInfo)
