/* eslint-disable no-useless-constructor */
import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
class CustomerLists extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      customerLists: [{'_id': '1', name: 'List 1'},
                      {'_id': '2', name: 'List 2'},
                      {'_id': '3', name: 'List 3'}]
    }
    props.loadMyPagesList()
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
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding Customer Lists? <a href='#' target='_blank'>Click Here </a>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div className='m-portlet m-portlet-mobile '>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Customer Lists
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                          <span>
                            <i className='la la-plus' />
                            <span>
                              Add List
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        { this.state.customerLists && this.state.customerLists.length > 0
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
                                    <span style={{width: '150px'}}>List Name</span>
                                  </th>
                                  <th data-field='options'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '170px'}} />
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                                {
                                  this.state.customerLists.map((list, i) => (
                                    <tr data-row={i}
                                      className='m-datatable__row m-datatable__row--even'
                                      style={{height: '55px'}} key={i}>
                                      <td data-field='title'
                                        className='m-datatable__cell'>
                                        <span style={{width: '150px'}}>{list.name}</span>
                                      </td>
                                      <td data-field='seemore'
                                        className='m-datatable__cell'>
                                        <span className='pull-right'
                                          style={{width: '170px'}}>
                                          <button className='btn btn-primary btn-sm'
                                            style={{float: 'left', margin: 2}}
                                            onClick={() => this.showDialogEdit(list)}>
                                            Edit
                                          </button>
                                          <button className='btn btn-primary btn-sm'
                                            style={{float: 'left', margin: 2}}
                                            onClick={() => this.showDialogDelete(list._id)}>
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
    pages: (state.pagesInfo.pages)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadMyPagesList: loadMyPagesList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CustomerLists)
