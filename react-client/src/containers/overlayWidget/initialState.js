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
      showBackgroundPicker: false
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
    }
  }

  showColorPicker (value) {
    if (value === 'heading') {
      this.setState({showHeadingPicker: true})
      this.setState({showBackgroundPicker: false})
    } else if (value === 'background') {
      this.setState({showHeadingPicker: false})
      this.setState({showBackgroundPicker: true})
    }
  }

  toggleColorPicker (value) {
    if (value === 'heading') {
      this.setState({showHeadingPicker: !this.state.showHeadingPicker})
    } else if (value === 'background') {
      this.setState({showBackgroundPicker: !this.state.showBackgroundPicker})
    }
  }
  render () {
    return (
      <div>
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
                <input id='with-checkbox'
                  type='radio'
                  value='with-checkbox'
                  name='with-checkbox'
                  onChange={this.handleButtonType}
                  checked={this.props.initialState.button_type === 'with-checkbox'} />
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
              <option value='send-to-messenger'>Send to Messenger</option>
            </select>
          </div>
        </div>
        <br /><br />
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
