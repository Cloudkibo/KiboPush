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
      backgroundImage: 'https://kibopush.com/wp-content/uploads/2020/01/preview_background.jpg',
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
      <div style={{ width:'100%', height: '100%', top: '0px', left: '0px',borderLeft: '0.07rem solid #EBEDF2', backgroundImage: 'url(' + this.state.backgroundImage + ')', backgroundSize: 'cover',backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}} >
        {   
        this.props.currentWidget.type === 'bar' && this.props.currentWidget.submittedState.action_type === 'show_new_message' && 
        <div style={{ width: '100%', height: '25%', padding: '10px', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', textAlign: 'center', background: this.props.currentWidget.submittedState.background_color}}> 
         <PreviewContent 
            widgetType='bar' 
            submittedState={this.props.currentWidget.submittedState} 
            changeButtonText={this.changeButtonText}
            handleDescriptionChange={this.handleDescriptionChange}
            handleHeadlineChange={this.handleHeadlineChange} /> 
          >
        </div>
        }
        { this.props.currentWidget.type === 'modal' && this.props.currentWidget.submittedState.action_type === 'show_new_message' && 
          <div style={{background: 'rgba(33, 37, 41, 0.6)', zIndex: '99999', width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{width: '350px', height: '400px', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', background: this.props.currentWidget.submittedState.background_color }}>
          <PreviewContent 
            widgetType='modal' 
            submittedState={this.props.currentWidget.submittedState} 
            changeButtonText={this.changeButtonText}
            handleDescriptionChange={this.handleDescriptionChange}
            handleHeadlineChange={this.handleHeadlineChange} />
          </div>
        </div>
        }
        { this.props.currentWidget.type === 'page_takeover' && this.props.currentWidget.submittedState.action_type === 'show_new_message' &&
          <div style={{border: '1px solid lightgrey',zIndex: '99999', width:'100%', height: '100%', background: this.props.currentWidget.submittedState.background_color}}>
            <PreviewContent 
            widgetType='page_takeover' 
            submittedState={this.props.currentWidget.submittedState} 
            changeButtonText={this.changeButtonText}
            handleDescriptionChange={this.handleDescriptionChange}
            handleHeadlineChange={this.handleHeadlineChange} /> 
          </div>
        }
        { this.props.currentWidget.type === 'slide_in' && this.props.currentWidget.submittedState.action_type === 'show_new_message' &&
          <div style={{width:'100%', height: '100%', display:'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '100%'}}>
              <div style={{float: 'right', width: '350px', height: '400px', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', background: this.props.currentWidget.submittedState.background_color }}>
              <PreviewContent 
                widgetType='slide_in' 
                submittedState={this.props.currentWidget.submittedState} 
                changeButtonText={this.changeButtonText}
                handleDescriptionChange={this.handleDescriptionChange}
                handleHeadlineChange={this.handleHeadlineChange} /> 
            </div>
          </div>
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
