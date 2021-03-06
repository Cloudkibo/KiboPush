/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import fileDownload from 'js-file-download'
import { connect } from 'react-redux'
import {
  addPoll,
  getpollresults,
  loadPollsList
} from '../../redux/actions/poll.actions'
import json2csv from 'json2csv'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'

class PollResult extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      totalSent: 0,
      totalResponses: 0,
      show: false,
    }
    this.getFile = this.getFile.bind(this)
    this.props.getpollresults(this.props.location.state._id)
    this.goToSettings = this.goToSettings.bind(this)
  }

  goToSettings () {
    this.props.history.push({
      pathname: `/settings`,
      state: {module: 'pro'}
    })
  }
  getFile () {
    if (!this.props.superUser) {
      let usersPayload = []
      for (let i = 0; i < this.props.responsesfull.length; i++) {
        var jsonStructure = {}
        for (let j = 0; j < this.props.pages.length; j++) {
          if (this.props.responsesfull[i].subscriberId.pageId === this.props.pages[j]._id) {
            jsonStructure.PageName = this.props.pages[j].pageName
          }
        }
        jsonStructure['Statement'] = this.props.location.state.statement
        jsonStructure['SubscriberName'] = this.props.responsesfull[i].subscriberId.firstName + ' ' + this.props.responsesfull[i].subscriberId.lastName
        jsonStructure['Response'] = this.props.responsesfull[i].response
        jsonStructure['DateTime'] = this.props.responsesfull[i].datetime
        jsonStructure['PollId'] = this.props.responsesfull[i].pollId
        jsonStructure['PageId'] = this.props.responsesfull[i].subscriberId.pageId._id
        jsonStructure['PageName'] = this.props.responsesfull[i].subscriberId.pageId.pageName
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
      fileDownload(data, this.props.location.state.statement + '-report.csv')
    } else {
      this.msg.error('You are not allowed to perform this action')
    }
  }

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/js/Chart.min.js')
    document.body.appendChild(addScript)

    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Poll Results`;
  }

  UNSAFE_componentWillReceiveProps (nextprops) {
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
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="upgrade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Upgrade to Pro
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>This feature is not available in free account. Kindly updrade your account to use this feature.</p>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' onClick={() => this.goToSettings()}>
                      Upgrade to Pro
                  </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
                          Poll Responses
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
                    {this.state.show && (this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C')
                    ? <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.getFile}>
                      <span>
                        <i className='fa fa-download' />
                        <span>
                          Download File
                        </span>
                      </span>
                    </button>
                    : this.state.show &&
                    <button className='btn btn-success m-btn m-btn--icon pull-right' data-toggle="modal" data-target="#upgrade">
                      <span>
                        <i className='fa fa-download' />
                        <span>
                          Download File
                        </span>&nbsp;&nbsp;
                        <span style={{border: '1px solid #f4516c', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                          <span style={{color: '#f4516c'}}>PRO</span>
                        </span>
                      </span>
                    </button>
                    }
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='ui-block-content'>
                  {this.state.totalResponses ?
                    <div style={{'width': '600px', 'height': '400px', 'margin': '0 auto'
                    }}>
                      <canvas id='radar-chart' width={250} height={170} />
                    </div>  :
                    <div className='col-xl-12 col-lg-12 col-md-30 col-sm-30 col-xs-12' style={{'textAlign': 'center', 'fontSize': 'x-large'}}>

                    <h5> Currently there are no responses for this poll.</h5>
                    </div>
                  }
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
    )
  }
}

function mapStateToProps (state) {
  return {
    polls: (state.pollsInfo.polls),
    responses: (state.pollsInfo.responses),
    responsesfull: (state.pollsInfo.responsesfull),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    superUser: (state.basicInfo.superUser)
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
