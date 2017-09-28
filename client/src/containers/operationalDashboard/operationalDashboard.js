/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
//  import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'
import { loadUsersList } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { handleDate } from '../../utility/utils'

class OperationalDashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadUsersList()
    this.state = {
      usersData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchUser = this.searchUser.bind(this)
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
  displayData (n, users) {
    console.log('one', users)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > users.length) {
      limit = users.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = users[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({usersData: users})
    console.log('in displayData', this.state.usersData)
  }
  handlePageClick (data) {
    this.displayData(data.selected, this.props.users)
  }
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.users) {
      console.log('Users Updated', nextProps.users)
      this.displayData(0, nextProps.users)
      this.setState({ totalLength: nextProps.users.length })
    }
  }
  goToBroadcasts (user) {
    console.log(this.props);
    this.props.history.push({
      pathname: `/userDetails`,
      state: user
    })
    console.log('State', this.state)
    console.log('goToBroadcasts', user._id, user.name)
    // browserHistory.push(`/viewsurveydetail/${survey._id}`)
  }
  searchUser (event) {
    var filtered = []
    for (let i = 0; i < this.props.users.length; i++) {
      if (this.props.users[i].name.toLowerCase().includes(event.target.value)) {
        filtered.push(this.props.users[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }
  render () {
    const user = {_id : "59c057fdec330620b880160c", name : 'sania siddiqui'};
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
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  { this.state.usersData && this.state.usersData.length > 0
                  ? <div className='table-responsive'>
                    <div>
                      <label> Search </label>
                      <input type='text' placeholder='Search Users' className='form-control' onChange={this.searchUser} />
                    </div>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Profile Pic</th>
                          <th>Users</th>
                          <th>Email</th>
                          <th>Gender</th>
                          <th>Created At</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {
                        this.state.usersData.map((user, i) => (
                          <tr>
                            <td><img alt='pic'
                              src={(user.profilePic) ? user.profilePic : ''}
                              className='img-circle' width='60' height='60' /></td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.gender}</td>
                            <td>{handleDate(user.createdAt)}</td>
                            <td>
                              <button className='btn btn-primary btn-sm'
                                style={{float: 'left', margin: 2}} onClick={() => this.goToBroadcasts(user)}>See more
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                      </tbody>
                    </table>
                    <ReactPaginate previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a href=''>...</a>}
                      breakClassName={'break-me'}
                      pageCount={Math.ceil(this.state.totalLength / 5)}
                      marginPagesDisplayed={2}
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
  console.log('in mapStateToProps', state)
  if (state.UsersInfo) {
    users: state.UsersInfo.users
  } else {
    users: []
  }
  return users
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadUsersList: loadUsersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OperationalDashboard)
