import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'
class SeeSubscribers extends React.Component {
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
                  <h4>CloudKibo</h4>
                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Subscribers</th>
                          <th>Gender</th>
                          <th>Locale</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>John</td>
                          <td>M</td>
                          <td>USA</td>
                        </tr>
                        <tr>
                          <td>Ali</td>
                          <td>M</td>
                          <td>Pakistan</td>
                        </tr>
                        <tr>
                          <td>Sania</td>
                          <td>F</td>
                          <td>Pakistan</td>
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
              <div className='add-options-message'>
                <Link
                  to='/seemore'
                  style={{float: 'right', margin: 2}}
                  className='btn btn-primary btn-sm'>
                  Back
                </Link>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }
}
export default SeeSubscribers
