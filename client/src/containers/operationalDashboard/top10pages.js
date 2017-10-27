/* eslint-disable no-useless-constructor */
import React from 'react'
import ReactPaginate from 'react-paginate'
class top10pages extends React.Component {
  constructor (props, context) {
    super(props, context)
  }

  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              { this.props.pagesData !== null && this.props.length > 0
              ? <div className='table-responsive'>
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>Page Name</th>
                      <th>Number of Subscribers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                  this.props.pagesData.map((page, i) => (
                    <tr>
                      <td>{page.pageName}</td>
                      <td>{page.subscribers}</td>
                    </tr>
                  ))
                }
                  </tbody>
                </table>
                <ReactPaginate previousLabel={'previous'}
                  nextLabel={'next'}
                  breakLabel={<a>...</a>}
                  breakClassName={'break-me'}
                  pageCount={Math.ceil(this.props.length / 2)}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={(data) => {
                    data.name = 'pages'
                    this.props.handleClickEvent(data)
                  }}
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

export default top10pages
