/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import InitialState from './initialState'
import OptInActions from './optInActions'
import Setup from './setup'

class Tab extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.onTabClick = this.onTabClick.bind(this)
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
    if (tab === 'optInAction') {
      $('#tab_3').addClass('active')
      $('#optInActions').addClass('active')
      this.props.setActiveTab('optInAction')
    } else if (tab === 'setup') {
      $('#tab_4').addClass('active')
      $('#setup').addClass('active')
      this.props.setActiveTab('setup')
    }
  }
  componentDidMount () {
    if (this.props.activeTab === 'optInAction') {
      this.clickOptInAction()
    }
  }
  render () {
    return (
      <div>
        <ul className='nav nav-tabs'>
          <li>
            <a id='initialState' className='broadcastTabs active'>Initial State</a>
          </li>
          <li>
            <a id='submittedState' className='broadcastTabs'>Submitted State </a>
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
            <InitialState />
          </div>
          <div className='tab-pane' id='tab_2' />
          <div className='tab-pane' id='tab_3'>
            <OptInActions />
          </div>
          <div className='tab-pane' id='tab_4'>
            <Setup />
          </div>
        </div>
      </div>
    )
  }
}

export default Tab
