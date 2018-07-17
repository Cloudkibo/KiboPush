/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllSequence, createSequence, fetchAllMessages, deleteMessage, setSchedule, createMessage, setStatus } from '../../redux/actions/sequence.action'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import { Popover, PopoverBody } from 'reactstrap'

class CreateSequence extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModalDelete: false,
      deleteid: '',
      error: false,
      openPopover: false,
      disabled: true,
      targetValue: '',
      selectedDays: '0',
      condition: 'immediately',
      sequenceId: ''
    }
    if (this.props.location.state && (this.props.location.state.module === 'edit' || this.props.location.state.module === 'view')) {
      props.fetchAllMessages(this.props.location.state._id)
    }
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleDone = this.handleDone.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.onDaysChange = this.onDaysChange.bind(this)
    this.changeCondition = this.changeCondition.bind(this)
    this.createMessage = this.createMessage.bind(this)
    this.changeStatus = this.changeStatus.bind(this)
    this.gotoView = this.gotoView.bind(this)
  }

  gotoView (message) {
    //  this.props.createSequence({name: this.state.name})
    if (message.payload && message.payload.length > 0) {
      browserHistory.push({
        pathname: `/viewMessage`,
        state: {title: message.title, payload: message.payload, id: this.state.sequenceId, messageId: message._id}
      })
    } else {
      browserHistory.push({
        pathname: `/createMessageSeq`,
        state: {title: message.title, payload: message.payload, id: this.state.sequenceId, messageId: message._id}
      })
    }
  }

  changeStatus (e, id) {
    this.props.setStatus({ messageId: id, isActive: e.target.checked }, this.state.sequenceId)
  }

  changeCondition (e) {
    this.setState({condition: e.target.value})
  }

  onDaysChange (e) {
    this.setState({selectedDays: e.target.value})
  }

  handleClick (value, i) {
    console.log('value', value)
    console.log('this.props.messages[i]', this.props.messages[i])
    this.setState({condition: this.props.messages[i].schedule.condition, selectedDays: this.props.messages[i].schedule.days, messageId: value})
    var val = 'buttonTarget-' + value
    this.setState({disabled: true, targetValue: val})
    this.setState({openPopover: !this.state.openPopover})
  }

  handleClose (e) {
    this.setState({openPopover: false, title: '', url: ''})
  }
  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
  }

  handleDone () {
    this.setState({openPopover: !this.state.openPopover})
    if (this.state.condition === 'immediately') {
      this.props.setSchedule({condition: 'immediately', days: '0', date: 'immediately', messageId: this.state.messageId}, this.state.sequenceId)
    } else {
      var d1 = new Date()
      if (this.state.condition === 'hours') {
        d1.setHours(d1.getHours() + Number(this.state.selectedDays))
      } else if (this.state.condition === 'minutes') {
        d1.setMinutes(d1.getMinutes() + Number(this.state.selectedDays))
      } else if (this.state.condition === 'day(s)') {
        d1.setDate(d1.getDate() + Number(this.state.selectedDays))
      }
      let utcDate = new Date(d1)   // We can keep the date for queue schedule purposes == don't remvoe it
      this.props.setSchedule({condition: this.state.condition, days: this.state.selectedDays, date: utcDate, messageId: this.state.messageId}, this.state.sequenceId)
    }
  }

  createMessage () {
    var d1 = new Date()
    d1.setDate(d1.getDate() + 1)
    var utcDate = new Date(d1).toISOString()
    this.props.createMessage({sequenceId: this.state.sequenceId, schedule: {condition: 'day(s)', days: '1', date: utcDate}, title: 'New Message', payload: []})
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  componentDidMount () {
    this.scrollToTop()
    if (this.props.location.state && this.props.location.state.module === 'edit') {
      this.setState({sequenceId: this.props.location.state._id})
    } else if (this.props.location.state && this.props.location.state.module === 'view') {
      this.setState({sequenceId: this.props.location.state._id})
    }
    document.title = 'KiboPush | Sequence Messaging'
  }
  updateName (e) {
    this.setState({name: e.target.value, error: false})
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.location.state.module === 'create' && nextProps.createdSequence !== '') {
      this.setState({sequenceId: nextProps.createdSequence._id})
      this.props.fetchAllMessages(nextProps.createdSequence._id)
    }
    if (nextProps.messages) {
      //  this.setState({condition: nextProps.messages.schedule.condition, selectedDays: nextProps.messages.schedule.selectedDays})
    }
  }

  initializeSwitch (state, id) {
    var self = this
    var temp = '#' + id
    /* eslint-disable */
    $(temp).bootstrapSwitch({
      /* eslint-enable */
      state: state
    })
    /* eslint-disable */
    $(temp).on('switchChange.bootstrapSwitch', function (event, state) {
      if (state === true) {
        self.props.setStatus({_id: event.target.attributes.id.nodeValue, isActive: true}, self.state.sequenceId)
      } else {
        self.props.setStatus({_id: event.target.attributes.id.nodeValue, isActive: false}, self.state.sequenceId)
      }
    })
  }
  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
            {
              this.state.isShowingModalDelete &&
              <ModalContainer style={{width: '500px'}}
                onClose={this.closeDialogDelete}>
                <ModalDialog style={{width: '500px'}}
                  onClose={this.closeDialogDelete}>
                  <h3>Delete Message</h3>
                  <p>Are you sure you want to delete this Message?</p>
                  <button style={{float: 'right'}}
                    className='btn btn-primary btn-sm'
                    onClick={() => {
                      this.props.deleteMessage(this.state.deleteid, this.msg, this.state.sequenceId)
                      this.closeDialogDelete()
                    }}>Delete
                  </button>
                </ModalDialog>
              </ModalContainer>
            }
            <div className='m-content'>
              <div className='m-portlet  m-portlet--full-height '>
              	<div className='m-portlet__head'>
              		<div className='m-portlet__head-caption'>
              			<div className='m-portlet__head-title'>
              				<h3 className='m-portlet__head-text'>
            				     {this.props.location.state.name}
              				</h3>
              			</div>
              		</div>
                  <div className='m-portlet__head-tools'>
                      <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.createMessage}>
                        <span>
                          <i className='la la-plus' />
                          <span>
                              Add Message
                            </span>
                        </span>
                      </button>
                  </div>
              	</div>
              	<div className='m-portlet__body'>
                  {this.props.messages && this.props.messages.length > 0
                  ? <div className='row'>
                    <div className='col-12'>
                      <p style={{marginTop: '10px'}}> <b>Note:</b> Subscribers who are engaged in live chat with an agent, will receive messages from this sequence after 30 mins of ending the conversation.</p>
                    </div>
                    <div className='col-xl-2 col-lg-2 col-md-2 col-sm-2'>
                      <div className='m-list-timeline'>
                        <div style={{float: 'right', textAlign: 'right'}}>
                          <div className='m-list-timeline__time'>
                            <div className='row' style={{height: '37px', width: 'max-content'}}>
                              <span className='m-list-timeline__text' style={{ width: '100px', marginTop: '6px', verticalAlign: 'middle', lineHeight: '40px'}}><label style={{fontWeight: '600'}}>Schedule</label></span>
                            </div>
                          </div>
                          {this.props.messages.map((message, i) => (
                          <div>
                          <div className='m-list-timeline__time'>
                            <div className='row' style={{height: '57px', width: 'max-content', cursor: 'pointer'}} id={'buttonTarget-' + message._id} ref={(b) => { this.target = b }} onClick={() => this.handleClick(message._id, i)}>
                              <span className='m-list-timeline__text' style={{ width: '200px', marginTop: '6px', verticalAlign: 'middle', lineHeight: `${i*33+97}px`}}>
                                {message.schedule.condition === 'immediately'
                                ? <u>immediately</u>
                                : <u>After {message.schedule.days} {message.schedule.condition}</u>
                                }
                            </span>
                            </div>
                          </div>
                        </div>
                        ))}
                        </div>
                      </div>
                    </div>
                    {this.state.targetValue &&
                    <Popover placement='right' isOpen={this.state.openPopover} style={{marginTop: '55px'}} target={this.state.targetValue} toggle={this.handleToggle}>
                      <PopoverBody style={{height: '230px'}}>
                        <div>
                          <label style={{fontWeight: 'normal'}}>This message will be sent</label>
                          <br /><br />
                            { this.state.condition !== 'immediately'
                              ? <div className='row'>
                              <div className='col-lg-6 col-md-6 col-sm-6'>
                               <input id='example-text-input' type='number' min='0' step='1' value={this.state.selectedDays} className='form-control' onChange={this.onDaysChange} />
                               </div>
                               {console.log('this.state.condition', this.state.condition)}
                               <div className='col-lg-6 col-md-6 col-sm-6'>
                                 <select className='form-control m-input' onChange={(e, i) => this.changeCondition(e, i)}
                                   value={this.state.condition}>
                                   <option value='immediately'>Immediately</option>
                                   <option value='minutes'>Minutes</option>
                                   <option value='hours'>Hours</option>
                                   <option value='day(s)'>Day(s)</option>
                                 </select>
                               </div>
                             </div>
                             : <select className='form-control m-input' onChange={(e, i) => this.changeCondition(e, i)}
                              value={this.state.condition}>
                              <option value='immediately'>Immediately</option>
                              <option value='minutes'>Minutes</option>
                              <option value='hours'>Hours</option>
                              <option value='days'>Day(s)</option>
                            </select>
                          }
                          <br />
                            <label style={{fontWeight: 'normal'}}>after a user is subscribed to this sequence</label>
                            <br /><br />
                          <button onClick={this.handleDone} className='btn btn-primary btn-sm pull-right'> Done </button>
                          <button style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} onClick={this.handleClose} className='btn pull-left'> Cancel </button>
                          <br />
                          <br />
                        </div>
                      </PopoverBody>
                    </Popover>
                  }
                    <div className='col-xl-10 col-lg-10 col-md-10 col-sm-10'>
                      <div className='m-list-timeline'>
                        <div className='m-list-timeline__items'>
                          <div className='m-list-timeline__item'>
                              <div className='row' style = {{padding: '5px', width: 'max-content', marginLeft: '30px'}}>
                                <span className='m-list-timeline__text' style={{width: '100px', marginTop: '10px'}}><label style={{fontWeight: '600'}}>Active</label></span>
                                <span className='m-list-timeline__text' style={{width: '290', marginTop: '10px'}}><label style={{fontWeight: '600'}}>Message</label></span>
                                <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}><label style={{fontWeight: '600'}}>Sent</label></span>
                                <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}><label style={{fontWeight: '600'}}>Seen</label></span>
                                <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}><label style={{fontWeight: '600'}}>Clicked</label></span>
                            </div>
                          </div>
                          {this.props.messages.map((message, i) => (
                            (i === (this.props.messages.length - 1)
                              ? <div className='m-list-timeline__item'>
                                  <span className='m-list-timeline__badge m-list-timeline__badge--success' style={{position: 'initial'}}></span>
                                  <div className='row' style = {{padding: '5px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '2px 5px #ccc', width: 'max-content', marginLeft: '10px', cursor: 'pointer', color: 'rgb(113, 106, 202)'}} ref={(b) => { this.target = b }}>
                                    <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
                                    <label>
                                      <input ref={message._id} type="checkbox" name="" defaultChecked={message.isActive} onChange={(e) => this.changeStatus(e, message._id)} />
                                      <span></span>
                                    </label>
                                   </span>
                                    <span className='m-list-timeline__text m-card-profile__email m-link' style={{width: '300px', marginTop: '10px', marginLeft: '50px'}} onClick={() => this.gotoView(message)}>Send <label style={{fontWeight: '500'}}>{message.title}</label></span>
                                    <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}>{message.sent}</span>
                                    <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}>{message.seen}</span>
                                    <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}>{message.clicks}</span>
                                    <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px', cursor: 'pointer'}}><i className='fa fa-trash-o' style={{pointer: 'cursor'}} onClick={() => this.showDialogDelete(message._id)} /></span>
                              </div>
                              </div>
                              : <div className='m-list-timeline__item'>
                                  <span className='m-list-timeline__badge m-list-timeline__badge--success' style={{position: 'initial'}}></span>
                                  <div className='row' style = {{padding: '5px', border: '1px solid #ccc', borderRadius: '10px', boxShadow: '2px 5px #ccc', width: 'max-content', marginLeft: '10px', cursor: 'pointer'}}>
                                    <span className='m-switch m-switch--outline m-switch--icon m-switch--success'>
    																<label>
    																	<input type="checkbox" defaultChecked={message.isActive} name="" onChange={(e) => this.changeStatus(e, message._id)} />
    																	<span></span>
    																</label>
    							                 </span>
                                    <span className='m-list-timeline__text m-card-profile__email m-link' style={{width: '300px', marginTop: '10px', marginLeft: '50px'}} onClick={() => this.gotoView(message)}>Send <label style={{fontWeight: '500'}}>{message.title}</label></span>
                                    <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}>{message.sent}</span>
                                    <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}>{message.seen}</span>
                                    <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}>{message.clicks}</span>
                                    <span className='m-list-timeline__text' style={{width: '80', marginTop: '10px'}}><i className='fa fa-trash-o' style={{pointer: 'cursor'}} onClick={() => this.showDialogDelete(message._id)} /></span>
                              </div>
                              </div>
                            )
                        ))}
                  </div>
                </div>
              </div>
            </div>
            : <div> No data to display</div>
          }
          </div>
          <div className='m-portlet__foot m-portlet__foot--fit' style={{'overflow': 'auto'}}>
            <div className='m-form__actions' style={{'float': 'right', 'marginTop': '25px', 'marginRight': '20px', 'marginBottom': '25px'}}>
              <Link
                to='/sequenceMessaging'
                className='btn btn-primary' style={{'marginLeft': '10px'}}>
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    sequences: (state.sequenceInfo.sequences),
    createdSequence: (state.sequenceInfo.createdSequence),
    messages: (state.sequenceInfo.messages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllSequence: fetchAllSequence,
    createSequence: createSequence,
    fetchAllMessages: fetchAllMessages,
    deleteMessage: deleteMessage,
    setSchedule: setSchedule,
    createMessage: createMessage,
    setStatus: setStatus
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSequence)
