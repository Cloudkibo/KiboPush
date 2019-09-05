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
      pageNumber: 0,
      searchValue: '',
      connectedFilter: '',
      typeFilter: '',
      adminFilter: ''
    }
    props.loadPageUsers({
      pageId: this.props.location.state.pageId,
      search_value: '',
      connected_filter: '',
      type_filter: '',
      admin_filter: ''
    })

    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleFilterByType = this.handleFilterByType.bind(this)
    this.handleFilterByConnected = this.handleFilterByConnected.bind(this)
    this.handleFilterByAdmin = this.handleFilterByAdmin.bind(this)
    this.searchUser = this.searchUser.bind(this)
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
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.pageUsers)
  }

  handleFilterByConnected (e) {
    if (e.target.value === 'true') {
      this.setState({connectedFilter: true, pageNumber: 0})
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: this.state.searchValue,
        connected_filter: true,
        type_filter: this.state.typeFilter,
        admin_filter: this.state.adminFilter })
    } else if (e.target.value === 'false') {
      this.setState({connectedFilter: false, pageNumber: 0})
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: this.state.searchValue,
        connected_filter: false,
        type_filter: this.state.typeFilter,
        admin_filter: this.state.adminFilter })
    } else {
      this.setState({connectedFilter: '', pageNumber: 0})
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: this.state.searchValue,
        connected_filter: '',
        type_filter: this.state.typeFilter,
        admin_filter: this.state.adminFilter })
    }
  }

  handleFilterByType (e) {
    if (e.target.value !== '') {
      this.setState({typeFilter: e.target.value, pageNumber: 0})
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: this.state.searchValue,
        connected_filter: this.state.connectedFilter,
        type_filter: e.target.value,
        admin_filter: this.state.adminFilter })
    } else {
      this.setState({typeFilter: '', pageNumber: 0})
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: this.state.searchValue,
        connected_filter: this.state.connectedFilter,
        type_filter: '',
        admin_filter: this.state.adminFilter })
    }
  }

  handleFilterByAdmin (e) {
    if (e.target.value === 'true') {
      this.setState({adminFilter: true, pageNumber: 0})
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: this.state.searchValue,
        connected_filter: this.state.connectedFilter,
        type_filter: this.state.typeFilter,
        admin_filter: true })
    } else if (e.target.value === 'false') {
      this.setState({adminFilter: false, pageNumber: 0})
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: this.state.searchValue,
        connected_filter: this.state.connectedFilter,
        type_filter: this.state.typeFilter,
        admin_filter: false })
    } else {
      this.setState({adminFilter: '', pageNumber: 0})
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: this.state.searchValue,
        connected_filter: this.state.connectedFilter,
        type_filter: this.state.typeFilter,
        admin_filter: '' })
    }
  }

  searchUser (e) {
    this.setState({searchValue: e.target.value, pageNumber: 0})
    if (e.target.value !== '') {
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: e.target.value,
        connected_filter: this.state.connectedFilter,
        type_filter: this.state.typeFilter,
        admin_filter: this.state.adminFilter })
    } else {
      this.props.loadPageUsers({
        pageId: this.props.location.state.pageId,
        search_value: '',
        connected_filter: this.state.connectedFilter,
        type_filter: this.state.typeFilter,
        admin_filter: this.state.adminFilter })
    }
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
                        {this.props.location.state.pageName}&nbsp;&nbsp;&nbsp;
                        <span className='m-badge m-badge--wide m-badge--primary'>{this.props.pageUsersCount} Users</span>
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-xl-12 order-2 order-xl-1'>
                      <div className='row filters'>
                        <div className='col-md-4'>
                          <div className='m-form__group m-form__group--inline'>
                            <div className=''>
                              <label style={{ width: '60px' }}>Account:</label>
                            </div>
                            <div className='m-form__control'>
                              <select className='custom-select' id='m_form_status' style={{ width: '250px' }} tabIndex='-98' value={this.state.typeFilter} onChange={this.handleFilterByType}>
                                <option key='' value='' disabled>Filter by Account...</option>
                                <option key='individual' value='individual'>Individual</option>
                                <option key='team' value='team'>Team</option>
                                <option key='all' value=''>All</option>
                              </select>
                            </div>
                          </div>
                          <div className='d-md-none m--margin-bottom-10' />
                        </div>
                        <div className='col-md-4'>
                          <div className='m-form__group m-form__group--inline'>
                            <div className=''>
                              <label style={{ width: '60px' }}>Connected:</label>
                            </div>
                            <div className='m-form__control'>
                              <select className='custom-select' id='m_form_type' style={{ width: '250px' }} tabIndex='-98' value={this.state.connectedFilter} onChange={this.handleFilterByConnected}>
                                <option key='' value='' disabled>Filter by Connected...</option>
                                <option key='true' value='true'>True</option>
                                <option key='false' value='false'>False</option>
                                <option key='all' value=''>All</option>
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-4'>
                          <div className='m-form__group m-form__group--inline'>
                            <div className=''>
                              <label style={{ width: '60px' }}>Admin:</label>
                            </div>
                            <div className='m-form__control'>
                              <select className='custom-select' style={{ width: '250px' }} id='m_form_type' tabIndex='-98' value={this.state.adminFilter} onChange={this.handleFilterByAdmin}>
                                <option key='' value='' disabled>Filter by Admin...</option>
                                <option key='true' value='true'>True</option>
                                <option key='false' value='false'>False</option>
                                <option key='all' value=''>All</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ marginTop: '15px' }} className='form-group m-form__group row align-items-center'>
                        <div className='col-md-12'>
                          <div className='m-input-icon m-input-icon--left'>
                            <input type='text' className='form-control m-input m-input--solid' value={this.state.searchValue} placeholder='Search User by Name...' id='generalSearch' onChange={this.searchUser} />
                            <span className='m-input-icon__icon m-input-icon__icon--left'>
                              <span><i className='la la-search' /></span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                  { this.state.pageUsersData && this.state.pageUsersData.length > 0
                  ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                    <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                      <thead className='m-datatable__head'>
                        <tr className='m-datatable__row'
                          style={{height: '53px'}}>
                          <th data-field='name'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '120px'}}>User Name</span>
                          </th>
                          <th data-field='type'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Account Type</span>
                          </th>
                          <th data-field='connected'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '100px'}}>Connected</span>
                          </th>
                          <th data-field='facebook'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '150px'}}>Facebook Name</span>
                          </th>
                          <th data-field='admin'
                            className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                            <span style={{width: '50px'}}>Admin</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className='m-datatable__body'>
                        {
                        this.state.pageUsersData.map((pageUser, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='name' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '120px'}}>{pageUser.user.name}</span></td>
                            <td data-field='type' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{(pageUser.plan.unique_ID === 'plan_A' || pageUser.plan.unique_ID === 'plan_B') ? 'Individual' : 'Team' }</span></td>
                            <td data-field='connected' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{pageUser.connected ? 'true' : 'false'}</span></td>
                            <td data-field='facebook' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '150px'}}>{pageUser.user.facebookInfo ? pageUser.user.facebookInfo.name : '-'}</span></td>
                            <td data-field='admin' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '50px'}}>{pageUser.admin ? 'true' : 'false'}</span></td>
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
