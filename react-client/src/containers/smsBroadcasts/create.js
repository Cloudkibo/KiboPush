/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Select from 'react-select'
import { connect } from 'react-redux'
import { loadBroadcastsList, loadTwilioNumbers, sendBroadcast, getCount } from '../../redux/actions/smsBroadcasts.actions'
import { bindActionCreators } from 'redux'
import { Popover, PopoverBody } from 'reactstrap'
import { Picker } from 'emoji-mart'
import TargetCustomers from '../businessGateway/targetCustomers'
import AlertContainer from 'react-alert'
import { updateCurrentCustomersInfo, setDefaultCustomersInfo } from '../../redux/actions/businessGateway.actions'
import { fetchContactLists } from '../../redux/actions/contacts.actions'

class SmsBroadcast extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showEmojiPicker: false,
      message: '',
      fileColumns: [{'value': 'name', 'label': 'name'}, {'value': 'number', 'label': 'number'}],
      segmentationErrors: [],
      title: '',
      subscribersCount: 0,
      conditions: []
    }
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onMessageChange = this.onMessageChange.bind(this)
    this.toggleEmojiPicker = this.toggleEmojiPicker.bind(this)
    this.setEmoji = this.setEmoji.bind(this)
    this.validateSegmentation = this.validateSegmentation.bind(this)
    this.sendBroadcast = this.sendBroadcast.bind(this)
    this.clearFields = this.clearFields.bind(this)
    this.onGetCount = this.onGetCount.bind(this)
    this.debounce = this.debounce.bind(this)
    this.updateConditions = this.updateConditions.bind(this)
    this.handleListSelect = this.handleListSelect.bind(this)
    this.handleSegmentationType = this.handleSegmentationType.bind(this)
    props.setDefaultCustomersInfo({filter: []})
    props.getCount([], this.onGetCount)
    props.fetchContactLists()
  }
  updateConditions (conditions, update) {
    console.log('updating conditions', conditions)
    this.setState({conditions})
    if (update) {
      if (this.validateConditions(conditions)) {
        this.props.getCount(conditions, this.onGetCount)
      } else {
        this.setState({subscribersCount: 0})
      }
    }
  }

  validateConditions (conditions) {
    let invalid = false
    for (let i = 0; i < conditions.length; i++) {
      if (conditions[i].condition === '' && conditions[i].criteria === '' && conditions[i].text === '') {
        continue
      } else if (conditions[i].condition === '' || conditions[i].criteria === '' || conditions[i].text === '') {
       invalid = true
      }
    }
    return !invalid
  }
  debounce () {
    this.props.getCount(this.state.conditions, this.onGetCount)
  }

  onGetCount (data) {
    console.log('recieved count', data)
    this.setState({subscribersCount: data.subscribersCount})
  }

  onTitleChange (e) {
    this.setState({title: e.target.value})
  }

  clearFields () {
   // this.msg.success('Broadcast sent successfully')
    var conditions = [{condition: '', criteria: '', text: ''}]
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'filter', conditions)
    this.setState({title: '', message: '', segmentationErrors: []})
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

  setEmoji (emoji) {
    this.setState({
      message: this.state.message + emoji.native,
      showEmojiPicker: false
    })
  }

  onMessageChange (e) {
    this.setState({message: e.target.value})
  }

  toggleEmojiPicker () {
    this.setState({showEmojiPicker: !this.state.showEmojiPicker})
  }

  sendBroadcast () {
    console.log('this.props.location.state.number', this.props.location)
    if (this.state.title === '') {
      this.msg.error('Please enter the title of the broadcast')
    } else if (this.state.message === '') {
      this.msg.error('Please enter the message to send')
    } else if (this.validateSegmentation()) {
      this.props.sendBroadcast({payload: [{componentType: 'text', text: this.state.message, id: 0}],
        phoneNumber: this.props.location.state.number,
        platform: 'twilio',
        title: this.state.title,
        segmentation: this.state.segmentationType === 'basicSegmentation' && this.props.customersInfo && this.props.customersInfo.filter ? this.props.customersInfo.filter : '',
        listIds: this.state.segmentationType === 'listSegmentation' ? this.state.listIds : []
      }, this.clearFields, this.msg)
    }
  }

  handleSegmentationType (e) {
    this.setState({segmentationType: e.target.value})
  }

  handleListSelect (list) {
    this.setState({list})
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
      <div style={{minHeight: '85vh', maxHeight: '100vh', marginBottom: '0', overflow: 'auto'}} className='m-grid__item m-grid__item--fluid m-wrapper'>
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
                    <div className='m-portlet__head-tools'>
                    <button disabled={this.state.subscribersCount === 0 || !this.validateConditions(this.state.conditions)} id='send' onClick={this.sendBroadcast} className='btn btn-primary'>
                       Send
                      </button>
                    </div>
                  </div>
                  <div className='m-portlet__body'>
                    <div className='form-group m-form__group'>
                    <span style={{marginLeft: '20px'}}>
                      <i className='flaticon-exclamation m--font-brand' />
                      <p style={{display: 'inline', fontSize: '1.1em'}}> {`This broadcast will be sent to ${this.state.subscribersCount} ${this.state.subscribersCount === 1 ? 'subscriber' : 'subscribers'}`}</p>
                      </span>
                      <div className='col-3'>
                        <label className='col-form-label'>Push Message:</label>
                      </div>
                      <div className='col-12'>
                        <input value={this.state.title} placeholder={'Enter the title of the broadcast here...'}
                          className='form-control m-input' onChange={this.onTitleChange} />
                        <br />
                        <div className='m-input-icon m-input-icon--right m-messenger__form-controls' style={{backgroundColor: '#f4f5f8'}}>
                          <textarea
                            className='form-control m-input'
                            id='postTextArea' rows='3'
                            placeholder='Enter your message here...'
                            value={this.state.message}
                            onChange={this.onMessageChange} />
                          <span id='emogiPicker' className='m-input-icon__icon m-input-icon__icon--right'>
                            <span>
                              <i className='fa fa-smile-o' style={{cursor: 'pointer'}} onClick={this.toggleEmojiPicker} />
                            </span>
                          </span>
                          <Popover placement='left' isOpen={this.state.showEmojiPicker} className='facebooPostPopover' target='emogiPicker' toggle={this.toggleEmojiPicker}>
                            <PopoverBody>
                              <div>
                                <Picker
                                  emojiSize={24}
                                  perLine={6}
                                  skin={1}
                                  set='facebook'
                                  custom={[]}
                                  autoFocus={false}
                                  showPreview={false}
                                  onClick={(emoji, event) => this.setEmoji(emoji)}
                                />
                              </div>
                            </PopoverBody>
                          </Popover>
                        </div>
                      </div>
                    </div>
                    <div className='form-group m-form__group'>
                      <div className='col-3'>
                        <label className='col-form-label'>Select Segmentation:</label>
                      </div>
                      <div className='radio' style={{marginLeft: '35px'}}>
                        <input 
                          id='basicSegmentation'
                          type='radio'
                          value='basicSegmentation'
                          name='basicSegmentation'
                          onChange={this.handleSegmentationType}
                          checked={this.state.segmentationType === 'basicSegmentation'} />
                        <label>Apply Basic Segmentation</label>
                      </div>
                      {
                        this.state.segmentationType === 'basicSegmentation' &&
                          <TargetCustomers 
                            msg = {this.msg} 
                            fileColumns={this.state.fileColumns} 
                            updateConditions={this.updateConditions} 
                            debounce={this.debounce} 
                            segmentationErrors={this.state.segmentationErrors} 
                            resetErrors={() => { this.setState({segmentationErrors: []}) }} 
                          />
                      }
                      <div className='radio' style={{marginLeft: '35px'}}>
                        <input 
                          id='listSegmentation'
                          type='radio'
                          value='listSegmentation'
                          name='listSegmentation'
                          onChange={this.handleSegmentationType}
                          checked={this.state.segmentationType === 'listSegmentation'} />
                        <label>Use Subscriber Lists</label>
                      </div>
                      {
                        this.state.segmentationType === 'listSegmentation' &&
                        <div style={{marginLeft: '1px'}} className='form-group m-form__group row'>
                          <div className='col-lg-8'>
                            <Select
                              isMulti
                              options={this.props.contactLists ? this.props.contactLists.map(list => { return {value: list._id, label: list.name} }) : []}
                              onChange={this.handleListSelect}
                              value={this.state.list}
                              placeholder='Select List'
                            />
                          </div>
                        </div>
                      }
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
    broadcasts: (state.smsBroadcastsInfo.broadcasts),
    count: (state.smsBroadcastsInfo.count),
    twilioNumbers: (state.smsBroadcastsInfo.count),
    customersInfo: (state.businessGatewayInfo.customersInfo),
    contactLists: (state.contactsInfo.contactLists)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    loadBroadcastsList,
    loadTwilioNumbers,
    sendBroadcast,
    updateCurrentCustomersInfo,
    setDefaultCustomersInfo,
    getCount,
    fetchContactLists
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SmsBroadcast)
