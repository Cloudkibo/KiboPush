/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import {
  addInvitation,
  loadInvitationsList,
  cancelinvitation
} from '../../redux/actions/invitations.actions'
import { bindActionCreators } from 'redux'
import ReactPaginate from 'react-paginate'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'

class Invitations extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.loadInvitationsList()
    this.state = {
      invitationsData: [],
      invitationsDataAll: [],
      totalLength: 0,
      filterByName: '',
      filterByEmail: '',
      showVideo: false
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.invitations) {
      this.displayData(0, nextProps.invitations)
      this.setState({totalLength: nextProps.invitations.length})
    }
  }

  displayData (n, invitations) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > invitations.length) {
      limit = invitations.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = invitations[i]
      index++
    }
    this.setState({invitationsData: data, invitationsDataAll: invitations})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.state.invitationsDataAll)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Invitations`;
  }

  cancelInvitation (invitation) {
    this.props.cancelinvitation(invitation, this.msg)
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="video" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Dashboard Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <YouTube
                  videoId='o0RZ_XlUqgo'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                />               
                </div>
              </div>
            </div>
          </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Invitations</h3>
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
              Need help in understanding invitations? Here is the <a href='https://kibopush.com/invite-members/' target='_blank'>documentation</a>.
              Or check out this <a href='#' data-toggle="modal" data-target="#video">video tutorial</a>
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
              <div className='m-portlet__head-tools'>
                <Link to={{pathname: '/newInvitation', state: { prevPath: this.props.location.pathname }}}>
                  <button
                    className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                    <span>
                      <i className='la la-plus' />
                      <span>
                        Invite Someone
                      </span>
                    </span>
                  </button>
                </Link>
              </div>
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
                this.props.invitations && this.props.invitations.length > 0
                  ? <div>
                    {
                    this.state.invitationsData &&
                    this.state.invitationsData.length > 0
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
                              <th data-field='Action'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '150px'}}>Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'
                            style={{textAlign: 'center'}}>
                            {
                          this.state.invitationsData.map(
                            (invitation, i) => (
                              <tr data-row={i}
                                className='m-datatable__row m-datatable__row--even'
                                style={{height: '55px'}} key={i}>
                                <td data-field='Condition'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px'}}>{invitation.name}</span>
                                </td>
                                <td data-field='KeyWords'
                                  className='m-datatable__cell'>
                                  <span
                                    style={{width: '150px', overflow: 'visible'}}>{invitation.email}</span>
                                </td>
                                <td data-field='Action'
                                  className='m-datatable__cell'>
                                  <span style={{width: '150px'}}>
                                    <button className='btn btn-primary'
                                      style={{
                                        float: 'left',
                                        margin: 2
                                      }}
                                      onClick={() => this.cancelInvitation(
                                              invitation)}>Cancel Invitation
                                    </button>
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
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    invitations: (state.invitationsInfo.invitations)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {loadInvitationsList: loadInvitationsList, addInvitation: addInvitation, cancelinvitation},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Invitations)
