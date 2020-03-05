
/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import CardBoxesContainer from '../../components/Dashboard/CardBoxesContainer'
import ProgressBoxKiboEngage from '../../components/Dashboard/ProgressBoxKiboEngage'
import ProgressBoxKiboChat from '../../components/Dashboard/ProgressBoxKiboChat'
import SubscriberSummary from './subscriberSummary'
import AutopostingSummary from './autopostingSummary'
import IntegrationsSummary from './integrationsSummary'
import NewsIntegrationsSummary from './newsIntegrationsSummary'
import { loadDashboardData, loadSubscriberSummary, sentVsSeen, loadGraphData, loadTopPages, updateSubscriptionPermission, loadSentSeen } from '../../redux/actions/dashboard.actions'
import { bindActionCreators } from 'redux'
import { loadMyPagesList, updateCurrentPage } from '../../redux/actions/pages.actions'
import { loadSubscribersCount } from '../../redux/actions/subscribers.actions'
import {
  createbroadcast
} from '../../redux/actions/broadcast.actions'
import AlertContainer from 'react-alert'
import YouTube from 'react-youtube'
import { RingLoader } from 'halogenium'
//  import GettingStarted from './gettingStarted'
import { registerAction } from '../../utility/socketio'
import { readShopifyInstallRequest } from '../../utility/utils'
import { validateUserAccessToken } from '../../redux/actions/basicinfo.actions'
// import Reports from './reports'
// import TopPages from './topPages'
import moment from 'moment'
import fileDownload from 'js-file-download'
// import Connect from '../facebookConnect/connect'

