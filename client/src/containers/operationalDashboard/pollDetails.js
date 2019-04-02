/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadPollDetails } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'

class ViewPollDetail extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      totalResponses: 0,
      totalSent: 0,
      subscribersData: [],
      subscribersDataAll: [],
      totalLengthSubscriber: 0,
      searchValue: '',
      filteredData: ''
    }
    this.displayData = this.displayData.bind(this)
    this.backToUserDetails = this.backToUserDetails.bind(this)
    this.searchSubscriber = this.searchSubscriber.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  componentDidMount () {
    if (this.props.location.state) {
      this.props.loadPollDetails(this.props.location.state._id)
      // this.displayData(0, this.props.location.state.data.subscriber)
      // this.setState({ totalLengthSubscriber: this.props.location.state.data.subscriber.length })
    } else {
      this.props.loadPollDetails(this.props.currentPoll._id)
    }

    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Poll Details`
  }
  searchSubscriber (event) {
    this.setState({searchValue: event.target.value})
    var filtered = []
    var data = this.props.location.state.data.subscriber
    if (this.state.filteredData !== '') {
      data = this.state.filteredData
    }
    for (let i = 0; i < data.length; i++) {
      var fullName = data[i].firstName + ' ' + data[i].lastName
      if (data[i].firstName.toLowerCase().includes((event.target.value).toLowerCase()) || data[i].lastName.toLowerCase().includes((event.target.value).toLowerCase()) || fullName.toLowerCase().includes((event.target.value).toLowerCase())) {
        filtered.push(data[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLengthSubscriber: filtered.length })
  }

  displayData (n, subscribers) {
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > subscribers.length) {
      limit = subscribers.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = subscribers[i]
      index++
    }
    this.setState({subscribersData: data, subscribersDataAll: subscribers})
  }
  handlePageClick (data) {
    this.displayData(data.selected, this.state.subscribersDataAll)
  }
  componentWillReceiveProps (nextProps) {
    if (nextProps.pollDetails) {
      let pollResponses = nextProps.pollDetails.pollResponses
      let pollPages = nextProps.pollDetails.pollpages
      if (pollPages) {
        this.setState({ totalSent: pollPages.length })
      }
      if (pollResponses) {
        this.setState({ totalResponses: pollResponses.length })
        var counts = []
        var value = []
        var colors = ['#38a9ff', '#ff5e3a', '#ffdc1b']
        var index = 0
        pollResponses.map((poll) => {
          if (value.length < 1) {
            counts[index] = 1
            value[index] = poll.response
          } else {
            let valueFound = false
            for (let i = 0; i < value.length; i++) {
              if (value[i] === poll.response) {
                counts[i] = counts[i] + 1
                valueFound = true
              }
            }
            if (!valueFound) {
              index = index + 1
              counts[index] = 1
              value[index] = poll.response
            }
          }
        })
        this.drawPieChart(colors, counts, value)
      }
    }
  }
  drawPieChart (colors, counts, value) {
    var radarChart = document.getElementById('radar-chart')
    if (radarChart !== null) {
      // eslint-disable-next-line camelcase
      var ctx_rc = radarChart.getContext('2d')

      // eslint-disable-next-line camelcase
      var data_rc = {
        datasets: [
          {
            data: counts,
            backgroundColor: colors
          }],
        labels: value
      }
      // eslint-disable-next-line no-unused-vars,no-undef
      var radarChartEl = new Chart(ctx_rc, {
        type: 'pie',
        data: data_rc
      })
    }
  }
  backToUserDetails () {
    if (this.props.location.state) {
      this.props.history.push({
        pathname: `/operationalDashboard`
      })
    } else {
      const user = this.props.currentUser
      this.props.history.push({
        pathname: `/userDetails`,
        state: user
      })
    }
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            {this.props.pollDetails &&
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12' style={{marginTop: '20px'}}>
                      <div className='m-section'>
                        <h3 className='m-section__heading' style={{marginTop: '15px'}}>
                        Q. {this.props.pollDetails.poll.statement}
                        </h3>
                        <div className='m-section__content'>
                          <div data-code-preview='true' data-code-html='true' data-code-js='false'>
                            <div className='m-demo__preview'>
                              <div className='m-list-timeline' style={{marginTop: '10px', marginLeft: '30px'}}>
                                <div className='m-list-timeline__items'>
                                  <div className='m-list-timeline__item'>
                                    <span className='m-list-timeline__badge m-list-timeline__badge--success' />
                                    <span className='m-list-timeline__text'>
                                      {this.props.pollDetails.poll.options[0]}
                                    </span>
                                  </div>
                                  <div className='m-list-timeline__item'>
                                    <span className='m-list-timeline__badge m-list-timeline__badge--danger' />
                                    <span className='m-list-timeline__text'>
                                      {this.props.pollDetails.poll.options[1]}
                                    </span>
                                  </div>
                                  <div className='m-list-timeline__item'>
                                    <span className='m-list-timeline__badge m-list-timeline__badge--warning' />
                                    <span className='m-list-timeline__text'>
                                      {this.props.pollDetails.poll.options[2]}
                                    </span>
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
                <div className='m-portlet__body' style={{'display': 'flex'}}>
                  <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12' style={{'textAlign': 'center', 'fontSize': 'x-large'}}>
                    <div className='m-widget26'>
                      <div className='m-widget26__number'>
                        {this.state.totalSent}
                        <h5>
                          Polls Sent So Far
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12' style={{'textAlign': 'center'}}>
                    <div className='m-widget26'>
                      <div className='m-widget26__number'>
                        { this.props.pollDetails.pollResponses
                        ? <div className='count-stat'>{this.state.totalResponses}
                        </div>
                        : <div className='count-stat'>{this.state.totalResponses}
                        </div>
                        }
                        <h5>
                          Polls Respones
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          </div>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet' style={{height: '100%'}}>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Poll Response Chart
                        </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='ui-block-content'>
                    <div style={{'width': '600px', 'height': '400px', 'margin': '0 auto'
                    }}>
                      <canvas id='radar-chart' width={250} height={170} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          { /* this.props.location.state && this.props.location.state.data.subscriber.length > 0 &&
          <div className='row'>

            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Subscribers
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row align-items-center'>
                    <div className='col-xl-12'>
                      <div className='form-group m-form__group row align-items-center'>
                        <div className='col-md-12'>
                          <div className='m-input-icon m-input-icon--left'>
                            <input type='text' style={{width: '33%'}} className='form-control m-input m-input--solid' value={this.state.searchValue} placeholder='Search...' id='generalSearch' onChange={this.searchSubscriber} />
                            <span className='m-input-icon__icon m-input-icon__icon--left'>
                              <span><i className='la la-search' /></span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {this.state.subscribersData && this.state.subscribersData.length > 0
                    ? <div className='m_datatable m-datatable m-datatable--default m-datatable--loaded' id='ajax_data' style={{width: '-webkit-fill-available'}}>
                      <table className='m-datatable__table'
                        id='m-datatable--27866229129' style={{
                          display: 'block',
                          height: 'auto',
                          overflowX: 'auto'
                        }}>
                        <thead className='m-datatable__head'>
                          <tr className='m-datatable__row'
                            style={{height: '53px'}}>
                            <th data-field='Profile Picture'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Profile Picture</span>
                            </th>
                            <th data-field='Name'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Name</span>
                            </th>
                            <th data-field='Page'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Page</span>
                            </th>
                            <th data-field='seen'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Seen</span>
                            </th>
                            <th data-field='responded'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Responded</span>
                            </th>
                            <th data-field='Locale'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Locale</span>
                            </th>
                            <th data-field='Gender'
                              className='m-datatable__cell--center m-datatable__cell m-datatable__cell--sort'>
                              <span style={{width: '100px', overflow: 'inherit'}}>Gender</span>
                            </th>
                          </tr>
                        </thead>

                        <tbody className='m-datatable__body' style={{textAlign: 'center'}}>
                          {
                        this.state.subscribersData.map((subscriber, i) => (
                          <tr data-row={i}
                            className='m-datatable__row m-datatable__row--even'
                            style={{height: '55px'}} key={i}>
                            <td data-field='Profile Picture'
                              className='m-datatable__cell'>
                              <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                <img alt='pic'
                                  src={(subscriber.profilePic) ? subscriber.profilePic : ''}
                                  className='m--img-rounded m--marginless m--img-centered' width='60' height='60'
                              />
                              </span>
                            </td>

                            <td data-field='Name'
                              className='m-datatable__cell'>
                              <span
                                style={{width: '100px', overflow: 'inherit'}}>{subscriber.firstName} {subscriber.lastName}</span>
                            </td>

                            <td data-field='Page'
                              className='m-datatable__cell'>
                              <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                {subscriber.page}
                              </span>
                            </td>
                            <td data-field='seen'
                              className='m-datatable__cell'>
                              {subscriber.seen === true
                              ? <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                true
                              </span>
                              : <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                false
                              </span>
                            }
                            </td>
                            <td data-field='responded'
                              className='m-datatable__cell'>
                              {subscriber.responded === true
                              ? <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                true
                              </span>
                              : <span
                                style={{width: '100px', overflow: 'inherit'}}>
                                false
                              </span>
                            }
                            </td>
                            <td data-field='Locale' className='m-datatable__cell'><span style={{width: '100px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.locale}</span></td>
                            <td data-field='Gender' className='m-datatable__cell'><span style={{width: '100px', color: 'white'}} className='m-badge m-badge--brand'>{subscriber.gender}</span></td>
                          </tr>
                        ))
                      }
                        </tbody>
                      </table>
                      <ReactPaginate previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={<a>...</a>}
                        breakClassName={'break-me'}
                        pageCount={Math.ceil(this.state.totalLengthSubscriber / 4)}
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
                </div>
              </div>
            </div>
          </div>
          */ }
          <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
            <button className='btn btn-primary' onClick={() => this.backToUserDetails()} style={{ float: 'right', margin: '20px' }}>Back
            </button>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    currentPoll: (state.backdoorInfo.currentPoll),
    currentUser: (state.backdoorInfo.currentUser),
    pollDetails: (state.backdoorInfo.pollDetails)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ loadPollDetails: loadPollDetails },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewPollDetail)
