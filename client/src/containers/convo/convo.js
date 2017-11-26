/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  addBroadcast,
  clearAlertMessage,
  loadBroadcastsList,
  sendbroadcast
} from '../../redux/actions/broadcast.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'

class Convo extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      alertMessage: '',
      type: '',
      broadcastsData: [],
      totalLength: 0,
      filterValue: ''
    }
    props.loadBroadcastsList()
    this.sendBroadcast = this.sendBroadcast.bind(this)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchBroadcast = this.searchBroadcast.bind(this)
    this.onFilter = this.onFilter.bind(this)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    document.body.appendChild(addScript)
    document.title = 'KiboPush | Broadcast'
    var datatable = $('#m_datatable').mDatatable({
      pagingType: 'full_numbers',
      paging: true
    })
  }

  displayData (n, broadcasts) {
    console.log(broadcasts)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > broadcasts.length) {
      limit = broadcasts.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = broadcasts[i]
      index++
    }
    this.setState({broadcastsData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.broadcasts)
  }

  gotoEdit (broadcast) {
    this.props.history.push({
      pathname: `/editbroadcast`,
      state: broadcast._id
    })
  }

  sendBroadcast (broadcast) {
    if (this.props.subscribers.length === 0) {
      this.setState({
        alertMessage: 'You dont have any Subscribers',
        type: 'danger'
      })
    } else {
      this.props.sendbroadcast(broadcast)
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.broadcasts) {
      console.log('Broadcasts Updated', nextProps.broadcasts)
      this.displayData(0, nextProps.broadcasts)
      this.setState({ totalLength: nextProps.broadcasts.length })
    }
    this.sendBroadcast = this.sendBroadcast.bind(this)
    if (nextProps.successMessage) {
      this.setState({
        alertMessage: nextProps.successMessage,
        type: 'success'
      })
    } else if (nextProps.errorMessage) {
      this.setState({
        alertMessage: nextProps.errorMessage,
        type: 'danger'
      })
    } else {
      this.setState({
        alertMessage: '',
        type: ''
      })
    }
  }
  searchBroadcast (event) {
    var filtered = []
    if (event.target.value !== '') {
      for (let i = 0; i < this.props.broadcasts.length; i++) {
        if (this.props.broadcasts[i].title && this.props.broadcasts[i].title.toLowerCase().includes(event.target.value.toLowerCase())) {
          filtered.push(this.props.broadcasts[i])
        }
      }
    } else {
      filtered = this.props.broadcasts
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilter (e) {
    console.log(e.target.value)
    this.setState({filterValue: e.target.value})
    var filtered = []
    if (e.target.value !== '') {
      for (let i = 0; i < this.props.broadcasts.length; i++) {
        if (e.target.value === 'miscellaneous') {
          if (this.props.broadcasts[i].payload.length > 1) {
            filtered.push(this.props.broadcasts[i])
          }
        } else {
          if (this.props.broadcasts[i].payload.length === 1 && this.props.broadcasts[i].payload[0].componentType === e.target.value) {
            filtered.push(this.props.broadcasts[i])
          }
        }
      }
    } else {
      filtered = this.props.broadcasts
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  render () {
    console.log('Broadcasts', this.state.broadcastsData)
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
                  <h3 className='m-subheader__title'>Manage Broadcasts</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              {
                this.props.subscribers &&
                this.props.subscribers.length === 0 &&
                <div style={{padding: '10px'}}>
                  <center>
                    <Alert type='info' headline='0 Subscribers'>
                      Your connected pages have zero subscribers. Unless you
                      do not have any subscriber, you will not be able to
                      broadcast message, polls and surveys.
                      To invite subscribers click <Link
                        to='/invitesubscribers'
                        style={{color: 'blue', cursor: 'pointer'}}> here </Link>.
                    </Alert>
                  </center>
                </div>
              }
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding broadcasts? <a href='http://kibopush.com/broadcast/' target='_blank'>Click Here </a>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='m-portlet'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Broadcasts
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        {
                          this.props.subscribers && this.props.subscribers.length === 0
                            ? <Link to='/createconvo'>
                              <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' disabled>
                                <span>
                                  <i className='la la-plus' />
                                  <span>
                                    Create New Broadcast
                                  </span>
                                </span>
                              </button>
                            </Link>
                            : <Link to='createconvo'>
                              <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                                <span>
                                  <i className='la la-plus' />
                                  <span>
                                    Create Broadcast
                                  </span>
                                </span>
                              </button>
                            </Link>
                        }
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <form>
                        <div className='form-row'>
                          <div style={{display: 'inline-block'}} className='form-group col-md-8'>
                            <input type='text' placeholder='Search broadcasts by title' className='form-control' onChange={this.searchBroadcast} />
                          </div>
                          <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                            <select className='custom-select' style={{width: '100%'}} value={this.state.filterValue} onChange={this.onFilter} >
                              <option value='' disabled>Filter by type...</option>
                              <option value='text'>text</option>
                              <option value='image'>image</option>
                              <option value='card'>card</option>
                              <option value='gallery'>gallery</option>
                              <option value='audio'>audio</option>
                              <option value='video'>video</option>
                              <option value='file'>file</option>
                              <option value='miscellaneous'>miscellaneous</option>
                              <option value=''>all</option>
                            </select>
                          </div>
                        </div>
                      </form>
                      <div>
                        <table id='m_datatable'>
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Type</th>
                              <th>Created At</th>
                              <th>Sent</th>
                              <th>Seen</th>
                            </tr>
                          </thead>
                          { this.state.broadcastsData && this.state.broadcastsData.length > 0
                          ? <tbody>
                            this.state.broadcastsData.map((broadcast, i) => (
                            <tr>
                              <td>{broadcast.title}</td>
                              <td>{(broadcast.payload.length > 1) ? 'Miscellaneous' : (broadcast.payload[0]) ? broadcast.payload[0].componentType : ''}</td>
                              <td>{handleDate(broadcast.datetime)}</td>
                              <td>{broadcast.sent}</td>
                              <td>{broadcast.seen}</td>
                            </tr>
                            ))
                          </tbody>
                          : <p>No data found</p>
                          }
                        </table>
                        { this.state.broadcastsData && this.state.broadcastsData.length > 0
                        ? <div className='pagination'>
                          <ReactPaginate previousLabel={<i className='fa fa-angle-left' />}
                            nextLabel={<i className='fa fa-angle-right' />}
                            breakLabel={<a>...</a>}
                            breakClassName={'break-me'}
                            pageCount={Math.ceil(this.state.totalLength / 5)}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination pagination-lg'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'} />
                        </div>
                        : <br />
                        }
                      </div>
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
  console.log(state)
  return {
    broadcasts: (state.broadcastsInfo.broadcasts),
    successMessage: (state.broadcastsInfo.successMessage),
    errorMessage: (state.broadcastsInfo.errorMessage),
    subscribers: (state.subscribersInfo.subscribers)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList: loadBroadcastsList,
    addBroadcast: addBroadcast,
    sendbroadcast: sendbroadcast,
    clearAlertMessage: clearAlertMessage,
    loadSubscribersList: loadSubscribersList
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Convo)
