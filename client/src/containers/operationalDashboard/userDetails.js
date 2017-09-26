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
    props.loadPagesList()
    this.state = {
      pagesData: [],
      totalLength: 0
    }
    this.displayData = this.displayData.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
  }

  displayData (n, pages) {
    console.log('one', pages)
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
    this.setState({pagesData: pages})
    console.log('in displayData', this.state.pagesData)
  }

  handlePageClick (data) {
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
          <h3>Sania Siddiqui</h3>
          <PagesInfo pages={this.state.pagesData} length={this.state.totalLength} handlePageClick={this.handlePageClick} />
          <BroadcastsInfo userID={this.props.location.state} />
          <SurveysInfo />
          <PollsInfo />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('in mapStateToProps', state)
  return {
    pages: state.PagesInfo.pages
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadPagesList: loadPagesList},
    dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UserDetails)
