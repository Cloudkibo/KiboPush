/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import InitialState from './initialState'
import Footer from './footer'

class SubmittedState extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selectedRadio: '',
      selectedRadioTab: '',
      initialState: {},
      url: ''
    }
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.handleRadioTab = this.handleRadioTab.bind(this)
    this.handleUrl = this.handleUrl.bind(this)
    this.setInitialState = this.setInitialState.bind(this)
  }

  componentWillMount () {
    console.log('in componentWillMount of submittedState')
    this.props.setSubmittedState(this.state.selectedRadio, this.state.url, this.state.selectedRadioTab)
  }

  handleUrl (e) {
    this.setState({url: e.target.value})
    this.props.setSubmittedState('REDIRECT_TO_URL', e.target.value, this.state.selectedRadioTab)
  }

  setInitialState (pageTemplate, backgroundColor, titleColor, descriptionColor, imgSrc, mediaPlacement) {
    console.log('in setinitialstate of submittedState', imgSrc)
    let initialState = {
      backgroundColor: backgroundColor,
      titleColor: titleColor,
      descriptionColor: descriptionColor,
      buttonText: 'Send To Messenger',
      mediaType: 'image',
      mediaLink: imgSrc,
      mediaPlacement: mediaPlacement
    }
    this.setState({initialState: initialState})
    console.log('in setInitialState of submittedState')
    this.props.setSubmittedState('SHOW_NEW_MESSAGE', initialState)
  }
  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.target.value
    })
    console.log('e.target.value', e.target.value)
    if (e.target.value === 'SHOW_NEW_MESSAGE') {
      this.props.setSubmittedState('SHOW_NEW_MESSAGE', this.state.initialState)
    } else {
      this.props.setSubmittedState('REDIRECT_TO_URL', this.state.url, this.state.selectedRadioTab)
    }
  }
  handleRadioTab (e) {
    this.setState({
      selectedRadioTab: e.target.value
    })
    this.props.setSubmittedState('REDIRECT_TO_URL', this.state.url, e.target.value)
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
            checked={this.state.selectedRadio === 'SHOW_NEW_MESSAGE'} />
          <label>Show New Message</label>
        </div>
        <div className='radio' style={{marginLeft: '18px'}}>
          <input id='url'
            type='radio'
            value='REDIRECT_TO_URL'
            name='url'
            onChange={this.handleRadioButton}
            checked={this.state.selectedRadio === 'REDIRECT_TO_URL'} />
          <label>Redirect to URL</label>
        </div>
        <br />
        {this.state.selectedRadio === 'REDIRECT_TO_URL' &&
          <div>
            <label>URL to open after submission:</label>
            <input className='form-control m-input m-input--air' value={this.state.url} onChange={this.handleUrl} />
            <br />
            <label>Open this URL:</label>
            <div className='radio' style={{marginLeft: '18px'}}>
              <input id='newTab'
                type='radio'
                value='NEW_TAB'
                name='newTab'
                onChange={this.handleRadioTab}
                checked={this.state.selectedRadioTab === 'NEW_TAB'} />
              <label>In a new tab</label>
            </div>
            <div className='radio' style={{marginLeft: '18px'}}>
              <input id='currentTab'
                type='radio'
                value='CURRENT_TAB'
                name='currentTab'
                onChange={this.handleRadioTab}
                checked={this.state.selectedRadioTab === 'CURRENT_TAB'} />
              <label>In the current tab</label>
            </div>
          </div>
        }
        {this.state.selectedRadio === 'SHOW_NEW_MESSAGE' &&
          <InitialState submittedState setInitialState={this.setInitialState} />
        }
        <br />
        <Footer page='submittedState' handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
      </div>
    )
  }
}

export default SubmittedState
