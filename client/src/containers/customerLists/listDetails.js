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

class ListDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      phoneList: [{'_id': '1', name: 'Sania Siddiqui', phone: '+923312443100'},
                      {'_id': '2', name: 'Sojharo', phone: '+923312443100'},
                      {'_id': '3', name: 'Anisha', phone: '+923312443100'}]
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
                            All Customers
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        { this.state.phoneList && this.state.phoneList.length > 0
                        ? <div className='col-lg-12 col-md-12 order-2 order-xl-1'>
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
                                  <th data-field='title'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px'}}>Name</span>
                                  </th>
                                  <th data-field='title'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px'}}>Number</span>
                                  </th>
                                  <th data-field='options'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '170px'}} />
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                                {
                                  this.props.listDetail.map((obj, i) => (
                                    <tr data-row={i}
                                      className='m-datatable__row m-datatable__row--even'
                                      style={{height: '55px'}} key={i}>
                                      <td data-field='title'
                                        className='m-datatable__cell'>
                                        <span style={{width: '150px'}}>{obj.name}</span>
                                      </td>
                                      <td data-field='title'
                                        className='m-datatable__cell'>
                                        <span style={{width: '150px'}}>{obj.phone}</span>
                                      </td>
                                      <td data-field='seemore'
                                        className='m-datatable__cell'>
                                        <span className='pull-right'
                                          style={{width: '170px'}}>
                                          <button className='btn btn-primary btn-sm'
                                            style={{float: 'left', margin: 2}}
                                            onClick={() => this.showDialogEdit(obj)}>
                                            Edit
                                          </button>
                                          <button className='btn btn-primary btn-sm'
                                            style={{float: 'left', margin: 2}}
                                            onClick={() => this.showDialogDelete(obj._id)}>
                                            Delete
                                          </button>
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        </div>
                      : <div className='table-responsive'>
                        <p> No data to display </p>
                      </div>
                      }
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
