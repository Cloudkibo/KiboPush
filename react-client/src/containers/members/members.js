/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  loadMembersList,
  deleteMember,
  updateMember
} from '../../redux/actions/members.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'

class Members extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadMembersList()
    this.state = {
      membersData: [],
      membersDataAll: [],
      totalLength: 0,
      filterByName: '',
      filterByEmail: '',
      isShowingModalDelete: false,
      deleteid: '',
      openVideo: false
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoMembers.click()
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.members) {
      console.log('members', nextProps.members)
      this.displayData(0, nextProps.members)
      this.setState({totalLength: nextProps.members.length})
    }
  }
  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }
  displayData (n, members) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    let membersData = members.filter(m => !!m.userId)
    if ((offset + 10) > membersData.length) {
      limit = membersData.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = membersData[i]
      index++
    }
    this.setState({membersData: data, membersDataAll: membersData})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.membersDataAll)
  }

  componentDidMount () {
    // require('https://cdn.cloudkibo.com/public/js/jquery-3.2.0.min.js')
    // require('https://cdn.cloudkibo.com/public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Members`
    this.scrollToTop()
    // this.initializeConditionSelect(this.state.conditionSelect.options)
    // this.initializeActiveSelect(this.state.activeSelect.options)
  }

  removeMember (member) {
    this.props.deleteMember({
      userId: member.userId._id,
      companyId: member.companyId,
      domain_email: member.domain_email
    }, this.msg)
  }

  updateRole (member, role) {
    this.props.updateMember({
      userId: member.userId._id,
      companyId: member.companyId,
      domain_email: member.domain_email,
      role
    })
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <a href='#/' style={{ display: 'none' }} ref='videoMember' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoMember">videoMember</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoMember" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Dashboard Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" 
                  aria-label="Close"
                  onClick={() => {
                    this.setState({
                      openVideo: false
                    })}}>
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                {this.state.openVideo && <YouTube
                  videoId='o0RZ_XlUqgo'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 0
                    }
                  }}
                />
                }
                </div>
              </div>
            </div>
          </div>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Members</h3>
            </div>
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Delete Member
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Are you sure you want to delete this member?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.removeMember(this.state.deleteid)
                  this.closeDialogDelete()
                }} data-dismiss='modal'>Delete
              </button>
                </div>
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
              Need help in understanding members? Here is the <a href='https://kibopush.com/invite-members/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
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
                <Link to={{pathname: '/newInvitation', state: { prevPath: this.props.location.pathname }}}>
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
                                    {/* {
                                      member.role !== 'buyer' && member.role === 'admin' && this.props.user.permissions.deleteAdminPermission &&
                                      <button className='btn btn-primary'
                                        style={{
                                          float: 'left',
                                          margin: 2
                                        }}
                                        onClick={() => this.showDialogDelete(member)}>Delete
                                      </button>
                                    }
                                    {
                                      member.role !== 'buyer' && member.role === 'agent' && this.props.user.permissions.deleteAgentPermission &&
                                      <button className='btn btn-primary'
                                        style={{
                                          float: 'left',
                                          margin: 2
                                        }}
                                        onClick={() => this.showDialogDelete(member)}>Delete
                                      </button>
                                    } */}
                                  </span>
                                </td>
                              </tr>
                            ))
                        }
                          </tbody>
                        </table>
                        <ReactPaginate previousLabel={'previous'}
                          nextLabel={'next'}
                          breakLabel={<a href='#/'>...</a>}
                          breakClassName={'break-me'}
                          pageCount={Math.ceil(
                                       this.state.totalLength / 10)}
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
    )
  }
}

function mapStateToProps (state) {
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
