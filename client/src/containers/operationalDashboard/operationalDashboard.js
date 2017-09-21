/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
//  import { connect } from 'react-redux'
import { Link } from 'react-router'
//  import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
//  import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class OperationalDashboard extends React.Component {
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
                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Users</th>
                          <th>Number of Pages</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Anisha</td>
                          <td>Static Data</td>
                          <td><Link to='/viewUserDetails'>See more</Link></td>
                        </tr>
                      </tbody>
                    </table>
                    <ReactPaginate previousLabel={'previous'}
                      nextLabel={'next'}
                      breakLabel={<a href=''>...</a>}
                      breakClassName={'break-me'}
                      pageCount={5}
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      containerClassName={'pagination'}
                      subContainerClassName={'pages pagination'}
                      activeClassName={'active'} />
                  </div>
                </div>
              </div>

            </main>

          </div>
        </div>
      </div>

    )
  }
}

export default OperationalDashboard
