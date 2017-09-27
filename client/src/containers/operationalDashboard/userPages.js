import React from 'react'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router'
class PagesInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.searchPage = this.searchPage.bind(this)
  }
  searchPage (event) {
    var filtered = []
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageName.toLowerCase().includes(event.target.value)) {
        filtered.push(this.props.pages[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }
  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Pages</h4><br />
              { this.props.pages != null && this.props.length > 0
              ? <div className='table-responsive'>
                <div>
                  <label> Search </label>
                  <input type='text' placeholder='Search Pages' className='form-control' onChange={this.searchPage} />
                </div>
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
                  this.props.pages.map((page, i) => (
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
                  pageCount={Math.ceil(this.props.length / 4)}
                  marginPagesDisplayed={1}
                  pageRangeDisplayed={3}
                  onPageChange={this.props.handlePageClick}
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
