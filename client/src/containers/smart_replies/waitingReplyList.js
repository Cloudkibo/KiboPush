/* eslint-disable no-useless-constructor */
import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'
import { UncontrolledTooltip } from 'reactstrap'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { loadTags } from '../../redux/actions/tags.actions'
import { loadWaitingReplyList } from '../../redux/actions/smart_replies.actions'

class WaitingReplyList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      waitingList: [],
      totalLength: 0,
      tagOptions: [],
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
    this.handleFilterByTag = this.handleFilterByTag.bind(this)
    this.stackGenderFilter = this.stackGenderFilter.bind(this)
    this.stackPageFilter = this.stackPageFilter.bind(this)
    this.stackLocaleFilter = this.stackLocaleFilter.bind(this)
    props.loadWaitingReplyList()
    props.loadMyPagesList()
    props.loadTags()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.waitingReplyList) {
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
  }

  openChat (subscriber) {
    this.props.history.push({
      pathname: `/liveChat`,
      state: {subscriberToRespond: subscriber}
    })
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
    this.setState({waitingList: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.waitingList)
  }
  stackGenderFilter (filteredData) {
    if (this.state.filterByGender !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].gender === this.state.filterByGender) {
          filtered.push(filteredData[i])
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
        if (filteredData[i].pageId && (filteredData[i].pageId.pageId === this.state.filterByPage)) {
          filtered.push(filteredData[i])
        }
      }
      filteredData = filtered
    }
    return filteredData
  }

  stackTagFilter (filteredData) {
    if (this.state.filterByTag !== '') {
      var filtered = []
      for (var i = 0; i < filteredData.length; i++) {
        if (filteredData[i].tags) {
          for (var j = 0; j < filteredData[i].tags.length; j++) {
            if (filteredData[i].tags[j] === this.state.filterByTag) {
              filtered.push(filteredData[i])
              break
            }
          }
        }
      }
      filteredData = filtered
    }
    return filteredData
  }

  handleFilterByTag (e) {
    this.setState({filterByTag: e.target.value})
    this.setState({searchValue: ''})
    var filteredData = this.props.waitingReplyList
    filteredData = this.stackGenderFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
    filteredData = this.stackPageFilter(filteredData)
    var filtered = []
    console.log('e.target.value', e.target.value)
    if (e.target.value !== '') {
      for (var k = 0; k < filteredData.length; k++) {
        if (filteredData[k].tags) {
          for (var i = 0; i < filteredData[k].tags.length; i++) {
            if (filteredData[k].tags[i] === e.target.value) {
              filtered.push(filteredData[k])
              break
            }
          }
        }
      }
      filteredData = filtered
    }
    this.setState({filteredData: filteredData})
    this.displayData(0, filteredData)
    this.setState({ totalLength: filteredData.length })
  }
  handleFilterByPage (e) {
    this.setState({filterByPage: e.target.value})
    this.setState({searchValue: ''})
    var filteredData = this.props.waitingReplyList
    filteredData = this.stackGenderFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
    filteredData = this.stackTagFilter(filteredData)
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
    this.setState({filterByGender: e.target.value})
    var filteredData = this.props.waitingReplyList
    filteredData = this.stackPageFilter(filteredData)
    filteredData = this.stackLocaleFilter(filteredData)
    filteredData = this.stackTagFilter(filteredData)
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
    this.setState({filterByLocale: e.target.value})
    this.setState({searchValue: ''})
    var filteredData = this.props.waitingReplyList
    filteredData = this.stackPageFilter(filteredData)
    filteredData = this.stackGenderFilter(filteredData)
    filteredData = this.stackTagFilter(filteredData)
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
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
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
                                          <option key={i} value={page._id}>{page.pageName}</option>
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
                              <div className='col-md-6' style={{marginTop: '20px'}}>
                                <div className='m-form__group m-form__group--inline'>
                                  <div className='' style={{marginTop: '10px'}}>
                                    <label style={{width: '60px'}}>Tags:</label>
                                  </div>
                                  <div className='m-form__control'>
                                    <select className='custom-select'style={{width: '250px'}} id='m_form_type' tabIndex='-98' value={this.state.filterByTag} onChange={this.handleFilterByTag}>
                                      <option key='' value='' disabled>Filter by Tags...</option>
                                      <option key='ALL' value=''>ALL</option>
                                      {
                                        this.state.tagOptions.map((tag, i) => (
                                          <option key={i} value={tag.value}>{tag.label}</option>
                                        ))
                                      }
                                    </select>
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6' style={{marginTop: '20px'}}>
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
                                  <th data-field='Tag'
                                    className='m-datatable__cell--center m-datatable__cell'>
                                    <span style={{width: '50px', overflow: 'inherit'}}>Tags</span>
                                  </th>
                                  <th data-field='redirect'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px', overflow: 'inherit'}}> Click to Respond</span>
                                  </th>
                                </tr>
                              </thead>

                              <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                                {
                              this.state.waitingList.map((subscriber, i) => (
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
                                  <td data-field='source'
                                    className='m-datatable__cell'>
                                    <span
                                      style={{width: '100px', overflow: 'inherit'}}>
                                      {subscriber.subscriber.source === 'customer_matching' ? 'PhoneNumber' : subscriber.source === 'direct_message' ? 'Direct Message' : 'Chat Plugin'}
                                    </span>
                                  </td>
                                  <td data-field='Gender' className='m-datatable__cell'>
                                    <span style={{width: '50px'}}>
                                      {
                                        subscriber.gender === 'male' ? (<i className='la la-male' style={{color: subscriber.isSubscribed ? '#716aca' : '#818a91'}} />) : (<i className='la la-female' style={{color: subscriber.isSubscribed ? '#716aca' : '#818a91'}} />)
                                      }
                                    </span>
                                  </td>
                                  <td data-field='Locale' className='m-datatable__cell'><span style={{width: '100px', overflow: 'inherit'}}className='m-badge m-badge--brand'>{subscriber.locale}</span></td>
                                  <td data-field='Tag' id={'tag-' + i} className='m-datatable__cell'>
                                    <span style={{width: '50px', color: 'white', overflow: 'inherit'}}>
                                      {
                                        subscriber.tags && subscriber.tags.length > 0 ? (<i className='la la-tags' style={{color: subscriber.isSubscribed ? '#716aca' : '#818a91'}} />) : ('No Tags Assigned')
                                      }
                                    </span>
                                    {subscriber.tags && subscriber.tags.length > 0 &&
                                      <UncontrolledTooltip style={{minWidth: '100px', opacity: '1.0'}} placement='left' target={'tag-' + i}>
                                          {
                                              subscriber.tags.map((tag, i) => (
                                                <span key={i} style={{display: 'block'}}>{tag}</span>
                                              ))
                                          }
                                        </UncontrolledTooltip>
                                    }
                                  </td>
                                  <td data-field='redirect' className='m-datatable__cell'><span style={{overflow: 'inherit'}}>
                                    <button className='btn btn-primary btn-sm'
                                      style={{margin: 2}} onClick={() => this.openChat(subscriber)}>
                                      Start Conversation
                                  </button></span></td>
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
                        </div>
                      : <div className='table-responsive'>
                        <p> No data to display </p>
                      </div>
                    }
                    </div>
                    <div className='m-portlet__foot m-portlet__foot--fit'>
                      <div className='m-form__actions m-form__actions' style={{padding: '30px'}}>
                        <Link to='/' className='btn btn-primary'>
                          Back
                        </Link>
                      </div>
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
  return {
    pages: (state.pagesInfo.pages),
    tags: (state.tagsInfo.tags),
    count: (state.subscribersInfo.count),
    waitingReplyList: (state.botsInfo.waitingReplyList)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadTags: loadTags,
    loadWaitingReplyList: loadWaitingReplyList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WaitingReplyList)
