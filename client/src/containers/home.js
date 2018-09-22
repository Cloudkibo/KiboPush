import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Dashboard from './dashboard/dashboard'

class Home extends Component {
  componentDidMount () {

  }

  render () {
    return (
      <Dashboard location={this.props.location} />
    )
  }
}

function mapStateToProps (state) {
  return {
    connectInfo: (state.basicInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
