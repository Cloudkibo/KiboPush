/* eslint-disable no-return-assign */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import {editBot, updateStatus, botDetails} from '../../redux/actions/smart_replies.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import AlertContainer from 'react-alert'

class ViewBot extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      id: '',
      name: '',
      page: '',
      payload: [],
      isActive: true
    }
    this.createUI = this.createUI.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.createBot = this.createBot.bind(this)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | View Bot`;
    if (this.props.location.state) {
      this.props.botDetails(this.props.location.state)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.showBotDetails) {
      console.log('This is supposed to be the botDetails', nextProps.showBotDetails)
      var botName = nextProps.showBotDetails.botName
      if (botName) {
        botName = botName.split('-').join(' ')
      }
      this.setState({id: nextProps.showBotDetails._id, name: botName, page: nextProps.showBotDetails.botName, isActive: nextProps.showBotDetails.isActive, payload: nextProps.showBotDetails.payload})
    }
  }

  changeStatus (e) {
    this.setState({isActive: e.target.value})
  }

  createUI () {
    let uiItems = []
    for (let i = 0; i < this.state.payload.length; i++) {
      uiItems.push(
        <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
          <br />
          <div className='panel panel-default field-editor'>
            <div className='panel-heading clearfix'>
              <strong className='panel-title'>Question {i + 1}</strong>
            </div>
            <div className='panel-body'>
              <div className='row'>
                <div className='col-xl-6 col-md-6 col-lg-6 col-sm-6'>
                  <div className='form-group' id={'question' + i}>
                    <label style={{fontWeight: 'normal'}}>Enter several variations of same question to train the bot.</label>
                  </div>
                  {this.createMore(i)}
                </div>
                <div className='col-xl-6 col-md-6 col-lg-6 col-sm-6' style={{borderLeft: '0.07rem solid #EBEDF2'}}>
                  <br />
                  <br />
                  <br />
                  <div className='m-input-icon m-input-icon--right'>
                    <textarea className='form-control'
                      placeholder='Type the answer of your questions here...'
                      rows='3' onChange={this.handleAnswerChange.bind(this, i)} value={this.state.payload[i].answer} disabled />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return uiItems || null
  }

  createMore (payloadIndex) {
    console.log('this.state.payload', this.state.payload)
    let uiItems = []
    for (let i = 0; i < this.state.payload[payloadIndex].questions.length; i++) {
      uiItems.push(
        <div>
          <div className='m-input-icon m-input-icon--right'>
            <input type='text' className='form-control m-input' placeholder='Enter new question here' value={this.state.payload[payloadIndex].questions[i]}
              onChange={this.handleQuestionChange.bind(this, i, payloadIndex)} disabled />
          </div>
          <br />
        </div>
      )
    }
    return uiItems || null
  }

  addMore (payloadIndex) {
    let payload = this.state.payload
    payload[payloadIndex].questions.push('')
    this.setState({payload: payload})
  }

  addClick () {
    let botQuestions = this.state.payload
    let questions = ['', '', '']
    botQuestions.push({
      'questions': questions,
      'answer': ''
    })
    this.setState({payload: botQuestions})
  }

  removeClick (i) {
    let botQuestions = this.state.payload.slice()
    botQuestions.splice(i, 1)
    this.setState({
      payload: botQuestions
    })
  }

  removeQuestion (i, payloadIndex) {
    let payload = this.state.payload
    payload[payloadIndex].questions = this.state.payload[payloadIndex].questions.slice()
    payload[payloadIndex].questions.splice(i, 1)
    this.setState({payload: payload})
  }

  handleQuestionChange (i, payloadIndex, event) {
    let payload = this.state.payload
    payload[payloadIndex].questions = this.state.payload[payloadIndex].questions.slice()
    payload[payloadIndex].questions[i] = event.target.value
    this.setState({payload: payload})
  }

  handleAnswerChange (i, event) {
    let payload = this.state.payload
    payload[i].answer = event.target.value
    this.setState({payload: payload})
  }

  createBot () {
    console.log('payload', this.state.payload)
    if (this.state.payload.length === 0) {
      this.msg.error('Please enter one question atleast')
      return
    } else {
      for (var i = 0; i < this.state.payload.length; i++) {
        if (this.state.payload[i].questions.length < 3) {
          this.msg.error('You must enter atleast 3 variations of a question')
          return
        } else {
          for (var j = 0; j < this.state.payload[i].questions.length; j++) {
            if (this.state.payload[i].questions[j] === '') {
              this.msg.error('You must enter atleast 3 variations of a question')
              return
            }
          }
        }
        if (this.state.payload[i].answer === '') {
          this.msg.error('You must enter answer of all the questions')
          return
        }
      }
    }
    this.props.editBot({botId: this.state.id, payload: this.state.payload})
    this.props.updateStatus({botId: this.state.id, isActive: this.state.isActive})
    this.props.browserHistory.push({
      pathname: `/bots`
    })
  }

  render () {
    console.log('Current state in ViewBot', this.state)
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Create Bot</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div id='identity' className='m-portlet m-portlet--mobile' style={{height: '100%'}}>
                <div className='m-portlet__body'>
                  <div className='col-xl-12'>
                    <div className='form-group' id='titl'>
                      <label className='control-label'>Bot Name:</label>
                      <input className='form-control'
                        value={this.state.name} disabled />
                    </div>
                  </div>
                  <br />
                  <div className='col-xl-12'>
                    <label>Assigned to Page:</label>&nbsp;&nbsp;
                    {this.props.showBotDetails && this.props.showBotDetails.pageId &&
                    <span>
                      <img alt='pic' style={{height: '30px'}} src={(this.props.showBotDetails.pageId.pagePic) ? this.props.showBotDetails.pageId.pagePic : 'icons/users.jpg'} />&nbsp;&nbsp;
                      <span>{this.props.showBotDetails.pageId.pageName}</span>
                    </span>
                  }
                  </div>
                  <br />
                  <div className='col-xl-12'>
                    <label className='control-label'>Status:</label>&nbsp;&nbsp;&nbsp;
                    <select className='custom-select' id='m_form_type' value={this.state.isActive} disabled onChange={this.changeStatus} style={{width: '500px'}}>
                      <option key='2' value='true'>Active</option>
                      <option key='3' value='false'>Disabled</option>
                    </select>
                  </div>
                  <br />
                  <div className='col-xl-12'>
                    <h5> Questions </h5>
                    {this.createUI()}
                  </div>
                  <br />
                </div>
                <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
                  <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px', 'marginBottom': '25px'}}>
                    <Link
                      to='/bots'
                      className='btn btn-secondary' style={{'marginLeft': '10px'}}>
                      Back
                    </Link>
                  </div>
                </div>
              </div>
              <br />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    showBotDetails: (state.botsInfo.botDetails)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      editBot: editBot,
      updateStatus: updateStatus,
      botDetails: botDetails
    }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewBot)
