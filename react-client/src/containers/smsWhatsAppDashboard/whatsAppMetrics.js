
/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import WhatsAppMetrics from '../../components/smsWhatsAppDashboard/whatsAppMetrics'
import { bindActionCreators } from 'redux'
import { validDateRange } from '../../utility/utils'
import moment from 'moment'

class Metrics extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      dateRangeWarning: '',
      chartData: [],
      showMetrics: this.props.showMetrics
    }
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.changeDateTo = this.changeDateTo.bind(this)
    this.changeDateFrom = this.changeDateFrom.bind(this)
    this.setChartData = this.setChartData.bind(this)
    this.prepareLineChartData = this.prepareLineChartData.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    let endDate = new Date()
    let startDate = new Date(
        (endDate.getTime() - (30 * 24 * 60 * 60 * 1000)))

    let startMonth = ('0' + (startDate.getMonth() + 1)).slice(-2)
    let startDay = ('0' + startDate.getDate()).slice(-2)
    let finalStartDate = `${startDate.getFullYear()}-${startMonth}-${startDay}`

    let endMonth = ('0' + (endDate.getMonth() + 1)).slice(-2)
    let endDay = ('0' + endDate.getDate()).slice(-2)
    let finalEndDate = `${endDate.getFullYear()}-${endMonth}-${endDay}`
    this.setState({startDate: finalStartDate, endDate: finalEndDate, showMetrics: !this.state.showMetrics})
    this.props.loadMetrics({
      startDate: finalStartDate,
      endDate: finalEndDate
    })
  }

  componentDidMount () {
    if (this.props.metrics && this.props.metrics.graphDatas) {
      this.setChartData(this.props.metrics.graphDatas)
    }
  }
  UNSAFE_componentWillReceiveProps (nextprops) {
    if (nextprops.metrics.graphDatas) {
      this.setChartData(nextprops.metrics.graphDatas)
    }
  }

  getDays () {
    var date1 = new Date(this.state.startDate)
    var date2 = new Date(this.state.endDate)
    var Difference_In_Time = date2.getTime() - date1.getTime()
    return  (Difference_In_Time / (1000 * 3600 * 24))
  }

  includeZeroCounts (data) {
    var dataArray = []
    var days = this.getDays()
    var index = 0
    var varDate = moment()
    for (var i = 0; i < days; i++) {
      for (var j = 0; j < data.length; j++) {
        var recordId = data[j]._id
        var date = `${recordId.year}-${recordId.month}-${recordId.day}`
        var loopDate = moment(varDate).format('YYYY-MM-DD')
        if (moment(date).isSame(loopDate, 'day')) {
          var d = {}
          d.date = loopDate
          d.count = data[j].count
          dataArray.push(d)
          varDate = moment(varDate).subtract(1, 'days')
          index = 0
          break
        }
        index++
      }
      if (index === data.length) {
        var obj = {}
        obj.date = varDate.format('YYYY-MM-DD')
        obj.count = 0
        dataArray.push(obj)
        varDate = moment(varDate).subtract(1, 'days')
        index = 0
      }
    }
    return dataArray.reverse()
  }

  prepareLineChartData (activeSubscribers, messagesSent, templateMessagesSent, messagesReceived, zoomMeetings) {
    var dataChart = []
    if (activeSubscribers && activeSubscribers.length > 0) {
      for (var i = 0; i < activeSubscribers.length; i++) {
        var record = {}
        record.date = activeSubscribers[i].date
        if (messagesSent && messagesSent.length > 0) {
          record.messagesSent = messagesSent[i].count
        } else {
          record.messagesSent = 0
        }
        if (templateMessagesSent && templateMessagesSent.length > 0) {
          record.templateMessagesSent = templateMessagesSent[i].count
        } else {
          record.templateMessagesSent = 0
        }
        if (messagesReceived && messagesReceived.length > 0) {
          record.messagesReceived = messagesReceived[i].count
        } else {
          record.messagesReceived = 0
        }
        if (zoomMeetings && zoomMeetings.length > 0) {
          record.zoomMeetings = zoomMeetings[i].count
        } else {
          record.zoomMeetings = 0
        }
        record.activeSubscribers = activeSubscribers[i].count
        dataChart.push(record)
      }
    } else if (messagesSent && messagesSent.length > 0) {
      for (var j = 0; j < messagesSent.length; j++) {
        var record1 = {}
        record1.date = messagesSent[j].date
        if (activeSubscribers && activeSubscribers.length > 0) {
          record1.activeSubscribers = activeSubscribers[j].count
        } else {
          record1.activeSubscribers = 0
        }
        if (templateMessagesSent && templateMessagesSent.length > 0) {
          record1.templateMessagesSent = templateMessagesSent[j].count
        } else {
          record1.templateMessagesSent = 0
        }
        if (messagesReceived && messagesReceived.length > 0) {
          record1.messagesReceived = messagesReceived[j].count
        } else {
          record1.messagesReceived = 0
        }
        if (zoomMeetings && zoomMeetings.length > 0) {
          record1.zoomMeetings = zoomMeetings[j].count
        } else {
          record1.zoomMeetings = 0
        }
        record1.messagesSent = messagesSent[j].count
        dataChart.push(record1)
      }
    } else if (templateMessagesSent && templateMessagesSent.length > 0) {
      for (var k = 0; k < templateMessagesSent.length; k++) {
        var record2 = {}
        record2.date = templateMessagesSent[k].date
        if (activeSubscribers && activeSubscribers.length > 0) {
          record2.activeSubscribers = activeSubscribers[k].count
        } else {
          record2.activeSubscribers = 0
        }
        if (messagesSent && messagesSent.length > 0) {
          record2.messagesSent = messagesSent[k].count
        } else {
          record2.messagesSent = 0
        }
        if (messagesReceived && messagesReceived.length > 0) {
          record2.messagesReceived = messagesReceived[k].count
        } else {
          record2.messagesReceived = 0
        }
        if (zoomMeetings && zoomMeetings.length > 0) {
          record2.zoomMeetings = zoomMeetings[k].count
        } else {
          record2.zoomMeetings = 0
        }
        record2.templateMessagesSent = templateMessagesSent[k].count
        dataChart.push(record2)
      }
    } else if (messagesReceived && messagesReceived.length > 0) {
      for (var l = 0; l < messagesReceived.length; l++) {
        var record3 = {}
        record3.date = messagesReceived[l].date
        if (activeSubscribers && activeSubscribers.length > 0) {
          record3.activeSubscribers = activeSubscribers[l].count
        } else {
          record3.activeSubscribers = 0
        }
        if (messagesSent && messagesSent.length > 0) {
          record3.messagesSent = messagesSent[l].count
        } else {
          record3.messagesSent = 0
        }
        if (templateMessagesSent && templateMessagesSent.length > 0) {
          record3.templateMessagesSent = templateMessagesSent[l].count
        } else {
          record3.templateMessagesSent = 0
        }
        if (zoomMeetings && templateMessagesSent.length > 0) {
          record3.zoomMeetings = zoomMeetings[l].count
        } else {
          record3.zoomMeetings = 0
        }
        record3.messagesReceived = messagesReceived[l].count
        dataChart.push(record3)
      }
    }
    return dataChart
  }

  setChartData (graphData) {
    let activeSubscribers = []
    let messagesSent = []
    let templateMessagesSent = []
    let zoomMeetings = []
    let messagesReceived = []
    if (graphData.activeSubscribers && graphData.activeSubscribers.length > 0) {
      activeSubscribers = this.includeZeroCounts(graphData.activeSubscribers)
    }
    if (graphData.messagesSent && graphData.messagesSent.length > 0) {
      messagesSent = this.includeZeroCounts(graphData.messagesSent)
    }
    if (graphData.templateMessagesSent && graphData.templateMessagesSent.length > 0) {
      templateMessagesSent = this.includeZeroCounts(graphData.templateMessagesSent)
    }
    if (graphData.messagesReceived && graphData.messagesReceived.length > 0) {
      messagesReceived = this.includeZeroCounts(graphData.messagesReceived)
    }
    if (graphData.zoomMeetings && graphData.zoomMeetings.length > 0) {
      zoomMeetings = this.includeZeroCounts(graphData.zoomMeetings)
    }
    let dataChart = this.prepareLineChartData(
      activeSubscribers, messagesSent, templateMessagesSent, messagesReceived, zoomMeetings)
    this.setState({chartData: dataChart})
  }

  changeDateTo (e) {
    this.setState({
      endDate: e.target.value,
    })
    let {valid, dateRangeWarning} = validDateRange(this.state.startDate, e.target.value)
    if (valid) {
      this.props.loadMetrics({
        startDate: this.state.startDate,
        endDate: e.target.value})
    }
    this.setState({dateRangeWarning: dateRangeWarning})
  }
  changeDateFrom (e) {
    this.setState({
      startDate: e.target.value
    })
    let {valid, dateRangeWarning} = validDateRange(e.target.value, this.state.endDate)
    if (valid) {
      this.props.loadMetrics({
        startDate: e.target.value,
        endDate: this.state.endDate})
    }
    this.setState({dateRangeWarning: dateRangeWarning})
  }
  render () {
    return (
      <div className='col-xl-12'>
        <div className='m-portlet'>
          <div className='m-portlet__head'>
            {this.props.showToggle &&<div className='m-portlet__head-caption'>
              <div className='m-portlet__head-title'>
                <h3 className='m-portlet__head-text'>
                  WhatsApp Metrics
                </h3>
              </div>
            </div>
            }
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                <li className='nav-item m-tabs__item' />
                {this.state.showMetrics &&
                  <li className='nav-item m-tabs__item' style={{marginRight: '10px'}}>
                  <div className='form-row'>
                  <div className='col-md-12' style={{ display: 'inherit' }}>
                    <span style={{marginTop: '7px', marginRight: '10px'}}>From:</span>
                    <div className='col-md-5'>
                      <input className='form-control m-input'
                        onChange={(e) => this.changeDateFrom(e)}
                        value={this.state.startDate}
                        id='text'
                        placeholder='Value'
                        max= {moment().format('YYYY-MM-DD')}
                        type='date'/>
                      { this.state.dateRangeWarning !== '' &&<span style={{color: '#ffb822'}}className='m-form__help'>
                        {this.state.dateRangeWarning}
                      </span> }
                    </div>
                    <span style={{marginTop: '7px', marginLeft: '10px',marginRight: '10px'}}>To:</span>
                      <div className='col-md-5'>
                        <input className='form-control m-input'
                          onChange={(e) => this.changeDateTo(e)}
                          value={this.state.endDate}
                          id='text'
                          placeholder='Value'
                          max= {moment().format('YYYY-MM-DD')}
                          type='date'/>
                        { this.state.dateRangeWarning !== '' && <span style={{color: '#ffb822'}}className='m-form__help'>
                          {this.state.dateRangeWarning}
                        </span> }
                      </div>
                  </div>
                </div>
                </li>
              }
                {this.props.showToggle &&
                <li className='m-portlet__nav-item'>
                  <div data-portlet-tool='toggle' className='m-portlet__nav-link m-portlet__nav-link--icon' title='' data-original-title='Collapse' onClick={this.toggle} style={{marginTop: '5px'}}>
                    {this.state.showMetrics
                      ? <i className='la la-angle-up' style={{cursor: 'pointer'}} />
                      : <i className='la la-angle-down' style={{cursor: 'pointer'}} />
                    }
                </div>
              </li>
              }
              </ul>
            </div>
          </div>
          {this.state.showMetrics && this.props.metrics &&
            <WhatsAppMetrics metrics={this.props.metrics} lineChartData={this.state.chartData} />
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    metrics: (state.smsWhatsAppDashboardInfo.metrics)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Metrics)
