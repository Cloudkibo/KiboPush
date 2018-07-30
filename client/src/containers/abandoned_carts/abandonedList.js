/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { getAbandonedCarts } from '../../redux/actions/abandonedCarts.actions'

class AbandonedList extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.props.getAbandonedCarts()
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleStatusChange = this.handleStatusChange.bind(this)
  }

  handlePageClick () {
    console.log('Need to handle the page click logic here')
  }

  handleStatusChange (shopId, statusValue) {
    // TODO
    // It will receive the shopID which it will send to API endpoint to update the value
    this.setState({isActive: statusValue})
    console.log('set the status: ' + statusValue)
    this.props.updateCartStatus({shopId: shopId, isActive: statusValue}, this.msg)
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Abandoned Carts</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding abandoned carts? Here is the <a href='http://kibopush.com/bots/' target='_blank'>documentation</a>.
                Or check out this <a>video tutorial</a>
            </div>
          </div>

          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Abandoned Carts
                        </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{ display: 'block', height: 'auto', overflow: 'inherit' }}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{ height: '53px' }}>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '125px' }}>Subscriber Name</span>
                          </th>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '125px'}}>Created At</span>
                          </th>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '125px'}}>Scheduled At</span>
                          </th>
                          <th data-field='value'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '125px' }}>Cart Value</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{ width: '125px' }}>Status</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                        {
                        (this.props.abandonedList) && this.props.abandonedList.map((item) => {
                          return <tr className='m-datatable__row m-datatable__row--even' key={item._id}
                            style={{height: '55px'}}>
                            <td data-field='name' className='m-datatable__cell'><span style={{width: '125px'}}>Dayem Siddiqui</span></td>
                            <td data-field='page' className='m-datatable__cell'><span style={{width: '125px'}}>{new Date(item.created_at).toString()}</span></td>
                            <td data-field='page' className='m-datatable__cell'><span style={{width: '125px'}}>{new Date(item.scheduled_at).toString()}</span></td>
                            <td data-field='value' className='m-datatable__cell'><span style={{width: '125px'}}>{item.totalPrice}</span></td>
                            <td data-field='status' className='m-datatable__cell'><span style={{width: '125px'}}>{item.status}</span></td>
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
  console.log('state', state)
  return {
    abandonedList: (state.abandonedInfo.abandonedList)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      getAbandonedCarts: getAbandonedCarts
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AbandonedList)
