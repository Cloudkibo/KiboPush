import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import ReactPaginate from 'react-paginate'
import { loadPageSubscribersList } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Select from 'react-select'

class PageSubscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    // const pageId = this.props.params.pageId
    let pageName = ''
    if (this.props.currentPage) {
      pageName = this.props.currentPage.pageName
      const id = this.props.currentPage._id
      this.props.loadPageSubscribersList(id)
    }
    this.state = {
      pageName: pageName,
      pageSubscribersData: [],
      pageSubscribersDataAll: [],
      totalLength: 0,
      genders: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }],
      genderValue: '',
      localeValue: ''
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSubscribers = this.searchSubscribers.bind(this)
    this.backToUserDetails = this.backToUserDetails.bind(this)
    this.onFilterByGender = this.onFilterByGender.bind(this)
    this.onFilterByLocale = this.onFilterByLocale.bind(this)
  }

  displayData (n, pageSubscribers) {
    console.log(n, pageSubscribers)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > pageSubscribers.length) {
      limit = pageSubscribers.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageSubscribers[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({pageSubscribersData: data, pageSubscribersDataAll: pageSubscribers})
    console.log('in displayData', this.state.pageSubscribersData)
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.pageSubscribersDataAll)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.pageSubscribers) {
      console.log('Page Subscribers Updated', nextProps.pageSubscribers)
      this.displayData(0, nextProps.pageSubscribers)
      this.setState({ totalLength: nextProps.pageSubscribers.length })
    }
  }
  searchSubscribers (event) {
    var filtered = []
    console.log('length', this.props.pageSubscribers)
    for (let i = 0; i < this.props.pageSubscribers.length; i++) {
      if (this.props.pageSubscribers[i].firstName.toLowerCase().includes(event.target.value.toLowerCase()) || this.props.pageSubscribers[i].lastName.toLowerCase().includes(event.target.value.toLowerCase())) {
        filtered.push(this.props.pageSubscribers[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: this.state.pageSubscribersData.length })
  }

  backToUserDetails () {
    const user = this.props.currentUser
    console.log('back to user details', user, this.props)
    this.props.history.push({
      pathname: `/userDetails`,
      state: user
    })
  }

  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/material.min.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/main.js')
    // document.body.appendChild(addScript)
  }

  onFilterByGender (data) {
    var filtered = []
    if (!data) {
      if (this.state.localeValue !== '') {
        for (var a = 0; a < this.props.pageSubscribers.length; a++) {
          if (this.props.pageSubscribers[a].locale === this.state.localeValue) {
            filtered.push(this.props.pageSubscribers[a])
          }
        }
      } else {
        filtered = this.props.pageSubscribers
      }
      this.setState({genderValue: ''})
    } else {
      if (this.state.localeValue !== '') {
        for (var i = 0; i < this.props.pageSubscribers.length; i++) {
          if (this.props.pageSubscribers[i].gender === data.value && this.props.pageSubscribers[i].locale === this.state.localeValue) {
            filtered.push(this.props.pageSubscribers[i])
          }
        }
      } else {
        for (var j = 0; j < this.props.pageSubscribers.length; j++) {
          if (this.props.pageSubscribers[j].gender === data.value) {
            filtered.push(this.props.pageSubscribers[j])
          }
        }
      }
      this.setState({genderValue: data.value})
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilterByLocale (data) {
    var filtered = []
    if (!data) {
      if (this.state.genderValue !== '') {
        for (var a = 0; a < this.props.pageSubscribers.length; a++) {
          if (this.props.pageSubscribers[a].gender === this.state.genderValue) {
            filtered.push(this.props.pageSubscribers[a])
          }
        }
      } else {
        filtered = this.props.pageSubscribers
      }
      this.setState({localeValue: ''})
    } else {
      if (this.state.genderValue !== '') {
        for (var i = 0; i < this.props.pageSubscribers.length; i++) {
          if (this.props.pageSubscribers[i].gender === this.state.genderValue && this.props.pageSubscribers[i].locale === data.value) {
            filtered.push(this.props.pageSubscribers[i])
          }
        }
      } else {
        for (var j = 0; j < this.props.pageSubscribers.length; j++) {
          if (this.props.pageSubscribers[j].locale === data.value) {
            filtered.push(this.props.pageSubscribers[j])
          }
        }
      }
      this.setState({localeValue: data.value})
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
                        { this.props.pageSubscribers && this.props.pageSubscribers.length > 0
                          ? <div className='col-lg-12 col-md-12'>
                            <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                              <div className='row align-items-center'>
                                <div className='col-xl-12 order-2 order-xl-1'>
                                  <div
                                    className='form-group m-form__group row align-items-center'>
                                    <div className='col-md-4'>
                                      <div
                                        className='m-form__group m-form__group--inline'>
                                        <div className='m-input-icon m-input-icon--left'>
                                          <input type='text' placeholder='Search Pages...' className='form-control m-input m-input--solid' onChange={this.searchSubscribers} />
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
                                            options={this.props.locales}
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
                                        <th data-field='pages'
                                          className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                          <span style={{width: '150px'}}>Profile Pic</span>
                                        </th>
                                        <th data-field='likes'
                                          className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                          <span style={{width: '150px'}}>Subscriber Name</span>
                                        </th>
                                        <th data-field='subscribers'
                                          className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                          <span style={{width: '150px'}}>Gender</span>
                                        </th>
                                        <th data-field='connected'
                                          className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                          <span style={{width: '150px'}}>Locale</span>
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                                      {
                                        this.state.pageSubscribersData.map((subscriber, i) => (
                                          <tr data-row={i}
                                            className='m-datatable__row m-datatable__row--even'
                                            style={{height: '55px'}} key={i}>
                                            <td data-field='pages'
                                              className='m-datatable__cell'>
                                              <img alt='pic'
                                                src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                                className='img-circle' width='60' height='60' />
                                            </td>
                                            <td data-field='likes'
                                              className='m-datatable__cell'>
                                              <span
                                                style={{width: '150px'}}>{subscriber.firstName}{' '}{subscriber.lastName}</span>
                                            </td>
                                            <td data-field='subscribers'
                                              className='m-datatable__cell'>
                                              <span
                                                style={{width: '150px'}}>{subscriber.gender}</span>
                                            </td>
                                            <td data-field='connected'
                                              className='m-datatable__cell'>
                                              <span
                                                style={{width: '150px'}}>{subscriber.locale}</span>
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
                                    pageCount={Math.ceil(this.state.totalLength / 5)}
                                    marginPagesDisplayed={2}
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
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('in mapStateToProps for pageSubscribers', state)
  return {
    pageSubscribers: (state.PageSubscribersInfo.pageSubscribers),
    locales: (state.PageSubscribersInfo.locales),
    currentUser: (state.getCurrentUser.currentUser),
    currentPage: (state.getCurrentPage.currentPage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPageSubscribersList: loadPageSubscribersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageSubscribers)
