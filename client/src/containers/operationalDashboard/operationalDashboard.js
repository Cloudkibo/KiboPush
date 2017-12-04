/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import DataObjectsCount from './dataObjectsCount'
import Top10pages from './top10pages'
import Reports from './reports'
import Select from 'react-select'
import ListItem from './ListItem'
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
  loadSurveysGraphData
} from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

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
    props.loadUsersList()
    this.displayData = this.displayData.bind(this)
    this.displayObjects = this.displayObjects.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchUser = this.searchUser.bind(this)
    this.getFile = this.getFile.bind(this)
    this.logChange = this.logChange.bind(this)
    this.showContent = this.showContent.bind(this)
    this.hideContent = this.hideContent.bind(this)
    this.onFilterByGender = this.onFilterByGender.bind(this)
    this.onFilterByLocale = this.onFilterByLocale.bind(this)
    this.handleDate = this.handleDate.bind(this)
    this.prepareLineChartData = this.prepareLineChartData.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.includeZeroCounts = this.includeZeroCounts.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
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
    document.title = 'KiboPush | Operational Dashboard'
  }

  handleClick (e) {
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false})
  }
  displayData (n, users) {
    console.log('one', users)
    let data = []
    let offset = n * 5
    let limit
    let index = 0
    if ((offset + 5) > users.length) {
      limit = users.length
    } else {
      limit = offset + 5
    }
    for (var i = offset; i < limit; i++) {
      data[index] = users[i]
      index++
    }
    this.setState({usersData: data, usersDataAll: users})
    console.log('in displayData', this.state.usersData)
  }

  displayObjects (n, users) {
    console.log('users', users)
    var temp = []
    temp.push(users)
    console.log('temp', temp)
    this.setState({objects: users})
    console.log('new object', this.state.objects)
    this.setState({objectsLength: 1})

    // this.setState({objectsData: temp}, () => {
    //   console.log('inside', this.state.objectsData)
    // }
    // )
    // this.setState({objectsLength: 1})
    // console.log('in displayData of diplayObjects1', this.state.objectsData)
    // console.log('in displayData of diplayObjects2', this.state.objectsData[0].PagesCount)
  //  console.log('in displayData of diplayObjects3', this.state.objectsData[0].PagesCount.count)
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
    console.log('On days change', value)
    if (value && value !== '') {
      if (value.indexOf('.') !== -1) {
        value = Math.floor(value)
      }
      this.props.loadBroadcastsGraphData(value)
      this.props.loadPollsGraphData(value)
      this.props.loadSurveysGraphData(value)
    } else if (value === '') {
      this.setState({selectedDays: defaultVal})
      this.props.loadBroadcastsGraphData(defaultVal)
      this.props.loadPollsGraphData(defaultVal)
      this.props.loadSurveysGraphData(defaultVal)
    }
  }
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.users) {
      console.log('Users Updated', nextProps.users)
      this.displayData(0, nextProps.users)
      this.setState({ totalLength: nextProps.users.length })
    }
    if (nextProps.dataobjects !== null) {
      console.log('data objects Updated', nextProps.dataobjects)
      this.displayObjects(0, nextProps.dataobjects)
    }
    if (nextProps.toppages) {
      console.log('top pages Updated', nextProps.toppages)
    }
    /*
    if (nextProps.broadcastsGraphData) {
      console.log('Broadcasts Graph Data', nextProps.broadcastsGraphData.broadcastsGraphInfo)
      var graphInfoBroadcast = nextProps.broadcastsGraphData.broadcastsGraphInfo
      if (graphInfoBroadcast.broadcastsgraphdata && graphInfoBroadcast.broadcastsgraphdata.length > 0) {
        var broadcastData = graphInfoBroadcast.broadcastsgraphdata
        broadcastData = this.includeZeroCounts(broadcastData)
      }
    }
    if (nextProps.pollsGraphData) {
      console.log('Polls Graph Data', nextProps.pollsGraphData.pollsGraphInfo)
      var graphInfoPolls = nextProps.pollsGraphData.pollsGraphInfo
      if (graphInfoPolls.pollsgraphdata && graphInfoPolls.pollsgraphdata.length > 0) {
        var pollsData = graphInfoPolls.pollsgraphdata
        pollsData = this.includeZeroCounts(pollsData)
      }
    }
    if (nextProps.surveysGraphData) {
      console.log('Surveys Graph Data', nextProps.surveysGraphData.surveysGraphInfo)
      var graphInfoSurveys = nextProps.surveysGraphData.surveysGraphInfo
      if (graphInfoSurveys.surveysgraphdata && graphInfoSurveys.surveysgraphdata.length > 0) {
        var surveysData = graphInfoSurveys.surveysgraphdata
        surveysData = this.includeZeroCounts(surveysData)
      }
    }
    var dataChart = this.prepareLineChartData(surveysData, pollsData, broadcastData)
    this.setState({chartData: dataChart}) */
  }
  includeZeroCounts (data) {
    var dataArray = []
    var days = this.state.selectedDays
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
    return dataArray
  }
  prepareLineChartData (surveys, polls, broadcasts) {
    var dataChart = []
    if (surveys) {
      for (var i = 0; i < surveys.length; i++) {
        var record = {}
        record.date = surveys[i].date
        record.broadcastscount = broadcasts[i].count
        record.pollscount = polls[i].count
        record.surveyscount = surveys[i].count
        dataChart.push(record)
      }
    }
    return dataChart
  }

  goToBroadcasts (user) {
    console.log(this.props.user)
    this.props.saveUserInformation(user)
    this.props.history.push({
      pathname: `/userDetails`,
      state: user
    })
    console.log('State', this.state)
    console.log('goToBroadcasts', user._id, user.name)
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

  logChange (val) {
    console.log('Selected: ' + JSON.stringify(val))
    if (!val) {
      this.setState({selectedValue: null})
      this.props.loadDataObjectsCount(0)
    } else if (val.value === 10) {
      console.log('Selected:', val.value)
      this.setState({selectedValue: val.value})
      this.props.loadDataObjectsCount(val.value)
    } else if (val.value === 30) {
      this.setState({ selectedValue: val.value })
      this.props.loadDataObjectsCount(val.value)
    }
  }

  showContent (title) {
    if (title === 'Top Ten Pages') {
      this.setState({showTopTenPages: true})
    } else if (title === 'Reports') {
      this.setState({showReports: true})
    } else {
      this.setState({showUsers: true})
    }
  }

  hideContent (title) {
    if (title === 'Top Ten Pages') {
      this.setState({showTopTenPages: false})
    } else if (title === 'Reports') {
      this.setState({showReports: false})
    } else {
      this.setState({showUsers: false})
    }
  }

  onFilterByGender (data) {
    var filtered = []
    if (!data) {
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
          if (this.props.users[i].gender === data.value && this.props.users[i].locale === this.state.localeValue) {
            filtered.push(this.props.users[i])
          }
        }
      } else {
        for (var j = 0; j < this.props.users.length; j++) {
          if (this.props.users[j].gender === data.value) {
            filtered.push(this.props.users[j])
          }
        }
      }
      this.setState({genderValue: data.value})
    }
    this.displayData(0, filtered)
    this.setState({ totalLength: filtered.length })
  }

  onFilterByLocale (data) {
    console.log(data)
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

  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>
                { this.state.objectsLength > 0 &&
                  <DataObjectsCount objectsData={this.state.objects} length={this.state.objectsLength} />
                }
              </div>
              <div className='row'>
                { this.state.showReports
                ? <Reports
                  iconClassName={'fa fa-line-chart'}
                  title={'Reports'}
                  hideContent={this.hideContent}
                  lineChartData={this.state.chartData}
                  onDaysChange={this.onDaysChange}
                  selectedDays={this.state.selectedDays}
                />
                : <ListItem iconClassName={'fa fa-line-chart'} title={'Reports'} showContent={this.showContent} />
            }
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
                                <Select
                                  name='form-field-name'
                                  options={this.state.genders}
                                  onChange={this.onFilterByGender}
                                  placeholder='Filter by gender...'
                                  value={this.state.genderValue}
                                />
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
                                             <div className='m-widget4__item'>
                                               <div className='m-widget4__img m-widget4__img--pic'>
                                                 <img alt='pic' src={(user.profilePic) ? user.profilePic : ''} />
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
                                                    Gender: {user.gender}
                                                 </span>
                                                 <span className='m-widget4__sub' style={{float: 'right', marginRight: '100px'}}>
                                                    Locale: {user.locale}
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
  console.log('in mapStateToProps', state)
  return {
    users: (state.UsersInfo.users),
    locales: (state.UsersInfo.locales),
    currentUser: (state.getCurrentUser.currentUser),
    dataobjects: (state.dataObjectsInfo.dataobjects),
    toppages: (state.topPagesInfo.toppages),
    broadcastsGraphData: (state.broadcastsGraphInfo),
    pollsGraphData: (state.pollsGraphInfo),
    surveysGraphData: (state.surveysGraphInfo)
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
    loadPollsGraphData: loadPollsGraphData},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OperationalDashboard)
