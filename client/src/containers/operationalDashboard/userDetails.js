import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import PagesInfo from './userPages'
import BroadcastsInfo from './userBroadcasts'
import SurveysInfo from './userSurveys'
import PollsInfo from './userPolls'
import { loadPagesList } from '../../redux/actions/backdoor.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

class UserDetails extends React.Component {
  constructor (props, context) {
    super(props, context)
    console.log('constructor UserDetails', this.props.location.state._id)
    console.log('constructor', this.props)
    const userID = this.props.location.state._id
    props.loadPagesList(userID)
    this.state = {
      pagesData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handleClickEvent = this.handleClickEvent.bind(this)
    this.search = this.search.bind(this)
  }

<<<<<<< HEAD
 search (event, name) {
   console.log(name)
=======
  searchPage (event) {
>>>>>>> a2900c9d850358798db6722ee6a69519fdf5cd10
    var filtered = []
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageName.toLowerCase().includes(event.target.value) || this.props.pages[i].pageName.toUpperCase().includes(event.target.value) || this.props.pages[i].pageName.includes(event.target.value)) {
        filtered.push(this.props.pages[i])
      }
    }
    if (filtered && filtered.length > 0) {
      this.displayData(0, filtered)
      this.setState({ totalLength: this.state.pagesData.length })
    }
  }

  displayData (n, pages) {
    console.log(n, pages)
    let offset = n * 4
    let data = []
    let limit
    let index = 0
    if ((offset + 4) > pages.length) {
      limit = pages.length
    } else {
      limit = offset + 4
    }
    for (var i = offset; i < limit; i++) {
      data[index] = pages[i]
      index++
    }
    console.log('data[index]', data)
    this.setState({pagesData: data})
    console.log('in displayData', this.state.pagesData)
  }

  handleClickEvent (data) {
    console.log(data.name)
    this.displayData(data.selected, this.props.pages)
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
    if (nextProps.pages) {
      console.log('Pages Updated', nextProps.pages)
      this.displayData(0, nextProps.pages)
      this.setState({ totalLength: nextProps.pages.length })
    }
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

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <h3>{this.props.location.state.name}</h3>
<<<<<<< HEAD
          <PagesInfo pages={this.state.pagesData} length={this.state.totalLength} handlePageClick={this.handleClickEvent} displayData={this.displayData} search ={this.search} />
=======
          <PagesInfo pages={this.state.pagesData} length={this.state.totalLength} handlePageClick={this.handlePageClick} displayData={this.displayData} searchPage={this.searchPage} />
>>>>>>> a2900c9d850358798db6722ee6a69519fdf5cd10
          <BroadcastsInfo userID={this.props.location.state._id} />
          <SurveysInfo userID={this.props.location.state._id} />
          <PollsInfo userID={this.props.location.state._id} />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('in mapStateToProps for pages, current', state)
  return {
    pages: state.PagesInfo.pages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadPagesList: loadPagesList
  },dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UserDetails)
