/* eslint-disable no-useless-constructor */
import React from 'react'
import { getAdvancedSettings, updateAdvancedSettings } from '../../redux/actions/settings.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'

class AdvancedSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      saveAutomationMessages: false,
      hideChatSessions: false
    }
    this.onChangeSaveSetting = this.onChangeSaveSetting.bind(this)
    this.onChangeChatSessionsSwitch = this.onChangeChatSessionsSwitch.bind(this)

    props.getAdvancedSettings()
  }

  onChangeSaveSetting (e) {
    const data = {
      saveAutomationMessages: e.target.checked
    }
    let advancedSettings = this.props.advancedSettings
    advancedSettings.saveAutomationMessages = e.target.checked
    this.setState({saveAutomationMessages: e.target.checked})
    this.props.updateAdvancedSettings(data, advancedSettings, this.msg)
  }

  onChangeChatSessionsSwitch (e) {
    const data = {
      hideChatSessions: e.target.checked
    }
    let advancedSettings = this.props.advancedSettings
    advancedSettings.hideChatSessions = e.target.checked
    this.setState({hideChatSessions: e.target.checked})
    this.props.updateAdvancedSettings(data, advancedSettings, this.msg)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.advancedSettings) {
      this.setState({
        saveAutomationMessages: nextProps.advancedSettings.saveAutomationMessages,
        hideChatSessions: nextProps.advancedSettings.hideChatSessions
      })
    }
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{height: '85vh'}} className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Advanced Settings
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <span className='m-widget4__sub'>
                    <div className='m-form__group form-group row'>
                      <span className='col-9 col-form-label'>
                        Save automation messages (broadcast, poll, survey, etc) in live chat
                      </span>
                      <div className='col-3'>
                        <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                          <label>
                            <input type='checkbox' data-switch='true' checked={this.state.saveAutomationMessages} onChange={(e) => {this.onChangeSaveSetting(e)}} />
                            <span></span>
                          </label>
                        </span>
                      </div>
                    </div>
                  </span>
                  <span className='m-widget4__sub'>
                    <div className='m-form__group form-group row'>
                      <span className='col-9 col-form-label'>
                        Hide chat sessions where subscriber did not send any chat message and just initiated session.
                      </span>
                      <div className='col-3'>
                        <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                          <label>
                            <input type='checkbox' data-switch='true' checked={this.state.hideChatSessions} onChange={(e) => {this.onChangeChatSessionsSwitch(e)}} />
                            <span></span>
                          </label>
                        </span>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    advancedSettings: (state.settingsInfo.advanced_settings)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getAdvancedSettings: getAdvancedSettings,
    updateAdvancedSettings: updateAdvancedSettings
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSettings)
