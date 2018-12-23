/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ContentLeftSide from './contentLeft'
import ContentRightSide from './contentRight'
import AboveHeadline from './aboveHeadline'
import AboveDescription from './aboveDescription'
import BelowDescription from './belowDescription'
import { updateLandingPageData } from '../../redux/actions/landingPages.actions'

class PreviewSubmittedState extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    this.handleButtonText = this.handleButtonText.bind(this)
  }

  handleTitleChange (e) {
    this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'title', e.target.value)
  }

  handleDescriptionChange (e) {
    this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'description', e.target.value)
  }

  handleButtonText (e) {
    this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'buttonText', e.target.value)
  }

  render () {
    return (
      <div>
        {this.props.landingPage.submittedState.state && this.props.landingPage.submittedState.state.mediaLink !== '' && this.props.landingPage.submittedState.state.mediaPlacement === 'contentLeftSide'
          ? <ContentLeftSide
            initialState={this.props.landingPage.submittedState.state}
            title={this.props.landingPage.submittedState.title}
            description={this.props.landingPage.submittedState.description}
            handleDescriptionChange={this.handleDescriptionChange}
            handleTitleChange={this.handleTitleChange}
            currentTab={this.props.landingPage.currentTab}
            buttonText={this.props.landingPage.submittedState.buttonText}
            handleButtonText={this.handleButtonText} />
          : this.props.landingPage.submittedState.state && this.props.landingPage.submittedState.state.mediaLink !== '' && this.props.landingPage.submittedState.state.mediaPlacement === 'contentRightSide'
          ? <ContentRightSide
            initialState={this.props.landingPage.submittedState.state}
            title={this.props.landingPage.submittedState.title}
            description={this.props.landingPage.submittedState.description}
            handleDescriptionChange={this.handleDescriptionChange}
            handleTitleChange={this.handleTitleChange}
            currentTab={this.props.landingPage.currentTab}
            buttonText={this.props.landingPage.submittedState.buttonText}
            handleButtonText={this.handleButtonText} />
          : this.props.landingPage.submittedState.state && this.props.landingPage.submittedState.state.mediaLink !== '' && this.props.landingPage.submittedState.state.mediaPlacement === 'aboveDescription'
          ? <AboveDescription
            initialState={this.props.landingPage.submittedState.state}
            title={this.props.landingPage.submittedState.title}
            description={this.props.landingPage.submittedState.description}
            handleDescriptionChange={this.handleDescriptionChange}
            handleTitleChange={this.handleTitleChange}
            currentTab={this.props.landingPage.currentTab}
            buttonText={this.props.landingPage.submittedState.buttonText}
            handleButtonText={this.handleButtonText} />
          : this.props.landingPage.submittedState.state && this.props.landingPage.submittedState.state.mediaLink !== '' && this.props.landingPage.submittedState.state.mediaPlacement === 'belowDescription'
            ? <BelowDescription
              initialState={this.props.landingPage.submittedState.state}
              title={this.props.landingPage.submittedState.title}
              description={this.props.landingPage.submittedState.description}
              handleDescriptionChange={this.handleDescriptionChange}
              handleTitleChange={this.handleTitleChange}
              currentTab={this.props.landingPage.currentTab}
              buttonText={this.props.landingPage.submittedState.buttonText}
              handleButtonText={this.handleButtonText} />
            : <AboveHeadline
              initialState={this.props.landingPage.submittedState.state}
              title={this.props.landingPage.submittedState.title}
              description={this.props.landingPage.submittedState.description}
              handleDescriptionChange={this.handleDescriptionChange}
              handleTitleChange={this.handleTitleChange}
              currentTab={this.props.landingPage.currentTab}
              buttonText={this.props.landingPage.submittedState.buttonText}
              handleButtonText={this.handleButtonText} />
          }

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
export default connect(mapStateToProps, mapDispatchToProps)(PreviewSubmittedState)
