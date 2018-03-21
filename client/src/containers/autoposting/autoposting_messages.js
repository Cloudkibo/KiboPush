/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { loadAutopostingMessages } from '../../redux/actions/autoposting.actions'
import { bindActionCreators } from 'redux'
import { handleDate } from '../../utility/utils'
import ReactPaginate from 'react-paginate'
import { Link } from 'react-router'

class AutopostingMessages extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      messagesData: [],
      totalLength: 0
    }
    props.loadAutopostingMessages(props.location.state.id)
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  componentDidMount () {
    // require('../../../public/js/jquery-3.2.0.min.js')
    // require('../../../public/js/jquery.min.js')
    // var addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../js/theme-plugins.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/demo/default/base/scripts.bundle.js')
    // document.body.appendChild(addScript)
    // addScript = document.createElement('script')
    // addScript.setAttribute('src', '../../../assets/vendors/base/vendors.bundle.js')
    // document.body.appendChild(addScript)
    this.scrollToTop()

    document.title = 'KiboPush | Autoposting Messages'
  }

  displayData (n, messages) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > messages.length) {
      limit = messages.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = messages[i]
      index++
    }
    this.setState({messagesData: data})
  }

  handlePageClick (data) {
    this.displayData(data.selected, this.props.autoposting_messages)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.autoposting_messages) {
      this.displayData(0, nextProps.autoposting_messages)
      this.setState({ totalLength: nextProps.autoposting_messages.length })
    }
  }

  render () {
    return (
      <div>
        <Header />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Autoposting Messages</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-technology m--font-accent' />
                </div>
                <div className='m-alert__text'>
                  Need help in understanding this page? Click <a>here</a>.
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='m-portlet'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            History
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='tab-content'>
                        { this.state.messagesData && this.state.messagesData.length > 0
                          ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data'>
                            <table className='m-datatable__table' style={{display: 'block', height: 'auto', overflowX: 'auto'}}>
                              <thead className='m-datatable__head'>
                                <tr className='m-datatable__row'
                                  style={{height: '53px'}}>
                                  <th data-field='page' style={{width: 100}}
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span>Page Name</span>
                                  </th>
                                  <th data-field='datetime' style={{width: 100}}
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span>Sent At</span>
                                  </th>
                                  <th data-field='sent' style={{width: 100}}
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span>Sent</span>
                                  </th>
                                  <th data-field='seen' style={{width: 100}}
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span >Seen</span>
                                  </th>
                                  <th data-field='clicked' style={{width: 100}}
                                    className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                    <span>clicked</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='m-datatable__body'>
                                {
                                  this.state.messagesData.map((message, i) => (
                                    <tr data-row={i}
                                      className='m-datatable__row m-datatable__row--even'
                                      style={{height: '55px'}} key={i}>
                                      <td data-field='page' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{message.pageId.pageName}</span></td>
                                      <td data-field='datetime' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{handleDate(message.datetime)}</span></td>
                                      <td data-field='sent' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{message.sent}</span></td>
                                      <td data-field='seen' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{message.seen}</span></td>
                                      <td data-field='clicked' style={{width: 100, textAlign: 'center'}} className='m-datatable__cell'><span>{message.clicked}</span></td>
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
                                pageCount={Math.ceil(this.state.totalLength / 5)}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
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
                        <div className='add-options-message' style={{marginBottom: '35px'}}>
                          <Link to='/autoposting' className='btn btn-primary pull-right'>Back
                          </Link>
                        </div>
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
  return {
    autoposting_messages: (state.autopostingInfo.autoposting_messages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadAutopostingMessages: loadAutopostingMessages
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AutopostingMessages)
