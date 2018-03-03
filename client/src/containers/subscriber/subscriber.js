/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import fileDownload from 'js-file-download'
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
      searchValue: ''
    }
    props.loadMyPagesList()
    props.loadSubscribersList()
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handleFilterByGender = this.handleFilterByGender.bind(this)
    this.handleFilterByLocale = this.handleFilterByLocale.bind(this)
    this.handleFilterByPage = this.handleFilterByPage.bind(this)
    this.stackGenderFilter = this.stackGenderFilter.bind(this)
    this.stackPageFilter = this.stackPageFilter.bind(this)
    this.stackLocaleFilter = this.stackLocaleFilter.bind(this)
    this.exportRecords = this.exportRecords.bind(this)
    this.prepareExportData = this.prepareExportData.bind(this)
    console.log('exeuting subscriber')
  }

  componentDidMount () {
    console.log('exeuting subscriber')
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    document.title = 'KiboPush | Subscribers'
  }

  searchSubscriber (event) {
    console.log('exeuting subscriber')
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
    console.log('exeuting subscriber')
    console.log(subscribers)
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
    console.log('download File called')
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
        console.log(err)
      } else {
        fileDownload(csv, 'SegmentedList.csv')
      }
    })
  }
  handlePageClick (data) {
    console.log('exeuting subscriber')
    this.displayData(data.selected, this.state.subscribersDataAll)
  }

  componentWillReceiveProps (nextProps) {
    console.log('exeuting subscriber')
    console.log('componentWillReceiveProps is called in sub', nextProps)
    if (nextProps.subscribers) {
      console.log('Subscribers Updated', nextProps.subscribers)
      this.displayData(0, nextProps.subscribers)
      this.setState({ totalLength: nextProps.subscribers.length })
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
  handleFilterByPage (e) {
    console.log('Filter By Page')
    this.setState({filterByPage: e.target.value, searchValue: ''})
    var filteredData = this.props.subscribers
    filteredData = this.stackGenderFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
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
    console.log('Filter By Gender')
    this.setState({filterByGender: e.target.value, searchValue: ''})
    var filteredData = this.props.subscribers
    filteredData = this.stackPageFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
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
    console.log('Filter By Locale')
    this.setState({filterByLocale: e.target.value, searchValue: ''})
    var filteredData = this.props.subscribers
    filteredData = this.stackPageFilter(filteredData)
    filteredData = this.stackGenderFilter(filteredData)
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
    console.log('In render of subscriber')
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
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
                  <a href='http://kibopush.com/user-guide/' target='_blank'>Click Here </a> to learn how you can get more subscribers.
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
                                  <div className='filters' style={{marginTop: '10px', display: 'flex'}}>
                                    <div className='col-md-4'>
                                      <div className='m-form__group m-form__group--inline'>
                                        <div className='m-form__label'>
                                          <label>Gender:</label>
                                        </div>
                                        {/* <div className='m-form__control'>
                                      <div className='btn-group bootstrap-select form-control m-bootstrap-select m-bootstrap-select--solid dropup'><button type='button' className='btn dropdown-toggle bs-placeholder btn-default' data-toggle='dropdown' role='button' data-id='m_form_status' title='All' aria-expanded='false'><span className='filter-option pull-left'>All</span>&nbsp;<span className='bs-caret'><span className='caret' /></span></button><div className='dropdown-menu open' role='combobox'><ul className='dropdown-menu inner' role='listbox' aria-expanded='false'><li data-original-index='0' className='selected'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='true'><span className='text'>All</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='1'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>Male</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='2'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>Female</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='3'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>Other</span><span className='glyphicon glyphicon-ok check-mark' /></a></li></ul>
                                      </div> */}
                                        <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.filterByGender} onChange={this.handleFilterByGender}>
                                          <option value='' disabled>Filter by Gender...</option>
                                          <option value=''>All</option>
                                          <option value='male'>Male</option>
                                          <option value='female'>Female</option>
                                          <option value='other'>Other</option>
                                        </select>{/* </div>
                                    </div> */}
                                      </div>
                                      <div className='d-md-none m--margin-bottom-10' />
                                    </div>
                                    <div className='col-md-4'>
                                      <div className='m-form__group m-form__group--inline'>
                                        <div className='m-form__label'>
                                          <label className='m-label m-label--single'>Page:</label>
                                        </div>
                                        <div className='m-form__control'>
                                          <select className='custom-select' id='m_form_type' tabIndex='-98' value={this.state.filterByPage} onChange={this.handleFilterByPage}>
                                            <option value='' disabled>Filter by Page...</option>
                                            <option value=''>ALL</option>
                                            {
                                              this.props.pages.map((page, i) => (
                                                <option value={page.pageId}>{page.pageName}</option>
                                              ))
                                            }
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-md-4'>
                                      <div className='m-form__group m-form__group--inline'>
                                        <div className='m-form__label'>
                                          <label className='m-label m-label--single'>Locale:</label>
                                        </div>
                                        <div className='m-form__control'>
                                          {/* <div className='btn-group bootstrap-select form-control m-bootstrap-select m-bootstrap-select--solid'>
                                        <button type='button' className='btn dropdown-toggle bs-placeholder btn-default' data-toggle='dropdown' role='button' data-id='m_form_type' title='All'><span className='filter-option pull-left'>All</span>&nbsp;<span className='bs-caret'><span className='caret' /></span></button>
                                        <div className='dropdown-menu open' role='combobox'>
                                          <ul className='dropdown-menu inner' role='listbox' aria-expanded='false'><li data-original-index='0' className='selected'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='true'><span className='text'>All</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='1'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>en_US</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='2'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>en_GB</span><span className='glyphicon glyphicon-ok check-mark' /></a></li><li data-original-index='3'><a tabIndex='0' className='' data-tokens='null' role='option' aria-disabled='false' aria-selected='false'><span className='text'>en_AZ</span><span className='glyphicon glyphicon-ok check-mark' /></a></li></ul></div>
                                        */}<select className='custom-select' id='m_form_type' tabIndex='-98' value={this.state.filterByLocale} onChange={this.handleFilterByLocale}>
                                          <option value='' disabled>Filter by Locale...</option>
                                          <option value=''>ALL</option>
                                          {
                                            this.props.locales.map((locale, i) => (
                                              <option value={locale}>{locale}</option>
                                            ))
                                          }
                                        </select>{/* </div> */}
                                        </div>
                                      </div>
                                      <div className='d-md-none m--margin-bottom-10' />
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
                                      {subscriber.phoneNumber}
                                    </span>
                                  </td>
                                  <td data-field='email'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.email}
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
  console.log(state)
  return {
    subscribers: (state.subscribersInfo.subscribers),
    locales: (state.subscribersInfo.locales),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadSubscribersList: loadSubscribersList,
    loadMyPagesList: loadMyPagesList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Subscriber)
