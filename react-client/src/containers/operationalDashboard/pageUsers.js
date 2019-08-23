/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { loadPageUsers } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class PageUsers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pageUsersData: [],
      totalLength: 0,
      pageNumber: 0
    }
    props.loadPageUsers({last_id: 'none', number_of_records: 10, first_page: 'first', pageId: this.props.location.state.pageId})

    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
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

    document.title = `${title} | Page Users`
  }

  displayData (n, pageUsers) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > pageUsers.length) {
      limit = pageUsers.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pageUsers[i]
      index++
    }
    this.setState({pageUsersData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadPageUsers({
        last_id: 'none',
        number_of_records: 10,
        first_page: 'first',
        pageId: this.props.location.state.pageId })
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadPageUsers({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.pageUsers.length > 0 ? this.props.pageUsers[this.props.pageUsers.length - 1]._id : 'none',
        number_of_records: 10,
        first_page: 'next',
        pageId: this.props.location.state.pageId })
    } else {
      this.props.loadPageUsers({
        current_page: this.state.pageNumber,
        requested_page: data.selected,
        last_id: this.props.pageUsers.length > 0 ? this.props.pageUsers[0]._id : 'none',
        number_of_records: 10,
        first_page: 'previous',
        pageId: this.props.location.state.pageId })
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.pageUsers)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.pageUsers) {
      this.displayData(0, nextProps.pageUsers)
    }
    if (nextProps.pageUsersCount) {
      this.setState({ totalLength: nextProps.pageUsersCount })
    }
  }

  render () {
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
                        {this.props.location.state.pageName}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div>
                  { this.state.pageUsersData && this.state.pageUsersData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>User Name</span>
                          </th>
                          <th data-field='type'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Account Type</span>
                          </th>
                          <th data-field='connected'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Connected</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                        this.state.pageUsersData.map((pageUser, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{pageUser.user.name}</span></td>
                            <td data-field='type' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{(pageUser.plan.unique_ID === 'plan_A' || pageUser.plan.unique_ID === 'plan_B') ? 'Individual' : 'Team' }</span></td>
                            <td data-field='connected' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{pageUser.connected ? 'true' : 'false'}</span></td>
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
  return {
    pageUsers: (state.backdoorInfo.pageUsers),
    pageUsersCount: (state.backdoorInfo.pageUsersCount)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPageUsers
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PageUsers)
