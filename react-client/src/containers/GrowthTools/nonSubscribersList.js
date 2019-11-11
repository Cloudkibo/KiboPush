/* eslint-disable no-useless-constructor */
import React from 'react'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import { getPendingSubscriptions } from '../../redux/actions/growthTools.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPaginate from 'react-paginate'
import fileDownload from 'js-file-download'
var json2csv = require('json2csv')

class NonSubscribersList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      nonSubscribersData: [],
      nonSubscribersDataAll: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.searchNonSubscriber = this.searchNonSubscriber.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.exportRecordsNonSubscribers = this.exportRecordsNonSubscribers.bind(this)
    if (this.props.currentList) {
      props.getPendingSubscriptions(this.props.currentList.listName)
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

    document.title = `${title} | Non Subscribers List`;
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.nonSubscribersNumbers) {
      this.displayData(0, nextProps.nonSubscribersNumbers)
      this.setState({ totalLength: nextProps.nonSubscribersNumbers.length })
    }
  }
  prepareExportData () {
    var data = []
    var nonSubscriberObj = {}
    for (var i = 0; i < this.state.nonSubscribersData.length; i++) {
      var nonSubscriber = this.state.nonSubscribersData[i]
      nonSubscriberObj = {
        'Name': nonSubscriber.name,
        'Page': nonSubscriber.pageId.pageName,
        'PhoneNumber': nonSubscriber.number
      }
      data.push(nonSubscriberObj)
    }
    return data
  }

  exportRecordsNonSubscribers () {
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
        fileDownload(csv, 'NonSubscribersList.csv')
      }
    })
  }
  displayData (n, nonSubscribers) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > nonSubscribers.length) {
      limit = nonSubscribers.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = nonSubscribers[i]
      index++
    }
    this.setState({nonSubscribersData: data, nonSubscribersDataAll: nonSubscribers})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.nonSubscribersDataAll)
  }

  searchNonSubscriber (event) {
    var filtered = []
    for (let i = 0; i < this.props.nonSubscribersNumbers.length; i++) {
      if (this.props.nonSubscribersNumbers[i].number.includes(event.target.value) || this.props.nonSubscribersNumbers[i].number.includes(event.target.value)) {
        filtered.push(this.props.nonSubscribersNumbers[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  render () {
    return (
      <div className='m-portlet m-portlet-mobile '>
        <div className='m-portlet__head'>
          <div className='m-portlet__head-caption'>
            <div className='m-portlet__head-title'>
              <h3 className='m-portlet__head-text'>
                Customers with Pending Subscription
              </h3>
            </div>
          </div>
        </div>
        <div className='m-portlet__body'>
          { this.props.nonSubscribersNumbers && this.props.nonSubscribersNumbers.length > 0
            ? <div>
              <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                <div className='row align-items-center'>
                  <div className='col-xl-12 order-2 order-xl-1'>
                    <div className='form-group m-form__group row align-items-center'>
                      <div className='col-md-4'>
                        <div className='m-input-icon m-input-icon--left'>
                          <input type='text' className='form-control m-input m-input--solid' placeholder='Search PhoneNumber' id='generalSearch' onChange={this.searchNonSubscriber} />
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
                    </tr>
                  </thead>

                  <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                    {
                  this.state.nonSubscribersData.map((nonSubscriber, i) => (
                    <tr data-row={i}
                      className='m-datatable__row m-datatable__row--even'
                      style={{height: '55px'}} key={i}>
                      <td data-field='Name'
                        className='m-datatable__cell'>
                        <span
                          style={{width: '100px', overflow: 'inherit'}}>{nonSubscriber.name === '' ? 'Customer' : nonSubscriber.name}</span>
                      </td>

                      <td data-field='Page'
                        className='m-datatable__cell'>
                        <span
                          style={{width: '100px', overflow: 'inherit'}}>
                          {nonSubscriber.pageId.pageName}
                        </span>
                      </td>

                      <td data-field='phoneNumber'
                        className='m-datatable__cell'>
                        <span
                          style={{width: '100px', overflow: 'inherit'}}>
                          {nonSubscriber.number}
                        </span>
                      </td>
                    </tr>
                  ))
                }
                  </tbody>
                </table>
                <ReactPaginate previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={<a href='#/'>...</a>}
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
                <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.exportRecordsNonSubscribers}>
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
    )
  }
}
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    nonSubscribersNumbers: (state.growthToolsInfo.nonSubscribersData),
    currentList: (state.listsInfo.currentList)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    getPendingSubscriptions: getPendingSubscriptions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(NonSubscribersList)
