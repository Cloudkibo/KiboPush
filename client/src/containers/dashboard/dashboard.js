/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory, Link } from 'react-router'
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
import Halogen from 'halogen'
//  import GettingStarted from './gettingStarted'
import { joinRoom, registerAction } from '../../utility/socketio'
import { getuserdetails } from '../../redux/actions/basicinfo.actions'
import Reports from '../operationalDashboard/reports'
import TopPages from './topPages'
import moment from 'moment'
import fileDownload from 'js-file-download'
// import Connect from '../facebookConnect/connect'

var json2csv = require('json2csv')

class Dashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    props.loadMyPagesList()
    props.loadDashboardData()
    props.loadSubscribersList()
    props.loadGraphData(0)
    props.loadTopPages()
    this.state = {
      isShowingModal: false,
      sentseendata1: [],
      chartData: [],
      selectedDays: 10,
      topPages: [],
      loading: true,
      showDropDown: false,
      pageLikesSubscribes: {}
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
    console.log('in componentWillReceiveProps dashboard', nextprops)
    if (nextprops.user) {
      joinRoom(nextprops.user.companyId)
      if (nextprops.user.emailVerified === false) {
        browserHistory.push({
          pathname: '/resendVerificationEmail'
        })
      } else if ((nextprops.user.currentPlan === 'plan_A' || nextprops.user.currentPlan === 'plan_B') && !nextprops.user.facebookInfo) {
        browserHistory.push({
          pathname: '/connectFb',
          state: { account_type: 'individual' }
        })
      } else if ((nextprops.user.currentPlan === 'plan_C' || nextprops.user.currentPlan === 'plan_D') && !nextprops.user.facebookInfo && nextprops.user.role === 'buyer' && !nextprops.user.skippedFacebookConnect) {
        if (nextprops.pages && nextprops.pages.length === 0) {
          console.log('going to push')
          browserHistory.push({
            pathname: '/connectFb',
            state: { account_type: 'team' }
          })
        }
      } else if ((nextprops.user.role === 'admin' || nextprops.user.role === 'buyer') && !nextprops.user.wizardSeen) {
        console.log('going to push add page wizard')
        browserHistory.push({
          pathname: '/inviteUsingLinkWizard'
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

    if (!this.props.pages && nextprops.pages) {
      this.props.sentVsSeen(nextprops.pages[0].pageId)
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
    console.log('location', this.props.location)
    if (this.props.location && this.props.location.state && this.props.location.state.loadScript) {
      console.log('in loadScript')
      let addScript = document.createElement('script')
      addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/vendors/base/vendors.bundle.js')
      document.body.appendChild(addScript)
      let addScript1 = document.createElement('script')
      addScript1.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/base/scripts.bundle.js')
      document.body.appendChild(addScript1)
    }
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

  changePage (page) {
    let index = 0
    for (let i = 0; i < this.props.pages.length; i++) {
      if (page === this.props.pages[i].pageName) {
        console.log('in if change page')
        index = i
        break
      }
    }
    this.props.sentVsSeen(this.props.pages[index].pageId)
    this.setState({
      pageLikesSubscribes: {
        selectedPage: this.props.pages[index].pageName,
        likes: this.props.pages[index].likes,
        subscribers: this.props.pages[index].subscribers,
        unsubscribes: this.props.pages[index].unsubscribes,
        selectedPageId: this.props.pages[index].pageId
      }
    }
      )
  }

  showDropDown () {
    this.setState({showDropDown: true})
  }

  hideDropDown () {
    this.setState({showDropDown: false})
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
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Dashboard</h3>
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-3 col-md-3 col-lg-3' />
          <div className='col-sm-4 col-md-4 col-lg-4'>
            <div className='m-portlet__head-tools'>
              <ul className='m-portlet__nav'>
                <li onClick={this.showDropDown} className='m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <a className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                    Change Page
                  </a>
                  {
                    this.state.showDropDown &&
                    <div className='m-dropdown__wrapper'>
                      <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                      <div className='m-dropdown__inner'>
                        <div className='m-dropdown__body'>
                          <div className='m-dropdown__content'>
                            <ul className='m-nav'>
                              <li className='m-nav__section m-nav__section--first'>
                                <span className='m-nav__section-text'>
                                  Connected Pages
                                </span>
                              </li>
                              {
                                this.props.pages.map((page, i) => (
                                  <li key={page.pageId} className='m-nav__item'>
                                    <a onClick={() => this.changePage(page.pageName)} className='m-nav__link' style={{cursor: 'pointer'}}>
                                      <span className='m-nav__link-text'>
                                        {page.pageName}
                                      </span>
                                    </a>
                                  </li>
                                ))
                              }
                              <li className='m-nav__separator m-nav__separator--fit' />
                              <li className='m-nav__item'>
                                <a onClick={() => this.hideDropDown} style={{borderColor: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--pill m-btn--wide btn-sm'>
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='m-content'>
          {
            this.props.pages && this.props.pages.length === 0 &&
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
          ? <div className='align-center'><center><Halogen.RingLoader color='#FF5E3A' /></center></div>
          : <div>
            <div className='row'>
              {
                this.props.pages && this.props.pages.length > 0 &&
                <PageLikesSubscribers firstPage={this.props.pages[0]} pageLikesSubscribes={this.state.pageLikesSubscribes} />
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
