/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
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
      totalLength: 0,
      pageNumber: 0
    }
    props.loadAutopostingMessages(props.location.state.id, {first_page: 'first', last_id: 'none', number_of_records: 10})
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

    document.title = `${title} | Autoposting Messages`
  }

  displayData (n, messages) {
    let offset = n * 10
    let data = []
    let limit
    let index = 0
    if ((offset + 10) > messages.length) {
      limit = messages.length
    } else {
      limit = offset + 10
    }
    for (var i = offset; i < limit; i++) {
      data[index] = messages[i]
      index++
    }
    this.setState({messagesData: data})
  }

  handlePageClick (data) {
    if (data.selected === 0) {
      this.props.loadAutopostingMessages(this.props.location.state.id, {first_page: 'first', last_id: 'none', number_of_records: 10})
    } else if (this.state.pageNumber < data.selected) {
      this.props.loadAutopostingMessages(this.props.location.state.id,
        {
          first_page: 'next',
          current_page: this.state.pageNumber,
          requested_page: data.selected,
          last_id: this.props.autoposting_messages.length > 0 ? this.props.autoposting_messages[this.props.autoposting_messages.length - 1]._id : 'none',
          number_of_records: 10
        }
      )
    } else {
      this.props.loadAutopostingMessages(this.props.location.state.id,
        {
          first_page: 'previous',
          current_page: this.state.pageNumber,
          requested_page: data.selected,
          last_id: this.props.autoposting_messages.length > 0 ? this.props.autoposting_messages[0]._id : 'none',
          number_of_records: 10
        }
      )
    }
    this.setState({pageNumber: data.selected})
    this.displayData(data.selected, this.props.autoposting_messages)
  }

  componentWillReceiveProps (nextProps) {
    console.log('in componentWillReceiveProps', nextProps)
    if (nextProps.autoposting_messages) {
      this.displayData(0, nextProps.autoposting_messages)
      this.setState({ totalLength: nextProps.count })
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
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
              Need help in understanding this page? Here is the <a href='https://kibopush.com/autoposting/' target='_blank'>documentation</a>.
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
                              <th data-field='page'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px'}}>Page Name</span>
                              </th>
                              <th data-field='datetime'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px'}}>Sent At</span>
                              </th>
                              <th data-field='sent'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px'}}>Sent</span>
                              </th>
                              <th data-field='seen'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px'}}>Seen</span>
                              </th>
                              <th data-field='clicked'
                                className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                                <span style={{width: '100px'}}>clicked</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className='m-datatable__body'>
                            {
                              this.state.messagesData.map((message, i) => (
                                <tr data-row={i}
                                  className='m-datatable__row m-datatable__row--even'
                                  style={{height: '55px'}} key={i}>
                                  <td data-field='page' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{message.pageId.pageName}</span></td>
                                  <td data-field='datetime' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{handleDate(message.datetime)}</span></td>
                                  <td data-field='sent' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{message.sent}</span></td>
                                  <td data-field='seen' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{message.seen}</span></td>
                                  <td data-field='clicked' className='m-datatable__cell--center m-datatable__cell'><span style={{width: '100px'}}>{message.clicked}</span></td>
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
                            onPageChange={this.handlePageClick}
                            containerClassName={'pagination'}
                            subContainerClassName={'pages pagination'}
                            activeClassName={'active'}
                            forcePage={this.state.pageNumber} />
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
    )
  }
}

function mapStateToProps (state) {
  return {
    autoposting_messages: (state.autopostingInfo.autoposting_messages),
    count: (state.autopostingInfo.count)

  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadAutopostingMessages: loadAutopostingMessages
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AutopostingMessages)
