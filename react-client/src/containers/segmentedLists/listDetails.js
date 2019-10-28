/* eslint-disable no-useless-constructor */
import React from 'react'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {
  loadListDetails
} from '../../redux/actions/customerLists.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import fileDownload from 'js-file-download'
var json2csv = require('json2csv')

class ListDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      subscribersData: [],
      subscribersDataAll: [],
      totalLength: 0,
      listName: this.props.currentList ? this.props.currentList.listName : 'Subscribers'
    }
    this.displayData = this.displayData.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.exportRecords = this.exportRecords.bind(this)
    this.prepareExportData = this.prepareExportData.bind(this)
    if (this.props.currentList) {
      props.loadListDetails(this.props.currentList._id)
    }
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | list Details`;
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
        fileDownload(csv, 'SegmentedList.csv')
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.listDetail) {
      this.displayData(0, nextProps.listDetail)
      this.setState({ totalLength: nextProps.listDetail.length })
    }
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.subscribersDataAll)
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
        'Source': subscriber.source === 'customer_matching' ? 'PhoneNumber' : subscriber.source === 'direct_message' ? 'Direct Message' : 'Chat Plugin',
        'Locale': subscriber.locale,
        'Gender': subscriber.gender
      }
      data.push(subscriberObj)
    }
    return data
  }

  searchSubscriber (event) {
    var filtered = []
    for (let i = 0; i < this.props.listDetail.length; i++) {
      let fullName = this.props.listDetail[i].firstName.toLowerCase() + ' ' + this.props.listDetail[i].lastName.toLowerCase()
      if (fullName.includes((event.target.value).toLowerCase())) {
        filtered.push(this.props.listDetail[i])
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

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12 col-md-12 col-sm-12'>
              <div className='m-portlet m-portlet-mobile '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {this.state.listName}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  { this.props.listDetail && this.props.listDetail.length > 0
                    ? <div>
                      <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                        <div className='row align-items-center'>
                          <div className='col-xl-12 order-2 order-xl-1'>
                            <div className='form-group m-form__group row align-items-center'>
                              <div className='col-md-4'>
                                <div className='m-input-icon m-input-icon--left'>
                                  <input type='text' className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' onChange={this.searchSubscriber} />
                                  <span className='m-input-icon__icon m-input-icon__icon--left'>
                                    <span><i className='la la-search' /></span>
                                  </span>
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
                              <th data-field='Email'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px', overflow: 'inherit'}}>Email</span>
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
                            </tr>
                          </thead>

                          <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                            {
                          this.state.subscribersData.map((subscriber, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
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
                                  {subscriber.phoneNumber && subscriber.phoneNumber !== '' ? subscriber.phoneNumber : '-'}
                                </span>
                              </td>
                              <td data-field='email'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '100px', overflow: 'inherit'}}>
                                  {subscriber.email && subscriber.email !== '' ? subscriber.email : '-'}
                                </span>
                              </td>
                              <td data-field='source'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '100px', overflow: 'inherit'}}>
                                  {subscriber.source === 'customer_matching' ? 'PhoneNumber' : subscriber.source === 'direct_message' ? 'Direct Message' : 'Chat Plugin'}
                                </span>
                              </td>
                              <td data-field='Locale' className='m-datatable__cell'><span style={{width: '100px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.locale}</span></td>
                              <td data-field='Gender' className='m-datatable__cell'><span style={{width: '100px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.gender}</span></td>
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
                <div className='m-portlet__foot m-portlet__foot--fit'>
                  <div className='m-form__actions m-form__actions' style={{padding: '30px'}}>
                    <Link to='/segmentedLists' className='btn btn-primary'>
                      Back
                    </Link>
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
    pages: (state.pagesInfo.pages),
    listDetail: (state.listsInfo.listDetails),
    currentList: (state.listsInfo.currentList)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadListDetails: loadListDetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ListDetails)
