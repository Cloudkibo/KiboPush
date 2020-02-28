/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router-dom'
import {getInsights} from '../../redux/actions/sponsoredMessaging.actions'


class AdInsights extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
  }
  this.props.getInsights(this.props.location.state.sponsoredMessage.adId)
}

componentDidMount () {
  console.log('state in insights', this.props.location.state.sponsoredMessage)
}

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Ad insights
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <Link to='/sponsoredMessaging' className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                          Back
                    </Link>
                  </div>
                </div>
                <div className='m-portlet__body'>


                <div className='form-row'>
                  {this.props.insights && this.props.insights.length > 0
                  ? <div className='col-md-12 m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='name'
                            className='m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Ad Name</span>
                          </th>
                          <th data-field='impression'
                            className='m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Impression</span>
                          </th>
                          <th data-field='reach'
                            className='m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Reach</span>
                          </th>
                          <th data-field='clicks'
                            className='m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Clicks</span>
                          </th>
                          <th data-field='amount_spent'
                            className='m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Amount Spent</span>
                          </th>
                          <th data-field='start_date'
                            className='m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Start date</span>
                          </th>
                          <th data-field='end_date'
                            className='m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>End date</span>
                          </th>

                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                          {this.props.insights.map((insight, i) => (
                            <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '64px'}}
                            >
                              <td data-field='name' className='m-datatable__cell'>
                                <span style={{width: '150px'}}>{insight.ad_name}</span></td>
                              <td data-field='impression' className='m-datatable__cell'>
                              <span style={{width: '100px'}}>{insight.impressions}</span></td>
                              <td data-field='reach' className='m-datatable__cell'>
                              <span style={{width: '100px'}}>{insight.reach}</span></td>
                              <td data-field='clicks' className='m-datatable__cell'>
                              <span style={{width: '100px'}}>{insight.clicks}</span></td>
                              <td data-field='amount_spent' className='m-datatable__cell'>
                              <span style={{width: '150px'}}>{insight.spend}</span></td>
                              <td data-field='start_date' className='m-datatable__cell'>
                              <span style={{width: '150px'}}>{insight.date_start}</span></td>
                              <td data-field='end_date' className='m-datatable__cell'>
                              <span style={{width: '150px'}}>{insight.date_stop}</span></td>
                            </tr>
                          ))
                          }
                      </tbody>
                    </table>
                    <div className='pagination'>
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a href='#/'>...</a>}
                        breakClassName={'break-me'}
                        // pageCount={Math.ceil(this.state.totalLength / 10)}
                        pageCount = {1}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'} />
                    </div>
                  </div>
                  : <div>No data to display</div>
                }
                  {/* <div className='col-12'>
                    <p> No data to display </p>
                  </div> */}
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
    insights: (state.sponsoredMessagingInfo.insights),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getInsights,
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AdInsights)
