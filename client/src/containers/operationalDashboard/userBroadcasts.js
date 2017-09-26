import React from 'react'
import ReactPaginate from 'react-paginate'

class BroadcastsInfo extends React.Component {
  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Broadcasts</h4><br />
              <div className='table-responsive'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Broadcasts</th>
                      <th>Type</th>
                      <th>Number of Messages Read</th>
                      <th />
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

export default BroadcastsInfo
