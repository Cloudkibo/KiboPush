/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'
import { loadUsersList } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
    console.log(users)
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
    this.setState({usersData: data})
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
  render () {
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
                  { this.state.subscribersData && this.state.subscribersData.length > 0
                  ? <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Users</th>
                          <th>Number of Pages</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {
                        this.state.usersData.map((user, i) => (
                          <tr>
                            <td>{user.name}</td>
                            <td>{user.numberOfPages}</td>
                            <td><Link to='/seemore' className='pull-right'>
                              <button className='btn btn-primary btn-sm'>See more</button></Link>
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
                      pageCount={Math.ceil(this.state.totalLength / 4)}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
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
    users: (state.UsersInfo.users)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadUsersList: loadUsersList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OperationalDashboard)
