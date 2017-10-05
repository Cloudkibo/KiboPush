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
          data: data_rc,
          options: {
            deferred: {           // enabled by default
              delay: 300        // delay of 500 ms after the canvas is considered inside the viewport
            },
            legend: {
              display: true
            },
            scale: {
              gridLines: {
                display: false
              },
              ticks: {
                beginAtZero: true
              },
              reverse: false
            },
            animation: {
              animateScale: true
            }
          }
        })
      }
    }
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br />
          <br />
          <br />
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h3 className='presentation-margin'>Poll Report</h3>
            <div className='container'>
              <br />
              <div className='row'>
                <div className='col-lg-12 col-sm-12 col-xs-12'>
                  <div className='ui-block responsive-flex'>
                    <h5 className='presentation-margin'>Title: {this.props.location.state.statement}</h5>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div className='ui-block'>
                    <div className='ui-block-content'>
                      <ul className='statistics-list-count'>
                        <li>
                          <div className='points'>
                            <span>
                          Polls Sent So Far
                        </span>
                          </div>
                          <div className='count-stat'>{this.props.polls.length}
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12'>
                  <div className='ui-block'>
                    <div className='ui-block-content'>
                      <ul className='statistics-list-count'>
                        <li>
                          <div className='points'>
                            <span>
                          Poll Responses
                        </span>
                          </div>
                          { this.props.responses
                          ? <div className='count-stat'>{this.state.totalResponses}
                          </div>
                          : <div className='count-stat'>{this.state.totalResponses}
                          </div>
                        }
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              <div className='row'>
                <div className='col-lg-12 col-sm-12 col-xs-12'>
                  <div className='ui-block responsive-flex'>
                    <div className='ui-block-title'>
                      <div className='h6 title'>Poll Response Chart</div>
                    </div>
                    <div className='ui-block-content'>
                      <div className='chart-js chart-js-one-bar' style={{
                        'width': '400px',
                        'height': '350px',
                        'margin': '0 auto'
                      }}>
                        <canvas id='radar-chart' width={250} height={170} />
                        <div className='add-options-message'>
                          <Link
                            to='/poll'
                            style={{float: 'right', margin: 2}}
                            className='pull-right btn btn-primary btn-sm'>
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
