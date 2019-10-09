/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { loadBroadcastsList, sendBroadcast, getCount } from '../../redux/actions/whatsAppBroadcasts.actions'
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
      title: 'Broadcast Title',
      tabActive: 'broadcast',
      subscribersCount: 0
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
    this.onGetCount = this.onGetCount.bind(this)
    this.updateConditions = this.updateConditions.bind(this)
    this.debounce = this.debounce.bind(this)
    props.setDefaultCustomersInfo({filter: []})
    props.getCount([], this.onGetCount)
    this.conditions = []
  }

  
  debounce () {
    this.props.getCount(this.conditions, this.onGetCount)
  }

  updateConditions (conditions, update) {
    console.log('updating conditions', conditions)
    this.conditions = conditions
    if (update) {
      this.props.getCount(this.conditions, this.onGetCount)
    }
  }

  onGetCount (data) {
    console.log('recieved count', data)
    this.setState({subscribersCount: data.subscribersCount})
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
    this.setState({tabActive: 'target'})
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
    this.initTab()
    this.reset(false)
  }

  validateConditions (conditions) {
    let invalid = false
    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i].condition === '' || conditions[i].criteria === '' || conditions[i].text === '') {
       invalid = true
      }
    }
    return !invalid
  }

  validateSegmentation (customersInfo) {
    let errors = false
    let errorMessages = []
    let conditionErrors = []
    let conditionError = {}
    let isErrorInCondition = false
    if (customersInfo.filter.length === 1 && customersInfo.filter[0].condition === '' && customersInfo.filter[0].criteria === '' && customersInfo.filter[0].text === '') {
      this.props.updateCurrentCustomersInfo(customersInfo, 'filter', [])
      return !errors
    }
    for (let i = 0; i < customersInfo.filter.length; i++) {
      if (customersInfo.filter[i].condition === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'condition', index: i, message: 'Please choose a valid condition'}
        conditionErrors.push(conditionError)
      }
      if (customersInfo.filter[i].criteria === '') {
        isErrorInCondition = true
        errors = true
        conditionError = {field: 'criteria', index: i, message: 'Please choose a valid criteria'}
        conditionErrors.push(conditionError)
      }
      if (customersInfo.filter[i].text === '') {
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
    console.log('sending broadcast', {payload: this.state.broadcast,
        platform: 'Twilio WhatsApp',
        title: this.state.title,
        segmentation: this.props.customersInfo && this.props.customersInfo.filter ? this.props.customersInfo.filter : ''
      })
    if (this.state.title === '') {
      this.msg.error('Please enter the title of the broadcast')
    } else if (this.validateSegmentation(this.props.customersInfo)) {
      this.props.sendBroadcast({payload: this.state.broadcast,
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
                            <button disabled={this.state.subscribersCount === 0} id='send' onClick={this.sendBroadcast} className='btn btn-primary'>
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
                              pages={undefined}
                              buttonActions={this.state.buttonActions} />
                          </div>
                          <div className='tab-pane' id='tab_2'>
                            <span style={{marginLeft: '20px'}}>
                              <i className='flaticon-exclamation m--font-brand' />
                              <p style={{display: 'inline', fontSize: '1.1em'}}> {`This broadcast will be sent to ${this.state.subscribersCount} ${this.state.subscribersCount === 1 ? 'subscriber' : 'subscribers'}`}</p>
                            </span>
                            <TargetCustomers debounce={this.debounce} updateConditions={this.updateConditions} style={{marginTop: '20px'}} fileColumns={this.state.fileColumns} segmentationErrors={this.state.segmentationErrors} resetErrors={() => { this.setState({segmentationErrors: []}) }} />
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
    customersInfo: (state.businessGatewayInfo.customersInfo)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList,
    sendBroadcast,
    updateCurrentCustomersInfo,
    setDefaultCustomersInfo,
    getCount
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateWhatsAppBroadcast)
