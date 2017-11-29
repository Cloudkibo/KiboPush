/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { loadPollDetails } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'

class ViewPollDetail extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      totalResponses: 0,
      totalSent: 0
    }
    console.log('Poll Detail', props.currentPoll)
    props.loadPollDetails(props.currentPoll._id)
    this.backToUserDetails = this.backToUserDetails.bind(this)
  }

  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/Chart.min.js')
    document.body.appendChild(addScript)
  }

  componentWillReceiveProps (nextProps) {
    console.log('Poll Details Receive Props', nextProps.pollDetails)
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
    const user = this.props.currentUser
    console.log('back to user details', user, this.props)
    this.props.history.push({
      pathname: `/userDetails`,
      state: user
    })
  }

  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='m-portlet'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title col-xl-12 col-lg-12 col-md-12 col-xs-12 col-sm-12' style={{marginTop: '20px'}}>
                          <div className='m-section'>
                            <h3 className='m-section__heading' style={{marginTop: '15px'}}>
                            Q. {this.props.currentPoll.statement}
                            </h3>
                            <div className='m-section__content'>
                              <div data-code-preview='true' data-code-html='true' data-code-js='false'>
                                <div className='m-demo__preview'>
                                  <div className='m-list-timeline' style={{marginTop: '10px', marginLeft: '30px'}}>
                                    <div className='m-list-timeline__items'>
                                      <div className='m-list-timeline__item'>
                                        <span className='m-list-timeline__badge m-list-timeline__badge--success' />
                                        <span className='m-list-timeline__text'>
                                          {this.props.currentPoll.options[0]}
                                        </span>
                                      </div>
                                      <div className='m-list-timeline__item'>
                                        <span className='m-list-timeline__badge m-list-timeline__badge--danger' />
                                        <span className='m-list-timeline__text'>
                                          {this.props.currentPoll.options[1]}
                                        </span>
                                      </div>
                                      <div className='m-list-timeline__item'>
                                        <span className='m-list-timeline__badge m-list-timeline__badge--warning' />
                                        <span className='m-list-timeline__text'>
                                          {this.props.currentPoll.options[2]}
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
                            { this.props.responses
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
                    <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                      <button className='btn btn-primary' onClick={() => this.backToUserDetails()} style={{ float: 'right', margin: '20px' }}>Back
                      </button>
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
    currentPoll: (state.getCurrentPoll.currentPoll),
    currentUser: (state.getCurrentUser.currentUser),
    pollDetails: (state.PollDetailsInfo.pollDetails)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ loadPollDetails: loadPollDetails },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewPollDetail)
