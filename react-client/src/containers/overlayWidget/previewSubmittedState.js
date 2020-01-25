/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { updateWidget } from '../../redux/actions/overlayWidgets.actions'
var MessengerPlugin = require('react-messenger-plugin').default

class PreviewInitialState extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      backgroundImage: 'https://kibopush.com/wp-content/uploads/2020/01/preview_background.jpg',
    }
    this.handleHeadlineChange = this.handleHeadlineChange.bind(this)
    this.changeButtonText = this.changeButtonText.bind(this)
    props.getFbAppId()
  }
  handleHeadlineChange (e) {
    this.props.updateWidget(this.props.currentWidget, 'submittedState', 'message', e.target.value)
  }
  changeButtonText (e) {
    this.props.updateWidget(this.props.currentWidget, 'submittedState', 'button_text', e.target.value)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
  }

  render () {
    return (
      <div style={{ width:'100%', height: '100%', top: '0px', left: '0px',borderLeft: '0.07rem solid #EBEDF2', backgroundImage: 'url(' + this.state.backgroundImage + ')', backgroundSize: 'cover',backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}} >
        {   
          this.props.currentWidget.submittedState.action_type === 'show_new_message' && 
        <div style={{ width: '100%', height: '30%', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', textAlign: 'center', background: this.props.currentWidget.submittedState.background_color}}> 
          <textarea value={this.props.currentWidget.submittedState.message} rows='2' style={{fontWeight: '600', fontSize: 'large', textAlign: 'center', height: 'auto', width: '350px', margin: '10px', background: this.props.currentWidget.submittedState.background_color, color: this.props.currentWidget.submittedState ? this.props.currentWidget.submittedState.headline_color : '#000'}} maxLength='100' onChange={this.handleHeadlineChange} />
          <div className='btn' style={{backgroundColor: `${this.props.currentWidget.submittedState.button_background}`}}>
            <textarea style={{width: '180px', textAlign: 'center',height: '32px', 'background': `${this.props.currentWidget.submittedState.button_background}`, 'color': `${this.props.currentWidget.submittedState.button_text_color}`}} value={this.props.currentWidget.submittedState.button_text} maxLength='25' onChange={this.changeButtonText} />
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
