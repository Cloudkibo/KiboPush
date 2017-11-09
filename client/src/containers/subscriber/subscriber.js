/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class Subscriber extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadSubscribersList()
    this.state = {
      subscribersData: [],
      subscribersDataAll: [],
      totalLength: 0,
      filterByGender: '',
      filterByLocale: ''
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handleFilterByGender = this.handleFilterByGender.bind(this)
    this.handleFilterByLocale = this.handleFilterByLocale.bind(this)
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
    document.title = 'KiboPush | Subscribers'
  }

  searchSubscriber (event) {
    var filtered = []
    for (let i = 0; i < this.props.subscribers.length; i++) {
      if (this.props.subscribers[i].firstName.toLowerCase().includes(event.target.value) || this.props.subscribers[i].lastName.toLowerCase().includes(event.target.value)) {
        filtered.push(this.props.subscribers[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  displayData (n, subscribers) {
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

  handlePageClick (data) {
    this.displayData(data.selected, this.state.subscribersDataAll)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.subscribers) {
      console.log('Broadcasts Updated', nextProps.subscribers)
      this.displayData(0, nextProps.subscribers)
      this.setState({ totalLength: nextProps.subscribers.length })
    }
  }

  handleFilterByGender (e) {
    var filtered = []
    this.setState({filterByGender: e.target.value})
    if (this.state.filterByLocale !== '') {
      if (e.target.value === '') {
        for (var k = 0; k < this.props.subscribers.length; k++) {
          if (this.props.subscribers[k].locale === this.state.filterByLocale) {
            filtered.push(this.props.subscribers[k])
          }
        }
      } else {
        for (var i = 0; i < this.props.subscribers.length; i++) {
          if (this.props.subscribers[i].gender === e.target.value && this.props.subscribers[i].locale === this.state.filterByLocale) {
            filtered.push(this.props.subscribers[i])
          }
        }
      }
    } else {
      if (e.target.value === '') {
        filtered = this.props.subscribers
      } else {
        for (var j = 0; j < this.props.subscribers.length; j++) {
          if (this.props.subscribers[j].gender === e.target.value) {
            filtered.push(this.props.subscribers[j])
          }
        }
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  handleFilterByLocale (e) {
    var filtered = []
    this.setState({filterByLocale: e.target.value})
    if (this.state.filterByGender !== '') {
      if (e.target.value === '') {
        for (var k = 0; k < this.props.subscribers.length; k++) {
          if (this.props.subscribers[k].gender === this.state.filterByGender) {
            filtered.push(this.props.subscribers[k])
          }
        }
      } else {
        for (var i = 0; i < this.props.subscribers.length; i++) {
          if (this.props.subscribers[i].locale === e.target.value && this.props.subscribers[i].gender === this.state.filterByGender) {
            filtered.push(this.props.subscribers[i])
          }
        }
      }
    } else {
      if (e.target.value === '') {
        filtered = this.props.subscribers
      } else {
        for (var j = 0; j < this.props.subscribers.length; j++) {
          if (this.props.subscribers[j].locale === e.target.value) {
            filtered.push(this.props.subscribers[j])
          }
        }
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  render () {
    console.log('Subscriber Data', this.state.subscribersData)

    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <h3>Subscribers</h3>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  <Link to='/invitesubscribers' className='btn btn-primary btn-sm'
                    style={{float: 'right'}}>Invite Subscribers</Link>

                  { this.props.subscribers && this.props.subscribers.length > 0
                  ? <div className='table-responsive'>
                    <form>
                      <div className='form-row'>
                        <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                          <label> Search </label>
                          <input type='text' placeholder='Search Subscribers' className='form-control' onChange={this.searchSubscriber} />
                        </div>
                        <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                          <label> Gender </label>
                          <select className='input-sm' value={this.state.filterByGender} onChange={this.handleFilterByGender} >
                            <option value='' disabled>Filter by Gender...</option>
                            <option value='male'>male</option>
                            <option value='female'>female</option>
                            <option value='other'>other</option>
                            <option value=''>all</option>
                          </select>
                        </div>
                        <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                          <label> Locale </label>
                          <select className='input-sm' value={this.state.filterByLocale} onChange={this.handleFilterByLocale} >
                            <option value='' disabled>Filter by Locale...</option>
                            {
                              this.props.locales.map((locale, i) => (
                                <option value={locale}>{locale}</option>
                              ))
                            }
                            <option value=''>all</option>
                          </select>
                        </div>
                      </div>
                    </form>
                    {
                      this.state.subscribersData && this.state.subscribersData.length > 0
                      ? <div>
                        <table className='table table-striped'>
                          <thead>
                            <tr>
                              <th>Profile Picture</th>
                              <th>Name</th>
                              <th>Page</th>
                              <th>Locale</th>
                              <th>Gender</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              this.state.subscribersData.map((subscriber, i) => (
                                <tr>
                                  <td>
                                    <img alt='pic'
                                      src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                      className='img-circle' width='60' height='60'
                                    />
                                  </td>
                                  <td>{subscriber.firstName} {subscriber.lastName}</td>
                                  <td>{subscriber.pageId.pageName}</td>
                                  <td>{subscriber.locale}</td>
                                  <td>{subscriber.gender}</td>
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

            </main>

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
    locales: (state.subscribersInfo.locales)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadSubscribersList: loadSubscribersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Subscriber)
