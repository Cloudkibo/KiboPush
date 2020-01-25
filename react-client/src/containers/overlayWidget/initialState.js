/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Popover from '../landingPages/popover'
import ColorPicker from '../landingPages/colorPicker'
import Footer from './footer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateWidget } from '../../redux/actions/overlayWidgets.actions'

class InitialState extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showHeadingPicker: false,
      showBackgroundPicker: false,
      showButtonBgPicker: false, 
      showButtonTextPicker: false
    }
    this.showColorPicker = this.showColorPicker.bind(this)
    this.toggleColorPicker = this.toggleColorPicker.bind(this)
    this.onChangeComplete = this.onChangeComplete.bind(this)
    this.handleButtonType = this.handleButtonType.bind(this)
    this.changeButtonBackground = this.changeButtonBackground.bind(this)
    this.changeButtonText = this.changeButtonText.bind(this)
  }

  componentDidMount () {
  }

  handleButtonType (e) {
    if (e.target.value === 'with_checkbox') {
      this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_background', '#337ab7')
      this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_text', 'Send Me Insights')
    } else {
      this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_background', 'blue')
      this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_text', 'send_to_messenger')
    }
    this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_type', e.target.value)
  }
  changeButtonText(e) {
    this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_text', e.target.value)
  }
  changeButtonBackground (e) {
    this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_background', e.target.value)
  }
  onChangeComplete (color, value) {
    console.log('color.hex', color.hex)
    if (value === 'heading') {
      this.props.updateWidget(this.props.currentWidget, 'initialState', 'headline_color', color.hex)
    } else if (value === 'background') {
      this.props.updateWidget(this.props.currentWidget, 'initialState', 'background_color', color.hex)
    } else if (value === 'button_text') {
      this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_text_color', color.hex)
    } else if (value === 'button_background') {
      this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_background', color.hex)
    }
  }

  showColorPicker (value) {
    if (value === 'heading') {
      this.setState({
        showHeadingPicker: true,
        showBackgroundPicker: false,
        showButtonBgPicker: false,
        showButtonTextPicker: false
      })
    } else if (value === 'background') {
      this.setState({
        showHeadingPicker: false,
        showBackgroundPicker: true,
        showButtonBgPicker: false,
        showButtonTextPicker: false
      })
    } else if (value === 'button_background') {
      this.setState({
        showHeadingPicker: false,
        showBackgroundPicker: false,
        showButtonBgPicker: true,
        showButtonTextPicker: false
      })
    } else if (value === 'button_text') {
      this.setState({
        showHeadingPicker: false,
        showBackgroundPicker: false,
        showButtonBgPicker: false,
        showButtonTextPicker: true
      })
    }
  }

  toggleColorPicker (value) {
    if (value === 'heading') {
      this.setState({showHeadingPicker: !this.state.showHeadingPicker})
    } else if (value === 'background') {
      this.setState({showBackgroundPicker: !this.state.showBackgroundPicker})
    } else if (value === 'button_text') {
      this.setState({showButtonTextPicker: !this.state.showButtonTextPicker})
    } else if (value === 'button_background') {
      this.setState({showButtonBgPicker: !this.state.showButtonBgPicker})
    }
  }
  render () {
    return (
      <div>
        <div style={{minHeight: '450px'}}>
          <Popover isOpen={this.state.showHeadingPicker} target='init_heading' title='heading' toggle={this.toggleColorPicker} color={this.props.initialState.headline_color} onChangeComplete={this.onChangeComplete} />
          <Popover isOpen={this.state.showBackgroundPicker} target='init_background' title='background' toggle={this.toggleColorPicker} color={this.props.initialState.background_color} onChangeComplete={this.onChangeComplete} />
          <label>Button Type:</label>
          <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
              <div className='radio-buttons' style={{marginLeft: '20px'}}>
                <div className='radio'>
                  <input id='send_to_messenger'
                    type='radio'
                    value='send_to_messenger'
                    name='send_to_messenger'
                    onChange={this.handleButtonType}
                    checked={this.props.initialState.button_type === 'send_to_messenger'} />
                  <label>Send to Messenger</label>
                </div>
                <div className='radio'>
                  <input id='with_checkbox'
                    type='radio'
                    value='with_checkbox'
                    name='with_checkbox'
                    onChange={this.handleButtonType}
                    checked={this.props.initialState.button_type === 'with_checkbox'} />
                  <label>With Checkbox</label>
                </div>
              </div>
            </div>
          </div>
          <br />
          <label>Colors:</label><br />
          <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
              <ColorPicker id='init_heading' name='heading' showColorPicker={this.showColorPicker} backgroundColor={this.props.initialState.headline_color} title='Heading' />
            </div>
            <div className='col-md-6 col-lg-6 col-sm-6'>
              <ColorPicker id='init_background' name='background' showColorPicker={this.showColorPicker} backgroundColor={this.props.initialState.background_color} title='Background' />
            </div>
          </div>
          {
            this.props.currentWidget.initialState.button_type === 'with_checkbox' &&
            <div className='row'>
              <Popover isOpen={this.state.showButtonBgPicker} target='init_button_background' title='button_background' toggle={this.toggleColorPicker} color={this.props.initialState.button_background} onChangeComplete={this.onChangeComplete} />
              <Popover isOpen={this.state.showButtonTextPicker} target='init_button_text' title='button_text' toggle={this.toggleColorPicker} color={this.props.initialState.button_text_color} onChangeComplete={this.onChangeComplete} />
              <div className='col-md-6 col-lg-6 col-sm-6'>
                <ColorPicker id='init_button_background' name='button_background' showColorPicker={this.showColorPicker} backgroundColor={this.props.initialState.button_background} title='Button Background' />
              </div>
              <div className='col-md-6 col-lg-6 col-sm-6'>
                <ColorPicker id='init_button_text' name='button_text' showColorPicker={this.showColorPicker} backgroundColor={this.props.initialState.button_text_color} title='Button Text' />
              </div>
              <br />
              <br />
            </div>
            }
          {this.props.currentWidget.initialState.button_type === 'send_to_messenger' &&
          <div>
            <br />
            <div className='row'>
              <div className='col-md-6 col-lg-6 col-sm-6'>
                <label>Button Background</label>
                <select className='form-control m-input' value={this.props.initialState.button_background} onChange={this.changeButtonBackground}>
                  <option value='white'>White</option>
                  <option value='blue'>Blue</option>
                </select>
              </div>
            </div>
            <br />
            <div className='row'>
              <div className='col-md-6 col-lg-6 col-sm-6'>
                <label>Button Text</label>
                <select className='form-control m-input' value={this.props.initialState.button_text} onChange={this.changeButtonText}>
                  <option value='send_to_messenger'>Send to Messenger</option>
                </select>
              </div>
            </div>
            <br /><br />
          </div>
          }
        </div>
        <Footer widgetState='initialState' handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log('state in initialState.js', state)
  return {
    currentWidget: (state.overlayWidgetsInfo.currentWidget),
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateWidget: updateWidget
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(InitialState)
