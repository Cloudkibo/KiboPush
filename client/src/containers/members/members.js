/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {
  loadMembersList,
  deleteMember,
  updateMember
} from '../../redux/actions/members.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'

class Members extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMembersList()
    this.state = {
      membersData: [],
      membersDataAll: [],
      totalLength: 0,
      filterByName: '',
      filterByEmail: ''
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.members) {
      this.displayData(0, nextProps.members)
      this.setState({totalLength: nextProps.members.length})
    }
  }

  displayData (n, members) {
    console.log(members)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > members.length) {
      limit = members.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = members[i]
      index++
    }
    this.setState({membersData: data, membersDataAll: members})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.membersDataAll)
  }

  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    document.title = 'KiboPush | Members'

    // this.initializeConditionSelect(this.state.conditionSelect.options)
    // this.initializeActiveSelect(this.state.activeSelect.options)
  }

  removeMember (member) {
    this.props.deleteMember({
      userId: member.userId._id,
      companyId: member.companyId,
      domain_email: member.domain_email
    })
  }

  updateRole (member, role) {
    this.props.updateMember({
      userId: member.userId._id,
      companyId: member.companyId,
      domain_email: member.domain_email,
      role
    })
  }

  render () {
    console.log('Members', this.props.members)
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Members</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div
                className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
                role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-exclamation m--font-brand' />
                </div>
                <div className='m-alert__text'>
                  You can assign different roles to your members as well.
                </div>
              </div>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Entries
                      </h3>
                    </div>
                  </div>
                  {this.props.user.permissions.invitationsPermission &&
                  <div className='m-portlet__head-tools'>
                    <Link to='newInvitation'>
                      <button
                        className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                        <span>
                          <i className='la la-plus' />
                          <span>
                            Invite Someone as Member
                          </span>
                        </span>
                      </button>
                    </Link>
                  </div>
                  }
                </div>
                <div className='m-portlet__body'>
                  <div
                    className='m-form m-form--label-align-right m--margin-top-20 m--margin-bottom-30'>
                    <div className='row align-items-center'>
                      <div className='col-xl-12 order-2 order-xl-1'>
                        {/* { */}
                        {/* this.props.invitations && */}
                        {/* this.props.invitations.length > 0 && */}
                        {/* <div */}
                        {/* className='form-group m-form__group row align-items-center'> */}
                        {/* <div className='col-md-5'> */}
                        {/* <div */}
                        {/* className='m-form__group m-form__group--inline'> */}
                        {/* <div className='m-form__label'> */}
                        {/* <label> */}
                        {/* Condition: */}
                        {/* </label> */}
                        {/* </div> */}
                        {/* <div className='m-form__control'> */}
                        {/* <select className='custom-select' id='conditionSelect' value={this.state.filterByCondition} onChange={this.handleFilterByCondition} > */}
                        {/* <option value='' disabled>Filter by Condition...</option> */}
                        {/* <option value='message_is'>message_is</option> */}
                        {/* <option value='message_contains'>message_contains</option> */}
                        {/* <option value='message_begins'>message_begins</option> */}
                        {/* <option value=''>all</option> */}
                        {/* </select> */}
                        {/* </div> */}
                        {/* </div> */}
                        {/* <div */}
                        {/* className='d-md-none m--margin-bottom-10' /> */}
                        {/* </div> */}
                        {/* <div className='col-md-3'> */}
                        {/* <div */}
                        {/* className='m-form__group m-form__group--inline'> */}
                        {/* <div className='m-form__label'> */}
                        {/* <label> */}
                        {/* Active: */}
                        {/* </label> */}
                        {/* </div> */}
                        {/* <div className='m-form__control'> */}
                        {/* <select className='custom-select' id='isActiveSelect' value={this.state.filterByStatus} onChange={this.handleFilterByStatus}> */}
                        {/* <option value='' disabled>Filter by Status...</option> */}
                        {/* <option value='yes'>yes</option> */}
                        {/* <option value='no'>no</option> */}
                        {/* <option value=''>all</option> */}
                        {/* </select> */}
                        {/* </div> */}
                        {/* </div> */}
                        {/* <div */}
                        {/* className='d-md-none m--margin-bottom-10' /> */}
                        {/* </div> */}
                        {/* </div> */}
                        {/* } */}
                      </div>
                    </div>
                  </div>
                  {
                    this.props.members && this.props.members.length > 0
                      ? <div>
                        {
                        this.state.membersData &&
                        this.state.membersData.length > 0
                          ? <div
                            className='m_datatable m-datatable m-datatable--default m-datatable--loaded'
                            id='ajax_data'>
                            <table className='m-datatable__table'
                              id='m-datatable--27866229129' style={{
                                display: 'block',
                                height: 'auto',
                                overflowX: 'auto'
                              }}>
                              <thead className='m-datatable__head'>
                                <tr className='m-datatable__row'
                                  style={{height: '53px'}}>
                                  <th data-field='Condition'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px'}}>Name</span>
                                  </th>
                                  <th data-field='KeyWords'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span
                                      style={{width: '150px'}}>Email Address</span>
                                  </th>
                                  <th data-field='KeyWords'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span
                                      style={{width: '150px'}}>Role</span>
                                  </th>
                                  <th data-field='Action'
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span style={{width: '150px'}}>Actions</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='m-datatable__body'
                                style={{textAlign: 'center'}}>
                                {
                              this.state.membersData.map(
                                (member, i) => (
                                  <tr data-row={i}
                                    className='m-datatable__row m-datatable__row--even'
                                    style={{height: '55px'}} key={i}>
                                    <td data-field='Condition'
                                      className='m-datatable__cell'>
                                      <span
                                        style={{width: '150px'}}>{member.userId.name}</span>
                                    </td>
                                    <td data-field='KeyWords'
                                      className='m-datatable__cell'>
                                      <span
                                        style={{width: '150px', overflow: 'visible'}}>{member.userId.email}</span>
                                    </td>
                                    <td data-field='KeyWords'
                                      className='m-datatable__cell'>
                                      <span
                                        style={{width: '150px'}}>{member.userId.role}</span>
                                    </td>
                                    <td data-field='Action'
                                      className='m-datatable__cell'>
                                      <span style={{width: '150px'}}>
                                        {
                                          member.role !== 'buyer' && this.props.user.permissions.updateRolePermission &&
                                          <span>
                                            {
                                            member.role === 'admin'
                                            ? <button className='btn btn-primary'
                                              style={{
                                                float: 'left',
                                                margin: 2
                                              }}
                                              onClick={() => this.updateRole(
                                                        member, 'agent')}>Make Agent
                                            </button>
                                            : <button className='btn btn-primary'
                                              style={{
                                                float: 'left',
                                                margin: 2
                                              }}
                                              onClick={() => this.updateRole(
                                                        member, 'admin')}>Make Admin
                                            </button>
                                          }
                                          </span>
                                        }
                                        {
                                          member.role !== 'buyer' &&
                                          <button className='btn btn-primary'
                                            style={{
                                              float: 'left',
                                              margin: 2
                                            }}
                                            onClick={() => this.removeMember(
                                              member)}>Delete
                                          </button>
                                        }
                                      </span>
                                    </td>
                                  </tr>
                                ))
                            }
                              </tbody>
                            </table>
                            <ReactPaginate previousLabel={'previous'}
                              nextLabel={'next'}
                              breakLabel={<a>...</a>}
                              breakClassName={'break-me'}
                              pageCount={Math.ceil(
                                           this.state.totalLength / 4)}
                              marginPagesDisplayed={1}
                              pageRangeDisplayed={3}
                              onPageChange={this.handlePageClick}
                              containerClassName={'pagination'}
                              subContainerClassName={'pages pagination'}
                              activeClassName={'active'} />
                          </div>
                          : <p> No search results found. </p>
                      }
                      </div>
                      : <p> No data to display </p>
                  }
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
    user: (state.basicInfo.user),
    members: (state.membersInfo.members)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadMembersList: loadMembersList, deleteMember, updateMember},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Members)
