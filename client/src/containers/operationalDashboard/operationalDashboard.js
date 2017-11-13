/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import DataObjectsCount from './dataObjectsCount'
import Top10pages from './top10pages'
import Reports from './reports'
import Select from 'react-select'
import ListItem from './ListItem'
//  import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'
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
      lineChartData: [
        { date: '21 FEB', month: 'feb', year: '2017', chats: 10 },
        { date: '22 FEB', month: 'feb', year: '2017', chats: 12 },
        { date: '29 FEB', month: 'feb', year: '2017', chats: 20 },
        { date: '30 FEB', month: 'feb', year: '2017', chats: 11 },
        { date: '1 JAN', month: 'feb', year: '2017', chats: 9 },
        { date: '2 JAN', month: 'feb', year: '2017', chats: 2 },
        { date: '3 JAN', month: 'feb', year: '2017', chats: 11 }
      ],
      chartData: []
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
    this.prepareLineCharData = this.prepareLineCharData.bind(this)
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
    if (nextProps.broadcastsGraphData) {
      console.log('Broadcasts Graph Data', nextProps.broadcastsGraphData.broadcastsGraphInfo)
      var graphInfo = nextProps.broadcastsGraphData.broadcastsGraphInfo
      if (graphInfo.broadcastsgraphdata.length > 0) {
        var dataChart = this.prepareLineCharData(graphInfo.broadcastsgraphdata)
        console.log(dataChart)
        this.setState({chartData: dataChart})
      }
    }
    if (nextProps.pollsGraphData) {
      console.log('Polls Graph Data', nextProps.pollsGraphData.pollsGraphInfo)
    }
    if (nextProps.surveysGraphData) {
      console.log('Surveys Graph Data', nextProps.surveysGraphData.surveysGraphInfo)
    }
  }
  prepareLineCharData (data) {
    var dataChart = []
    var records = data
    records.map((record) => {
      var recordId = record._id
      var date = recordId.day + '/' + recordId.month + '/' + recordId.year
      var count = record.count
      var chartRecord = { date: date, broadcastscount: count }
      dataChart.push(chartRecord)
    })
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
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <div className='ui-block'>
            <div className='ui-block-content'>
              <div className='ui-block'>
                <div className='ui-block-content'>
                  <Select
                    name='form-field-name'
                    options={this.state.options}
                    onChange={this.logChange}
                    placeholder='Filter by last:'
                    value={this.state.selectedValue}
                    clearValueText='Filter by:'
                  />
                  <br />
                  <DataObjectsCount objectsData={this.state.objects} length={this.state.objectsLength} />
                </div>
              </div>
              <br />
              {
                this.state.showTopTenPages
                ? <Top10pages
                  iconClassName={'fa fa-facebook'}
                  title={'Top Ten Pages'}
                  hideContent={this.hideContent}
                  pagesData={this.props.toppages}
                />
                : <ListItem iconClassName={'fa fa-facebook'} title={'Top Ten Pages'} showContent={this.showContent} />
              }
              {
                this.state.showReports
                ? <Reports
                  iconClassName={'fa fa-line-chart'}
                  title={'Reports'}
                  hideContent={this.hideContent}
                  lineChartData={this.state.chartData}
                />
                : <ListItem iconClassName={'fa fa-line-chart'} title={'Reports'} showContent={this.showContent} />
              }
              {
                this.state.showUsers
                ? <div style={{boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', margin: '10px', borderRadius: '5px', border: '1px solid #ccc'}} className='card'>
                  <div style={{width: '100%', padding: '1rem'}} className='card-block'>
                    <div style={{display: 'inline-block', padding: '20px'}}>
                      <h4 className='card-title'><i className='fa fa-users' aria-hidden='true' /> Users</h4>
                    </div>
                    <div className='pull-right' style={{display: 'inline-block', padding: '10px'}}>
                      <div style={{width: '100%', textAlign: 'center'}}>
                        <div onClick={() => this.hideContent('Users')} style={{cursor: 'pointer', display: 'inline-block', padding: '10px'}}>
                          <h4><i className='fa fa-chevron-circle-up' aria-hidden='true' /></h4>
                        </div>
                        <div style={{display: 'inline-block', padding: '10px'}} />
                      </div>
                    </div>
                    <div className='row'>
                      <main className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                        {
                          this.props.users && this.props.users.length > 0
                          ? <div className='table-responsive'>
                            <form>
                              <div className='form-row' style={{display: 'flex'}}>
                                <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                                  <label> Search </label>
                                  <input type='text' placeholder='Search Users...' className='form-control' onChange={this.searchUser} />
                                </div>
                                <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                                  <label> Gender </label>
                                  <Select
                                    name='form-field-name'
                                    options={this.state.genders}
                                    onChange={this.onFilterByGender}
                                    placeholder='Filter by gender...'
                                    value={this.state.genderValue}
                                  />
                                </div>
                                <div style={{display: 'inline-block'}} className='form-group col-md-4'>
                                  <label> Locale </label>
                                  <Select
                                    name='form-field-name'
                                    options={this.props.locales}
                                    onChange={this.onFilterByLocale}
                                    placeholder='Filter by locale...'
                                    value={this.state.localeValue}
                                  />
                                </div>
                              </div>
                            </form>
                            {
                              this.state.usersData && this.state.usersData.length > 0
                              ? <div>
                                <table className='table table-striped'>
                                  <thead>
                                    <tr>
                                      <th>Profile Pic</th>
                                      <th>Users</th>
                                      <th>Email</th>
                                      <th>Gender</th>
                                      <th>Locale</th>
                                      <th>Created At</th>
                                      <th />
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {
                                      this.state.usersData.map((user, i) => (
                                        <tr>
                                          <td><img alt='pic'
                                            src={(user.profilePic) ? user.profilePic : ''}
                                            className='img-circle' width='60' height='60' /></td>
                                          <td>{user.name}</td>
                                          <td>{user.email}</td>
                                          <td>{user.gender}</td>
                                          <td>{user.locale}</td>
                                          <td>{this.handleDate(user.createdAt)}</td>
                                          <td>
                                            <button className='btn btn-primary btn-sm'
                                              style={{float: 'left', margin: 2}} onClick={() => this.goToBroadcasts(user)}>See more
                                            </button>
                                          </td>
                                        </tr>
                                      ))
                                    }
                                  </tbody>
                                </table>
                                <div>
                                  <div style={{display: 'inline-block'}}>
                                    <ReactPaginate previousLabel={'previous'}
                                      nextLabel={'next'}
                                      breakLabel={<a>...</a>}
                                      breakClassName={'break-me'}
                                      pageCount={Math.ceil(this.state.totalLength / 5)}
                                      marginPagesDisplayed={2}
                                      pageRangeDisplayed={3}
                                      onPageChange={this.handlePageClick}
                                      containerClassName={'pagination'}
                                      subContainerClassName={'pages pagination'}
                                      activeClassName={'active'} />
                                  </div>
                                  <div className='pull-right' style={{display: 'inline-block', paddingTop: '40px'}}>
                                    <div style={{display: 'inline-block', verticalAlign: 'middle'}}>
                                      <label>Get data in CSV file: </label>
                                    </div>
                                    <div style={{display: 'inline-block', marginLeft: '10px'}}>
                                      <i style={{cursor: 'pointer'}} className='fa fa-download fa-2x' onClick={() => this.getFile()} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              : <p> No search results found. </p>
                            }
                          </div>
                          : <div className='table-responsive'>
                            <p> No data to display </p>
                          </div>
                        }
                      </main>
                    </div>
                  </div>
                </div>
                : <ListItem iconClassName={'fa fa-users'} title={'Users'} showContent={this.showContent} />
              }
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
