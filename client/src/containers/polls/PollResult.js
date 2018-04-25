/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { Link } from 'react-router'
import fileDownload from 'js-file-download'
import { connect } from 'react-redux'
import {
  addPoll,
  getpollresults,
  loadPollsList
} from '../../redux/actions/poll.actions'
import json2csv from 'json2csv'
import { bindActionCreators } from 'redux'

class PollResult extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      totalSent: 0,
      totalResponses: 0,
      show: false
    }
    this.getFile = this.getFile.bind(this)
    this.props.getpollresults(this.props.location.state._id)
  }
  getFile () {
    let usersPayload = []
    for (let i = 0; i < this.props.responsesfull.length; i++) {
      var jsonStructure = {}
      for (let j = 0; j < this.props.pages.length; j++) {
        if (this.props.responsesfull[i].subscriberId.pageId === this.props.pages[j]._id) {
          jsonStructure.PageName = this.props.pages[j].pageName
        }
      }
      jsonStructure['Statement'] = this.props.responsesfull[i].pollId.statement
      jsonStructure['SubscriberName'] = this.props.responsesfull[i].subscriberId.firstName + ' ' + this.props.responsesfull[i].subscriberId.lastName
      jsonStructure['Response'] = this.props.responsesfull[i].response
      jsonStructure['DateTime'] = this.props.responsesfull[i].datetime
      jsonStructure['PollId'] = this.props.responsesfull[i].pollId._id
      jsonStructure['PageId'] = this.props.responsesfull[i].subscriberId.pageId
      jsonStructure['SubscriberId'] = this.props.responsesfull[i].subscriberId._id
      usersPayload.push(jsonStructure)
    }
    //  var keys = []
    // keys.push('Subscriber Name')
    // keys.push(this.props.responsesfull[0].pollId.statement)
    var info = usersPayload
    var keys = []
    var val = info[0]

    for (var j in val) {
      var subKey = j
      keys.push(subKey)
    }
    var data = json2csv({data: usersPayload, fields: keys})
    fileDownload(data, this.props.responsesfull[0].pollId.statement + '-report.csv')
  }

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/Chart.min.js')
    document.body.appendChild(addScript)
  }

  componentWillReceiveProps (nextprops) {
    this.setState({show: true})
    var poll = this.props.location.state
    this.setState({totalSent: poll.sent})
    if (nextprops.responses) {
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
    console.log('PollResult props', this.props)
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
                      <div className='m-portlet__head-tools'>
                        {this.state.show &&
                        <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.getFile}>
                          <span>
                            <i className='fa fa-download' />
                            <span>
                              Download File
                            </span>
                          </span>
                        </button>
                        }
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
  return {
    polls: (state.pollsInfo.polls),
    responses: (state.pollsInfo.responses),
    responsesfull: (state.pollsInfo.responsesfull),
    pages: (state.pagesInfo.pages)
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
