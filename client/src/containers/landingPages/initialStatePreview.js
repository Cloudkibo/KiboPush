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
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { updateLandingPageData } from '../../redux/actions/landingPages.actions'

class PreviewInitialSate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    props.getFbAppId()
  }

  handleTitleChange (e) {
    this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'title', e.target.value)
  }

  handleDescriptionChange (e) {
    this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'description', e.target.value)
  }

  render () {
    return (
      <div>
        {this.props.landingPage.initialState.pageTemplate === 'text' && this.props.landingPage.initialState.mediaLink !== '' && this.props.landingPage.initialState.mediaPlacement === 'contentLeftSide'
          ? <ContentLeftSide
            initialState={this.props.landingPage.initialState}
            title={this.props.landingPage.initialState.title}
            description={this.props.landingPage.initialState.description}
            handleDescriptionChange={this.handleDescriptionChange}
            handleTitleChange={this.handleTitleChange}
            fbAppId={this.props.fbAppId}
            pageId={this.props.landingPage.pageId}
            currentTab={this.props.landingPage.currentTab} />
          : this.props.landingPage.initialState.pageTemplate === 'text' && this.props.landingPage.initialState.mediaLink !== '' && this.props.landingPage.initialState.mediaPlacement === 'contentRightSide'
          ? <ContentRightSide
            initialState={this.props.landingPage.initialState}
            title={this.props.landingPage.initialState.title}
            description={this.props.landingPage.initialState.description}
            handleDescriptionChange={this.handleDescriptionChange}
            handleTitleChange={this.handleTitleChange}
            fbAppId={this.props.fbAppId}
            pageId={this.props.landingPage.pageId}
            currentTab={this.props.landingPage.currentTab} />
          : this.props.landingPage.initialState.pageTemplate === 'text' && this.props.landingPage.initialState.mediaLink !== '' && this.props.landingPage.initialState.mediaPlacement === 'aboveDescription'
          ? <AboveDescription
            initialState={this.props.landingPage.initialState}
            title={this.props.landingPage.initialState.title}
            description={this.props.landingPage.initialState.description}
            handleDescriptionChange={this.handleDescriptionChange}
            handleTitleChange={this.handleTitleChange}
            fbAppId={this.props.fbAppId}
            pageId={this.props.landingPage.pageId}
            currentTab={this.props.landingPage.currentTab} />
          : this.props.landingPage.initialState.pageTemplate === 'text' && this.props.landingPage.initialState.mediaLink !== '' && this.props.landingPage.initialState.mediaPlacement === 'belowDescription'
            ? <BelowDescription
              initialState={this.props.landingPage.initialState}
              title={this.props.landingPage.initialState.title}
              description={this.props.landingPage.initialState.description}
              handleDescriptionChange={this.handleDescriptionChange}
              handleTitleChange={this.handleTitleChange}
              fbAppId={this.props.fbAppId}
              pageId={this.props.landingPage.pageId}
              currentTab={this.props.landingPage.currentTab} />
            : <AboveHeadline
              initialState={this.props.landingPage.initialState}
              title={this.props.landingPage.initialState.title}
              description={this.props.landingPage.initialState.description}
              handleDescriptionChange={this.handleDescriptionChange}
              handleTitleChange={this.handleTitleChange}
              fbAppId={this.props.fbAppId}
              pageId={this.props.landingPage.pageId}
              currentTab={this.props.landingPage.currentTab} />
          }

      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('updated state', state)
  return {
    fbAppId: state.basicInfo.fbAppId,
    landingPage: state.landingPagesInfo.landingPage
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getFbAppId: getFbAppId,
    updateLandingPageData: updateLandingPageData
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PreviewInitialSate)
