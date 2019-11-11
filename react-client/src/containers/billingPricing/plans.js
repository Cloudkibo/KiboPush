/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { fetchAllPlans, deletePlan, createPlan, updatePlan, migrate, makeDefault } from '../../redux/actions/billingPricing.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { Popover, PopoverBody } from 'reactstrap'

class Plans extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModalDelete: false,
      isShowingModal: false,
      isShowingModalUpdate: false,
      isShowingModalMigrate: false,
      deleteid: '',
      name: '',
      interval: 'month',
      intervalOptions: [{value: 'day', text: 'daily'},
      {value: 'week', text: 'weekly'},
      {value: 'month', text: 'monthly'},
      {value: 'year', text: 'yearly'}],
      planOptions: [],
      trial: 0,
      amount: 0,
      editId: '',
      editName: '',
      editTrial: 0,
      editInterval: 'month',
      editAmount: 0,
      migrateTo: '',
      migrateFrom: '',
      disabled: true,
      openPopover: false,
      targetValue: ''
    }
    props.fetchAllPlans()
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.showDialogMigrate = this.showDialogMigrate.bind(this)
    this.closeDialogMigrate = this.closeDialogMigrate.bind(this)
    this.showDialogUpdate = this.showDialogUpdate.bind(this)
    this.closeDialogUpdate = this.closeDialogUpdate.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.goToCreate = this.goToCreate.bind(this)
    this.goToCancel = this.goToCancel.bind(this)
    this.goToUpdate = this.goToUpdate.bind(this)
    this.goToUpdateCancel = this.goToUpdateCancel.bind(this)
    this.updateName = this.updateName.bind(this)
    this.updateAmount = this.updateAmount.bind(this)
    this.updateInterval = this.updateInterval.bind(this)
    this.updateTrial = this.updateTrial.bind(this)
    this.migrateCompanies = this.migrateCompanies.bind(this)
    this.choosePlan = this.choosePlan.bind(this)
    this.openPopover = this.openPopover.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.makeDefault = this.makeDefault.bind(this)
  }

  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Plans`;
  }

  makeDefault (value) {
    var id = this.state.targetValue.split('-')
    this.setState({openPopover: false})
    this.props.makeDefault({plan_id: id[1], account_type: value}, this.msg)
  }
  openPopover (value) {
    console.log('openPopover')
    var val = 'buttonTarget-' + value
    this.setState({disabled: true, targetValue: val})
    this.setState({openPopover: !this.state.openPopover})
  }
  handleToggle () {
    this.setState({openPopover: !this.state.openPopover})
  }
  componentWillReceiveProps (nextprops) {
    if (nextprops.plans && nextprops.plans.length > 0) {
      var temp = []
      for (var i = 0; i < nextprops.plans.length; i++) {
        temp.push({value: nextprops.plans[i]._id, text: nextprops.plans[i].name})
      }
      this.setState({planOptions: temp, migrateTo: nextprops.plans[0]._id, migrateFrom: nextprops.plans[0]._id})
    }
  }
  goToCreate () {
    if (this.state.name === '') {
      this.msg.error('Please enter name')
    } else {
      this.setState({isShowingModal: false, name: '', amount: 0, interval: 'month', trial: 0})
      this.props.createPlan({name: this.state.name, amount: parseInt(this.state.amount), interval: this.state.interval, trial_period: parseInt(this.state.trial)}, this.msg)
    }
  }
  goToCancel () {
    this.setState({name: '', amount: 0, trial: 0, isShowingModal: false})
  }
  goToUpdate () {
    if (this.state.editName === '') {
      this.msg.error('Please enter name')
    } else {
      this.setState({isShowingModalUpdate: false})
      this.props.updatePlan({name: this.state.editName, unique_id: this.state.editId, trial_period: parseInt(this.state.editTrial)}, this.msg)
    }
  }
  goToUpdateCancel () {
    this.setState({isShowingModalUpdate: false})
  }
  updateName (e, module) {
    if (module === 'create') {
      this.setState({name: e.target.value})
    } else if (module === 'edit') {
      this.setState({editName: e.target.value})
    }
  }
  updateAmount (e) {
    this.setState({amount: e.target.value})
  }
  updateInterval (e, module) {
    if (module === 'create') {
      this.setState({interval: e.target.value})
    }
  }
  updateTrial (e, module) {
    if (module === 'create') {
      this.setState({trial: e.target.value})
    } else if (module === 'edit') {
      this.setState({editTrial: e.target.value})
    }
  }
  onDelete (companyCount, id) {
    console.log('id', id)
    if (companyCount > 0) {
      this.msg.error('Please migrate all companies of this plan before deleting')
    } else {
      this.showDialogDelete(id)
      this.refs.delete.click()
    }
  }

  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
  }

  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false})
  }
  showDialogUpdate (id, name, interval, trial, amount) {
    this.setState({isShowingModalUpdate: true, editId: id, editName: name, editInterval: interval, editTrial: trial, editAmount: amount})
  }

  closeDialogUpdate () {
    this.setState({isShowingModalUpdate: false})
  }
  showDialogMigrate () {
    this.setState({isShowingModalMigrate: true})
  }

  closeDialogMigrate () {
    this.setState({isShowingModalMigrate: false})
  }
  migrateCompanies (from, to) {
    if (this.state.migrateFrom !== this.state.migrateTo) {
      let from = this.props.plans.filter(plan => plan._id === this.state.migrateFrom)
      let to = this.props.plans.filter(plan => plan._id === this.state.migrateTo)
      this.props.migrate({
        from: { id: this.state.migrateFrom, unique_id: from[0].unique_ID },
        to: { id: this.state.migrateTo, unique_id: to[0].unique_ID }
      }, this.msg)
      this.setState({isShowingModalMigrate: false})
    }
  }
  choosePlan (e, module) {
    if (module === 'from') {
      this.setState({migrateFrom: e.target.value})
    } else if (module === 'to') {
      this.setState({migrateTo: e.target.value})
    }
    if (module === 'to' && this.state.migrateFrom === e.target.value) {
      console.log('in first')
      this.setState({disabled: true})
    } else if (module === 'from' && this.state.migrateTo === e.target.value) {
      console.log('in first')
      this.setState({disabled: true})
    } else {
      this.setState({disabled: false})
    }
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
          <a href='#/' style={{ display: 'none' }} ref='delete' data-toggle="modal" data-target="#delete">delete</a>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="delete" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Delete Plan
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Are you sure you want to delete this plan?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.props.deletePlan(this.state.deleteid, this.msg)
                  this.closeDialogDelete()
                }}>Delete
              </button>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="addPlan" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Add Plan
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <div className='m-form'>
                <div id='question' className='form-group m-form__group'>
                  <label className='control-label'>Plan Name:</label>
                  <input className='form-control' placeholder='Enter name here...'
                    value={this.state.name} onChange={(e) => this.updateName(e, 'create')} />
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <label className='control-label' style={{fontWeight: 'normal'}}>Amount:</label>
                    <div className='input-group'>
                      <span className='input-group-addon' id='basic-addon2'>
                        $
                      </span>
                      <input type='number' className='form-control m-input' placeholder='0' aria-describedby='basic-addon2' value={this.state.amount} onChange={(e) => this.updateAmount(e, 'create')} />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <label className='control-label' style={{fontWeight: 'normal'}}>Trial Period:</label>
                    <div className='input-group'>
                      <input type='number' className='form-control m-input' placeholder='0' aria-describedby='basic-addon2' value={this.state.trial} onChange={(e) => this.updateTrial(e, 'create')} />
                      <span className='input-group-addon' id='basic-addon2'>
                        days
                      </span>
                    </div>
                  </div>
                </div>
                <br />
                <label className='control-label' style={{fontWeight: 'normal'}}>Pricing Interval:</label><br />
                <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.interval} onChange={(e) => this.updateInterval(e, 'create')}>
                  {
                    this.state.intervalOptions.map((interval, i) => (
                      <option key={i} value={interval.value}>{interval.text}</option>
                    ))
                  }
                </select>
              </div>
              <br /><br />
              <div style={{width: '100%', textAlign: 'right'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-secondary' onClick={this.goToCancel}
                  data-modal='modal'>
                    Cancel
                  </button>
                </div>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button style={{color: 'white'}} onClick={this.goToCreate} className='btn btn-primary'
                  data-modal='modal'>
                    Create
                  </button>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="update" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Edit Plan
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <div className='m-form'>
                <div id='question' className='form-group m-form__group'>
                  <label className='control-label'>Plan Name:</label>
                  <input className='form-control' placeholder='Enter name here...'
                    value={this.state.editName} onChange={(e) => this.updateName(e, 'edit')} />
                </div>
                <div className='row'>
                  <div className='col-md-6'>
                    <label className='control-label' style={{fontWeight: 'normal'}}>Amount:</label>
                    <div className='input-group'>
                      <span className='input-group-addon' id='basic-addon2'>
                        $
                      </span>
                      <input type='number' className='form-control m-input' placeholder='0' aria-describedby='basic-addon2' value={this.state.editAmount} disabled />
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <label className='control-label' style={{fontWeight: 'normal'}}>Trial Period:</label>
                    <div className='input-group'>
                      <input type='number' className='form-control m-input' placeholder='0' aria-describedby='basic-addon2' value={this.state.editTrial} onChange={(e) => this.updateTrial(e, 'edit')} />
                      <span className='input-group-addon' id='basic-addon2'>
                        days
                      </span>
                    </div>
                  </div>
                </div>
                <br />
                <label className='control-label' style={{fontWeight: 'normal'}}>Pricing Interval:</label><br />
                <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.editInterval} disabled>
                  {
                    this.state.intervalOptions.map((interval, i) => (
                      <option key={i} value={interval.value}>{interval.text}</option>
                    ))
                  }
                </select>
              </div>
              <br /><br />
              <div style={{width: '100%', textAlign: 'right'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button className='btn btn-secondary' onClick={this.goToUpdateCancel}>
                    Cancel
                  </button>
                </div>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button style={{color: 'white'}} onClick={this.goToUpdate} className='btn btn-primary'>
                    Update
                  </button>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="migrate" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                  Migrate Companies
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <div className='m-form'>
                <label className='control-label' style={{fontWeight: 'normal'}}>Migrate Companies From:</label><br />
                <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.migrateFrom} onChange={(e) => this.choosePlan(e, 'from')}>
                  {
                    this.state.planOptions.map((plan, i) => (
                      <option key={i} value={plan.value}>{plan.text}</option>
                    ))
                  }
                </select>
              </div>
              <br />
              <div className='m-form'>
                <label className='control-label' style={{fontWeight: 'normal'}}>Migrate Companies To:</label><br />
                <select className='custom-select' id='m_form_type' style={{width: '250px'}} tabIndex='-98' value={this.state.migrateTo} onChange={(e) => this.choosePlan(e, 'to')}>
                  {
                    this.state.planOptions.map((plan, i) => (
                      <option key={i} value={plan.value}>{plan.text}</option>
                    ))
                  }
                </select>
              </div>
              <br /><br />
              <div style={{width: '100%', textAlign: 'right'}}>
                <div style={{display: 'inline-block', padding: '5px'}}>
                  <button style={{color: 'white'}} onClick={this.migrateCompanies} className='btn btn-primary' disabled={this.state.disabled}>
                    Migrate
                  </button>
                </div>
              </div>
                </div>
              </div>
            </div>
          </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Plans
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' data-toggle="modal" data-target="#migrate"  onClick={this.showDialogMigrate}>
                      <span>
                        <span>
                          Migrate Companies
                        </span>
                      </span>
                    </button>&nbsp;&nbsp;
                    <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' data-toggle="modal" data-target="#addPlan" onClick={this.showDialog}>
                      <span>
                        <i className='la la-plus' />
                        <span>
                          Add Plan
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='tab-content'>
                    <div className='tab-pane active m-scrollable' role='tabpanel'>
                      <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                        <div style={{height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                          <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                            <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                              <div className='tab-pane active' id='m_widget5_tab1_content' aria-expanded='true'>
                                <div className='m-widget5'>
                                  {this.props.plans && this.props.plans.map((plan, i) => (
                                    <div className='m-widget5__item' key={i} style={{border: '1px solid rgb(204, 204, 204)', boxShadow: 'rgb(204, 204, 204) 2px 5px', borderRadius: '10px'}}>
                                      <div className='m-widget5__content' style={{verticalAlign: 'bottom'}}>
                                        <h4 className='m-widget5__title'>
                                          {plan.name}&nbsp;&nbsp;
                                          {(plan.unique_ID === 'plan_B' || plan.unique_ID === 'plan_D' || plan.default_individual || plan.default_team) &&
                                            <span style={{border: '1px solid #34bfa3', padding: '0px 5px', borderRadius: '10px', fontSize: '12px'}}>
                                              <span className='m--font-success'>Default</span>
                                            </span>
                                          }
                                        </h4>
                                        <div className='m-widget5__info'>
                                          <span className='m-widget5__author'>
                                            Amount:&nbsp;
                                          </span>
                                          <span className='m-widget5__info-author m--font-info'>
                                            ${plan.amount}
                                          </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                          <span className='m-widget5__info-label'>
                                          Trial Period:&nbsp;
                                          </span>
                                          <span className='m-widget5__info-author m--font-info'>
                                            {plan.trial_period} days
                                          </span>
                                        </div>
                                      </div>
                                      <div className='m-widget5__stats1'>
                                        <center>
                                          <span className='m-widget5__number'>
                                            {plan.companyCount}
                                          </span>
                                          <br />
                                          <span className='m-widget5__sales'>
                                            Companies
                                          </span>
                                        </center>
                                      </div>
                                      <div className='m-widget5__stats1'>
                                        <center style={{cursor: 'pointer'}} data-toggle="modal" data-target="#update" onClick={() => this.showDialogUpdate(plan.unique_ID, plan.name, plan.interval ? plan.interval : 'month', plan.trial_period, plan.amount)}>
                                          <span className='m-widget5__number'>
                                            <i className='fa fa-edit' style={{fontSize: '1.5rem'}} />
                                          </span>
                                          <br />
                                          <span className='m-widget5__sales'>
                                            Edit
                                          </span>
                                        </center>
                                      </div>
                                      <div className='m-widget5__stats1'>
                                        {plan.unique_ID !== 'plan_B' && plan.unique_ID !== 'plan_D' && !plan.default_individual && !plan.default_team
                                        ? <center style={{cursor: 'pointer'}} onClick={() => this.onDelete(plan.companyCount, plan.unique_ID)}>
                                          <span className='m-widget5__number'>
                                            <i className='fa fa-trash' style={{fontSize: '1.5rem'}} />
                                          </span>
                                          <br />
                                          <span className='m-widget5__sales'>
                                            Delete
                                          </span>
                                        </center>
                                        : <center style={{cursor: 'not-allowed'}}>
                                          <span className='m-widget5__number'>
                                            <i className='fa fa-trash' style={{fontSize: '1.5rem'}} />
                                          </span>
                                          <br />
                                          <span className='m-widget5__sales'>
                                            Delete
                                          </span>
                                        </center>
                                      }
                                      </div>
                                      <div className='m-widget5__stats1' style={{verticalAlign: 'middle'}}>
                                        {plan.unique_ID !== 'plan_B' && plan.unique_ID !== 'plan_D' && !plan.default_individual && !plan.default_team
                                          ? <div>
                                            <center style={{cursor: 'pointer'}} onClick={() => this.openPopover(plan._id, i)} id={'buttonTarget-' + plan._id} ref={(b) => { this.target = b }}>
                                              <span className='m-widget5__number'>
                                                <i className='fa fa-ellipsis-v' style={{fontSize: '1.5rem'}} />
                                              </span>
                                            </center>
                                          </div>
                                          : <div>
                                            <center style={{cursor: 'not-allowed'}} id={'buttonTarget-' + plan._id} ref={(b) => { this.target = b }}>
                                              <span className='m-widget5__number'>
                                                <i className='fa fa-ellipsis-v' style={{fontSize: '1.5rem'}} />
                                              </span>
                                            </center>
                                          </div>
                                          }
                                      </div>
                                    </div>
                                  ))}
                                  {this.state.targetValue &&
                                  <Popover placement='bottom-end' isOpen={this.state.openPopover} target={this.state.targetValue} className='buttonPopoverPlan'>
                                    <PopoverBody>
                                      <div style={{color: '#6f727d'}}>
                                        <i className='fa fa-user' />&nbsp;&nbsp;<a href='#/' onClick={() => this.makeDefault('individual')} className='m-card-profile__email m-link' style={{cursor: 'pointer', marginTop: '5px'}}>
                                          Make Default Premium (Individual)
                                        </a>
                                        <br />
                                        <i className='fa fa-users' />&nbsp;&nbsp;<a href='#/' onClick={() => this.makeDefault('team')} className='m-card-profile__email m-link' style={{cursor: 'pointer', marginTop: '10px', marginBottom: '10px'}}>
                                          Make Default Premiuim (Team)
                                        </a>
                                      </div>
                                    </PopoverBody>
                                    </Popover>
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
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    plans: (state.billingPricingInfo.plans)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllPlans: fetchAllPlans,
    deletePlan: deletePlan,
    createPlan: createPlan,
    updatePlan: updatePlan,
    migrate: migrate,
    makeDefault: makeDefault
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Plans)
