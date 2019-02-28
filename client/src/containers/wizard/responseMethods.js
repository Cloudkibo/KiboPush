/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import AlertContainer from 'react-alert'
import { saveResponseMethod, findResponseMethod } from '../../redux/actions/settings.actions'
import Sidebar from './sidebar'
import Header from './header'
import { Link } from 'react-router'

class AutomationControls extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedRadio: 'mixResponse',
      responseMethod: 'MIX_CHAT'
    }
    props.findResponseMethod()
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.saveResponseMethod = this.saveResponseMethod.bind(this)
    this.updateResponseMethod = this.updateResponseMethod.bind(this)
  }

  componentDidMount () {
    this.updateResponseMethod(this.props.responseMethod)
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Response Methods`
  }
  componentWillReceiveProps (nextProps) {
    this.updateResponseMethod(nextProps.responseMethod)
  }
  updateResponseMethod (responseMethod) {
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
  }
  saveResponseMethod () {
    this.props.saveResponseMethod({automated_options: this.state.responseMethod}, this.msg)
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
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div className='m-content'>
          <div className='m-portlet m-portlet--full-height'>
            <div className='m-portlet__body m-portlet__body--no-padding'>
              <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                  <Sidebar step='6' isBuyer={this.props.user.role === 'buyer'} user={this.props.user} stepNumber={4} />
                  <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', webkitBoxShadow: 'none', boxShadow: 'none'}}>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Step {5}: Live Chat Response Methods
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='row align-items-center'>
                        <div className='radio-buttons' style={{ marginLeft: '37px' }}>
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
                      </div>
                      <div className='row'>
                        <button className='btn btn-primary' style={{ marginLeft: '20px', marginTop: '20px' }} disabled={this.state.responseMethod === ''} onClick={(e) => this.saveResponseMethod(e)}>Save</button>
                      </div>
                    </div>
                    <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                      <div className='m-form__actions'>
                        <div className='row'>
                          <div className='col-lg-6 m--align-left' >
                            <Link to='/menuWizard' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                              <span>
                                <i className='la la-arrow-left' />
                                <span>Back</span>&nbsp;&nbsp;
                              </span>
                            </Link>
                          </div>
                          <div className='col-lg-6 m--align-right'>
                            {this.props.user && this.props.user.isSuperUser
                            ? <Link to='/finish' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                              <span>
                                <span>Next</span>&nbsp;&nbsp;
                                <i className='la la-arrow-right' />
                              </span>
                            </Link>
                            : <Link to='/finish' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                              <span>
                                <span>Next</span>&nbsp;&nbsp;
                                <i className='la la-arrow-right' />
                              </span>
                            </Link>
                          }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
    responseMethod: (state.settingsInfo.responseMethod),
    user: (state.basicInfo.user)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    saveResponseMethod: saveResponseMethod,
    findResponseMethod: findResponseMethod
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AutomationControls)
