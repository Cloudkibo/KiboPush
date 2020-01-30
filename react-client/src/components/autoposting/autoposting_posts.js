/* eslint-disable no-undef */
/**
 * Created by imran on 24/06/2019.
 */

import React from 'react'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import PropTypes from 'prop-types'

class AutopostingPosts extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className='row'>
        <div className='col-xl-12'>
          <div className='m-portlet'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Facebook Posts
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <div className='tab-content'>
                { this.props.posts && this.props.posts.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='page'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Page Name</span>
                          </th>
                          <th data-field='datetime'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Posted At</span>
                          </th>
                          <th data-field='sent'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Likes</span>
                          </th>
                          <th data-field='clicked'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Comments</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                          this.props.posts.map((post, i) => (
                            <tr data-row={i}
                              className='m-datatable__row m-datatable__row--even'
                              style={{height: '55px'}} key={i}>
                              <td data-field='page' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{post.pageId.pageName}</span></td>
                              <td data-field='datetime' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{handleDate(post.datetime)}</span></td>
                              <td data-field='sent' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{post.likes}</span></td>
                              <td data-field='clicked' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{post.comments}</span></td>
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
                        pageCount={Math.ceil(this.props.totalLength / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={this.props.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                        forcePage={this.props.pageNumber} />
                    </div>
                  </div>
                  : <span>
                    <p> No data to display </p>
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

AutopostingPosts.propTypes = {
  'posts': PropTypes.array.isRequired,
  'totalLength': PropTypes.number.isRequired,
  'handlePageClick': PropTypes.func.isRequired,
  'pageNumber': PropTypes.number.isRequired
}

export default AutopostingPosts
