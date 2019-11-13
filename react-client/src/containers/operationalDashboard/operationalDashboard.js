/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import PlatformStats from './platformStats'
import SurveysByDays from './surveysByDays'
import BroadcastsByDays from './broadcastsByDays'
import PollsByDays from './pollsByDays'
import Top10pages from './top10pages'
import UniquePages from './uniquePages'
import Reports from './reports'
import AutopostingSummary from '../dashboard/autopostingSummary'
import CompanyInfo from './companyInfo'
//  import ListItem from './ListItem'
import moment from 'moment'
import Popover from 'react-simple-popover'
import {
  loadUsersList,
  downloadFile,
  loadBroadcastsGraphData,
  loadPollsGraphData,
  loadSurveysGraphData,
  loadSessionsGraphData,
  sendEmail,
  allLocales,
  fetchPlatformStats,
  fetchPlatformStatsDateWise,
  fetchUserStats,
  fetchUserStatsDateWise,
  fetchOneUserStats,
  fetchOneUserStatsDateWise,
  fetchPageStats,
  fetchPageStatsDateWise,
  fetchOnePageStats,
  fetchOnePageStatsDateWise,
  fetchTopPages,
  fetchAutopostingPlatformWise,
  fetchAutopostingPlatformWiseDateWise,
  fetchAutopostingUserWise,
  fetchAutopostingUserWiseDateWise,
  fetchPlatformStatsMonthly,
  fetchPlatformStatsWeekly
} from '../../redux/actions/backdoor.actions'
import { saveUserInformation } from '../../redux/dispatchers/backdoor.dispatcher'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import auth from '../../utility/auth.service'

class OperationalDashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      usersData: [],
      usersDataAll: [],
      objectsData: [],
      objects: {},
      totalLength: 0,
      objectsLength: 0,
      options: [
        { value: 10, label: '10 days' },
        { value: 30, label: '30 days' }],
      genders: [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }],
      genderValue: '',
      localeValue: '',
      searchValue: '',
      selectedValue: 0,
      showTopTenPages: false,
      showReports: false,
      showUsers: false,
      chartData: [],
      selectedDays: 10,
      openPopover: false,
      filter: false,
      showBroadcasts: false,
      showDropDown: false
    }

    props.allLocales()
    props.loadUsersList({last_id: 'none', number_of_records: 10, first_page: true, filter: false, filter_criteria: {search_value: '', gender_value: '', locale_value: ''}})
    // props.loadBroadcastsGraphData(0)
    // props.loadPollsGraphData(0)
    // props.loadSurveysGraphData(0)
    // props.loadSessionsGraphData(0)
    props.fetchPlatformStats()
    // props.fetchAutopostingPlatformWise()
    props.fetchPlatformStatsMonthly()
    props.fetchPlatformStatsWeekly()
    props.fetchTopPages(10)

    this.displayData = this.displayData.bind(this)
    this.displayObjects = this.displayObjects.bind(this)
    this.searchUser = this.searchUser.bind(this)
    this.getFile = this.getFile.bind(this)
    this.onFilterByGender = this.onFilterByGender.bind(this)
    this.onFilterByLocale = this.onFilterByLocale.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.prepareLineChartData = this.prepareLineChartData.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.sendEmail = this.sendEmail.bind(this)
    this.loadMore = this.loadMore.bind(this)
    this.debounce = this.debounce.bind(this)
    this.setUsersView = this.setUsersView.bind(this)
  }

  setUsersView (user) {
    auth.putActingAsUser(user.domain_email, user.name)
    this.props.history.push({
      pathname: `/dashboard`
    })
  }

  loadMore () {
    this.props.loadUsersList({last_id: this.state.usersData.length > 0 ? this.state.usersData[this.state.usersData.length - 1]._id : 'none', number_of_records: 10, first_page: false, filter: this.state.filter, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.genderValue, locale_value: this.state.localeValue}})
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Operational Dashboard`
    this.scrollToTop()
    var typingTimer
    var doneTypingInterval = 300
    var self = this
    let myInput = document.getElementById('users_search')
    myInput.addEventListener('keyup', () => {
      clearTimeout(typingTimer)
      typingTimer = setTimeout(self.debounce, doneTypingInterval)
    })
  }
  handleClick (e) {
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false})
  }
  displayData (n, users) {
    this.setState({usersData: users, usersDataAll: users})
  }

  displayObjects (n, users) {
    var temp = []
    temp.push(users)
    this.setState({objects: users})
    this.setState({objectsLength: 1})
  }

  handleDate (d) {
    if (d) {
      let c = new Date(d)
      return c.toDateString()
    }
  }

  onDaysChange (e) {
    var defaultVal = 10
    var value = e.target.value
    this.setState({selectedDays: value})
    if (value && value !== '') {
      if (value.indexOf('.') !== -1) {
        value = Math.floor(value)
      }
      this.props.loadBroadcastsGraphData(value)
      this.props.loadPollsGraphData(value)
      this.props.loadSurveysGraphData(value)
    } else if (value === '') {
      this.setState({selectedDays: ''})
      this.props.loadBroadcastsGraphData(defaultVal)
      this.props.loadPollsGraphData(defaultVal)
      this.props.loadSurveysGraphData(defaultVal)
    }
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    console.log('UNSAFE_componentWillReceiveProps in backdoor', nextProps)
    if (nextProps.users && nextProps.count) {
      console.log('in nextProps.users')
      this.displayData(0, nextProps.users)
      this.setState({ totalLength: nextProps.count })
    } else {
      this.setState({usersData: [], usersDataAll: []})
    }
    if (nextProps.dataobjects && nextProps.dataobjects !== null) {
      this.displayObjects(0, nextProps.dataobjects)
    }
    if (nextProps.toppages) {
    }
    if (nextProps.broadcastsGraphData) {
      var graphInfoBroadcast = nextProps.broadcastsGraphData.broadcastsGraphInfo
      if (graphInfoBroadcast && graphInfoBroadcast.broadcastsgraphdata && graphInfoBroadcast.broadcastsgraphdata.length > 0) {
        var broadcastData = graphInfoBroadcast.broadcastsgraphdata
        broadcastData = this.includeZeroCounts(broadcastData)
      }
    }
    if (nextProps.pollsGraphData) {
      var graphInfoPolls = nextProps.pollsGraphData.pollsGraphInfo
      if (graphInfoPolls && graphInfoPolls.pollsgraphdata && graphInfoPolls.pollsgraphdata.length > 0) {
        var pollsData = graphInfoPolls.pollsgraphdata
        pollsData = this.includeZeroCounts(pollsData)
      }
    }
    if (nextProps.surveysGraphData) {
      var graphInfoSurveys = nextProps.surveysGraphData.surveysGraphInfo
      if (graphInfoSurveys && graphInfoSurveys.surveysgraphdata && graphInfoSurveys.surveysgraphdata.length > 0) {
        var surveysData = graphInfoSurveys.surveysgraphdata
        surveysData = this.includeZeroCounts(surveysData)
      }
    }
    if (nextProps.sessionsGraphData) {
      var graphInfoSessions = nextProps.sessionsGraphData.sessionsGraphInfo
      if (graphInfoSessions && graphInfoSessions.sessionsgraphdata && graphInfoSessions.sessionsgraphdata.length > 0) {
        var sessionsData = graphInfoSessions.sessionsgraphdata
        sessionsData = this.includeZeroCounts(sessionsData)
      }
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

  goToBroadcasts (user) {
    this.props.saveUserInformation(user)
    this.props.history.push({
      pathname: `/userDetails`,
      state: user
    })
  }
   debounce () {
     console.log('debounce function called')
     var value = document.getElementById('users_search').value
     console.log('value', value)
     this.setState({searchValue: value})
     if (value !== '') {
       this.setState({filter: true})
       this.props.loadUsersList({last_id: this.props.users.length > 0 ? this.props.users[this.props.users.length - 1]._id : 'none', number_of_records: 10, first_page: true, filter: true, filter_criteria: {search_value: value.toLowerCase(), gender_value: this.state.genderValue, locale_value: this.state.localeValue}})
     } else {
       this.props.loadUsersList({last_id: this.props.users.length > 0 ? this.props.users[this.props.users.length - 1]._id : 'none', number_of_records: 10, first_page: true, filter: true, filter_criteria: {search_value: '', gender_value: this.state.genderValue, locale_value: this.state.localeValue}})
     }
   }

  searchUser (event) {
  }

  getFile () {
    console.log('getFile')
    this.props.downloadFile()
  }

  onFilterByGender (e) {
    //  var filtered = []
    this.setState({genderValue: e.target.value})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true})
      this.props.loadUsersList({last_id: this.props.users.length > 0 ? this.props.users[this.props.users.length - 1]._id : 'none', number_of_records: 10, first_page: true, filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: e.target.value, locale_value: this.state.localeValue}})
    } else {
      this.props.loadUsersList({last_id: this.props.users.length > 0 ? this.props.users[this.props.users.length - 1]._id : 'none', number_of_records: 10, first_page: true, filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: '', locale_value: this.state.localeValue}})
    }
  }

  onFilterByLocale (e) {
    this.setState({localeValue: e.target.value})
    if (e.target.value !== '' && e.target.value !== 'all') {
      this.setState({filter: true})
      this.props.loadUsersList({last_id: this.props.users.length > 0 ? this.props.users[this.props.users.length - 1]._id : 'none', number_of_records: 10, first_page: true, filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.genderValue, locale_value: e.target.value}})
    } else {
      this.props.loadUsersList({last_id: this.props.users.length > 0 ? this.props.users[this.props.users.length - 1]._id : 'none', number_of_records: 10, first_page: true, filter: true, filter_criteria: {search_value: this.state.searchValue, gender_value: this.state.genderValue, locale_value: ''}})
    }
  }
  sendEmail () {
    this.props.sendEmail(this.msg)
  }
  render () {
    let alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-content'>
          { this.props.platformStats &&
            <PlatformStats platformStats={this.props.platformStats} monthlyPlatformStats={this.props.platformStatsMonthly} weeklyPlatformStats={this.props.platformStatsWeekly} history={this.props.history} location={this.props.location} />
          }
          <div className='row'>
            <AutopostingSummary backdoor={true} history={this.props.history} location={this.props.location} />
          </div>
          <div className='row'>
            <Reports
              history={this.props.history}
              location={this.props.location}
              iconClassName={'fa fa-line-chart'}
              title={'Reports'}
              lineChartData={this.state.chartData}
              onDaysChange={this.onDaysChange}
              selectedDays={this.state.selectedDays}
              week={this.props.platformStatsWeekly}
              month={this.props.platformStatsMonthly}
              />
          </div>
          <div className='row'>
            <Top10pages pagesData={this.props.toppages} history={this.props.history} location={this.props.location} />
            <div className='col-xl-12'>
              <div className='m-portlet m-portlet--full-height '>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>Users</h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                      <li className='nav-item m-tabs__item' style={{marginTop: '15px'}}>
                        <div className='m-input-icon m-input-icon--left'>
                          <input name='users_search' id='users_search' type='text' placeholder='Search Users...' className='form-control m-input m-input--solid' onChange={this.searchUser} />
                          <span className='m-input-icon__icon m-input-icon__icon--left'>
                            <span><i className='la la-search' /></span>
                          </span>
                        </div>
                      </li>
                      <li className=' nav-item m-tabs__item m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click' aria-expanded='true'>
                        <div id='target' ref={(b) => { this.target = b }} style={{marginTop: '18px', marginLeft: '10px', zIndex: 6}} className='align-center'>
                          <a href='#/' onClick={this.handleClick} style={{padding: 10 + 'px', cursor:'pointer'}}> <i className='flaticon flaticon-more' /> </a>
                          <Popover
                            style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
                            placement='bottom'
                            target={this.target}
                            show={this.state.openPopover}
                            onHide={this.handleClose} >
                            <div>
                              <div>
                                <label style={{color: '#716aca'}}>Filters:</label>
                                <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.genderValue} onChange={this.onFilterByGender}>
                                  <option key='Gender' value='' disabled>Filter by gender...</option>
                                  <option key='GenderALL' value='all'>All</option>
                                  {
                                  this.state.genders.map((gender, i) => (
                                    <option key={'Gender' + i} value={gender.value}>{gender.label}</option>
                                  ))
                                }
                                </select>
                                <br />
                                <select className='custom-select' id='m_form_type' tabIndex='-98' value={this.state.localeValue} onChange={this.onFilterByLocale} style={{marginTop: '10px', width: '155px'}}>
                                  <option key='' value='' disabled>Filter by Locale...</option>
                                  <option key='ALL' value='all'>ALL</option>
                                  {
                                  this.props.locales && this.props.locales.map((locale, i) => (
                                    <option key={i} value={locale}>{locale}</option>
                                  ))
                                }
                                </select>
                              </div>
                              <br />
                              <div>
                                <label style={{color: '#716aca'}}>Actions:</label>
                                <br />
                                <i className='la la-download' />&nbsp;<a href='#/' onClick={this.getFile} className='m-card-profile__email m-link' style={{cursor: 'pointer'}}>
                                Download Data
                              </a>
                                <br />
                                <i className='la la-envelope-o' />&nbsp;<a href='#/' onClick={this.sendEmail} className='m-card-profile__email m-link' style={{cursor: 'pointer', marginTop: '5px'}}>
                                Send Weekly Email
                              </a>
                                <br />
                              </div>
                            </div>
                          </Popover>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='tab-content'>
                    <div className='tab-pane active m-scrollable' role='tabpanel'>
                      <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                        <div style={{height: '393px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                          <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                            <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                              <div className='tab-pane active' id='m_widget5_tab1_content' aria-expanded='true'>
                                {
                                  this.state.usersData && this.state.usersData.length > 0
                                  ? <div className='m-widget5'>
                                    { this.state.usersData.map((user, i) => (
                                      <div className='m-widget5__item' key={i} style={{borderBottom: '.07rem dashed #ebedf2'}}>
                                        <div className='m-widget5__pic'>
                                          <img className='m-widget7__img' alt='pic' src={(user.facebookInfo) ? user.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} style={{height: '100px', borderRadius: '50%', width: '7rem'}} />
                                        </div>
                                        <div className='m-widget5__content'>
                                          <h4 className='m-widget5__title'>
                                            {user.name}
                                          </h4>
                                          {user.email &&
                                          <span className='m-widget5__desc'>
                                            <b>Email:</b> {user.email}
                                          </span>
                                          }
                                          <br />
                                          <span className='m-widget5__desc'>
                                            <b>Created At:</b> {this.handleDate(user.createdAt)}
                                          </span>
                                          <div className='m-widget5__info'>
                                            <span className='m-widget5__author'>
                                              Gender:&nbsp;
                                            </span>
                                            <span className='m-widget5__info-author m--font-info'>
                                              {user.facebookInfo ? user.facebookInfo.gender : ''}
                                            </span>
                                            <span className='m-widget5__info-label'>
                                            Locale:&nbsp;
                                            </span>
                                            <span className='m-widget5__info-author m--font-info'>
                                              {user.facebookInfo ? user.facebookInfo.locale : ''}
                                            </span>
                                          </div>
                                        </div>
                                        <div className='m-widget5__stats1'>
                                          <span className='m-widget5__number'>
                                            {user.pages}
                                          </span>
                                          <br />
                                          <span className='m-widget5__sales'>
                                            Connected Pages
                                          </span>
                                        </div>
                                        <div className='m-widget5__stats2'>
                                          <span className='m-widget5__number'>
                                            {user.subscribers}
                                          </span>
                                          <br />
                                          <span className='m-widget5__votes'>
                                            Total Subscribers
                                          </span>
                                        </div>
                                        <div className='m-widget5__stats2'>
                                          <br />
                                          <span className='m-widget5__votes'>
                                            <button onClick={() => this.goToBroadcasts(user)} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                             See more
                                           </button>
                                          </span>
                                        </div>
                                        <div className='m-widget5__stats2'>
                                          <br />
                                          <span className='m-widget5__votes'>
                                            <button onClick={() => this.setUsersView(user)} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                             User's View
                                           </button>
                                          </span>
                                        </div>
                                      </div>
                                        ))}
                                  </div>
                                    : <div>No Data to display</div>
                                    }
                                {this.state.usersData.length < this.props.count &&
                                <center>
                                  <i className='fa fa-refresh' style={{color: '#716aca'}} />&nbsp;
                                  <a href='#/' id='assignTag' className='m-link' style={{color: '#716aca', cursor: 'pointer', marginTop: '20px'}} onClick={this.loadMore}>Load More</a>
                                </center>
                                }
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
          </div>
          <CompanyInfo history={this.props.history} location={this.props.location} />
          <BroadcastsByDays history={this.props.history} location={this.props.location} />
          <SurveysByDays history={this.props.history} location={this.props.location} />
          <PollsByDays history={this.props.history} location={this.props.location} />
          <UniquePages history={this.props.history} location={this.props.location} />
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log('in mapStateToProps', state)
  return {
    users: (state.backdoorInfo.users),
    count: (state.backdoorInfo.count),
    locales: (state.backdoorInfo.locales),
    currentUser: (state.backdoorInfo.currentUser),
    dataobjects: (state.backdoorInfo.dataobjects),
    toppages: state.backdoorInfo.kiboTopPages,
    broadcastsGraphData: (state.backdoorInfo),
    pollsGraphData: (state.backdoorInfo),
    surveysGraphData: (state.backdoorInfo),
    sessionsGraphData: (state.backdoorInfo),
    platformStats: state.backdoorInfo.platformStatsInfo,
    autopostingStats: state.backdoorInfo.autopostingStatsInfo,
    platformStatsWeekly: state.backdoorInfo.weeklyPlatformStats,
    platformStatsMonthly: state.backdoorInfo.monthlyPlatformStats
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadUsersList,
    saveUserInformation,
    downloadFile,
    loadBroadcastsGraphData,
    loadSurveysGraphData,
    loadPollsGraphData,
    loadSessionsGraphData,
    sendEmail,
    allLocales,
    fetchPlatformStats,
    fetchPlatformStatsDateWise,
    fetchUserStats,
    fetchUserStatsDateWise,
    fetchOneUserStats,
    fetchOneUserStatsDateWise,
    fetchPageStats,
    fetchPageStatsDateWise,
    fetchOnePageStats,
    fetchOnePageStatsDateWise,
    fetchTopPages,
    fetchAutopostingPlatformWise,
    fetchAutopostingPlatformWiseDateWise,
    fetchAutopostingUserWise,
    fetchAutopostingUserWiseDateWise,
    fetchPlatformStatsMonthly,
    fetchPlatformStatsWeekly
  },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OperationalDashboard)