var json2csv = require('json2csv')

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      sentseendata1: [],
      chartData: [],
      selectedDays: 10,
      topPages: [],
      loading: true,
      showDropDown: false,
      days: '30',
      pageId: 'all',
      selectedPage: {},
      openVideo: false
    }
    this.onDaysChange = this.onDaysChange.bind(this)
    this.prepareLineChartData = this.prepareLineChartData.bind(this)
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.setChartData = this.setChartData.bind(this)
    this.exportDashboardInformation = this.exportDashboardInformation.bind(this)
    this.prepareExportData = this.prepareExportData.bind(this)
    this.formatDate = this.formatDate.bind(this)
    this.showDropDown = this.showDropDown.bind(this)
    this.hideDropDown = this.hideDropDown.bind(this)
    this.changePage = this.changePage.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.checkUserAccessToken = this.checkUserAccessToken.bind(this)
    this.changeDays = this.changeDays.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoDashboard.click()
  }
  UNSAFE_componentWillMount () {

    this.props.validateUserAccessToken(this.checkUserAccessToken)
    this.props.loadDashboardData()
    this.props.updateSubscriptionPermission()
    this.props.loadSubscribersCount({})
    this.props.loadGraphData(0)
    this.props.loadTopPages()
    this.props.loadMyPagesList()
    this.props.loadSubscriberSummary({pageId: 'all', days: 'all'})
    this.props.loadSentSeen({pageId: 'all', days: '30'})
  }
  checkUserAccessToken (response) {
    console.log('checkUserAccessToken response', response)
    if (this.props.user && this.props.user.role === 'buyer' &&
        response.status === 'failed' && response.payload.error &&
        response.payload.error.code === 190 && this.props.user.platform === 'messenger') {
      this.props.history.push({
        pathname: '/connectFb',
        state: { session_inavalidated: true }
      })
    }
  }
  goToSettings () {
    this.props.history.push({
      pathname: `/settings`,
      state: {module: 'pro'}
    })
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
    // console.log('prepareExportData')
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
    console.log('this.props.graphData', this.props.graphData)
    if (this.props.graphData) {
      if (this.props.graphData.broadcastsgraphdata) {
        dashboardObj['No.of broadcasts created on different days'] = this.formatDate(this.props.graphData.broadcastsgraphdata)
      }
      if (this.props.graphData.pollsgraphdata) {
        dashboardObj['No.of polls created on different days'] = this.formatDate(this.props.graphData.pollsgraphdata)
      }
      if (this.props.graphData.surveysgraphdata) {
        dashboardObj['No.of surveys created on different days'] = this.formatDate(this.props.graphData.surveysgraphdata)
      }
      if (this.props.graphData.sessionsgraphdata) {
        dashboardObj['No.of chat session created on different days'] = this.formatDate(this.props.graphData.sessionsgraphdata)
      }
    }
   // console.log('this.props.topPages', this.props.topPages)
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
        console.log('call file download function')
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
  UNSAFE_componentWillReceiveProps (nextprops) {
    console.log('in UNSAFE_componentWillReceiveProps dashboard', nextprops)
    if (nextprops.user && nextprops.pages) {
      if (nextprops.user.emailVerified === false) {
        this.props.history.push({
          pathname: '/resendVerificationEmail'
        })
      } else
      if (nextprops.automated_options && !nextprops.user.facebookInfo && !nextprops.automated_options.twilio && !nextprops.automated_options.twilioWhatsApp && nextprops.user.role === 'buyer') {
        this.props.history.push({
          pathname: '/integrations'
        })
      }
      //  else if (nextprops.user.platform === 'messenger' && !nextprops.user.facebookInfo) {
      //   this.props.history.push({
      //     pathname: '/integrations',
      //     state: {showCancel: 'messenger'}
      //   })
      // } else if (nextprops.user.platform === 'sms' && nextprops.automated_options && !nextprops.automated_options.twilio) {
      //   this.props.history.push({
      //     pathname: '/integrations',
      //     state: {showCancel: 'sms'}
      //   })
      // } else if (nextprops.user.platform === 'whatsApp' && nextprops.automated_options && !nextprops.automated_options.twilioWhatsApp) {
      //   this.props.history.push({
      //     pathname: '/integrations',
      //     state: {showCancel: 'whatsApp'}
      //   })
      // }
      // else if ((nextprops.user.currentPlan.unique_ID === 'plan_A' || nextprops.user.currentPlan.unique_ID === 'plan_B') && !nextprops.user.facebookInfo) {
      //   this.props.history.push({
      //     pathname: '/connectFb',
      //     state: { account_type: 'individual' }
      //   })
      // } else if ((nextprops.user.currentPlan.unique_ID === 'plan_C' || nextprops.user.currentPlan.unique_ID === 'plan_D') && !nextprops.user.facebookInfo && nextprops.user.role === 'buyer' && !nextprops.user.skippedFacebookConnect) {
      //   if (nextprops.pages && nextprops.pages.length === 0) {
      //     console.log('going to push')
      //     this.props.history.push({
      //       pathname: '/connectFb',
      //       state: { account_type: 'team' }
      //     })
      //   }
      // }
      else if (nextprops.user.platform === 'messenger' && nextprops.pages && nextprops.pages.length === 0) {
        console.log('nextprops pages', nextprops)
        this.props.history.push({
          pathname: '/addfbpages'
        })
      } else if (nextprops.user.platform === 'messenger' && (nextprops.user.role === 'admin' || nextprops.user.role === 'buyer') && !nextprops.user.wizardSeen) {
        console.log('going to push add page wizard')
        this.props.history.push({
          pathname: '/inviteUsingLinkWizard'
        })
      } else if (readShopifyInstallRequest() && readShopifyInstallRequest() !== '') {
        this.props.history.push({
          pathname: '/abandonedCarts'
        })
      } else if (nextprops.user.platform === 'messenger' && nextprops.subscribersCount > 0) {
        // this means more than 0 subscribers
        this.setState({isShowingModal: false})
      } else if (nextprops.user.platform === 'messenger' && nextprops.pages && nextprops.pages.length > 0 && nextprops.subscribersCount === 0) {
        // this means 0 subscribers
        this.setState({isShowingModal: true})
      } else if (nextprops.pages && nextprops.pages.length === 0) {
      // this means connected pages in 0
        // this.props.history.push({
          // pathname: '/addPages',
          // state: {showMsg: true}
        // })
      }
      if (nextprops.dashboard && nextprops.sentseendata && nextprops.graphData) {
        this.setState({loading: false})
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

    // if (!this.props.pages && nextprops.pages) {
    //   this.props.sentVsSeen(nextprops.pages[0].pageId)
    // }
  }
  setChartData (graphData) {
    const url = window.location.hostname
    if (url.includes('kiboengage.cloudkibo.com')) {
      if (graphData.broadcastsgraphdata && graphData.broadcastsgraphdata.length > 0) {
        var broadcastData = graphData.broadcastsgraphdata
        broadcastData = this.includeZeroCounts(broadcastData)
      }
      console.log('broadcastsData', broadcastData)
      if (graphData.pollsgraphdata && graphData.pollsgraphdata.length > 0) {
        var pollsData = graphData.pollsgraphdata
        pollsData = this.includeZeroCounts(pollsData)
      }
      if (graphData.surveysgraphdata && graphData.surveysgraphdata.length > 0) {
        var surveysData = graphData.surveysgraphdata
        surveysData = this.includeZeroCounts(surveysData)
      }
      let dataChart = this.prepareLineChartData(surveysData, pollsData, broadcastData)
      console.log('dataChart', dataChart)
      this.setState({chartData: dataChart})
    } else {
      if (graphData.sessionsgraphdata && graphData.sessionsgraphdata.length > 0) {
        var sessionsData = graphData.sessionsgraphdata
        sessionsData = this.includeZeroCounts(sessionsData)
      }
      let dataChart = this.prepareLineChartData([], [], [], sessionsData)
      this.setState({chartData: dataChart})
    }
  }
  includeZeroCounts (data) {
    var dataArray = []
    var days = this.state.days
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
    console.log('location', this.props.location)
    if (this.props.location && this.props.location.state && this.props.location.state.loadScript) {
      console.log('in loadScript')
      // TODO We need to correct this in future.
      window.location.reload()
      // let addScript = document.createElement('script')
      // addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/vendors/base/vendors.bundle.js')
      // document.body.appendChild(addScript)
      // let addScript1 = document.createElement('script')
      // addScript1.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/base/scripts.bundle.js')
      // document.body.appendChild(addScript1)
    }
    // if (this.props.currentPage) {
    //   console.log('updating sentVsSeen currentPage')
    //   this.props.sentVsSeen(this.props.currentPage.pageId)
    // }
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Dashboard`
    var compProp = this.props
    registerAction({
      event: 'dashboard_updated',
      action: function (data) {
        compProp.loadMyPagesList()
        compProp.loadDashboardData()
      }
    })
  }

  changePage (page) {
    // let index = 0
    // for (let i = 0; i < this.props.pages.length; i++) {
    //   if (page === this.props.pages[i].pageId) {
    //     console.log('in if change page')
    //     index = i
    //     this.props.updateCurrentPage(this.props.pages[i])
    //     break
    //   }
    // }
    // this.props.sentVsSeen(this.props.pages[index].pageId)
    if (page === 'all') {
      this.setState({pageId: 'all'})
      this.props.loadSentSeen({pageId: 'all', days: this.state.days})
    } else {
      this.setState({pageId: page.pageId, selectedPage: page})
      this.props.loadSentSeen({pageId: page.pageId, days: this.state.days})
    }
  }

  changeDays (e) {
    this.setState({days: e.target.value})
    this.props.loadSentSeen({pageId: this.state.pageId, days: e.target.value})
  }

  showDropDown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
  }

  onKeyDown (e) {
    if (e.keyCode === 13) {
      e.preventDefault()
    }
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('this.props.dashboard', this.props.dashboard)
    const url = window.location.hostname
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="upgrade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
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
                <div style={{color: 'black'}} className="modal-body">
                  <p>This feature is not available in free account. Kindly updrade your account to use this feature.</p>
                  <div style={{width: '100%', textAlign: 'center'}}>
                    <div style={{display: 'inline-block', padding: '5px'}}>
                      <button className='btn btn-primary' onClick={() => this.goToSettings()} data-dismiss='modal'>
                        Upgrade to Pro
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a href='#/' style={{ display: 'none' }} ref='videoDashboard' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoDashboard">videoMessengerRefModal</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoDashboard" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
              <div className="modal-content" style={{width: '687px', top: '100'}}>
              <div style={{ display: 'block'}} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Dashboard Video Tutorial
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                   aria-label="Close"
                   onClick={() => {
                    this.setState({
                      openVideo: false
                    })}}>
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                {this.state.openVideo && <YouTube
                    videoId='NhqPaGp3TF8'
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: { // https://developers.google.com/youtube/player_parameters
                        autoplay: 0
                      }
                    }}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Dashboard</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          {
            this.props.user && this.props.user.platform === 'messenger' && this.props.pages && this.props.pages.length === 0 &&
            <div className='m-alert m-alert--icon m-alert--icon-solid m-alert--outline alert alert-warning alert-dismissible fade show' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation-1' style={{color: 'white'}} />
                <span />
              </div>
              <div className='m-alert__text'>
                <strong>
                0 Pages Connected!&nbsp;
                </strong>
                You have no pages connected. Please connect your facebook pages to get started.&nbsp; <Link style={{cursor: 'pointer'}} to='/addPages' >Connect Page</Link>
              </div>
            </div>
          }
          <AlertContainer ref={a => this.msg = a} {...alertOptions} />
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding dashboard? Here is the <a href='http://kibopush.com/dashboard/' target='_blank' rel='noopener noreferrer'>documentation</a>.
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
            </div>
          </div>
          {
            this.props.user && (((this.props.user.currentPlan === 'plan_A' || this.props.user.currentPlan === 'plan_ B') && !this.props.user.facebookInfo) || (this.props.user.emailVerified === false &&
              (this.props.user.currentPlan === 'plan_C' || this.props.user.currentPlan === 'plan_D')))
            ? null
            : <div>
              {/* this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') && !this.props.user.wizardSeen &&
              <GettingStarted pages={this.props.pages} /> */ }
            </div>
          }
          {this.state.loading
          ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
          : <div>
            <div className='row'>
              {
                this.props.dashboard &&
                <CardBoxesContainer data={this.props.dashboard} />
              }
            </div>
            <div className='row'>
              <SubscriberSummary includeZeroCounts={this.includeZeroCounts} />
            </div>
            <div className='row'>
              {
              this.props.pages && this.props.sentseendata && (url.includes('kiboengage.cloudkibo.com'))
              ? <ProgressBoxKiboEngage
                lineChartData={this.state.chartData}
                pages={this.props.pages}
                data={this.props.sentseendata}
                changePage={this.changePage}
                days={this.state.days}
                pageId={this.state.pageId}
                selectedPage={this.state.selectedPage}
                changeDays={this.changeDays}
                onKeyDown={this.onKeyDown} />
              : <ProgressBoxKiboChat
                lineChartData={this.state.chartData}
                pages={this.props.pages}
                data={this.props.sentseendata}
                changePage={this.changePage}
                days={this.state.days}
                pageId={this.state.pageId}
                selectedPage={this.state.selectedPage}
                changeDays={this.changeDays}
                onKeyDown={this.onKeyDown} />
            }
            </div>
            {(url.includes('kiboengage.cloudkibo.com') || url.includes('localhost')) &&
              <div className='row'>
                <AutopostingSummary />
              </div>
            }
            {(url.includes('kiboengage.cloudkibo.com') || url.includes('localhost')) &&
              <div className='row'>
                <NewsIntegrationsSummary />
              </div>
            }
            {(url.includes('kiboengage.cloudkibo.com') || url.includes('localhost')) &&
              <div className='row'>
                <IntegrationsSummary />
              </div>
            }
            {/*
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
            */}
            <div className='row'>
              <div className='m-form m-form--label-align-right m--margin-bottom-30 col-12'>
                {
                  this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_C'
              ? <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.exportDashboardInformation}>
                <span>
                  <i className='fa fa-download' />
                  <span>
                    Export Records in CSV File
                  </span>
                </span>
              </button>
              : <button className='btn btn-success m-btn m-btn--icon pull-right' data-toggle="modal" data-target="#upgrade">
                <span>
                  <i className='fa fa-download' />
                  <span>
                    Export Records in CSV File
                  </span>&nbsp;&nbsp;
                  <span style={{border: '1px solid #f4516c', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                    <span style={{color: '#f4516c'}}>PRO</span>
                  </span>
                </span>
              </button>
            }
              </div>
            </div>
          </div>
        }
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
    currentPage: (state.pagesInfo.currentPage),
    subscribersCount: (state.subscribersInfo.subscribersCount),
    graphData: (state.dashboardInfo.graphData),
    topPages: (state.dashboardInfo.topPages),
    automated_options: (state.basicInfo.automated_options),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      updateCurrentPage: updateCurrentPage,
      loadDashboardData: loadDashboardData,
      updateSubscriptionPermission: updateSubscriptionPermission,
      loadMyPagesList: loadMyPagesList,
      loadSubscribersCount: loadSubscribersCount,
      createbroadcast: createbroadcast,
      sentVsSeen: sentVsSeen,
      loadGraphData: loadGraphData,
      loadTopPages: loadTopPages,
      loadSubscriberSummary: loadSubscriberSummary,
      loadSentSeen: loadSentSeen,
      validateUserAccessToken
    },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
