/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { updateWidget } from '../../redux/actions/overlayWidgets.actions'
import PreviewContent from './submittedStatePreviewContent'

class PreviewInitialState extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      backgroundImage: 'https://kibopush.com/wp-content/uploads/2020/01/website-preview-2.png',
    }
    this.handleHeadlineChange = this.handleHeadlineChange.bind(this)
    this.changeButtonText = this.changeButtonText.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    props.getFbAppId()
  }
  handleHeadlineChange (e) {
    this.props.updateWidget(this.props.currentWidget, 'submittedState', 'message', e.target.value)
  }
  changeButtonText (e) {
    this.props.updateWidget(this.props.currentWidget, 'submittedState', 'button_text', e.target.value)
  }
  handleDescriptionChange (e) {
    this.props.updateWidget(this.props.currentWidget, 'submittedState', 'description', e.target.value)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
  }

  render () {

    return (
      <div style={{width: '100%', height: '100%'}}>
      <img src={this.state.backgroundImage} alt='' style={{width: '100%', height: '100%', filter: 'blur(3px) opacity(0.5)'}}/>
      { this.props.currentWidget.type === 'bar' && this.props.currentWidget.submittedState.action_type === 'show_new_message' &&
      <div style={{ width: '100%', height: '25%', position: 'absolute', top:'0', padding: '10px', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', textAlign: 'center', background: this.props.currentWidget.submittedState.background_color}}> 
          <PreviewContent 
            widgetType='bar' 
            submittedState={this.props.currentWidget.submittedState} 
            changeButtonText={this.changeButtonText}
            handleDescriptionChange={this.handleDescriptionChange}
            handleHeadlineChange={this.handleHeadlineChange}  >
          </PreviewContent>    
      </div>
      }
      { this.props.currentWidget.type === 'modal' && this.props.currentWidget.submittedState.action_type === 'show_new_message' &&
        <div style={{background: 'rgba(33, 37, 41, 0.6)', position: 'absolute', top: '0px', width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: '350px', height: '350px', position: 'absolute', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', background: this.props.currentWidget.submittedState.background_color }}>
        <PreviewContent 
            widgetType='modal' 
            submittedState={this.props.currentWidget.submittedState} 
            changeButtonText={this.changeButtonText}
            handleDescriptionChange={this.handleDescriptionChange}
            handleHeadlineChange={this.handleHeadlineChange}  >
          </PreviewContent>    
        </div>
      </div>
      }
      { this.props.currentWidget.type === 'slide_in' && this.props.currentWidget.submittedState.action_type === 'show_new_message' &&
      <div style={{width: '350px', height: '350px', position: 'absolute', top:'30%', right: '0', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', background: this.props.currentWidget.submittedState.background_color }}>
        <PreviewContent 
            widgetType='slide_in' 
            submittedState={this.props.currentWidget.submittedState} 
            changeButtonText={this.changeButtonText}
            handleDescriptionChange={this.handleDescriptionChange}
            handleHeadlineChange={this.handleHeadlineChange}  >
          </PreviewContent>    
      </div>
    }
      { this.props.currentWidget.type === 'page_takeover' && this.props.currentWidget.submittedState.action_type === 'show_new_message' &&
        <div style={{border: '1px solid lightgrey', position: 'absolute', top: '0', width:'100%', height: '100%', background: this.props.currentWidget.submittedState.background_color, display:'flex', justifyContent: 'center', alignItems: 'center'}}>
          <PreviewContent 
            widgetType='page_takeover' 
            submittedState={this.props.currentWidget.submittedState} 
            changeButtonText={this.changeButtonText}
            handleDescriptionChange={this.handleDescriptionChange}
            handleHeadlineChange={this.handleHeadlineChange}  >
          </PreviewContent>    
      </div>
      }
    </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fbAppId: state.basicInfo.fbAppId,
    currentWidget: state.overlayWidgetsInfo.currentWidget
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getFbAppId: getFbAppId,
    updateWidget: updateWidget
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PreviewInitialState)
