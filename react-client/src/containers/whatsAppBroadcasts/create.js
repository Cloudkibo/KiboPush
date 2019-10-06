/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadBroadcastsList, sendBroadcast } from '../../redux/actions/whatsAppBroadcasts.actions'
import { bindActionCreators } from 'redux'
import TargetCustomers from '../businessGateway/targetCustomers'
import AlertContainer from 'react-alert'
import { updateCurrentCustomersInfo, setDefaultCustomersInfo } from '../../redux/actions/businessGateway.actions'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'

class CreateWhatsAppBroadcast extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      broadcast: [],
      convoTitle: 'Broadcast Title',
      message: 'Your appointment is coming up on {{1}} at {{2}}',
      fileColumns: [{'value': 'name', 'label': 'name'}, {'value': 'number', 'label': 'number'}],
      segmentationErrors: [],
      title: '',
      tabActive: 'broadcast'
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onMessageChange = this.onMessageChange.bind(this)
    this.validateSegmentation = this.validateSegmentation.bind(this)
    this.sendBroadcast = this.sendBroadcast.bind(this)
    this.clearFields = this.clearFields.bind(this)
    this.setInputValue = this.setInputValue.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onNext = this.onNext.bind(this)
    this.onPrevious = this.onPrevious.bind(this)
    this.initTab = this.initTab.bind(this)
    this.onTargetClick = this.onTargetClick.bind(this)
    this.onBroadcastClick = this.onBroadcastClick.bind(this)
    props.setDefaultCustomersInfo({filter: []})
  }

  onNext (e) {
    console.log('in onNext', this.state.broadcast)
    /* eslint-disable */
    $('#tab_1').removeClass('active')
    $('#tab_2').addClass('active')
    $('#titleBroadcast').removeClass('active')
    $('#titleTarget').addClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'target'})
  }

  onPrevious () {
    /* eslint-disable */
    $('#tab_1').addClass('active')
    $('#tab_2').removeClass('active')
    $('#titleBroadcast').addClass('active')
    $('#titleTarget').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }

  initTab () {
    /* eslint-disable */
    $('#tab_1').addClass('active')
    $('#tab_2').removeClass('active')
    $('#titleBroadcast').addClass('active')
    $('#titleTarget').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }
  onBroadcastClick () {
    /* eslint-disable */
    $('#tab_1').addClass('active')
    $('#tab_2').removeClass('active')
    $('#titleBroadcast').addClass('active')
    $('#titleTarget').removeClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'broadcast'})
  }
  onTargetClick (e) {
    /* eslint-disable */
    $('#tab_1').removeClass('active')
    $('#tab_2').addClass('active')
    $('#titleBroadcast').removeClass('active')
    $('#titleTarget').addClass('active')
    /* eslint-enable */
    this.setState({tabActive: 'target', resetTarget: false})
  }


  handleChange (state) {
    this.setState(state)
  }

  setInputValue (value) {
    if (value === 'appointment') {
      this.setState({message: 'Your appointment is coming up on {{1}} at {{2}}'})
    } else if (value === 'order') {
      this.setState({message: 'Your {{1}} order of {{2}} has shipped and should be delivered on {{3}}. Details: {{4}}'})
    } else if (value === 'verification') {
      this.setState({message: 'Your {{1}} code is {{2}}'})
    }
  }

  onTitleChange (e) {
    this.setState({title: e.target.value})
  }

  clearFields () {
    this.msg.success('Broadcast sent successfully')
    var conditions = [{condition: '', criteria: '', text: ''}]
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'filter', conditions)
    this.setState({title: '', message: 'Your appointment is coming up on {{1}} at {{2}}', segmentationErrors: []})
  }

  validateSegmentation () {
    let errors = false
    let errorMessages = []
    let conditionErrors = []
    let conditionError = {}
    let isErrorInCondition = false
    if (this.props.customersInfo.filter.length === 1 && this.props.customersInfo.filter[0].condition === '' && this.props.customersInfo.filter[0].criteria === '' && this.props.customersInfo.filter[0].text === '') {
      this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'filter', [])
      return !errors
    }
    for (let i = 0; i < this.props.customersInfo.filter.length; i++) {
      if (this.props.customersInfo.filter[i].condition === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'condition', index: i, message: 'Please choose a valid condition'}
        conditionErrors.push(conditionError)
      }
      if (this.props.customersInfo.filter[i].criteria === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'criteria', index: i, message: 'Please choose a valid criteria'}
        conditionErrors.push(conditionError)
      }
      if (this.props.customersInfo.filter[i].text === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'text', index: i, message: 'Please choose a valid value'}
        conditionErrors.push(conditionError)
      }
    }
    if (isErrorInCondition) {
      errorMessages.push({error: 'conditions', message: conditionErrors})
      this.setState({segmentationErrors: errorMessages})
    }
    return !errors
  }

  onMessageChange (e) {
    this.setState({message: e.target.value})
  }

  sendBroadcast () {
    console.log('this.props.location.state.number', this.props.location)
    if (this.state.title === '') {
      this.msg.error('Please enter the title of the broadcast')
    } else if (this.state.message === '') {
      this.msg.error('Please use one of the templates to send')
    } else if (this.validateSegmentation()) {
      this.props.sendBroadcast({payload: [{componentType: 'text', text: this.state.message, id: 0}],
        platform: 'Twilio WhatsApp',
        title: this.state.title,
        segmentation: this.props.customersInfo && this.props.customersInfo.filter ? this.props.customersInfo.filter : ''
      }, this.clearFields)
    }
  }

  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-content'>
          <div className='row'>
            <div
              className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div>
                  <div className='m-portlet__head'>
                    <div className='m-portlet__head-caption'>
                      <div className='m-portlet__head-title'>
                        <h3 className='m-portlet__head-text'>
                          Create Broadcast
                        </h3>
                      </div>
                    </div>
                    {/* <div className='m-portlet__head-tools'>
                      <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.sendBroadcast}>
                        <span>
                          <i className='flaticon flaticon-paper-plane' />
                          <span>Send</span>
                        </span>
                      </button>
                    </div> */}
                  </div>

                  <p style={{fontSize: '1.1em', marginTop: '30px', marginLeft: '30px'}}><strong>Note:</strong> Broadcasts will only be sent to those subscribers who have messaged you in the past 24 hours.</p>


                  <div className='m-portlet__body'>
                    <div className='row'>
                      <div className='col-12'>
                        {
                          this.state.tabActive === 'broadcast' &&
                          <div className='pull-right'>
                            <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} style={{marginRight: '10px'}} onClick={this.reset}>
                              Reset
                            </button>
                            <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.onNext}>
                              Next
                            </button>
                          </div>
                        }
                        {
                          this.state.tabActive === 'target' &&
                          <div className='pull-right'>
                            <button className='btn btn-primary' style={{marginRight: '10px'}} onClick={this.onPrevious}>
                              Previous
                            </button>
                            <button className='btn btn-primary' style={{marginRight: '10px'}} disabled={(this.state.pageValue === '' || (this.state.broadcast.length === 0))} onClick={this.testConvo}>
                              Test
                            </button>
                            <button id='send' onClick={this.sendConvo} className='btn btn-primary'>
                              Send
                            </button>
                          </div>
                        }
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-12'>
                        <ul className='nav nav-tabs'>
                          <li>
                            <a id='titleBroadcast' className='broadcastTabs active' onClick={this.onBroadcastClick}>Broadcast </a>
                          </li>
                          <li>
                            {this.state.broadcast.length > 0
                              ? <a id='titleTarget' className='broadcastTabs' onClick={this.onTargetClick}>Targeting </a>
                              : <a>Targeting</a>
                            }
                          </li>

                        </ul>
                        <div className='tab-content'>
                          <div className='tab-pane fade active in' id='tab_1'>
                            <GenericMessage
                              hiddenComponents={['link', 'video', 'card']}
                              broadcast={this.state.broadcast}
                              handleChange={this.handleChange}
                              setReset={reset => { this.reset = reset }}
                              convoTitle={this.state.convoTitle}
                              titleEditable
                              noButtons
                              pageId={''}
                              pages={[]}
                              buttonActions={this.state.buttonActions} />
                          </div>
                          <div className='tab-pane' id='tab_2'>
                            <TargetCustomers fileColumns={this.state.fileColumns} segmentationErrors={this.state.segmentationErrors} resetErrors={() => { this.setState({segmentationErrors: []}) }} />
                          </div>
                        </div>
                      </div>
                    </div>
                </div>



                  {/* <div className='m-portlet__body'>
                    <div className='form-group m-form__group'>
                      <div className='col-3'>
                        <label className='col-form-label'>Push Message:</label>
                      </div>
                      <div className='col-12'>
                        <input value={this.state.title} placeholder={'Enter the title of the broadcast here...'}
                          className='form-control m-input' onChange={this.onTitleChange} />
                        <br />
                        <label>Use one of the templates below:</label>
                        <div className='m-list-search'>
                          <div className='m-list-search__results'>
                            <a onClick={() => this.setInputValue('appointment')} className='m-list-search__result-item' style={{cursor: 'pointer'}}>
                              <span className='m-list-search__result-item-icon'>
                                <i className='flaticon flaticon-event-calendar-symbol m--font-warning' />
                              </span>
                              <span className='m-list-search__result-item-text'>
                              Appointment Reminders
                              </span>
                            </a>
                            <a onClick={() => this.setInputValue('order')} className='m-list-search__result-item' style={{cursor: 'pointer'}}>
                              <span className='m-list-search__result-item-icon'>
                                <i className='flaticon flaticon-truck m--font-success' />
                              </span>
                              <span className='m-list-search__result-item-text'>
                                Order Notifications
                              </span>
                            </a>
                            <a onClick={() => this.setInputValue('verification')} className='m-list-search__result-item' style={{cursor: 'pointer'}}>
                              <span className='m-list-search__result-item-icon'>
                                <i className='flaticon flaticon-chat m--font-info' />
                              </span>
                              <span className='m-list-search__result-item-text'>
                                Verification Codes
                              </span>
                            </a>
                          </div>
                        </div>
                        {/* <div className='form-group' style={{border: '1px solid rgb(204, 204, 204)', display: 'flex', borderRadius: '10px', padding: '20px'}}>
                          <span for='example-text-input' className='col-form-label'>Your appointment is coming up on&nbsp;&nbsp;</span>
                          <div><input className='form-control' /></div>
                          <span for='example-text-input' className='col-form-label'>&nbsp;&nbsp;at&nbsp;&nbsp;</span>
                          <div><input className='form-control' /></div>
                        </div>
                        */}
                        {/* <div className='m-input-icon m-input-icon--right m-messenger__form-controls' style={{backgroundColor: '#f4f5f8'}}>
                          <textarea
                            className='form-control m-input'
                            id='postTextArea' rows='3'
                            placeholder='Enter your message here...'
                            value={this.state.message}
                            onChange={this.onMessageChange} />
                        </div>
                      </div>
                    </div>
                    <div className='form-group m-form__group'>
                      <div className='col-3'>
                        <label className='col-form-label'>Targeting:</label>
                      </div>
                      <TargetCustomers fileColumns={this.state.fileColumns} segmentationErrors={this.state.segmentationErrors} resetErrors={() => { this.setState({segmentationErrors: []}) }} />
                    </div>
                  </div> */}
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
    broadcasts: (state.smsBroadcastsInfo.broadcasts),
    count: (state.smsBroadcastsInfo.count),
    customersInfo: (state.businessGatewayInfo.customersInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList,
    sendBroadcast,
    updateCurrentCustomersInfo,
    setDefaultCustomersInfo
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateWhatsAppBroadcast)
