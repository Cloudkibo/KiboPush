/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'

import { connect } from 'react-redux'
import {
  addPoll,
  getpollresults,
  loadPollsList
} from '../../redux/actions/poll.actions'
import { bindActionCreators } from 'redux'

class PollResult extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      totalResponses: 0
    }
    console.log('this.props.location.state', this.props.location.state._id)
    this.props.getpollresults(this.props.location.state._id)
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

  componentWillReceiveProps (nextprops) {
    console.log('in componentWillReceiveProps', nextprops.responses)
    if (nextprops.responses) {
      console.log('after if', nextprops.responses)
      if (nextprops.responses.length > 0) {
        let totalResponses = 0
        for (let i = 0; i < nextprops.responses.length; i++) {
          totalResponses += nextprops.responses[i].count
        }
        this.setState({totalResponses: totalResponses})
      }
      var radarChart = document.getElementById('radar-chart')
      var counts = []
      var vals = []
      var colors = ['#38a9ff', '#ff5e3a', '#ffdc1b']
      var backcolors = []
      for (let j = 0; j < nextprops.responses.length; j++) {
        counts.push(nextprops.responses[j].count)
        backcolors.push(colors[j])
        vals.push(nextprops.responses[j].value)
      }
      if (radarChart !== null) {
        // eslint-disable-next-line camelcase
        var ctx_rc = radarChart.getContext('2d')

        // eslint-disable-next-line camelcase
        var data_rc = {
          datasets: [
            {
              data: counts,
              backgroundColor: backcolors
            }],
          labels: vals
        }
        // eslint-disable-next-line no-unused-vars,no-undef
        var radarChartEl = new Chart(ctx_rc, {
          type: 'pie',
          data: data_rc
        })
      }
    }
  }

  render () {
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
                  <h3 className='m-subheader__title'>Poll Report</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='m-portlet'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Title: {this.props.location.state.statement}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body' style={{'display': 'flex'}}>
                      <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12' style={{'textAlign': 'center', 'fontSize': 'x-large'}}>
                        <div className='m-widget26'>
                          <div className='m-widget26__number'>
                            {this.props.polls.length}
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
                      <Link
                        to='/poll'
                        style={{ float: 'right', margin: '20px' }}
                        className='btn btn-secondary'>
                        Back
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
  console.log('mapStateToProps pollresult', state)
  return {
    polls: (state.pollsInfo.polls),
    responses: (state.pollsInfo.responses)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPollsList: loadPollsList,
    addPoll: addPoll,
    getpollresults: getpollresults
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PollResult)
