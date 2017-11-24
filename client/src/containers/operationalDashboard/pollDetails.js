/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
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
        <HeaderResponsive />
        <Sidebar />
        <Responsive />

        <div className='container' style={{top: '100px'}}>
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h2 className='presentation-margin'>View Poll</h2>
            <div className='ui-block'>
              <div className='container'>
                <div className='row'>
                  <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12' style={{top: '10px'}}>
                    <label>Q. {this.props.currentPoll.statement}</label>
                    <ol className='table-bordered'>
                      <div className='container'>
                        <li>{this.props.currentPoll.options[0]}</li>
                        <li>{this.props.currentPoll.options[1]}</li>
                        <li>{this.props.currentPoll.options[2]}</li>
                      </div>
                    </ol>
                  </div>
                </div>
                <div className='row'>
                  <div className='response-count col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12' style={{top: '20px', display: 'flex', textAlign: 'center'}}>
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
                              <div className='count-stat'>{this.state.totalSent}
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
                              <div className='count-stat'>{this.state.totalResponses}
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                    <h4 style={{marginTop: '20px'}}>Poll Response Chart</h4>
                    <div className='chart-js chart-js-one-bar' style={{
                      'width': '400px',
                      'height': '350px',
                      'margin': '0 auto'
                    }} >
                      <canvas id='radar-chart' width={250} height={170} />
                    </div>
                  </div>
                </div>
                <div className='back-button col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12' style={{float: 'right', marginTop: '20px'}}>
                  <button className='pull-right btn btn-primary btn-sm' onClick={() => this.backToUserDetails()}>Back
                  </button>
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
