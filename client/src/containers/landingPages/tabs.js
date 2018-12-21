/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import InitialState from './initialState'
import SubmittedState from './submittedState'
import OptInActions from './optInActions'
import Setup from './setup'

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
    $('#setup').removeClass('active')
    $('#submittedState').removeClass('active')
    if (tab === 'initialState') {
      $('#tab_2').addClass('active')
      $('#submittedState').addClass('active')
      this.props.setCurrentTab('submittedState')
    } else if (tab === 'submittedState') {
      $('#tab_3').addClass('active')
      $('#optInActions').addClass('active')
      this.props.setCurrentTab('optInActions')
    } else if (tab === 'optInAction') {
      $('#tab_4').addClass('active')
      $('#setup').addClass('active')
      this.props.setCurrentTab('setup')
    }
  }
  handleBack (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#tab_4').removeClass('active')
    $('#initialState').removeClass('active')
    $('#optInActions').removeClass('active')
    $('#setup').removeClass('active')
    $('#submittedState').removeClass('active')
    if (tab === 'submittedState') {
      $('#tab_1').addClass('active')
      $('#initialState').addClass('active')
      this.props.setCurrentTab('initialState')
    } else if (tab === 'optInAction') {
      $('#tab_2').addClass('active')
      $('#submittedState').addClass('active')
      this.props.setCurrentTab('submittedState')
    } else if (tab === 'setup') {
      $('#tab_3').addClass('active')
      $('#optInActions').addClass('active')
      this.props.setCurrentTab('optInActions')
    }
  }
  onTabClick (tab) {
    $('#tab_1').removeClass('active')
    $('#tab_2').removeClass('active')
    $('#tab_3').removeClass('active')
    $('#tab_4').removeClass('active')
    $('#initialState').removeClass('active')
    $('#optInActions').removeClass('active')
    $('#setup').removeClass('active')
    $('#submittedState').removeClass('active')
    if (tab === 'initialState') {
      $('#tab_1').addClass('active')
      $('#initialState').addClass('active')
      this.props.setCurrentTab('initialState')
    } else if (tab === 'submittedState') {
      $('#tab_2').addClass('active')
      $('#submittedState').addClass('active')
      this.props.setCurrentTab('submittedState')
    } else if (tab === 'optInAction') {
      $('#tab_3').addClass('active')
      $('#optInActions').addClass('active')
      this.props.setCurrentTab('optInActions')
    } else if (tab === 'setup') {
      $('#tab_4').addClass('active')
      $('#setup').addClass('active')
      this.props.setCurrentTab('setup')
    }
  }
  componentDidMount () {
    if (this.props.currentTab !== '') {
      this.onTabClick(this.props.currentTab)
    }
  }
  render () {
    return (
      <div>
        <ul className='nav nav-tabs'>
          <li>
            <a id='initialState' className='broadcastTabs active' onClick={() => { this.onTabClick('initialState') }}>Initial State</a>
          </li>
          <li>
            <a id='submittedState' className='broadcastTabs' onClick={() => { this.onTabClick('submittedState') }}>Submitted State </a>
          </li>
          <li>
            <a id='optInActions' className='broadcastTabs' onClick={() => { this.onTabClick('optInAction') }}>Opt-In Actions </a>
          </li>
          <li>
            <a id='setup' className='broadcastTabs' onClick={() => { this.onTabClick('setup') }}>Setup </a>
          </li>
        </ul>
        <div className='tab-content'>
          <div className='tab-pane fade active in' id='tab_1'>
            <InitialState setInitialState={this.props.setInitialState} handleNext={this.handleNext} handleBack={this.handleBack} />
          </div>
          <div className='tab-pane' id='tab_2'>
            <SubmittedState setSubmittedState={this.props.setSubmittedState} handleNext={this.handleNext} handleBack={this.handleBack} />
          </div>
          <div className='tab-pane' id='tab_3'>
            <OptInActions optInMessage={this.props.optInMessage} handleNext={this.handleNext} handleBack={this.handleBack} />
          </div>
          <div className='tab-pane' id='tab_4'>
            <Setup handleNext={this.handleNext} handleBack={this.handleBack} />
          </div>
        </div>
      </div>
    )
  }
}

export default Tab
