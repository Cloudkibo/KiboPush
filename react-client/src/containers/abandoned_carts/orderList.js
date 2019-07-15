/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { getAbandonedCarts, updateStoreStatus, sendAbandonedCartNow } from '../../redux/actions/abandonedCarts.actions'
import Analytics from './analytics'
import { Link } from 'react-router'
import { handleDate } from '../../utility/utils'

class AbandonedList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.props.getAbandonedCarts()
    this.state = {
      showDropDown: false
    }
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
    this.onClickSendNow = this.onClickSendNow.bind(this)
  }

  handlePageClick () {
    console.log('Need to handle the page click logic here')
  }

  componentWillReceiveProps (nextprops) {
    console.log('nextprops', nextprops.abandonedList)
  }

  handleStatusChange () {
    // I am putting 0 because dayem said only one store will be existing for right now
    this.setState({isActive: !this.state.isActive})
    let shopId = this.state.store._id
    let statusValue = this.state.isActive
    this.props.updateStoreStatus({shopId: shopId, isActive: !statusValue}, this.msg)
  }

  onClickSendNow (id) {
    this.props.sendAbandonedCartNow({id: id}, this.msg)
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='row'>
        <div className='col-xl-12'>
          <div className='m-portlet'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Orders
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              {this.props.orderList && this.props.orderList.length > 0
              ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflow: 'inherit' }}>
                  <thead className='m-datatable__head'>
                    <tr className='m-datatable__row'
                      style={{ height: '53px' }}>
                      <th data-field='date'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '125px'}}>Created At</span>
                      </th>
                      <th data-field='price'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '125px'}}>Total Price</span>
                      </th>
                      <th data-field='status'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{ width: '125px' }}>Status</span>
                      </th>
                      <th data-field='actions'
                        className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                        <span style={{width: '250px'}}>Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                    {this.props.orderList.map((item) => {
                      return <tr className='m-datatable__row m-datatable__row--even' key={item._id}
                        style={{height: '55px'}}>
                        <td data-field='date' className='m-datatable__cell'><span style={{width: '125px'}}>{handleDate(item.created_at)}</span></td>
                        <td data-field='price' className='m-datatable__cell'><span style={{width: '125px'}}>{item.totalPrice}</span></td>
                        <td data-field='status' className='m-datatable__cell'><span style={{width: '125px'}}>{item.status}</span></td>
                        <td data-field='status' className='m-datatable__cell'><span style={{width: '250px'}}>
                          {
                            <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={() => { this.viewMore(item._id) }}>
                              <span>
                                View More
                              </span>
                            </button>
                          }
                        </span></td>
                      </tr>
                    })
                  }
                  </tbody>
                </table>
                <div className='pagination'>
                  <ReactPaginate previousLabel={'previous'}
                    nextLabel={'next'}
                    breakLabel={<a>...</a>}
                    breakClassName={'break-me'}
                    pageCount={Math.ceil((this.props.abandonedList) ? this.props.abandonedList.length / 10 : 1)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'} />
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
    )
  }
}

function mapStateToProps (state) {
  console.log('state', state)
  return {
    abandonedList: (state.abandonedInfo.abandonedList),
    orderList: (state.abandonedInfo.orderList),
    store: (state.abandonedInfo.storeList)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      getAbandonedCarts: getAbandonedCarts,
      updateStoreStatus: updateStoreStatus,
      sendAbandonedCartNow: sendAbandonedCartNow
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AbandonedList)
