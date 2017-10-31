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
import Select from 'react-select'

//  import { Link } from 'react-router'
import ReactPaginate from 'react-paginate'
import {
  loadUsersList,
  loadDataObjectsCount,
  loadTopPages,
  saveUserInformation,
  downloadFile
} from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { handleDate } from '../../utility/utils'

class OperationalDashboard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      usersData: [],
      objectsData: [],
      objects: {},
      pagesData: [],
      totalLength: 0,
      objectsLength: 0,
      pagesLength: 0,
      options: [
        { value: 10, label: '10 days' },
        { value: 30, label: '30 days' }],
      selectedValue: 0
    }
    props.loadUsersList()
    props.loadDataObjectsCount(0)
    props.loadTopPages()
    this.displayData = this.displayData.bind(this)
    this.displayObjects = this.displayObjects.bind(this)
    this.displayPages = this.displayPages.bind(this)
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.searchUser = this.searchUser.bind(this)
    this.getFile = this.getFile.bind(this)
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
  }
  displayData (n, users) {
    console.log('one', users)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > users.length) {
      limit = users.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = users[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({usersData: data})
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
  displayPages (n, users) {
    console.log('one', users)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > users.length) {
      limit = users.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = users[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({pagesData: data})
    console.log('in displayData', this.state.pagesData)
  }
  handlePageClick (data) {
    this.displayData(data.selected, this.props.users)
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
      this.displayPages(0, nextProps.toppages)
      this.setState({ pagesLength: nextProps.toppages.length })
    }
  }
  handleClickEvent (data) {
    console.log('handle click event', data)
    this.displayPages(data.selected, this.props.toppages)
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
    if (filtered && filtered.length > 0) {
      this.displayData(0, filtered)
      this.setState({ totalLength: filtered.length })
    }
  }
  getFile () {
    this.props.downloadFile()
  }
  logChange (val) {
    console.log('Selected: ' + JSON.stringify(val))

    if (val.value === 10) {
      console.log('Selected:', val.value)
      //this.setState({selectedValue: val.value})
      loadDataObjectsCount(val.value)
    } else if (val.value === 30) {
    //  this.setState({ selectedValue: val.value })
      loadDataObjectsCount(val.value)
    }
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
          <Select
            name='form-field-name'
            options={this.state.options}
            onChange={this.logChange}
            placeholder='Filter by last:'
            value={this.state.selectedValue}
          />
          <button className='btn btn-primary btn-sm' onClick={() => this.getFile()}>Download File
          </button>
          <DataObjectsCount objectsData={this.state.objects} length={this.state.objectsLength} />
          <Top10pages pagesData={this.state.pagesData} length={this.state.pagesLength} handleClickEvent={this.handleClickEvent} />
          <div className='row'>
            <main
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='ui-block'>
                <div className='birthday-item inline-items badges'>
                  { this.state.usersData && this.state.usersData.length > 0
                  ? <div className='table-responsive'>
                    <div>
                      <label> Users </label>
                      <input type='text' placeholder='Search Users' className='form-control' onChange={this.searchUser} />
                    </div>
                    <table className='table table-striped'>
                      <thead>
                        <tr>
                          <th>Profile Pic</th>
                          <th>Users</th>
                          <th>Email</th>
                          <th>Gender</th>
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
                            <td>{handleDate(user.createdAt)}</td>
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
                  : <div className='table-responsive'>
                    <p> No data to display </p>
                  </div>
                }
                </div>
              </div>

            </main>

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
    currentUser: (state.getCurrentUser.currentUser),
    dataobjects: (state.dataObjectsInfo.dataobjects),
    toppages: (state.topPagesInfo.toppages)

  //  usersData: state.usersData
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadUsersList: loadUsersList,
    loadDataObjectsCount: loadDataObjectsCount,
    loadTopPages: loadTopPages,
    saveUserInformation: saveUserInformation,
    downloadFile: downloadFile },
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(OperationalDashboard)
