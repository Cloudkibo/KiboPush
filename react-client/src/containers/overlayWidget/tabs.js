/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateWidget } from '../../redux/actions/overlayWidgets.actions'
import InitialState from './initialState'
import SubmittedState from './submittedState'

class Tab extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.onTabClick = this.onTabClick.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.handleBack = this.handleBack.bind(this)
  }
  handleNext (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#tab_4').removeClass('active')
    $('#initialState').removeClass('active')
    $('#optInActions').removeClass('active')
    $('#submittedState').removeClass('active')
    if (tab === 'initialState') {
      $('#tab_2').addClass('active')
      $('#submittedState').addClass('active')
      this.props.updateWidget(this.props.currentWidget, null, 'currentTab', 'submittedState')
    } else if (tab === 'submittedState') {
      $('#tab_3').addClass('active')
      $('#optInActions').addClass('active')
      this.props.updateWidget(this.props.currentWidget, null, 'currentTab', 'submittedState')
    } else if (tab === 'optInActions') {
      $('#tab_4').addClass('active')
    }
  }
  handleBack (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#tab_4').removeClass('active')
    $('#initialState').removeClass('active')
    $('#optInActions').removeClass('active')
    $('#submittedState').removeClass('active')
    if (tab === 'submittedState') {
      $('#tab_1').addClass('active')
      $('#initialState').addClass('active')
      //this.props.updateOverlayWidget(this.props.landingPage, '', 'currentTab', 'initialState')
    } else if (tab === 'optInActions') {
      $('#tab_2').addClass('active')
      $('#submittedState').addClass('active')
      //this.props.updateOverlayWidget(this.props.landingPage, '', 'currentTab', 'submittedState')
    }
  }
  onTabClick (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#tab_4').removeClass('active')
    $('#initialState').removeClass('active')
    $('#optInActions').removeClass('active')
    $('#submittedState').removeClass('active')
    if (tab === 'initialState') {
      $('#tab_1').addClass('active')
      $('#initialState').addClass('active')
      this.props.updateWidget(this.props.currentWidget, null, 'currentTab', 'initialState')
    } else if (tab === 'submittedState') {
      $('#tab_2').addClass('active')
      $('#submittedState').addClass('active')
      this.props.updateWidget(this.props.currentWidget, null, 'currentTab', 'submittedState')
    } else if (tab === 'optInActions') {
      $('#tab_3').addClass('active')
      $('#optInActions').addClass('active')
      this.props.updateWidget(this.props.currentWidget, null, 'currentTab', 'optInActions')
    }
  }
  componentDidMount () {
    if (this.props.currentWidget.currentTab && this.props.currentWidget.currentTab !== '') {
      this.onTabClick(this.props.currentWidget.currentTab)
    }
  }
  render () {
    console.log('render in tabs', this.props)
    return (
      <div>
        <ul className='nav nav-tabs'>
          <li>
            <a href='#/' id='initialState' className='broadcastTabs active' onClick={() => { this.onTabClick('initialState') }}>Initial State</a>
          </li>
          <li>
            <a href='#/' id='submittedState' className='broadcastTabs' onClick={() => { this.onTabClick('submittedState') }}>Submitted State </a>
          </li>
          <li>
            <a href='#/' id='optInActions' className='broadcastTabs' onClick={() => { this.onTabClick('optInActions') }}>Opt-In Actions </a>
          </li>
        </ul>
        <div className='tab-content'>
          <div className='tab-pane fade active in' id='tab_1'>
            <InitialState initialState={this.props.currentWidget.initialState} handleNext={this.handleNext} handleBack={this.handleBack} />
          </div>
          <div className='tab-pane' id='tab_2'>
            <SubmittedState submittedState={this.props.currentWidget.submittedState} handleNext={this.handleNext} handleBack={this.handleBack} />
          </div>
          <div className='tab-pane' id='tab_3'>
            <div>Opt In Actions</div>
          </div>
        </div>
      </div>
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
    updateWidget: updateWidget
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Tab)
