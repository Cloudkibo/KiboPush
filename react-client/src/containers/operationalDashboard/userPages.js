import React from 'react'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { savePageInformation } from '../../redux/actions/backdoor.actions'

class PagesInfo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onPageClick = this.onPageClick.bind(this)
    this.debounce = this.debounce.bind(this)

  }
  onPageClick (e, page) {
    this.props.savePageInformation(page)
  }

  componentDidMount () {
    var typingTimer
    var doneTypingInterval = 300
    var self = this
    let myInput = document.getElementById('searchPages')
    myInput.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(self.debounce, doneTypingInterval)
    })
  }
  debounce () {
    var value = document.getElementById('searchPages').value
    this.props.search(value, 'pages')
  }
  render () {
    console.log('this.userPages', this.props.pages)
    return (
      <div className='row'>
        <div
          className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Pages
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='row align-items-center'>
                <div className='col-lg-12 col-md-12'>
                  <div className='m-input-icon m-input-icon--left'>
                  <input type='text' id='searchPages' name='searchPages' placeholder='Search Pages...' className='form-control m-input m-input--solid'  />                    <span className='m-input-icon__icon m-input-icon__icon--left'>
                      <span><i className='la la-search' /></span>
                    </span>
                  </div>
                  {
                    this.props.pages && this.props.pages.length > 0
                   ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                     <table className='m-datatable__table'
                       id='m-datatable--27866229129' style={{
                         display: 'block',
                         height: 'auto',
                         overflowX: 'auto'
                       }}>
                       <thead className='m-datatable__head'>
                         <tr className='m-datatable__row'
                           style={{height: '53px'}}>
                           <th data-field='pages'
                             className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                             <span style={{width: '150px'}}>Pages</span>
                           </th>
                           <th data-field='Approved'
                             className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                             <span style={{width: '150px'}}>Permission</span>
                           </th>
                           <th data-field='likes'
                             className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                             <span style={{width: '150px'}}>Likes</span>
                           </th>
                           <th data-field='subscribers'
                             className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                             <span style={{width: '150px'}}>Subscribers</span>
                           </th>
                           <th data-field='connected'
                             className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                             <span style={{width: '150px'}}>Connected</span>
                           </th>
                           <th data-field='more'
                             className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                             <span style={{width: '150px'}} /></th>
                         </tr>
                       </thead>
                       <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                         {
                         this.props.pages.map((page, i) => (
                           <tr data-row={i}
                             className='m-datatable__row m-datatable__row--even'
                             style={{height: '55px'}} key={i}>
                             <td data-field='pages'
                               className='m-datatable__cell'>
                               <a
                                 style={{width: '150px', display: 'block'}}
                                 href={'http://m.me/' + page.pageId}
                                 target='_blank'>{page.pageName}</a>
                             </td>
                             <td data-field='Approved'
                               className='m-datatable__cell'>
                               <span
                                 style={{width: '150px'}}>{page.isApproved ? 'true' : 'false'}</span>
                             </td>
                             <td data-field='likes'
                               className='m-datatable__cell'>
                               <span
                                 style={{width: '150px'}}>{page.likes}</span>
                             </td>
                             <td data-field='subscribers'
                               className='m-datatable__cell'>
                               <span
                                 style={{width: '150px'}}>{page.subscribers}</span>
                             </td>
                             <td data-field='connected'
                               className='m-datatable__cell'>
                               <span
                                 style={{width: '150px'}}>{page.connected ? 'true' : 'false'}</span>
                             </td>
                             <td data-field='more'
                               className='m-datatable__cell'>
                               <span
                                 style={{width: '150px'}}>
                                 <Link onClick={(e) => { let pageSelected = page; this.onPageClick(e, pageSelected) }} to={'/pageSubscribers'} className='btn btn-primary btn-sm'>
                                 See Subscribers
                               </Link>
                               </span>
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
                       pageCount={Math.ceil(this.props.length / 10)}
                       marginPagesDisplayed={1}
                       pageRangeDisplayed={3}
                       onPageChange={(data) => { data.name = 'pages'; this.props.handleClickEvent(data) }}
                       containerClassName={'pagination'}
                       subContainerClassName={'pages pagination'}
                       activeClassName={'active'}
                       forcePage={this.props.pageNumber} />
                   </div>
                  : <p> No data to display </p>
                }
                </div>
              </div>
            </div>
          </div>
        </div>
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
