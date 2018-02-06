/* eslint-disable no-useless-constructor */
import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {
  loadListDetails
} from '../../redux/actions/customerLists.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'

class ListDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      subscribersData: [],
      listName: this.props.currentList ? this.props.currentList.listName : 'Subscribers'
    }
    if (this.props.currentList) {
      props.loadListDetails(this.props.currentList._id)
    }
  }
  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div className='m-portlet m-portlet-mobile '>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            {this.state.listName}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div>
                        <div className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                          <div className='row align-items-center'>
                            <div className='col-xl-12 order-2 order-xl-1'>
                              <div className='form-group m-form__group row align-items-center'>
                                <div className='col-md-4'>
                                  <div className='m-input-icon m-input-icon--left'>
                                    <input type='text' className='form-control m-input m-input--solid' placeholder='Search...' id='generalSearch' onChange={this.searchSubscriber} />
                                    <span className='m-input-icon__icon m-input-icon__icon--left'>
                                      <span><i className='la la-search' /></span>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                          <table className='m-datatable__table'
                            id='m-datatable--27866229129' style={{
                              display: 'block',
                              height: 'auto',
                              overflowX: 'auto'
                            }}>
                            <thead className='m-datatable__head'>
                              <tr className='m-datatable__row'
                                style={{height: '53px'}}>
                                <th data-field='Profile Picture'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Profile Picture</span>
                                </th>
                                <th data-field='Name'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Name</span>
                                </th>
                                <th data-field='Page'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Page</span>
                                </th>
                                <th data-field='Locale'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Locale</span>
                                </th>
                                <th data-field='Gender'
                                  className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                  <span style={{width: '150px'}}>Gender</span>
                                </th>
                              </tr>
                            </thead>

                            <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                              {
                            this.state.subscribersData.map((subscriber, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='Profile Picture'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>
                                    <img alt='pic'
                                      src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                      className='m--img-rounded m--marginless m--img-centered' width='60' height='60'
                                  />
                                  </span>
                                </td>

                                <td data-field='Name'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>{subscriber.firstName} {subscriber.lastName}</span>
                                </td>

                                <td data-field='Page'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>
                                    {subscriber.pageId.pageName}
                                  </span>
                                </td>
                                <td data-field='Locale' className='m-datatable__cell'><span style={{width: '150px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.locale}</span></td>
                                <td data-field='Gender' className='m-datatable__cell'><span style={{width: '150px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.gender}</span></td>
                              </tr>
                            ))
                          }
                            </tbody>
                          </table>
                          <ReactPaginate previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={<a>...</a>}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalLength / 4)}
                            marginPagesDisplayed={1}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'} />

                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__foot m-portlet__foot--fit'>
                      <div className='m-form__actions m-form__actions' style={{padding: '30px'}}>
                        <Link to='/customerLists' className='btn btn-primary'>
                          Back
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    listDetail: (state.listsInfo.listDetails),
    currentList: (state.listsInfo.currentList)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList,
    loadListDetails: loadListDetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ListDetails)
