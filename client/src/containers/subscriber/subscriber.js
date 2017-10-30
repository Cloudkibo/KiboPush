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
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
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
    this.setState({subscribersData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.subscribers)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.subscribers) {
      console.log('Broadcasts Updated', nextProps.subscribers)
      this.displayData(0, nextProps.subscribers)
      this.setState({ totalLength: nextProps.subscribers.length })
    }
  }

  render () {

    console.log("Subscriber Data", this.state.subscribersData)

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


                  { this.state.subscribersData && this.state.subscribersData.length > 0
                  ? <div className='table-responsive'>
                    <div>
                      <label> Search </label>
                      <input type='text' placeholder='Search Subscribers' className='form-control' onChange={this.searchSubscriber} />
                    </div>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Profile Picture</th>
                          <th>Page Name</th>
                          <th>Firstname</th>
                          <th>Lastname</th>
                          <th>Locale</th>
                          <th>Gender</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                        this.state.subscribersData.map((subscriber, i) => (
                          <tr>
                            <td><img alt='pic'
                              src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                              className='img-circle' width='60' height='60' /></td>
                            <td>{subscriber.email}</td>
                            <td>{subscriber.firstName}</td>
                            <td>{subscriber.lastName}</td>
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
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadSubscribersList: loadSubscribersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Subscriber)
