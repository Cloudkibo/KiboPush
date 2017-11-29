import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadBroadcastsList } from '../../redux/actions/backdoor.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
class BroadcastsInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor', props.userID)
    props.loadBroadcastsList(props.userID)
    this.state = {
      broadcastsData: [],
      broadcastsDataAll: [],
      totalLength: 0,
      filterValue: ''
    }
    //  props.loadBroadcastsList(props.location.this.state)
    // this.submitSurvey = this.submitSurvey.bind(this);
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchBroadcast = this.searchBroadcast.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }
  componentDidMount () {
    console.log('componentDidMount called in ViewSurveyDetail')
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
    console.log('componentDidMount called in ViewSurveyDetail Finished')
  }
  displayData (n, broadcasts) {
    console.log('one', broadcasts)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > broadcasts.length) {
      limit = broadcasts.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = broadcasts[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({broadcastsData: data, broadcastsDataAll: broadcasts})
    console.log('in displayData', this.state.broadcastsData)
  }
  handlePageClick (data) {
    this.displayData(data.selected, this.state.broadcastsDataAll)
  }
  componentWillReceiveProps (nextProps) {
    console.log('userbroadcasts componentWillReceiveProps is called')
    if (nextProps.broadcasts) {
      console.log('Broadcasts Updated', nextProps.broadcasts)
      this.displayData(0, nextProps.broadcasts)
      this.setState({ totalLength: nextProps.broadcasts.length })
    }
  }
  searchBroadcast (event) {
    var filtered = []
    if (event.target.value !== '') {
      for (let i = 0; i < this.props.broadcasts.length; i++) {
        if (this.props.broadcasts[i].title && this.props.broadcasts[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
          filtered.push(this.props.broadcasts[i])
        }
      }
    } else {
      filtered = this.props.broadcasts
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    console.log(e.target.value)
    this.setState({filterValue: e.target.value})
    var filtered = []
    if (e.target.value !== '') {
      for (let i = 0; i < this.props.broadcasts.length; i++) {
        if (e.target.value === 'miscellaneous') {
          if (this.props.broadcasts[i].payload.length > 1) {
            filtered.push(this.props.broadcasts[i])
          }
        } else {
          if (this.props.broadcasts[i].payload.length === 1 && this.props.broadcasts[i].payload[0].componentType === e.target.value) {
            filtered.push(this.props.broadcasts[i])
          }
        }
      }
    } else {
      filtered = this.props.broadcasts
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
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
                { this.props.broadcasts && this.props.broadcasts.length > 0
              ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
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
                      pageCount={Math.ceil(this.state.totalLength / 4)}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={this.handlePageClick}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'} />
                  </div>
                  : <p> No search results found. </p>
                }
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
    )
  }
}

function mapStateToProps (state) {
  console.log('user broadcasts', state)
  return {
    broadcasts: state.BroadcastsInfo.broadcasts
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadBroadcastsList: loadBroadcastsList}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(BroadcastsInfo)
