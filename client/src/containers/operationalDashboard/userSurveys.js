import React from 'react'
import ReactPaginate from 'react-paginate'

class SurveysInfo extends React.Component {

  render () {
      return (
        <div className = 'row'>
          <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                <h4>Surveys</h4><br />
                  <div className='table-responsive'>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Descripton</th>
                          <th>Created at</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
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
    );
  }
}

export default SurveysInfo
