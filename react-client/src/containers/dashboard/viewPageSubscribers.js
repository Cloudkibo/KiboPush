import React from 'react'
import ReactPaginate from 'react-paginate'
import { loadPageSubscribersList, allLocales } from '../../redux/actions/dashboard.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Select from 'react-select'
import { Link } from 'react-router-dom'

class ViewPageSubscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    // const pageId = this.props.params.pageId
    let pageName = ''
    props.allLocales()
    if (this.props.currentPage) {
      pageName = this.props.currentPage.pageName
      const id = this.props.currentPage._id
      props.loadPageSubscribersList(id, {last_id: 'none', number_of_records: 10, first_page: 'first', filter_criteria: {search_value: '', gender_value: '', locale_value: ''}})
    }
    this.state = {
      pageName: pageName,
      pageSubscribersData: [],
      pageSubscribersDataAll: [],
      totalLength: 0,
      localeOptions: [],
      genders: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }],
      genderValue: '',
      localeValue: '',
      searchValue: '',
      pageNumber: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSubscribers = this.searchSubscribers.bind(this)
    this.onFilterByGender = this.onFilterByGender.bind(this)
    this.onFilterByLocale = this.onFilterByLocale.bind(this)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | View Page Subcribers`;
  }

  displayData (n, pageSubscribers) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > pageSubscribers.length) {
      limit = pageSubscribers.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageSubscribers[i]
      index++
    }
    this.setState({pageSubscribersData: data, pageSubscribersDataAll: pageSubscribers})
  }

  handlePageClick (data) {
    if (this.props.currentPage) {
      if (data.selected === 0) {
        this.props.loadPageSubscribersList(this.props.currentPage._id, {last_id: 'none', number_of_records: 10, first_page: 'first', filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.genderValue, locale_value: this.state.localeValue}})
      } else if (this.state.pageNumber < data.selected) {
        this.props.loadPageSubscribersList(this.props.currentPage._id, {last_id: this.props.pageSubscribers.length > 0 ? this.props.pageSubscribers[this.props.pageSubscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'next', filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.genderValue, locale_value: this.state.localeValue}})
      } else {
        this.props.loadPageSubscribersList(this.props.currentPage._id, {last_id: this.props.pageSubscribers.length > 0 ? this.props.pageSubscribers[0]._id : 'none', number_of_records: 10, first_page: 'previous', filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.genderValue, locale_value: this.state.localeValue}})
      }
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.state.pageSubscribersDataAll)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.pageSubscribers && nextProps.count) {
      this.displayData(0, nextProps.pageSubscribers)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({pageSubscribersData: [], pageSubscribersDataAll: [], totalLength: 0})
    }
    var localeOptions = []
    if (nextProps.locales) {
      for (let i = 0; i < nextProps.locales.length; i++) {
        localeOptions.push({value: nextProps.locales[i], label: nextProps.locales[i]})
      }
      this.setState({localeOptions: localeOptions})
    }
  }
  searchSubscribers (event) {
    this.setState({searchValue: event.target.value.toLowerCase()})
    if (this.props.currentPage) {
      this.props.loadPageSubscribersList(this.props.currentPage._id, {last_id: this.props.pageSubscribers.length > 0 ? this.props.pageSubscribers[this.props.pageSubscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter_criteria: {search_value: event.target.value.toLowerCase(), gender_value: this.state.genderValue, locale_value: this.state.localeValue}})
    }
    // var filtered = []
    // for (let i = 0; i < this.props.pageSubscribers.length; i++) {
    //   if (this.props.pageSubscribers[i].firstName.toLowerCase().includes(event.target.value.toLowerCase()) || this.props.pageSubscribers[i].lastName.toLowerCase().includes(event.target.value.toLowerCase())) {
    //     filtered.push(this.props.pageSubscribers[i])
    //   }
    // }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: this.state.pageSubscribersData.length })
  }

  onFilterByGender (data) {
    if (data) {
      this.setState({genderValue: data.value})
      if (this.props.currentPage) {
        this.props.loadPageSubscribersList(this.props.currentPage._id, {last_id: this.props.pageSubscribers.length > 0 ? this.props.pageSubscribers[this.props.pageSubscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter_criteria: {search_value: this.state.searchValue, gender_value: data.value, locale_value: this.state.localeValue}})
      }
    } else {
      this.setState({genderValue: ''})
      this.props.loadPageSubscribersList(this.props.currentPage._id, {last_id: this.props.pageSubscribers.length > 0 ? this.props.pageSubscribers[this.props.pageSubscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter_criteria: {search_value: this.state.searchValue, gender_value: '', locale_value: this.state.localeValue}})
    }
    // var filtered = []
    // if (!data) {
    //   if (this.state.localeValue !== '') {
    //     for (var a = 0; a < this.props.pageSubscribers.length; a++) {
    //       if (this.props.pageSubscribers[a].locale === this.state.localeValue) {
    //         filtered.push(this.props.pageSubscribers[a])
    //       }
    //     }
    //   } else {
    //     filtered = this.props.pageSubscribers
    //   }
    //   this.setState({genderValue: ''})
    // } else {
    //   if (this.state.localeValue !== '') {
    //     for (var i = 0; i < this.props.pageSubscribers.length; i++) {
    //       if (this.props.pageSubscribers[i].gender === data.value && this.props.pageSubscribers[i].locale === this.state.localeValue) {
    //         filtered.push(this.props.pageSubscribers[i])
    //       }
    //     }
    //   } else {
    //     for (var j = 0; j < this.props.pageSubscribers.length; j++) {
    //       if (this.props.pageSubscribers[j].gender === data.value) {
    //         filtered.push(this.props.pageSubscribers[j])
    //       }
    //     }
    //   }
    //   this.setState({genderValue: data.value})
    // }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }

  onFilterByLocale (data) {
    console.log('data', data)
    if (data) {
      this.setState({localeValue: data.value})
      if (this.props.currentPage) {
        this.props.loadPageSubscribersList(this.props.currentPage._id, {last_id: this.props.pageSubscribers.length > 0 ? this.props.pageSubscribers[this.props.pageSubscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.genderValue, locale_value: data.value}})
      }
    } else {
      this.setState({localeValue: ''})
      this.props.loadPageSubscribersList(this.props.currentPage._id, {last_id: this.props.pageSubscribers.length > 0 ? this.props.pageSubscribers[this.props.pageSubscribers.length - 1]._id : 'none', number_of_records: 10, first_page: 'first', filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.genderValue, locale_value: ''}})
    }
    // var filtered = []
    // if (!data) {
    //   if (this.state.genderValue !== '') {
    //     for (var a = 0; a < this.props.pageSubscribers.length; a++) {
    //       if (this.props.pageSubscribers[a].gender === this.state.genderValue) {
    //         filtered.push(this.props.pageSubscribers[a])
    //       }
    //     }
    //   } else {
    //     filtered = this.props.pageSubscribers
    //   }
    //   this.setState({localeValue: ''})
    // } else {
    //   if (this.state.genderValue !== '') {
    //     for (var i = 0; i < this.props.pageSubscribers.length; i++) {
    //       if (this.props.pageSubscribers[i].gender === this.state.genderValue && this.props.pageSubscribers[i].locale === data.value) {
    //         filtered.push(this.props.pageSubscribers[i])
    //       }
    //     }
    //   } else {
    //     for (var j = 0; j < this.props.pageSubscribers.length; j++) {
    //       if (this.props.pageSubscribers[j].locale === data.value) {
    //         filtered.push(this.props.pageSubscribers[j])
    //       }
    //     }
    //   }
    //   this.setState({localeValue: data.value})
    // }
    // this.displayData(0, filtered)
    // this.setState({ totalLength: filtered.length })
  }

  render () {
    var subscribedStyle = {
      width: '150px',
      overflow: 'inherit'
    }
    var unsubscribedStyle = {
      width: '150px',
      overflow: 'inherit',
      color: '#b2bbc1'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>{this.state.pageName}</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Subscribers
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-lg-12 col-md-12'>
                      <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                        <div className='row align-items-center'>
                          <div className='col-xl-12 order-2 order-xl-1'>
                            <div
                              className='form-group m-form__group row align-items-center'>
                              <div className='col-md-4'>
                                <div
                                  className='m-form__group m-form__group--inline'>
                                  <div className='m-input-icon m-input-icon--left'>
                                    <input type='text' placeholder='Search Subscribers...' className='form-control m-input m-input--solid' onChange={this.searchSubscribers} />
                                    <span className='m-input-icon__icon m-input-icon__icon--left'>
                                      <span>
                                        <i className='la la-search' />
                                      </span>
                                    </span>
                                  </div>
                                </div>
                                <div
                                  className='d-md-none m--margin-bottom-10' />
                              </div>
                              <div className='col-md-4'>
                                <div
                                  className='m-form__group m-form__group--inline'>
                                  <div className='m-form__label'>
                                    <label>
                                      Gender:
                                    </label>
                                  </div>
                                  <div className='m-form__control'>
                                    <Select
                                      name='form-field-name'
                                      options={this.state.genders}
                                      onChange={this.onFilterByGender}
                                      placeholder='Filter by gender...'
                                      value={this.state.genderValue}
                                    />
                                  </div>
                                </div>
                                <div
                                  className='d-md-none m--margin-bottom-10' />
                              </div>
                              <div className='col-md-4'>
                                <div
                                  className='m-form__group m-form__group--inline'>
                                  <div className='m-form__label'>
                                    <label>
                                      Locale:
                                    </label>
                                  </div>
                                  <div className='m-form__control'>
                                    <Select
                                      name='form-field-name'
                                      options={this.state.localeOptions}
                                      onChange={this.onFilterByLocale}
                                      placeholder='Filter by locale...'
                                      value={this.state.localeValue}
                                    />
                                  </div>
                                </div>
                                <div
                                  className='d-md-none m--margin-bottom-10' />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {
                        this.state.pageSubscribersData && this.state.pageSubscribersData.length > 0
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
                                  <th data-field='picture'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px'}}>Profile Pic</span>
                                  </th>
                                  <th data-field='name'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px'}}>Subscriber Name</span>
                                  </th>
                                  <th data-field='gender'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px'}}>Gender</span>
                                  </th>
                                  <th data-field='locale'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px'}}>Locale</span>
                                  </th>
                                  <th data-field='status'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px'}}>Status</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                                {
                                  this.state.pageSubscribersData.map((subscriber, i) => (
                                    <tr data-row={i}
                                      className='m-datatable__row m-datatable__row--even'
                                      style={{height: '55px'}} key={i}>
                                      <td data-field='picture'
                                        className='m-datatable__cell'>
                                        <span
                                          style={subscriber.isSubscribed ? subscribedStyle : unsubscribedStyle}>
                                          <img alt='pic'
                                            src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                            className='img-circle' width='60' height='60' />
                                        </span>
                                      </td>
                                      <td data-field='name'
                                        className='m-datatable__cell'>
                                        <span
                                          style={subscriber.isSubscribed ? subscribedStyle : unsubscribedStyle}>{subscriber.firstName}{' '}{subscriber.lastName}</span>
                                      </td>
                                      <td data-field='gender'
                                        className='m-datatable__cell'>
                                        <span
                                          style={subscriber.isSubscribed ? subscribedStyle : unsubscribedStyle}>{subscriber.gender}</span>
                                      </td>
                                      <td data-field='locale'
                                        className='m-datatable__cell'>
                                        <span
                                          style={subscriber.isSubscribed ? subscribedStyle : unsubscribedStyle}>{subscriber.locale}</span>
                                      </td>
                                      <td data-field='status'
                                        className='m-datatable__cell'>
                                        <span
                                          style={subscriber.isSubscribed ? subscribedStyle : unsubscribedStyle}>
                                          {subscriber.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
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
                              pageCount={Math.ceil(this.state.totalLength / 10)}
                              marginPagesDisplayed={2}
                              pageRangeDisplayed={3}
                              onPageChange={this.handlePageClick}
                              containerClassName={'pagination'}
                              subContainerClassName={'pages pagination'}
                              activeClassName={'active'}
                              forcePage={this.state.pageNumber} />
                          </div>
                          : <p> No data to display </p>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{'overflow': 'auto'}}>
            <Link className='btn btn-primary btn-sm' to='/dashboard' style={{ float: 'right', marginRight: '5px' }}>Back
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('in mapStateToProps for pageSubscribers', state)
  return {
    pageSubscribers: (state.dashboardInfo.pageSubscribers),
    count: (state.dashboardInfo.subscribersCount),
    locales: (state.dashboardInfo.locales),
    currentUser: (state.backdoorInfo.currentUser),
    currentPage: (state.backdoorInfo.currentPage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPageSubscribersList: loadPageSubscribersList,
    allLocales: allLocales},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewPageSubscribers)
