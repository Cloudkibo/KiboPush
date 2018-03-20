/**
 * Created by sojharo on 30/11/2017.
 */
import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
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
    this.setState({pageSubscribersData: data, pageSubscribersDataAll: pageSubscribers})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.pageSubscribersDataAll)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.pageSubscribers) {
      this.displayData(0, nextProps.pageSubscribers)
      this.setState({ totalLength: nextProps.pageSubscribers.length })
    }
  }
  searchSubscribers (event) {
    var filtered = []
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
    this.props.history.push({
      pathname: `/userDetails`,
      state: user
    })
  }

  componentDidMount () {
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
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <h3>{ this.state.pageName }</h3>
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <h4>Subscribers List</h4>
                  { this.props.pageSubscribers && this.props.pageSubscribers.length > 0
                    ? <div className='table-responsive'>
                      <form>
                        <div className='form-row' style={{display: 'flex'}}>
                          <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                            <label> Search </label>
                            <input type='text' placeholder='Search Subscribers...' className='form-control' onChange={this.searchSubscribers} />
                          </div>
                          <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                            <label> Gender </label>
                            <Select
                              name='form-field-name'
                              options={this.state.genders}
                              onChange={this.onFilterByGender}
                              placeholder='Filter by gender...'
                              value={this.state.genderValue}
                            />
                          </div>
                          <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                            <label> Locale </label>
                            <Select
                              name='form-field-name'
                              options={this.props.locales}
                              onChange={this.onFilterByLocale}
                              placeholder='Filter by locale...'
                              value={this.state.localeValue}
                            />
                          </div>
                        </div>
                      </form>
                      {
                        this.state.pageSubscribersData && this.state.pageSubscribersData.length > 0
                          ? <div>
                            <table className='table table-striped'>
                              <thead>
                                <tr>
                                  <th>Profile Pic</th>
                                  <th>Subscriber</th>
                                  <th>Gender</th>
                                  <th>Locale</th>
                                  <th />
                                </tr>
                              </thead>
                              <tbody>
                                {
                              this.state.pageSubscribersData.map((subscriber, i) => (
                                <tr>
                                  <td><img alt='pic'
                                    src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                    className='img-circle' width='60' height='60' /></td>
                                  <td>{subscriber.firstName}{' '}{subscriber.lastName}</td>
                                  <td>{subscriber.gender}</td>
                                  <td>{subscriber.locale}</td>
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
              <div className='back-button' style={{float: 'right', margin: 2}}>
                <button className='btn btn-primary btn-sm' onClick={() => this.backToUserDetails()}>Back
                </button>
              </div>
            </main>

          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    pageSubscribers: (state.backdoorInfo.pageSubscribers),
    locales: (state.backdoorInfo.locales),
    currentUser: (state.backdoorInfo.currentUser),
    currentPage: (state.backdoorInfo.currentPage)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPageSubscribersList: loadPageSubscribersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageSubscribers)
