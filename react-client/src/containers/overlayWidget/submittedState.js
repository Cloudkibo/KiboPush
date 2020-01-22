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

class SubmittedState extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showHeadingPicker: false,
      showBackgroundPicker: false,
      showButtonTextPicker: false,
      showButtonBgPicker: false
    }
    this.showColorPicker = this.showColorPicker.bind(this)
    this.toggleColorPicker = this.toggleColorPicker.bind(this)
    this.onChangeComplete = this.onChangeComplete.bind(this)
    this.handleAfterSubmit = this.handleAfterSubmit.bind(this)
    this.changeTab = this.changeTab.bind(this)
    this.changeUrl = this.changeUrl.bind(this)
  }

  componentDidMount () {
  }

  handleAfterSubmit (e) {
    this.props.updateWidget(this.props.currentWidget, 'submittedState', 'action_type', e.target.value)
  }
  changeUrl(e) {
    this.props.updateWidget(this.props.currentWidget, 'submittedState', 'url', e.target.value)
  }
  changeTab (e) {
    this.props.updateWidget(this.props.currentWidget, 'submittedState', 'tab', e.target.value)
  }
  onChangeComplete (color, value) {
    console.log('color.hex', color.hex)
    if (value === 'heading') {
      this.props.updateWidget(this.props.currentWidget, 'submittedState', 'headline_color', color.hex)
    } else if (value === 'background') {
      this.props.updateWidget(this.props.currentWidget, 'submittedState', 'background_color', color.hex)
    } else if (value === 'button_text') {
      this.props.updateWidget(this.props.currentWidget, 'submittedState', 'button_text_color', color.hex)
    } else if (value === 'button_background') {
      this.props.updateWidget(this.props.currentWidget, 'submittedState', 'button_background', color.hex)
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
        <Popover isOpen={this.state.showHeadingPicker} target='sub_heading' title='heading' toggle={this.toggleColorPicker} color={this.props.submittedState.headline_color} onChangeComplete={this.onChangeComplete} />
        <Popover isOpen={this.state.showBackgroundPicker} target='sub_background' title='background' toggle={this.toggleColorPicker} color={this.props.submittedState.background_color} onChangeComplete={this.onChangeComplete} />
        <Popover isOpen={this.state.showButtonBgPicker} target='sub_button_background' title='button_background' toggle={this.toggleColorPicker} color={this.props.submittedState.button_background} onChangeComplete={this.onChangeComplete} />
        <Popover isOpen={this.state.showButtonTextPicker} target='sub_button_text' title='button_text' toggle={this.toggleColorPicker} color={this.props.submittedState.button_text_color} onChangeComplete={this.onChangeComplete} />
        <label>After Submit:</label>
        <div className='row'>
          <div className='col-md-6 col-lg-6 col-sm-6'>
            <div className='radio-buttons' style={{marginLeft: '20px'}}>
              <div className='radio'>
                <input id='show_new_message'
                  type='radio'
                  value='show_new_message'
                  name='show_new_message'
                  onChange={this.handleAfterSubmit}
                  checked={this.props.submittedState.action_type === 'show_new_message'} />
                <label>Show new message</label>
              </div>
              <div className='radio'>
                <input id='redirect_to_url'
                  type='radio'
                  value='redirect_to_url'
                  name='redirect_to_url'
                  onChange={this.handleAfterSubmit}
                  checked={this.props.submittedState.action_type === 'redirect_to_url'} />
                <label>Redirect to Url</label>
              </div>
            </div>
          </div>
        </div>
        <br />
        { this.props.submittedState.action_type  === 'show_new_message' &&
        <div>
          <label>Colors:</label><br />
          <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
              <ColorPicker id='sub_heading' name='heading' showColorPicker={this.showColorPicker} backgroundColor={this.props.submittedState.headline_color} title='Heading' />
            </div>
            <div className='col-md-6 col-lg-6 col-sm-6'>
              <ColorPicker id='sub_background' name='background' showColorPicker={this.showColorPicker} backgroundColor={this.props.submittedState.background_color} title='Background' />
            </div>
            <div className='col-md-6 col-lg-6 col-sm-6'>
              <ColorPicker id='sub_button_background' name='button_background' showColorPicker={this.showColorPicker} backgroundColor={this.props.submittedState.button_background} title='Button Background' />
            </div>
            <div className='col-md-6 col-lg-6 col-sm-6'>
              <ColorPicker id='sub_button_text' name='button_text' showColorPicker={this.showColorPicker} backgroundColor={this.props.submittedState.button_text_color} title='Button Text' />
            </div>
          </div>
        </div>
        }
        { this.props.submittedState.action_type === 'redirect_to_url' &&
        <div>
          <div className='row'>
            <div className='col-md-12 col-lg-12 col-sm-12'>
              <label>Url to open after submission:</label>
              <input className='form-control m-input' placeholder='Input Url'
                        onChange={this.changeUrl}
                        defaultValue={this.props.submittedState.url}
                        value={this.props.submittedState.url} />
            </div>
          </div>
          <br />
          <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
              <label>Open this url:</label>
              <div className='radio-buttons' style={{marginLeft: '20px'}}>
                <div className='radio'>
                  <input id='new_tab'
                    type='radio'
                    value='new_tab'
                    name='new_tab'
                    onChange={this.changeTab}
                    checked={this.props.submittedState.tab === 'new_tab'} />
                  <label>In a new tab</label>
                </div>
                <div className='radio'>
                  <input id='current_tab'
                    type='radio'
                    value='current_tab'
                    name='current_tab'
                    onChange={this.changeTab}
                    checked={this.props.submittedState.tab === 'current_tab'} />
                  <label>In the current tab</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
        <br /><br />
        <Footer widgetState='submittedState' handleNext={this.props.handleNext} handleBack={this.props.handleBack} />
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
export default connect(mapStateToProps, mapDispatchToProps)(SubmittedState)
