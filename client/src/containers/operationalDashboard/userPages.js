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
              <div className='table-responsive'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Pages</th>
                      <th>Number of Followers</th>
                      <th>Number of Subscribers</th>
                      <th>
                        <Link to='/pageSubscribers' className='btn btn-sm'>
                          <button className='btn btn-primary'>See Subscribers </button>
                        </Link>
                      </th>
                    </tr>
                  </thead>
                  <tbody />
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
    )
  }
}

export default PagesInfo
