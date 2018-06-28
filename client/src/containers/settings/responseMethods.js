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
      responseMethod: 'MIX_CHAT'
    }
    props.findResponseMethod()
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.saveResponseMethod = this.saveResponseMethod.bind(this)
    this.updateResponseMethod = this.updateResponseMethod.bind(this)
  }
  componentDidMount () {
    this.updateResponseMethod(this.props.responseMethod)
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
                    Response Methods
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
                  <p>All responses are automated</p>
                </div>
                <div className='radio'>
                  <input id='humanResponse'
                    type='radio'
                    value='humanResponse'
                    name='humanResponse'
                    onChange={this.handleRadioChange}
                    checked={this.state.selectedRadio === 'humanResponse'} />
                  <p>All responses are based on human agents</p>
                </div>
                <div className='radio'>
                  <input id='mixResponse'
                    type='radio'
                    value='mixResponse'
                    name='mixResponse'
                    onChange={this.handleRadioChange}
                    checked={this.state.selectedRadio === 'mixResponse'} />
                  <p>Responses are partially automated, with support by human agents</p>
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
    responseMethod: state.settingsInfo.responseMethod
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    saveResponseMethod: saveResponseMethod,
    findResponseMethod: findResponseMethod
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AutomationControls)
