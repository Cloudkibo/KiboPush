/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReactPaginate from 'react-paginate'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadTags } from '../../redux/actions/tags.actions'
import { loadWaitingSubscribers, removeWaitingSubscribers } from '../../redux/actions/smart_replies.actions'
import { allLocales } from '../../redux/actions/subscribers.actions'

class WaitingReplyList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      waitingList: [],
      totalLength: 0,
      tagOptions: [],
      locales: [],
      filterByGender: '',
      filterByLocale: '',
      filterByPage: '',
      filterByTag: '',
      searchValue: '',
      filteredData: ''
    }
    this.displayData = this.displayData.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.openChat = this.openChat.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handleFilterByGender = this.handleFilterByGender.bind(this)
    this.handleFilterByLocale = this.handleFilterByLocale.bind(this)
    this.handleFilterByPage = this.handleFilterByPage.bind(this)
    this.stackGenderFilter = this.stackGenderFilter.bind(this)
    this.stackPageFilter = this.stackPageFilter.bind(this)
    this.stackLocaleFilter = this.stackLocaleFilter.bind(this)
    this.backToIntents = this.backToIntents.bind(this)
    props.loadWaitingSubscribers(this.props.location.state)
    props.loadMyPagesList()
    props.allLocales()
  }

  backToIntents () {
    this.props.history.push({
      pathname: '/intents',
      state: this.props.location.state
    })
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Waiting Reply List`
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.waitingReplyList) {
      nextProps.waitingReplyList.sort(function (a, b) {
        return new Date(b.datetime) - new Date(a.datetime)
      })
      console.log('waiting reply list ' + JSON.stringify(nextProps.waitingReplyList))
      this.displayData(0, nextProps.waitingReplyList)
      this.setState({ totalLength: nextProps.waitingReplyList.length })
    } else {
      var emptyList = []
      this.displayData(0, emptyList)
    }
    if (nextProps.tags) {
      var tagOptions = []
      for (var i = 0; i < nextProps.tags.length; i++) {
        tagOptions.push({'value': nextProps.tags[i].tag, 'label': nextProps.tags[i].tag})
      }
      this.setState({
        tagOptions: tagOptions
      })
    }
    if (nextProps.locales) {
      this.setState({ locales: nextProps.locales })
    }
  }

  openChat (subscriber, id) {
    this.props.removeWaitingSubscribers(id)
    this.props.history.push({
      pathname: `/liveChat`,
      state: {subscriberToRespond: subscriber}
    })
  }

  displayData (n, subscribers) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > subscribers.length) {
      limit = subscribers.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = subscribers[i]
      index++
    }
    data.sort(function (a, b) {
      return new Date(b.datetime) - new Date(a.datetime)
    })
    this.setState({waitingList: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.waitingReplyList)
  }
  stackGenderFilter (filteredData) {
    if (this.state.filterByGender !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].subscriberId.gender === this.state.filterByGender) {
          filtered.push(filteredData[i])
        }
      }
      filteredData = filtered
    } else {
      console.log('inside gender filter else')
    }
    return filteredData
  }

  stackLocaleFilter (filteredData) {
    if (this.state.filterByLocale !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].subscriberId.locale === this.state.filterByLocale) {
          filtered.push(filteredData[i])
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
        if (filteredData[i].subscriberId.pageId && (filteredData[i].pageId.pageId === this.state.filterByPage)) {
          filtered.push(filteredData[i])
        }
      }
      filteredData = filtered
    }
    return filteredData
  }

  handleFilterByPage (e) {
    this.setState({filterByPage: e.target.value})
    this.setState({searchValue: ''})
    var filteredData = this.props.waitingReplyList
    filteredData = this.stackGenderFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
    var filtered = []
    if (e.target.value !== '') {
      for (var k = 0; k < filteredData.length; k++) {
        console.log(e.target.value)
        console.log(filteredData[k].subscriberId.pageId)
        if (filteredData[k].subscriberId.pageId && (filteredData[k].pageId.pageId === e.target.value)) {
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
    this.setState({filterByGender: e.target.value})
    var filteredData = this.props.waitingReplyList
    filteredData = this.stackPageFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
    var filtered = []
    if (e.target.value !== '') {
      for (var k = 0; k < filteredData.length; k++) {
        if (filteredData[k].subscriberId.gender && (filteredData[k].subscriberId.gender === e.target.value)) {
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
    this.setState({filterByLocale: e.target.value})
    this.setState({searchValue: ''})
    var filteredData = this.props.waitingReplyList
    filteredData = this.stackPageFilter(filteredData)
    filteredData = this.stackGenderFilter(filteredData)
    var filtered = []
    if (e.target.value !== '') {
      for (var k = 0; k < filteredData.length; k++) {
        if (filteredData[k].subscriberId.locale && (filteredData[k].subscriberId.locale === e.target.value)) {
          filtered.push(filteredData[k])
        }
      }
      filteredData = filtered
    }
    this.setState({filteredData: filteredData})
    this.displayData(0, filteredData)
    this.setState({ totalLength: filteredData.length })
  }

  searchSubscriber (event) {
    var filtered = []
    this.setState({filterByLocale: ''})
    this.setState({filterByTag: ''})
    this.setState({filterByPage: ''})
    this.setState({filterByGender: ''})
    for (let i = 0; i < this.props.waitingReplyList.length; i++) {
      if (this.props.waitingReplyList[i].firstName.toLowerCase().includes((event.target.value).toLowerCase()) || this.props.waitingReplyList[i].lastName.toLowerCase().includes((event.target.value).toLowerCase())) {
        filtered.push(this.props.waitingReplyList[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
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
                        Subscribers waiting for response
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                    <div className='row align-items-center'>
                      <div className='col-xl-12 order-2 order-xl-1'>
                        <div className='form-group m-form__group row align-items-center'>
                          <div className='col-md-6'>
                            <div className='m-form__group m-form__group--inline'>
                              <div className='' style={{marginTop: '10px'}}>
                                <label style={{width: '60px'}}>Gender:</label>
                              </div>
                              <div className='m-form__control'>
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
                              <div className='' style={{marginTop: '10px'}}>
                                <label style={{width: '60px'}}>Page:</label>
                              </div>
                              <div className='m-form__control'>
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
                          <div className='col-md-6'>
                            <div className='m-form__group m-form__group--inline'>
                              <div className='' style={{marginTop: '10px'}}>
                                <label style={{width: '60px'}}>Locale:</label>
                              </div>
                              <div className='m-form__control'>
                                <select className='custom-select' style={{width: '250px'}} id='m_form_type' tabIndex='-98' value={this.state.filterByLocale} onChange={this.handleFilterByLocale}>
                                  <option key='' value='' disabled>Filter by Locale...</option>
                                  <option key='ALL' value=''>ALL</option>
                                  {
                                    this.props.locales && this.props.locales.map((locale, i) => (
                                      <option key={i} value={locale}>{locale}</option>
                                    ))
                                  }
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  { this.state.waitingList && this.state.waitingList.length > 0
                    ? <div>
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
                              <th data-field='Source'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px', overflow: 'inherit'}}>Source</span>
                              </th>
                              <th data-field='Gender'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '50px', overflow: 'inherit'}}>Gender</span>
                              </th>
                              <th data-field='Locale'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px', overflow: 'inherit'}}>Locale</span>
                              </th>
                              <th data-field='redirect'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '150px', overflow: 'inherit'}}> Click to Respond</span>
                              </th>
                            </tr>
                          </thead>

                          <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                            { // Subscriber is one indexed object of waiting reply queue
                          this.state.waitingList.map((subscriber, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                              <td data-field='Profile Picture'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '100px', overflow: 'inherit'}}>
                                  <img alt='pic'
                                    src={subscriber.subscriberId.profilePic ? subscriber.subscriberId.profilePic : ''}
                                    className='m--img-rounded m--marginless m--img-centered' width='60' height='60'
                                />
                                </span>
                              </td>

                              <td data-field='Name'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '100px', overflow: 'inherit'}}>{subscriber.subscriberId.firstName} {subscriber.subscriberId.lastName}</span>
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
                                  {subscriber.subscriberId.phoneNumber ? subscriber.subscriberId.phoneNumber : '-'}
                                </span>
                              </td>
                              <td data-field='source'
                                className='m-datatable__cell'>
                                <span
                                  style={{width: '100px', overflow: 'inherit'}}>
                                  {subscriber.subscriberId.source === 'customer_matching' ? 'PhoneNumber' : subscriber.subscriberId.source === 'direct_message' ? 'Direct Message' : 'Chat Plugin'}
                                </span>
                              </td>
                              <td data-field='Gender' className='m-datatable__cell'>
                                <span style={{width: '50px'}}>
                                  {
                                    subscriber.subscriberId.gender === 'male' ? (<i className='la la-male' style={{color: subscriber.subscriberId.isSubscribed ? '#716aca' : '#818a91'}} />) : (<i className='la la-female' style={{color: subscriber.subscriberId.isSubscribed ? '#716aca' : '#818a91'}} />)
                                  }
                                </span>
                              </td>
                              <td data-field='Locale' className='m-datatable__cell'><span style={{width: '100px', overflow: 'inherit', color: 'white'}}className='m-badge m-badge--brand'>{subscriber.subscriberId.locale}</span></td>
                              <td data-field='redirect' className='m-datatable__cell'><span style={{overflow: 'inherit'}}>
                                <button className='btn btn-primary btn-sm'
                                  style={{margin: 2}} onClick={() => this.openChat(subscriber.subscriberId, subscriber._id)}>
                                  Start Conversation
                              </button></span></td>
                            </tr>
                          ))
                        }
                          </tbody>
                        </table>
                        <ReactPaginate previousLabel={'previous'}
                          nextLabel={'next'}
                          breakLabel={<a href='#/'>...</a>}
                          breakClassName={'break-me'}
                          pageCount={Math.ceil(this.state.totalLength / 10)}
                          marginPagesDisplayed={1}
                          pageRangeDisplayed={3}
                          onPageChange={this.handlePageClick}
                          containerClassName={'pagination'}
                          subContainerClassName={'pages pagination'}
                          activeClassName={'active'} />

                      </div>
                    </div>
                  : <div className='table-responsive'>
                    <p> No data to display </p>
                  </div>
                }
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit'>
                  <div className='m-form__actions m-form__actions' style={{padding: '30px'}}>
                    <a href='#/'
                      onClick={this.backToIntents}
                      className='btn btn-primary'>Back</a>
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
    tags: (state.tagsInfo.tags),
    locales: (state.subscribersInfo.locales),
    count: (state.subscribersInfo.count),
    waitingReplyList: (state.botsInfo.waitingReplyList)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadTags: loadTags,
    allLocales: allLocales,
    loadWaitingSubscribers: loadWaitingSubscribers,
    removeWaitingSubscribers: removeWaitingSubscribers
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WaitingReplyList)
