/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Tabs from './tabs'
import Preview from './preview'

class State extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      initialState: {},
      submittedState: {}
    }
    this.setInitialState = this.setInitialState.bind(this)
    this.setInitialStatePreview = this.setInitialStatePreview.bind(this)
    this.setSubmittedState = this.setSubmittedState.bind(this)
    this.setSubmittedStatePreview = this.setSubmittedStatePreview.bind(this)
  }
  setInitialState (pageTemplate, backgroundColor, titleColor, descriptionColor, imgSrc, mediaPlacement) {
    console.log('this.state.setInitialState', this.state.initialState)
    // let initialStateTemp = this.state.initialState
    // initialStateTemp.mediaLink = imgSrc
    // initialStateTemp.backgroundColor = backgroundColor
    // initialStateTemp.titleColor = titleColor
    // initialStateTemp.descriptionColor = descriptionColor
    // initialStateTemp.buttonText = 'Send To Messenger'
    // initialStateTemp.mediaType = 'image'
    // initialStateTemp.mediaLink = imgSrc
    // initialStateTemp.mediaPlacement = mediaPlacement
    let initialState = {
      title: this.state.initialState.title,
      description: this.state.initialState.description,
      pageTemplate: pageTemplate,
      backgroundColor: backgroundColor,
      titleColor: titleColor,
      descriptionColor: descriptionColor,
      buttonText: 'Send To Messenger',
      mediaType: 'image',
      mediaLink: imgSrc,
      mediaPlacement: mediaPlacement
    }
    this.setState({initialState: initialState})
    this.props.setInitialState(initialState)
    console.log('initialState:', this.state.initialState)
    console.log('initialState temp:', initialState)
  }
  setInitialStatePreview (title, description) {
    console.log('setInitialStatePreview')
    let initialState = this.state.initialState
    initialState.title = title
    initialState.description = description
    this.setState({initialState: initialState})
    this.props.setInitialState(initialState)
    console.log('initialState:', this.state.initialState)
    console.log('initialState temp:', initialState)
  }
  setSubmittedStatePreview (title, description, button) {
    let submittedState = this.state.submittedState
    submittedState.title = title
    submittedState.description = description
    submittedState.button = button
    this.setState({submittedState: submittedState})
    this.props.setSubmittedState(submittedState)
    console.log('submittedState preview:', this.state.submittedState)
    console.log('submittedState preview temp:', submittedState)
  }
  setSubmittedState (actionType, state, tab) {
    console.log('in setSubmittedState')
    let submittedState = this.state.submittedState
    if (actionType === 'SHOW_NEW_MESSAGE') {
      submittedState.actionType = actionType
      submittedState.state = state
    } else {
      submittedState.actionType = actionType
      submittedState.url = state
      submittedState.tab = tab
    }
    this.setState({submittedState: submittedState})
    this.props.setSubmittedState(submittedState)
    console.log('submittedState:', submittedState)
    console.log('submittedState temp:', submittedState)
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-6 col-lg-6 col-sm-6'>
          <Tabs setInitialState={this.setInitialState} setSubmittedState={this.setSubmittedState} currentTab={this.props.currentTab} setCurrentTab={this.props.setCurrentTab} />
        </div>
        <Preview
          initialState={this.state.initialState}
          setInitialStatePreview={this.setInitialStatePreview}
          submittedState={this.state.submittedState}
          setSubmittedStatePreview={this.setSubmittedStatePreview}
          currentTab={this.props.currentTab}
           />
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(State)
