/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import InitialState from './initialState'
import SubmittedState from './submittedState'
import OptInActions from './optInActions'
import Setup from './setup'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateLandingPageData } from '../../redux/actions/landingPages.actions'

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
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'submittedState')
    } else if (tab === 'submittedState') {
      $('#tab_3').addClass('active')
      $('#optInActions').addClass('active')
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'optInActions')
    } else if (tab === 'optInActions') {
      $('#tab_4').addClass('active')
      $('#setup').addClass('active')
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'setup')
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
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'initialState')
    } else if (tab === 'optInActions') {
      $('#tab_2').addClass('active')
      $('#submittedState').addClass('active')
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'submittedState')
    } else if (tab === 'setup') {
      $('#tab_3').addClass('active')
      $('#optInActions').addClass('active')
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'optInActions')
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
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'initialState')
    } else if (tab === 'submittedState') {
      $('#tab_2').addClass('active')
      $('#submittedState').addClass('active')
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'submittedState')
    } else if (tab === 'optInActions') {
      $('#tab_3').addClass('active')
      $('#optInActions').addClass('active')
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'optInActions')
    } else if (tab === 'setup') {
      $('#tab_4').addClass('active')
      $('#setup').addClass('active')
      this.props.updateLandingPageData(this.props.landingPage, '', 'currentTab', 'setup')
    }
  }
  componentDidMount () {
    if (this.props.landingPage.currentTab && this.props.landingPage.currentTab !== '') {
      this.onTabClick(this.props.landingPage.currentTab)
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
          {
            this.props.module === 'edit' &&
            <li>
            <a href='#/' id='setup' className='broadcastTabs' onClick={() => { this.onTabClick('setup') }}>Setup </a>
          </li>
          }
        </ul>
        <div className='tab-content'>
          <div className='tab-pane fade active in' id='tab_1'>
            <InitialState history={this.props.history} location={this.props.location} initialState={this.props.landingPage.initialState} handleNext={this.handleNext} handleBack={this.handleBack} />
          </div>
          <div className='tab-pane' id='tab_2'>
            <SubmittedState history={this.props.history} location={this.props.location} handleNext={this.handleNext} handleBack={this.handleBack} />
          </div>
          <div className='tab-pane' id='tab_3'>
            <OptInActions initialFiles={this.props.initialFiles} newFiles={this.props.newFiles} onEditMessage={this.props.onEditMessage} history={this.props.history} location={this.props.location} optInMessage={this.props.optInMessage} handleNext={this.handleNext} handleBack={this.handleBack} module={this.props.module} />
          </div>
          { this.props.module === 'edit' &&
          <div className='tab-pane' id='tab_4'>
            <Setup
              history={this.props.history}
              location={this.props.location}
              handleNext={this.handleNext}
              handleBack={this.handleBack}
              module={this.props.module}
              landing_page_id={this.props.landing_page_id}
              isActive={this.props.isActive} />
          </div>
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    landingPage: state.landingPagesInfo.landingPage
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateLandingPageData: updateLandingPageData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Tab)
