import React from 'react'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router'

class PagesInfo extends React.Component {
  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Pages</h4><br />
              { this.pages != null && this.length > 0
              ? <div className='table-responsive'>
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
                    {
                  this.pages.map((page, i) => (
                    <tr>
                      <td>{page.pageName}</td>
                      <td>{page.likes}</td>
                      <td>{page.connected}</td>
                      <td>
                        <Link to='/pageSubscribers'><button className='btn btn-primary btn-sm'
                          style={{float: 'left', margin: 2}}>See Subscribers
                        </button>
                        </Link>
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
                  pageCount={Math.ceil(length / 4)}
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
    )
  }
}

export default PagesInfo
