import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'
class UserDetails extends React.Component {
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
                  <h3>Anisha Chhatwani</h3><br />
                  <h4>Pages</h4>
                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Pages</th>
                          <th>Number of Followers</th>
                          <th>Number of Subscribers</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>CloudKibo</td>
                          <td>5</td>
                          <td>10</td>
                          <td><Link to='/'>See Subscribers</Link></td>
                        </tr>
                        <tr>
                          <td>FCS</td>
                          <td>5</td>
                          <td>10</td>
                          <td><Link to='/'>See Subscribers</Link></td>
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
                    <h4>Broadcasts</h4>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Broadcasts</th>
                          <th>Type</th>
                          <th>Number of Messages Read</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Hello There</td>
                          <td>Type</td>
                          <td>10</td>
                        </tr>
                        <tr>
                          <td>Hey</td>
                          <td>5</td>
                          <td>10</td>
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

export default UserDetails
