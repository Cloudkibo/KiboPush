/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import InitialState from './initialState'
import Footer from './footer'
import { updateLandingPageData } from '../../redux/actions/landingPages.actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class SubmittedState extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.handleRadioTab = this.handleRadioTab.bind(this)
    this.handleUrl = this.handleUrl.bind(this)
  }

  handleUrl (e) {
    this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'url', e.target.value)
  }

  handleRadioButton (e) {
    this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'actionType', e.target.value)
  }
  handleRadioTab (e) {
    this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'tab', e.target.value)
  }
  render () {
    return (
      <div>
        <label>After Submit:</label>
        <div className='radio' style={{marginLeft: '18px'}}>
          <input id='message'
            type='radio'
            value='SHOW_NEW_MESSAGE'
            name='message'
            onChange={this.handleRadioButton}
            checked={this.props.landingPage.submittedState.actionType === 'SHOW_NEW_MESSAGE'} />
          <label>Show New Message</label>
        </div>
        <div className='radio' style={{marginLeft: '18px'}}>
          <input id='url'
            type='radio'
            value='REDIRECT_TO_URL'
            name='url'
            onChange={this.handleRadioButton}
            checked={this.props.landingPage.submittedState.actionType === 'REDIRECT_TO_URL'} />
          <label>Redirect to URL</label>
        </div>
        <br />
        {this.props.landingPage.submittedState.actionType === 'REDIRECT_TO_URL' &&
          <div>
            <label>URL to open after submission:</label>
            <input className='form-control m-input m-input--air' value={this.props.landingPage.submittedState.url} onChange={this.handleUrl} />  
            <br />
            <label>Open this URL:</label>
            <div className='radio' style={{marginLeft: '18px'}}>
              <input id='newTab'
                type='radio'
                value='NEW_TAB'
                name='newTab'
                onChange={this.handleRadioTab}
                checked={this.props.landingPage.submittedState.tab === 'NEW_TAB'} />
              <label>In a new tab</label>
            </div>
            <div className='radio' style={{marginLeft: '18px'}}>
              <input id='currentTab'
                type='radio'
                value='CURRENT_TAB'
                name='currentTab'
                onChange={this.handleRadioTab}
                checked={this.props.landingPage.submittedState.tab === 'CURRENT_TAB'} />
              <label>In the current tab</label>
            </div>
          </div>
        }
        {this.props.landingPage.submittedState.actionType === 'SHOW_NEW_MESSAGE' &&
          <InitialState initialState={this.props.landingPage.submittedState.state} />
        }
        <br />
        <Footer page='submittedState' handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    landingPage: state.landingPagesInfo.landingPage
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateLandingPageData: updateLandingPageData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SubmittedState)
