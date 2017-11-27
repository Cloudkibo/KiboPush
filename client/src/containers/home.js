import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Sidebar from '../components/sidebar/sidebar'
//  import Responsive from '../components/sidebar/responsive'
import Dashboard from './dashboard/dashboard'
import Header from '../components/header/header'
//  import HeaderResponsive from '../components/header/headerResponsive'

class Home extends Component {
  componentDidMount () {

  }

  render () {
    console.log('Hello')
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <Dashboard />
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  // console.log(state);
  return {
    connectInfo: (state.basicInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
