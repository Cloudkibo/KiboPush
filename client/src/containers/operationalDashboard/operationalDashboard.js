/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import DataObjectsCount from './dataObjectsCount'
import SurveysByDays from './surveysByDays'
import BroadcastsByDays from './broadcastsByDays'
import PollsByDays from './pollsByDays'
import Top10pages from './top10pages'
import Reports from './reports'
import Select from 'react-select'
//  import ListItem from './ListItem'
import moment from 'moment'
import { Link } from 'react-router'
import Popover from 'react-simple-popover'
import {
  loadUsersList,
  loadDataObjectsCount,
  loadTopPages,
  saveUserInformation,
  downloadFile,
  loadBroadcastsGraphData,
  loadPollsGraphData,
  loadSurveysGraphData,
  loadSessionsGraphData,
  sendEmail
} from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

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
      selectedValue: 0,
      showTopTenPages: false,
      showReports: false,
      showUsers: false,
      chartData: [],
      selectedDays: 10,
      openPopover: false
    }
    props.loadDataObjectsCount(0)
    props.loadTopPages()
    props.loadBroadcastsGraphData(0)
    props.loadPollsGraphData(0)
    props.loadSurveysGraphData(0)
    props.loadSessionsGraphData(0)
    props.loadUsersList()
    this.displayData = this.displayData.bind(this)
    this.displayObjects = this.displayObjects.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchUser = this.searchUser.bind(this)
    this.getFile = this.getFile.bind(this)
    this.logChange = this.logChange.bind(this)
    this.onFilterByGender = this.onFilterByGender.bind(this)
    this.onFilterByLocale = this.onFilterByLocale.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.prepareLineChartData = this.prepareLineChartData.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.sendEmail = this.sendEmail.bind(this)
  }
  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }
  componentDidMount () {
    document.title = 'KiboPush | Operational Dashboard'
    this.scrollToTop()
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

  handlePageClick (data) {
    this.displayData(data.selected, this.state.usersDataAll)
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
  componentWillReceiveProps (nextProps) {
    if (nextProps.users) {
      this.displayData(0, nextProps.users)
      this.setState({ totalLength: nextProps.users.length })
    }
    if (nextProps.dataobjects !== null) {
      this.displayObjects(0, nextProps.dataobjects)
    }
    if (nextProps.toppages) {
    }
    if (nextProps.broadcastsGraphData) {
      var graphInfoBroadcast = nextProps.broadcastsGraphData.broadcastsGraphInfo
      if (graphInfoBroadcast.broadcastsgraphdata && graphInfoBroadcast.broadcastsgraphdata.length > 0) {
        var broadcastData = graphInfoBroadcast.broadcastsgraphdata
        broadcastData = this.includeZeroCounts(broadcastData)
      }
    }
    if (nextProps.pollsGraphData) {
      var graphInfoPolls = nextProps.pollsGraphData.pollsGraphInfo
      if (graphInfoPolls.pollsgraphdata && graphInfoPolls.pollsgraphdata.length > 0) {
        var pollsData = graphInfoPolls.pollsgraphdata
        pollsData = this.includeZeroCounts(pollsData)
      }
    }
    if (nextProps.surveysGraphData) {
      var graphInfoSurveys = nextProps.surveysGraphData.surveysGraphInfo
      if (graphInfoSurveys.surveysgraphdata && graphInfoSurveys.surveysgraphdata.length > 0) {
        var surveysData = graphInfoSurveys.surveysgraphdata
        surveysData = this.includeZeroCounts(surveysData)
      }
    }
    if (nextProps.sessionsGraphData) {
      var graphInfoSessions = nextProps.sessionsGraphData.sessionsGraphInfo
      if (graphInfoSessions.sessionsgraphdata && graphInfoSessions.sessionsgraphdata.length > 0) {
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
    // browserHistory.push(`/viewsurveydetail/${survey._id}`)
  }

  searchUser (event) {
    var filtered = []
    for (let i = 0; i < this.props.users.length; i++) {
      if (this.props.users[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        filtered.push(this.props.users[i])
      }
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  getFile () {
    this.props.downloadFile()
  }

  logChange (e) {
    if (!e.target.value) {
      this.setState({selectedValue: null})
      this.props.loadDataObjectsCount(0)
    } else if (e.target.value === '10') {
      this.setState({selectedValue: e.target.value})
      this.props.loadDataObjectsCount(10)
    } else if (e.target.value === '30') {
      this.setState({ selectedValue: e.target.value })
      this.props.loadDataObjectsCount(30)
    } else if (e.target.value === 'all') {
      this.setState({ selectedValue: e.target.value })
      this.props.loadDataObjectsCount(0)
    }
  }
  onFilterByGender (e) {
    var filtered = []
    if (!e.target.value) {
      if (this.state.localeValue !== '') {
        for (var a = 0; a < this.props.users.length; a++) {
          if (this.props.users[a].locale === this.state.localeValue) {
            filtered.push(this.props.users[a])
          }
        }
      } else {
        filtered = this.props.users
      }
      this.setState({genderValue: ''})
    } else {
      if (this.state.localeValue !== '') {
        for (var i = 0; i < this.props.users.length; i++) {
          if (this.props.users[i].gender === e.target.value && this.props.users[i].locale === this.state.localeValue) {
            filtered.push(this.props.users[i])
          }
        }
      } else if (e.target.value === 'all') {
        filtered = this.props.users
      } else {
        for (var j = 0; j < this.props.users.length; j++) {
          if (this.props.users[j].gender.toString() === e.target.value.toString()) {
            filtered.push(this.props.users[j])
          }
        }
      }
      this.setState({genderValue: e.target.value})
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilterByLocale (data) {
    var filtered = []
    if (!data) {
      if (this.state.genderValue !== '') {
        for (var a = 0; a < this.props.users.length; a++) {
          if (this.props.users[a].gender === this.state.genderValue) {
            filtered.push(this.props.users[a])
          }
        }
      } else {
        filtered = this.props.users
      }
      this.setState({localeValue: ''})
    } else {
      if (this.state.genderValue !== '') {
        for (var i = 0; i < this.props.users.length; i++) {
          if (this.props.users[i].gender === this.state.genderValue && this.props.users[i].locale === data.value) {
            filtered.push(this.props.users[i])
          }
        }
      } else {
        for (var j = 0; j < this.props.users.length; j++) {
          if (this.props.users[j].locale === data.value) {
            filtered.push(this.props.users[j])
          }
        }
      }
      this.setState({localeValue: data.value})
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }
  sendEmail () {
    this.props.sendEmail(this.msg)
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
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              { this.state.objectsLength > 0 &&
                <DataObjectsCount objectsData={this.state.objects} length={this.state.objectsLength} logChange={this.logChange} selectedValue={this.state.selectedValue} options={this.state.options} />
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
                <Top10pages pagesData={this.props.toppages} />
                <div className='col-xl-6'>
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
                              <input type='text' placeholder='Search Users...' className='form-control m-input m-input--solid' onChange={this.searchUser} />
                              <span className='m-input-icon__icon m-input-icon__icon--left'>
                                <span><i className='la la-search' /></span>
                              </span>
                            </div>
                          </li>
                          <li className=' nav-item m-tabs__item m-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click' aria-expanded='true'>
                            <div id='target' ref={(b) => { this.target = b }} style={{marginTop: '18px', marginLeft: '10px', zIndex: 6}} className='align-center'>
                              <Link onClick={this.handleClick} style={{padding: 10 + 'px'}}> <i className='flaticon flaticon-more' /> </Link>
                              <Popover
                                style={{boxShadow: '0 8px 16px 0 rgba(0,0,0,0.2)', borderRadius: '5px', zIndex: 25}}
                                placement='bottom'
                                target={this.target}
                                show={this.state.openPopover}
                                onHide={this.handleClose} >
                                <select className='custom-select' id='m_form_status' tabIndex='-98' value={this.state.genderValue} onChange={this.onFilterByGender}>
                                  <option value='' disabled>Filter by gender...</option>
                                  <option value=''>All</option>
                                  {
                                    this.state.genders.map((gender, i) => (
                                      <option value={gender.value}>{gender.label}</option>
                                    ))
                                  }
                                </select>
                                <br />
                                <Select
                                  name='form-field-name'
                                  options={this.props.locales}
                                  onChange={this.onFilterByLocale}
                                  placeholder='Filter by locale...'
                                  value={this.state.localeValue}
                                />
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
                                  <div className='tab-content'>
                                    <div className='tab-pane active' id='m_widget4_tab1_content'>
                                      {
                                        this.state.usersData && this.state.usersData.length > 0
                                      ? <div className='m-widget4'>
                                        {
                                           this.state.usersData.map((user, i) => (
                                             <div className='m-widget4__item' key={i}>
                                               <div className='m-widget4__img m-widget4__img--pic'>
                                                 <img alt='pic' src={(user.facebookInfo) ? user.facebookInfo.profilePic : 'icons/users.jpg'} />
                                               </div>
                                               <div className='m-widget4__info'>
                                                 <span className='m-widget4__title'>
                                                   {user.name}
                                                 </span>
                                                 {user.email &&
                                                   <br /> }
                                                 {user.email &&
                                                   <span className='m-widget4__sub'>
                                                        Email: {user.email}
                                                   </span>
                                                 }
                                                 <br />
                                                 <span className='m-widget4__sub'>
                                                    Created At: {this.handleDate(user.createdAt)}
                                                 </span>
                                                 <br />
                                                 <span className='m-widget4__sub'>
                                                    Gender: {user.facebookInfo ? user.facebookInfo.gender : ''}
                                                 </span>
                                                 <span className='m-widget4__sub' style={{float: 'right'}}>
                                                    Locale: {user.facebookInfo ? user.facebookInfo.locale : ''}
                                                 </span>
                                               </div>
                                               <div className='m-widget4__ext'>
                                                 <button onClick={() => this.goToBroadcasts(user)} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary'>
                                                  See more
                                                </button>
                                               </div>
                                             </div>
                                              ))}
                                      </div>
                                      : <div>No Data to display</div>
                                      }
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='pull-right' style={{display: 'inline-block', paddingTop: '40px'}} onClick={this.getFile}>
                          <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                            <label>Get data in CSV file: </label>
                          </div>
                          <div style={{display: 'inline-block', marginLeft: '10px'}}>
                            <i style={{cursor: 'pointer'}} className='fa fa-download fa-2x' />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <BroadcastsByDays />
              <SurveysByDays />
              <PollsByDays />
              <button className='btn btn-success m-btn m-btn--icon pull-right' onClick={this.sendEmail}>Send Weekly Email
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  console.log('in mapStateToProps', state)
  return {
    users: (state.backdoorInfo.users),
    locales: (state.backdoorInfo.locales),
    currentUser: (state.backdoorInfo.currentUser),
    dataobjects: (state.backdoorInfo.dataobjects),
    toppages: (state.backdoorInfo.toppages),
    broadcastsGraphData: (state.backdoorInfo),
    pollsGraphData: (state.backdoorInfo),
    surveysGraphData: (state.backdoorInfo),
    sessionsGraphData: (state.backdoorInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadUsersList: loadUsersList,
    loadDataObjectsCount: loadDataObjectsCount,
    loadTopPages: loadTopPages,
    saveUserInformation: saveUserInformation,
    downloadFile: downloadFile,
    loadBroadcastsGraphData: loadBroadcastsGraphData,
    loadSurveysGraphData: loadSurveysGraphData,
    loadPollsGraphData: loadPollsGraphData,
    loadSessionsGraphData: loadSessionsGraphData,
    sendEmail: sendEmail},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OperationalDashboard)
