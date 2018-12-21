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

class PreviewInitialSate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      title: props.title,
      description: props.description,
      buttonText: props.button ? props.button : ''
    }
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)

    props.getFbAppId()
  }

  handleTitleChange (e) {
    console.log('handleTitleChange', e.target.value)
    this.setState({title: e.target.value})
    this.props.setInitialStatePreview(e.target.value, this.state.description)
  }

  handleDescriptionChange (e) {
    console.log('handleDescriptionChange', e.target.value)
    this.setState({description: e.target.value})
    this.props.setInitialStatePreview(this.state.title, e.target.value)
  }

  handleButtonText (e) {
    this.setState({buttonText: e.target.value})
    this.props.setInitialStatePreview(this.state.title, this.state.description, e.target.value)
  }

  componentWillMount () {
    console.log('in componentDidMount')
    this.props.setInitialStatePreview(this.state.title, this.state.description)
  }

  render () {
    console.log('this.props.initialState in preview', this.props.initialState)
    return (
      <div>
        <div className='row' style={{paddingLeft: '15px'}}>
          {this.props.initialState && this.props.initialState.mediaLink && this.props.initialState.mediaPlacement === 'contentLeftSide'
            ? <ContentLeftSide
              initialState={this.props.initialState}
              title={this.state.title}
              description={this.state.description}
              handleDescriptionChange={this.handleDescriptionChange}
              handleTitleChange={this.handleTitleChange}
              fbAppId={this.props.fbAppId}
              pageId={this.props.pageId}
              currentTab={this.props.currentTab}
              buttonText={this.state.buttonText}
              handleButtonText={this.handleButtonText} />
            : this.props.initialState && this.props.initialState.mediaLink && this.props.initialState.mediaPlacement === 'contentRightSide'
            ? <ContentRightSide
              initialState={this.props.initialState}
              title={this.state.title}
              description={this.state.description}
              handleDescriptionChange={this.handleDescriptionChange}
              handleTitleChange={this.handleTitleChange}
              fbAppId={this.props.fbAppId}
              pageId={this.props.pageId}
              currentTab={this.props.currentTab}
              buttonText={this.state.buttonText}
              handleButtonText={this.handleButtonText} />
            : this.props.initialState && this.props.initialState.mediaLink && this.props.initialState.mediaPlacement === 'aboveHeadline'
            ? <AboveHeadline
              initialState={this.props.initialState}
              title={this.state.title}
              description={this.state.description}
              handleDescriptionChange={this.handleDescriptionChange}
              handleTitleChange={this.handleTitleChange}
              fbAppId={this.props.fbAppId}
              pageId={this.props.pageId}
              currentTab={this.props.currentTab}
              buttonText={this.state.buttonText}
              handleButtonText={this.handleButtonText} />
            : this.props.initialState && this.props.initialState.mediaLink && this.props.initialState.mediaPlacement === 'aboveDescription'
            ? <AboveDescription
              initialState={this.props.initialState}
              title={this.state.title}
              description={this.state.description}
              handleDescriptionChange={this.handleDescriptionChange}
              handleTitleChange={this.handleTitleChange}
              fbAppId={this.props.fbAppId}
              pageId={this.props.pageId}
              currentTab={this.props.currentTab}
              buttonText={this.state.buttonText}
              handleButtonText={this.handleButtonText} />
            : <BelowDescription
              initialState={this.props.initialState}
              title={this.state.title}
              description={this.state.description}
              handleDescriptionChange={this.handleDescriptionChange}
              handleTitleChange={this.handleTitleChange}
              fbAppId={this.props.fbAppId}
              pageId={this.props.pageId}
              currentTab={this.props.currentTab}
              buttonText={this.state.buttonText}
              handleButtonText={this.handleButtonText} />
          }

        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fbAppId: state.basicInfo.fbAppId
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getFbAppId: getFbAppId
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PreviewInitialSate)
