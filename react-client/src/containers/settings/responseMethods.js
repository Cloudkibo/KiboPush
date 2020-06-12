/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { saveResponseMethod, findResponseMethod } from '../../redux/actions/settings.actions'

class AutomationControls extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedRadio: 'mixResponse',
      responseMethod: 'MIX_CHAT',
      showAgentName: false
    }
    props.findResponseMethod()
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.saveResponseMethod = this.saveResponseMethod.bind(this)
    this.updateResponseMethod = this.updateResponseMethod.bind(this)
    this.changeAgentNameSetting = this.changeAgentNameSetting.bind(this)
  }

  changeAgentNameSetting (e) {
    this.setState({
      showAgentName: e.target.checked
    })
  }

  componentDidMount () {
    this.updateResponseMethod(this.props.responseMethod, this.props.showAgentName)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    this.updateResponseMethod(nextProps.responseMethod, nextProps.showAgentName)
  }
  
  updateResponseMethod (responseMethod, showAgentName) {
    if (responseMethod) {
      var response = ''
      if (responseMethod === 'MIX_CHAT') {
        response = 'mixResponse'
      } else if (responseMethod === 'AUTOMATED_CHAT') {
        response = 'autoResponse'
      } else if (responseMethod === 'HUMAN_CHAT') {
        response = 'humanResponse'
      } else if (responseMethod === 'DISABLE_CHAT') {
        response = 'disableChat'
      } else {
        response = ''
      }
      this.setState({
        responseMethod: responseMethod,
        selectedRadio: response
      })
    }
    if (showAgentName) {
      this.setState({showAgentName})
    }
  }

  saveResponseMethod () {
    this.props.saveResponseMethod({automated_options: this.state.responseMethod, showAgentName: this.state.showAgentName}, this.msg)
  }
  
  handleRadioChange (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'autoResponse') {
      this.setState({responseMethod: 'AUTOMATED_CHAT'})
    }
    if (e.currentTarget.value === 'humanResponse') {
      this.setState({responseMethod: 'HUMAN_CHAT'})
    }
    if (e.currentTarget.value === 'mixResponse') {
      this.setState({responseMethod: 'MIX_CHAT'})
    }
    if (e.currentTarget.value === 'disableChat') {
      this.setState({responseMethod: 'DISABLE_CHAT'})
    }
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-list-2 m--hide' />
                    Live Chat Response Methods
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='m-portlet__body'>
            <div className='row align-items-center'>
              <div className='radio-buttons' style={{marginLeft: '37px'}}>
                <div className='radio'>
                  <input id='autoResponse'
                    type='radio'
                    value='autoResponse'
                    name='autoResponse'
                    onChange={this.handleRadioChange}
                    checked={this.state.selectedRadio === 'autoResponse'} />
                  <p>All responses are automated (only chatbot would respond to subscribers)</p>
                </div>
                <div className='radio'>
                  <input id='humanResponse'
                    type='radio'
                    value='humanResponse'
                    name='humanResponse'
                    onChange={this.handleRadioChange}
                    checked={this.state.selectedRadio === 'humanResponse'} />
                  <p>All responses are from human agent (chatbot would be disabled and human agent would respond)</p>
                </div>
                <div className='radio'>
                  <input id='mixResponse'
                    type='radio'
                    value='mixResponse'
                    name='mixResponse'
                    onChange={this.handleRadioChange}
                    checked={this.state.selectedRadio === 'mixResponse'} />
                  <p>Both Human And Chatbot give response (when agent responds to the subscriber, chatbot would be disabled for 30 minutes)</p>
                </div>
                <div className='radio'>
                  <input id='disableChat'
                    type='radio'
                    value='disableChat'
                    name='disableChat'
                    onChange={this.handleRadioChange}
                    checked={this.state.selectedRadio === 'disableChat'} />
                  <p>Disable Live Chat entirely (No chat would be stored and you won’t be able to chat with subscribers)</p>
                </div>
              </div>

              <div className='row' style={{marginLeft: '5px', marginTop: '10px', marginBottom: '-10px'}}>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <span className='m-widget4__sub'>
                    <div className='m-form__group form-group row'>
                      <span className='col-10 col-form-label'>
                        Show agent name when sending messages
                      </span>
                      <div className='col-2'>
                        <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                          <label>
                            <input type='checkbox' data-switch='true' checked={this.state.showAgentName} onChange={this.changeAgentNameSetting} />
                            <span></span>
                          </label>
                        </span>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </div>
            <div className='row'>
              <button className='btn btn-primary' style={{marginLeft: '20px', marginTop: '20px'}} disabled={this.state.responseMethod === ''} onClick={(e) => this.saveResponseMethod(e)}>Save</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    responseMethod: state.settingsInfo.responseMethod,
    showAgentName: state.settingsInfo.showAgentName
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    saveResponseMethod: saveResponseMethod,
    findResponseMethod: findResponseMethod
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AutomationControls)
