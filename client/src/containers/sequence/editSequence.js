/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { browserHistory, Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAllSequence, createSequence, fetchAllMessages, deleteMessage, setSchedule, createMessage, setStatus, updateSegmentation } from '../../redux/actions/sequence.action'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import { Popover, PopoverBody } from 'reactstrap'
import { loadMyPagesList } from '../../redux/actions/pages.actions'

class CreateSequence extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModalDelete: false,
      deleteid: '',
      error: false,
      openPopover: false,
      ShowTrigger:false,
      disabled: true,
      targetValue: '',
      selectedDays: '0',
      condition: 'immediately',
      sequenceId: '',
      isShowingModalSegmentation: false,
      segmentationOptions: [{
        'name': true,
        'page': true,
        'subscribed': true
      }],
      segmentation: [],
      segmentationCondition: 'any',
      selectedSequenceId: '',
      selectedMessageId: '',
      validSegmentation: false
    }
    if (this.props.location.state && (this.props.location.state.module === 'edit' || this.props.location.state.module === 'view')) {
      props.fetchAllMessages(this.props.location.state._id)
    }
    props.loadMyPagesList()
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.ShowDialogTrigger=this.ShowDialogTrigger.bind(this)
    this.CloseDialogTrigger=this.CloseDialogTrigger.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialogSegmentation = this.showDialogSegmentation.bind(this)
    this.closeDialogSegmentation = this.closeDialogSegmentation.bind(this)
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
    this.addSegmentationOption = this.addSegmentationOption.bind(this)
    this.removeSegmentationOption = this.removeSegmentationOption.bind(this)
    this.saveSegmentation = this.saveSegmentation.bind(this)
    this.onNameSegmentationChange = this.onNameSegmentationChange.bind(this)
    this.onPageSegmentationChange = this.onPageSegmentationChange.bind(this)
    this.onSubscribedSegmentationChange = this.onSubscribedSegmentationChange.bind(this)
    this.onNameConditionChange = this.onNameConditionChange.bind(this)
    this.onSubscribedCriteriaChange = this.onSubscribedCriteriaChange.bind(this)
    this.onNameCriteriaChange = this.onNameCriteriaChange.bind(this)
    this.onConditionChange = this.onConditionChange.bind(this)
    this.validateSegmentation = this.validateSegmentation.bind(this)
  }

  saveSegmentation () {
    this.props.updateSegmentation({
      messageId: this.state.selectedMessageId,
      sequenceId: this.state.selectedSequenceId,
      segmentationCondition: this.state.segmentationCondition,
      segmentation: this.state.segmentation
    })
  }

  validateSegmentation() {
    console.log('validating')
    if (this.state.segmentation.length === 0) {
      return false
    }
    let invalidSegment = this.state.segmentation.find((segment) => {
      return (!segment.value)
    })
    return !invalidSegment
  }

  onConditionChange (condition) {
    this.setState({segmentationCondition: condition})
  } 

  onNameCriteriaChange (criteria, id) {
    let segmentation = this.state.segmentation
    let segmentationIndex = segmentation.findIndex((o) => o.id === id)
    if (segmentationIndex >= 0) {
      segmentation[segmentationIndex].criteria = criteria
    } else {
      segmentation.push({
        'condition': 'first_name',
        'value': '',
        'criteria': criteria,
        'id': id
      })
    }
    console.log('segmentation', segmentation)
    this.setState({segmentation: segmentation})
  }

  onNameConditionChange (condition, id) {
    let segmentation = this.state.segmentation
    let segmentationIndex = segmentation.findIndex((o) => o.id === id)
    if (segmentationIndex >= 0) {
      segmentation[segmentationIndex].condition = condition
    } else {
      segmentation.push({
        'condition': condition,
        'value': '',
        'criteria': 'is',
        'id': id
      })
    }
    console.log('segmentation', segmentation)
    this.setState({segmentation: segmentation})
  }

  onSubscribedCriteriaChange (criteria, id) {
    let segmentation = this.state.segmentation
    let segmentationIndex = segmentation.findIndex((o) => o.id === id)
    if (segmentationIndex >= 0) {
      segmentation[segmentationIndex].criteria = criteria
    } else {
      segmentation.push({
        'condition': 'subscription_date',
        'value': '',
        'criteria': criteria,
        'id': id
      })
    }
    console.log('segmentation', segmentation)
    this.setState({segmentation: segmentation})
  }

  onNameSegmentationChange (value, id) {
    let segmentation = this.state.segmentation
    let segmentationIndex = segmentation.findIndex((o) => o.id === id)
    if (segmentationIndex >= 0) {
      segmentation[segmentationIndex].value = value
    } else {
      segmentation.push({
        'condition': 'first_name',
        'value': value,
        'criteria': 'is',
        'id': id
      })
    }
    console.log('segmentation', segmentation)
    this.setState({segmentation: segmentation})
  }

  onPageSegmentationChange (value, id) {
    let segmentation = this.state.segmentation
    let segmentationIndex = segmentation.findIndex((o) => o.id === id)
    if (segmentationIndex >= 0) {
      segmentation[segmentationIndex].value = value
    } else {
      segmentation.push({
        'condition': 'page',
        'value': value,
        'criteria': 'is',
        'id': id
      })
    }
    console.log('segmentation', segmentation)
    this.setState({segmentation: segmentation})
  }

  onSubscribedSegmentationChange (value, id) {
    let segmentation = this.state.segmentation
    let segmentationIndex = segmentation.findIndex((o) => o.id === id)
    if (segmentationIndex >= 0) {
      segmentation[segmentationIndex].value = value
    } else {
      segmentation.push({
        'condition': 'subscription_date',
        'value': value,
        'criteria': 'on',
        'id': id
      })
    }
    console.log('segmentation', segmentation)
    this.setState({segmentation: segmentation})
  }

  addSegmentationOption () {
    let segmentationOptions = this.state.segmentationOptions
    segmentationOptions.push(
      {
        'name': true,
        'page': true,
        'subscribed': true
      }
    )
    this.setState({segmentationOptions: segmentationOptions})
  }

  removeSegmentationOption (index, option) {
    let segmentationOptions = this.state.segmentationOptions
    segmentationOptions[index][option] = false
    let segmentation = this.state.segmentation
    segmentation.splice(index, 1)
    this.setState({segmentationOptions: segmentationOptions, segmentation: segmentation})
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

  showDialogSegmentation (message) {
    this.setState({isShowingModalSegmentation: true, selectedSequenceId: message.sequenceId, selectedMessageId: message._id})
  }

  closeDialogSegmentation () {
    this.setState({isShowingModalSegmentation: false})
  }

  ShowDialogTrigger (message){
    this.setState({ShowTrigger: true, selectedSequenceId: message.sequenceId, selectedMessageId: message._id})
}

  CloseDialogTrigger (message){
    this.setState({ShowTrigger: false})
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

            {
              this.state.isShowingModalSegmentation &&
              <ModalContainer style={{width: '500px', paddingLeft: '33px', paddingRight: '33px'}}
                onClose={this.closeDialogSegmentation}>
                <ModalDialog style={{width: '500px',  paddingLeft: '33px', paddingRight: '33px'}}
                  onClose={this.closeDialogSegmentation}>
                  <h3  style={{marginBottom: '20px'}}>Segment Subscribers</h3>
                  <div style={{marginBottom: '20px'}}>Subscribers match  
                        <select onChange={(e) => this.onConditionChange(e.target.value)} style={{marginLeft: '10px', marginRight: '10px'}}>
                          <option value='any'>any</option>
                          <option value='all'>all</option>
                      </select>
                      of the following conditions
                  </div>
                  {
                    this.state.segmentationOptions.map((option, i) => {
                      return (
                      <div key = {i}>    
                        {
                          option.name ? 
                        <div style={{marginBottom: '10px'}}>
                          <i onClick={() => this.removeSegmentationOption(i, 'name')} className="fa fa-minus-circle" style={{fontSize:'24px'}}></i> 
                          <select onChange={(e) => this.onNameConditionChange(e.target.value, 'name'+i)} style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '110px'}}>
                            <option value='first_name'>First Name</option>
                            <option value='last_name'>Last Name</option>
                        </select>
                        <select onChange={(e) => this.onNameCriteriaChange(e.target.value, 'name'+i)} style={{bottom: '3px', position: 'relative', marginLeft: '10px'}}>
                          <option value='is'>is</option>
                          <option value='contains'>contains</option>
                          <option value='begins_with'>begins with</option>
                          </select>
                          <input className='sequence-input' style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '165px'}} type='text' onChange={(e) => this.onNameSegmentationChange(e.target.value, 'name'+i)}></input>
                        </div> : null
                        }


                        {
                          option.page ? 
                        <div style={{marginBottom: '10px'}}>
                          <i onClick={() => this.removeSegmentationOption(i, 'page')} className="fa fa-minus-circle" style={{fontSize:'24px'}}></i> 
                          <select style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '110px'}}>
                            <option>
                              Page
                            </option>
                        </select>
                        <select style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '105px'}}>
                          <option>is</option>
                          </select>
                          <select className='sequence-input' style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '165px'}} onChange={(e) => this.onPageSegmentationChange(e.target.value, 'page'+i)} >
                          <option disabled selected value> -- Select a Page -- </option>
                          {
                              this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                                <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                              ))
                          }
                          </select>
                        </div> : null
                        }

                        {
                          option.subscribed ?            
                        <div style={{marginBottom: '10px'}}>
                          <i onClick={() => this.removeSegmentationOption(i, 'subscribed')} className="fa fa-minus-circle" style={{fontSize:'24px'}}></i> 
                          <select style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '110px'}}>
                            <option>Subscribed</option>
                        </select>
                        <select onChange={(e) => this.onSubscribedCriteriaChange(e.target.value, 'subscribed'+i)} style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '105px'}}>
                          <option>on</option>
                          <option>before</option>
                          <option>after</option>
                          </select>
                          <input className='sequence-input' style={{bottom: '3px', position: 'relative', marginLeft: '10px'}} type='date' onChange={(e) => this.onSubscribedSegmentationChange(e.target.value, 'subscribed'+i)}></input>
                        </div> : null
                        }
                      </div>
                      )
                      
                    })
                  }

                  <div onClick={() => this.addSegmentationOption()} className="sequence-link">
                    <i className="fa fa-plus-circle" style={{fontSize:'24px'}}></i> 
                    <span style={{bottom: '3px', position: 'relative', fontWeight: 'bold', marginLeft: '5px'}} >Add</span>
                  </div>

                    <button onClick={() => this.saveSegmentation()} className='btn btn-primary btn-md pull-right' style={{marginLeft: '20px'}} disabled={!this.validateSegmentation()}> Save </button>
                    <button onClick={() => this.closeDialogSegmentation()} style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} className='btn pull-right'> Cancel </button>
                </ModalDialog>
              </ModalContainer>
            }

            {
              this.state.ShowTrigger &&
              <ModalContainer style={{width: '500px', paddingLeft: '33px', paddingRight: '33px'}}
                onClose={this.closeDialogSegmentation}>
                <ModalDialog style={{width: '500px',  paddingLeft: '33px', paddingRight: '33px'}}
                  onClose={this.closeDialogSegmentation}>
                  <h3  style={{marginBottom: '20px'}}>Trigger Message</h3>
                  <div style={{marginBottom: '20px'}}>  This message will be triggerred when:

                    <h2> Subscriber</h2>
                        <select onChange={(e) => this.onConditionChange(e.target.value)} style={{marginLeft: '10px', marginRight: '10px'}}>
                          <option value='any'>any</option>
                          <option value='all'>all</option>
                      </select>
                      of the following conditions
                  </div>
                  {
                    this.state.segmentationOptions.map((option, i) => {
                      return (
                      <div key = {i}>    
                        {
                          option.name ? 
                        <div style={{marginBottom: '10px'}}>
                          <i onClick={() => this.removeSegmentationOption(i, 'name')} className="fa fa-minus-circle" style={{fontSize:'24px'}}></i> 
                          <select onChange={(e) => this.onNameConditionChange(e.target.value, 'name'+i)} style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '110px'}}>
                            <option value='first_name'>First Name</option>
                            <option value='last_name'>Last Name</option>
                        </select>
                        <select onChange={(e) => this.onNameCriteriaChange(e.target.value, 'name'+i)} style={{bottom: '3px', position: 'relative', marginLeft: '10px'}}>
                          <option value='is'>is</option>
                          <option value='contains'>contains</option>
                          <option value='begins_with'>begins with</option>
                          </select>
                          <input className='sequence-input' style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '165px'}} type='text' onChange={(e) => this.onNameSegmentationChange(e.target.value, 'name'+i)}></input>
                        </div> : null
                        }


                        {
                          option.page ? 
                        <div style={{marginBottom: '10px'}}>
                          <i onClick={() => this.removeSegmentationOption(i, 'page')} className="fa fa-minus-circle" style={{fontSize:'24px'}}></i> 
                          <select style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '110px'}}>
                            <option>
                              Page
                            </option>
                        </select>
                        <select style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '105px'}}>
                          <option>is</option>
                          </select>
                          <select className='sequence-input' style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '165px'}} onChange={(e) => this.onPageSegmentationChange(e.target.value, 'page'+i)} >
                          <option disabled selected value> -- Select a Page -- </option>
                          {
                              this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                                <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                              ))
                          }
                          </select>
                        </div> : null
                        }

                        {
                          option.subscribed ?            
                        <div style={{marginBottom: '10px'}}>
                          <i onClick={() => this.removeSegmentationOption(i, 'subscribed')} className="fa fa-minus-circle" style={{fontSize:'24px'}}></i> 
                          <select style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '110px'}}>
                            <option>Subscribed</option>
                        </select>
                        <select onChange={(e) => this.onSubscribedCriteriaChange(e.target.value, 'subscribed'+i)} style={{bottom: '3px', position: 'relative', marginLeft: '10px', minWidth: '105px'}}>
                          <option>on</option>
                          <option>before</option>
                          <option>after</option>
                          </select>
                          <input className='sequence-input' style={{bottom: '3px', position: 'relative', marginLeft: '10px'}} type='date' onChange={(e) => this.onSubscribedSegmentationChange(e.target.value, 'subscribed'+i)}></input>
                        </div> : null
                        }
                      </div>
                      )
                      
                    })
                  }

                  <div onClick={() => this.addSegmentationOption()} className="sequence-link">
                    <i className="fa fa-plus-circle" style={{fontSize:'24px'}}></i> 
                    <span style={{bottom: '3px', position: 'relative', fontWeight: 'bold', marginLeft: '5px'}} >Add</span>
                  </div>

                    <button onClick={() => this.saveSegmentation()} className='btn btn-primary btn-md pull-right' style={{marginLeft: '20px'}} disabled={!this.validateSegmentation()}> Save </button>
                    <button onClick={() => this.closeDialogSegmentation()} style={{color: '#333', backgroundColor: '#fff', borderColor: '#ccc'}} className='btn pull-right'> Cancel </button>
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
                  
                  


                      <div className='m-list-timeline'>
                        <div className='m-list-timeline__items'>
                          {
                          <div> 
                            {this.props.messages.map((message, i) => (
                            <div key={i} className='m-list-timeline__item'>
                                    <span className='m-list-timeline__badge m-list-timeline__badge--success' style={{position: 'initial'}}></span>
                                    <div className='sequence-box' style={{paddingBottom: 0}}>
                                  <div className='sequence-close-icon' onClick={() => this.showDialogDelete(message._id)}/>

                                  <span>
                                    <span className='sequence-link sequence-name' style={{display: 'block'}} onClick={() => this.gotoView(message)}>
                                      {message.title}
                                    </span>
                                    <br />

                                    <span style={{display: 'inline-block', marginBottom: '10px'}}>
                                      <span>Trigger</span>:
                                        <span className='sequence-trigger' style={{marginLeft: '10px'}}>
                                          None
                                        </span>
                                        <span onClick={() => this.ShowDialogTrigger(message)} className='sequence-link'> -- Edit</span>
                                    </span>

                                    <span style={{display: 'block'}}>
                                      <span>Schedule</span>:
                                        <span className='sequence-trigger' style={{marginLeft: '10px'}}>
                                          Immediately
                                        </span>
                                        <span className='sequence-link' id={'buttonTarget-' + message._id} ref={(b) => { this.target = b }} onClick={() => this.handleClick(message._id, i)}> -- Edit</span>
                                    </span>

                                    <span style={{display: 'inlineblock'}}>
                                      <span>Segment</span>:
                                        <span className='sequence-trigger' style={{marginLeft: '10px'}}>
                                          None
                                        </span>
                                      <span onClick={() => this.showDialogSegmentation(message)} className='sequence-link'> -- Edit</span>
                                    </span>
                                  </span>

                                  <span style={{position: 'relative', bottom: '60px', left: '40%'}}>
                                    <span className='sequence-text sequence-centered-text' style={{marginLeft: '19%'}}>
                                      <span className='sequence-number'>{message.sent}</span>
                                      <br />
                                      <span>Sent</span>
                                    </span>

                                    <span className='sequence-text sequence-centered-text' style={{marginLeft: '5%'}}>
                                      <span className='sequence-number'>{message.seen}</span>
                                      <br />
                                      <span>Seen</span>
                                    </span>

                                    <span className='sequence-text sequence-centered-text' style={{marginLeft: '4%'}}>
                                      <span className='sequence-number'>{message.clicks}</span>
                                      <br />
                                      <span>Clicked</span>
                                    </span>
                                  </span>
                                </div>
                                </div>
                            ))
                            }

                              </div>
                            }
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
    messages: (state.sequenceInfo.messages),
    pages: (state.pagesInfo.pages),
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
    setStatus: setStatus,
    loadMyPagesList: loadMyPagesList,
    updateSegmentation: updateSegmentation
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CreateSequence)
