/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import PageLikesSubscribers from '../../components/Dashboard/PageLikesSubscribers'
import CardBoxes from '../../components/Dashboard/CardBoxes'
import CardsWithProgress from '../../components/Dashboard/CardsWithProgress'
import { loadDashboardData, sentVsSeen, loadGraphData, loadTopPages } from '../../redux/actions/dashboard.actions'
import { bindActionCreators } from 'redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { fetchSessions } from '../../redux/actions/livechat.actions'
import { loadSubscribersList } from '../../redux/actions/subscribers.actions'
import {
  createbroadcast
} from '../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import GettingStarted from './gettingStarted'
import { joinRoom, registerAction } from '../../utility/socketio'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import Reports from '../operationalDashboard/reports'
import TopPages from './topPages'
import moment from 'moment'
import fileDownload from 'js-file-download'
var json2csv = require('json2csv')

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    props.loadMyPagesList()
    props.loadDashboardData()
    props.sentVsSeen()
    props.loadSubscribersList()
    props.loadGraphData(0)
    props.loadTopPages()

    this.state = {
      isShowingModal: false,
      sentseendata1: [],
      chartData: [],
      selectedDays: 10,
      topPages: []
    }
    this.onDaysChange = this.onDaysChange.bind(this)
    this.prepareLineChartData = this.prepareLineChartData.bind(this)
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.setChartData = this.setChartData.bind(this)
    this.exportDashboardInformation = this.exportDashboardInformation.bind(this)
    this.prepareExportData = this.prepareExportData.bind(this)
    this.formatDate = this.formatDate.bind(this)
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  formatDate (data) {
    var formattedData = []
    for (var i = 0; i < data.length; i++) {
      var recordId = data[i]._id
      var date = `${recordId.year}-${recordId.month}-${recordId.day}`
      var tempObj = {'_id': date, 'count': data[i].count}
      formattedData.push(tempObj)
    }
    return formattedData
  }
  prepareExportData () {
    var data = []
    var dashboardObj = {}
    if (this.props.dashboard) {
      dashboardObj = {
        'User': this.props.dashboard.username,
        'Connected Pages': this.props.dashboard.pages,
        'Total Pages': this.props.dashboard.totalPages,
        'Unread Count': this.props.dashboard.unreadCount,
        'Activity': this.props.dashboard.activityChart,
        'Subscribers': this.props.dashboard.subscribers
      }
    }
    if (this.props.sentseendata) {
      dashboardObj['Broadcast Sent/Seen'] = this.props.sentseendata.broadcast
      dashboardObj['Polls Sent/Seen'] = this.props.sentseendata.poll
      dashboardObj['Surveys Sent/Seen'] = this.props.sentseendata.survey
    }
    if (this.props.graphData) {
      dashboardObj['No.of broadcasts created on different days'] = this.formatDate(this.props.graphData.broadcastsgraphdata)
      dashboardObj['No.of polls created on different days'] = this.formatDate(this.props.graphData.pollsgraphdata)
      dashboardObj['No.of surveys created on different days'] = this.formatDate(this.props.graphData.surveysgraphdata)
      dashboardObj['No.of chat session created on different days'] = this.formatDate(this.props.graphData.sessionsgraphdata)
    }
    if (this.props.topPages && this.props.topPages.length > 1) {
      for (var i = 0; i < this.props.topPages.length; i++) {
        dashboardObj['Top Page ' + (i + 1)] = this.props.topPages[i]
      }
    }
    data.push(dashboardObj)
    return data
  }
  exportDashboardInformation () {
    var data = this.prepareExportData()
    var info = data
    var keys = []
    var val = info[0]

    for (var j in val) {
      var subKey = j
      keys.push(subKey)
    }
    json2csv({ data: info, fields: keys }, function (err, csv) {
      if (err) {
      } else {
        fileDownload(csv, 'Dashboard.csv')
      }
    })
  }
  onDaysChange (e) {
    var defaultVal = 10
    var value = e.target.value
    this.setState({selectedDays: value})
    if (value && value !== '') {
      if (value.indexOf('.') !== -1) {
        value = Math.floor(value)
      }
      this.props.loadGraphData(value)
    } else if (value === '') {
      this.setState({selectedDays: ''})
      this.props.loadGraphData(defaultVal)
    }
  }
  componentWillReceiveProps (nextprops) {
    if (nextprops.user && nextprops.user.emailVerified === false &&
      (nextprops.user.currentPlan === 'plan_C' || nextprops.user.currentPlan === 'plan_D')) {
      browserHistory.push({
        pathname: '/resendVerificationEmail'
      })
    }
    if (nextprops.user) {
      if ((nextprops.user.currentPlan === 'plan_A' || nextprops.user.currentPlan === 'plan_ B') && !nextprops.user.facebookInfo) {
        browserHistory.push({
          pathname: '/connectFb',
          state: { account_type: 'individual' }
        })
      } else if (nextprops.subscribers && nextprops.subscribers.length > 0) {
        // this means more than 0 subscribers
        this.setState({isShowingModal: false})
      } else if (nextprops.pages && nextprops.pages.length > 0 && nextprops.subscribers && nextprops.subscribers.length === 0) {
        // this means 0 subscribers
        this.setState({isShowingModal: true})
      } else if (nextprops.pages && nextprops.pages.length === 0) {
      // this means connected pages in 0
        // browserHistory.push({
          // pathname: '/addPages',
          // state: {showMsg: true}
        // })
      }
      if (nextprops.user) {
        joinRoom(nextprops.user.companyId)
      }
      if (nextprops.sentseendata) {
        var temp = []
        temp.push(nextprops.sentseendata)
        this.setState({sentseendata1: nextprops.sentseendata})
      }
      if (nextprops.graphData) {
        this.setChartData(nextprops.graphData)
      }
    }
    if (nextprops.user && (nextprops.user.role === 'admin' || nextprops.user.role === 'buyer') && !nextprops.user.wizardSeen) {
      browserHistory.push({
        pathname: '/addPageWizard'
      })
    }
  }
  setChartData (graphData) {
    if (graphData.broadcastsgraphdata && graphData.broadcastsgraphdata.length > 0) {
      var broadcastData = graphData.broadcastsgraphdata
      broadcastData = this.includeZeroCounts(broadcastData)
    }
    if (graphData.pollsgraphdata && graphData.pollsgraphdata.length > 0) {
      var pollsData = graphData.pollsgraphdata
      pollsData = this.includeZeroCounts(pollsData)
    }
    if (graphData.surveysgraphdata && graphData.surveysgraphdata.length > 0) {
      var surveysData = graphData.surveysgraphdata
      surveysData = this.includeZeroCounts(surveysData)
    }
    if (graphData.sessionsgraphdata && graphData.sessionsgraphdata.length > 0) {
      var sessionsData = graphData.sessionsgraphdata
      sessionsData = this.includeZeroCounts(sessionsData)
    }
    var dataChart = this.prepareLineChartData(surveysData, pollsData, broadcastData, sessionsData)
    this.setState({chartData: dataChart})
  }
  includeZeroCounts (data) {
    var dataArray = []
    var days = this.state.selectedDays !== '' ? this.state.selectedDays : '10'
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
  prepareLineChartData (surveys, polls, broadcasts, sessions) {
    var dataChart = []
    if (surveys && surveys.length > 0) {
      for (var i = 0; i < surveys.length; i++) {
        var record = {}
        record.date = surveys[i].date
        if (broadcasts && broadcasts.length > 0) {
          record.broadcastscount = broadcasts[i].count
        } else {
          record.broadcastscount = 0
        }
        if (polls && polls.length > 0) {
          record.pollscount = polls[i].count
        } else {
          record.pollscount = 0
        }
        if (sessions && sessions.length > 0) {
          record.sessionscount = sessions[i].count
        } else {
          record.sessionscount = 0
        }
        record.surveyscount = surveys[i].count
        dataChart.push(record)
      }
    } else if (broadcasts && broadcasts.length > 0) {
      for (var j = 0; j < broadcasts.length; j++) {
        var record1 = {}
        record1.date = broadcasts[j].date
        if (surveys && surveys.length > 0) {
          record1.surveyscount = surveys[j].count
        } else {
          record1.surveyscount = 0
        }
        if (polls && polls.length > 0) {
          record1.pollscount = polls[j].count
        } else {
          record1.pollscount = 0
        }
        if (sessions && sessions.length > 0) {
          record1.sessionscount = sessions[j].count
        } else {
          record1.sessionscount = 0
        }
        record1.broadcastscount = broadcasts[j].count
        dataChart.push(record1)
      }
    } else if (polls && polls.length > 0) {
      for (var k = 0; k < polls.length; k++) {
        var record2 = {}
        record2.date = polls[k].date
        if (surveys && surveys.length > 0) {
          record2.surveyscount = surveys[k].count
        } else {
          record2.surveyscount = 0
        }
        if (broadcasts && broadcasts.length > 0) {
          record2.broadcastscount = broadcasts[k].count
        } else {
          record2.pollscount = 0
        }
        if (sessions && sessions.length > 0) {
          record2.sessionscount = sessions[k].count
        } else {
          record2.sessionscount = 0
        }
        record2.pollscount = polls[k].count
        dataChart.push(record2)
      }
    } else if (sessions && sessions.length > 0) {
      for (var l = 0; l < sessions.length; l++) {
        var record3 = {}
        record3.date = sessions[l].date
        if (surveys && surveys.length > 0) {
          record3.surveyscount = surveys[l].count
        } else {
          record3.surveyscount = 0
        }
        if (broadcasts && broadcasts.length > 0) {
          record3.broadcastscount = broadcasts[l].count
        } else {
          record3.pollscount = 0
        }
        if (polls && polls.length > 0) {
          record3.pollscount = polls[l].count
        } else {
          record3.pollscount = 0
        }
        record3.sessionscount = sessions[l].count
        dataChart.push(record3)
      }
    }
    return dataChart
  }
  componentDidMount () {
    document.title = 'KiboPush | Dashboard'
    var compProp = this.props
    registerAction({
      event: 'dashboard_updated',
      action: function (data) {
        compProp.loadMyPagesList()
        compProp.loadDashboardData()
      }
    })
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Dashboard</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <AlertContainer ref={a => this.msg = a} {...alertOptions} />
          {
            this.props.user && (((this.props.user.currentPlan === 'plan_A' || this.props.user.currentPlan === 'plan_ B') && !this.props.user.facebookInfo) || (this.props.user.emailVerified === false &&
              (this.props.user.currentPlan === 'plan_C' || this.props.user.currentPlan === 'plan_D')))
            ? null
            : <div>
              {/* this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') && !this.props.user.wizardSeen &&
              <GettingStarted pages={this.props.pages} /> */ }
            </div>
          }
          <div className='row'>
            {
              this.props.pages && this.props.pages.length > 0 &&
              <PageLikesSubscribers connectedPages={this.props.pages} />
            }
            {
              this.props.dashboard &&
              <CardBoxes data={this.props.dashboard} />
            }
          </div>
          {
            this.props.sentseendata &&
            <CardsWithProgress data={this.props.sentseendata} />
          }
          {
           this.props.topPages && this.props.topPages.length > 1 &&
             <div className='row'>
               <TopPages pagesData={this.props.topPages} />
             </div>
          }
          <div className='row'>
            <Reports
              iconClassName={'fa fa-line-chart'}
              title={'Reports'}
              lineChartData={this.state.chartData}
              onDaysChange={this.onDaysChange}
              selectedDays={this.state.selectedDays}
              />
          </div>
          <div className='row'>
            <div className='m-form m-form--label-align-right m--margin-bottom-30 col-12'>
              <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.exportDashboardInformation}>
                <span>
                  <i className='fa fa-download' />
                  <span>
                    Export Records in CSV File
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
  }

function mapStateToProps (state) {
  console.log('state', state)
  return {
    user: (state.basicInfo.user),
    dashboard: (state.dashboardInfo.dashboard),
    sentseendata: (state.dashboardInfo.sentseendata),
    pages: (state.pagesInfo.pages),
    subscribers: (state.subscribersInfo.subscribers),
    graphData: (state.dashboardInfo.graphData),
    topPages: (state.dashboardInfo.topPages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      loadDashboardData: loadDashboardData,
      loadMyPagesList: loadMyPagesList,
      loadSubscribersList: loadSubscribersList,
      createbroadcast: createbroadcast,
      fetchSessions: fetchSessions,
      getuserdetails: getuserdetails,
      sentVsSeen: sentVsSeen,
      loadGraphData: loadGraphData,
      loadTopPages: loadTopPages
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
