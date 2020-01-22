/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Preview extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    /*if (nextProps.landingPage.currentTab === 'initialState' || nextProps.landingPage.currentTab === 'setup') {
      this.setState({backgroundColor: nextProps.landingPage.initialState.backgroundColor})
    } else if (nextProps.landingPage.currentTab === 'submittedState' && nextProps.landingPage.submittedState.state && nextProps.landingPage.submittedState.state.backgroundColor) {
      this.setState({backgroundColor: nextProps.landingPage.submittedState.state.backgroundColor})
    } else {
      this.setState({backgroundColor: '#fff'})
    }
    if ((nextProps.landingPage.currentTab === 'initialState' || nextProps.landingPage.currentTab === 'setup') && nextProps.landingPage.initialState.pageTemplate === 'background' && nextProps.landingPage.initialState.mediaLink !== '') {
      this.setState({backgroundImage: nextProps.landingPage.initialState.mediaLink})
    } else {
      this.setState({backgroundImage: ''})
    }*/
  }

  render () {
    console.log('backgroundColor', this.state.backgroundColor)
    return (
      <div />
    )
  }
}

function mapStateToProps (state) {
  return {
    currentWidget: state.overlayWidgetsInfo.currentWidget
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview)
