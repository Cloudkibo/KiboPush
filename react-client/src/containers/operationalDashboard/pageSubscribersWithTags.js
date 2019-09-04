/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadSubscribersWithTags } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class PageSubscribersWithTags extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pageSubscribersData: [],
      totalLength: 0,
      pageNumber: 0
    }
    props.loadSubscribersWithTags(this.props.location.state.pageId)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    console.log('this.props in pageSubscribersWithTags', this.props)
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  componentDidMount () {
    this.scrollToTop()

    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Page Subscribers Tags`
    //this.displayData(0, this.props.pageSubscribers)
  }

  displayData (n, pageSubscribers) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > pageSubscribers.length) {
      limit = pageSubscribers.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageSubscribers[i]
      index++
    }
    this.setState({pageSubscribersData: data})
  }

  handlePageClick (data) {
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.pageSubscribers)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.pageSubscribers) {
      this.displayData(0, nextProps.pageSubscribers)
      this.setState({ totalLength: nextProps.pageSubscribers.length })
    }
  }

  render () {
    console.log('pageSubscribersWithTags state', this.state)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        {this.props.location.state.pageName} Subscribers
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div>
                  { this.state.pageSubscribersData && this.state.pageSubscribersData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>User Name</span>
                          </th>
                          <th data-field='assignedTags'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Assigned Tags</span>
                          </th>
                          <th data-field='unassignedTags'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Unassigned Tags</span>
                          </th>
                          <th data-field='status'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Status</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                        this.state.pageSubscribersData.map((pageSubscriber, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px', border: 'solid #F4F3FB'}} key={i}>
                            <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{pageSubscriber.subscriber.firstName + ' ' + pageSubscriber.subscriber.lastName}</span></td>
                            <td data-field='assignedTags' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{maxHeight: '150px', width: '150px', overflowY: 'scroll'}}> 
                                    {
                                        pageSubscriber.assignedTags.map(tag => {
                                            return (<span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'block', marginRight: '10px'}}>{tag.tag}</span>)
                                        })
                                    } 
                                </span>
                            </td>
                            <td data-field='unassignedTags' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{maxHeight: '150px', width: '150px', overflowY: 'scroll'}}> 
                                    {
                                        pageSubscriber.unassignedTags.map(tag => {
                                            return (<span className="m-badge m-badge--brand m-badge--wide" style={{marginBottom: '5px', display: 'block', marginRight: '10px'}}>{tag.tag}</span>)
                                        })
                                    } 
                                </span>
                            </td>
                            <td data-field='status' className='m-datatable__cell--center m-datatable__cell'>
                                <span style={{width: '100px'}}>
                                    {
                                        pageSubscriber.unassignedTags.length > 0 
                                        ? <span className="m-badge  m-badge--danger m-badge--wide" style={{marginBottom: '5px', display: 'block'}}>Incorrect</span>
                                        : <span className="m-badge  m-badge--success m-badge--wide" style={{marginBottom: '5px', display: 'block'}}>Correct</span>
                                    }
                                </span>
                            </td>
                          </tr>
                        ))
                      }
                      </tbody>
                    </table>
                    <div className='pagination'>
                      <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLength / 10)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        forcePage={this.state.pageNumber}
                        onPageChange={this.handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'} />
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
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  //console.log(state.backdoorInfo.subscribersWithTags)
  return {
    pageSubscribers: (state.backdoorInfo.subscribersWithTags)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadSubscribersWithTags
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageSubscribersWithTags)
