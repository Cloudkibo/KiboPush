/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import InitialState from './initialState'

class Tab extends React.Component {
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
            <a id='optInActions' className='broadcastTabs'>Opt-In Actions </a>
          </li>
          <li>
            <a id='setup' className='broadcastTabs'>Setup </a>
          </li>
        </ul>
        <div className='tab-content'>
          <div className='tab-pane fade active in' id='tab_1'>
            <InitialState />
          </div>
        </div>
      </div>
    )
  }
}

export default Tab
