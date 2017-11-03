import React from 'react'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { savePageInformation } from '../../redux/actions/backdoor.actions'

class PagesInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor page info')
    this.onPageClick = this.onPageClick.bind(this)
  }
  onPageClick (e, page) {
    console.log('Page Click', page)
    this.props.savePageInformation(page)
  }
  render () {
    return (
      <div className='row'>
        <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='ui-block'>
            <div className='birthday-item inline-items badges'>
              <h4>Pages</h4><br />
              { this.props.pagesData && this.props.pagesData.length > 0
              ? <div className='table-responsive'>
                <div>
                  <label> Search </label>
                  <input type='text' placeholder='Search Pages' className='form-control' onChange={(event) => { this.props.search(event, 'pages') }} />
                </div>
                {
                  this.props.pages && this.props.length > 0
                 ? <div>
                   <table className='table table-striped'>
                     <thead>
                       <tr>
                         <th>Pages</th>
                         <th>Number of Likes</th>
                         <th>Number of Subscribers</th>
                         <th>Connected</th>
                         <th />
                       </tr>
                     </thead>
                     <tbody>
                       {
                       this.props.pages.map((page, i) => (
                         <tr>
                           <td>{page.pageName}</td>
                           <td>{page.likes}</td>
                           <td>{page.subscribers}</td>
                           <td>{page.connected ? 'true' : 'false'}</td>
                           <td>
                             <Link onClick={(e) => { let pageSelected = page; this.onPageClick(e, pageSelected) }} to={'/pageSubscribers'} className='btn btn-primary btn-sm'>
                               See Subscribers
                             </Link>
                           </td>
                         </tr>
                       ))
                      }
                     </tbody>
                   </table>
                   <ReactPaginate previousLabel={'previous'}
                     nextLabel={'next'}
                     breakLabel={<a>...</a>}
                     breakClassName={'break-me'}
                     pageCount={Math.ceil(this.props.length / 4)}
                     marginPagesDisplayed={1}
                     pageRangeDisplayed={3}
                     onPageChange={(data) => { data.name = 'pages'; this.props.handleClickEvent(data) }}
                     containerClassName={'pagination'}
                     subContainerClassName={'pages pagination'}
                     activeClassName={'active'} />
                 </div>
                : <p> No search results found. </p>
              }
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

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    savePageInformation: savePageInformation
  }, dispatch)
}
export default connect(null, mapDispatchToProps)(PagesInfo)
