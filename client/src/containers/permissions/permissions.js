/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { fetchAllPermissions, updatePermissions } from '../../redux/actions/permissions.actions'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import AddPermission from './addPermission'

class Permissions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      permissionCheckboxes: [{name: 'API Permission', nick: 'apiPermission', selected: false},
      {name: 'Autoposting Permission', nick: 'autopostingPermission', selected: false},
      {name: 'Billing Permission', nick: 'billingPermission', selected: false},
      {name: 'Broadcast Permission', nick: 'broadcastPermission', selected: false},
      {name: 'Company Permission', nick: 'companyPermission', selected: false},
      {name: 'Company Update Permission', nick: 'companyUpdatePermission', selected: false},
      {name: 'Customer Matching Permission', nick: 'customerMatchingPermission', selected: false},
      {name: 'Dashboard Permission', nick: 'dashboardPermission', selected: false},
      {name: 'Delete Admin Permission', nick: 'deleteAdminPermission', selected: false},
      {name: 'Delete Agent Permission', nick: 'deleteAgentPermission', selected: false},
      {name: 'Downgrade Service', nick: 'downgradeService', selected: false},
      {name: 'Inivitations Permission', nick: 'invitationsPermission', selected: false},
      {name: 'Invite Admin Permission', nick: 'inviteAdminPermission', selected: false},
      {name: 'Invite Agent Permission', nick: 'inviteAgentPermission', selected: false},
      {name: 'Livechat Permission', nick: 'livechatPermission', selected: false},
      {name: 'Members Permission', nick: 'membersPermission', selected: false},
      {name: 'Menu Permission', nick: 'menuPermission', selected: false},
      {name: 'Pages Access Permission', nick: 'pagesAccessPermission', selected: false},
      {name: 'Pages Permission', nick: 'pagesPermission', selected: false},
      {name: 'Polls Permission', nick: 'pollsPermission', selected: false},
      {name: 'Subscriber Permission', nick: 'subscriberPermission', selected: false},
      {name: 'Terminate Service', nick: 'terminateService', selected: false},
      {name: 'Update Role Permission', nick: 'updateRolePermission', selected: false},
      {name: 'Upgrade Service', nick: 'upgradeService', selected: false}],
      selectedCheckbox: '',
      selectAllChecked: false,
      showPlusBuyer: true,
      showPlusAdmin: true,
      showPlusAgent: true,
      isShowingModal: false,
      openTab: ''
    }
    this.fetchPermissions = this.fetchPermissions.bind(this)
    this.showPermissions = this.showPermissions.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
    this.handleCheckboxClick = this.handleCheckboxClick.bind(this)
    this.updatePermissions = this.updatePermissions.bind(this)
  }
  handleCheckboxClick (e) {
    console.log('in handleCheckboxClick')
    var permissionCheckboxes = this.state.permissionCheckboxes
    var count = 0
    if (e.target.value === 'All') {
      if (e.target.checked) {
        this.setState({
          selectAllChecked: true
        })
        for (var j = 0; j < this.state.permissionCheckboxes.length; j++) {
          permissionCheckboxes[j].selected = true
        }
      } else {
        this.setState({
          selectAllChecked: false
        })
        for (var m = 0; m < this.state.permissionCheckboxes.length; m++) {
          permissionCheckboxes[m].selected = false
        }
      }
      this.setState({permissionCheckboxes: permissionCheckboxes})
      //  this.setState({subscriptionsData: subscriptionsAll})
      return
    }
    if (e.target.value !== '') {
      if (e.target.checked) {
        for (var p = 0; p < this.state.permissionCheckboxes.length; p++) {
          if (permissionCheckboxes[p].nick === e.target.value) {
            permissionCheckboxes[p].selected = true
          }
        }
        for (var a = 0; a < permissionCheckboxes.length; a++) {
          if (permissionCheckboxes[a].selected === true) {
            count = count + 1
          }
        }
        if (count === this.state.permissionCheckboxes.length) {
          this.setState({selectAllChecked: true})
        } else {
          this.setState({selectAllChecked: false})
        }
        this.setState({permissionCheckboxes: permissionCheckboxes})
      } else {
        for (var q = 0; q < this.state.permissionCheckboxes.length; q++) {
          if (permissionCheckboxes[q].nick === e.target.value) {
            permissionCheckboxes[q].selected = false
          }
        }
        // subscribers[e.target.value].selected = false
        this.setState({permissionCheckboxes: permissionCheckboxes, selectAllChecked: false})
        // this.setState({subscribersDataAll: subscribersAll})
      }
    }
  }
  fetchPermissions (value) {
    if (value === 'buyer') {
      this.setState({showPlusBuyer: !this.state.showPlusBuyer, showPlusAdmin: true, showPlusAgent: true, openTab: 'buyer'})
    } else if (value === 'admin') {
      this.setState({showPlusAdmin: !this.state.showPlusAdmin, showPlusBuyer: true, showPlusAgent: true, openTab: 'admin'})
    } else if (value === 'agent') {
      this.setState({showPlusAgent: !this.state.showPlusAgent, showPlusBuyer: true, showPlusAdmin: true, openTab: 'agent'})
    }
    this.props.fetchAllPermissions(value)
  }
  componentWillReceiveProps (nextprops) {
    if (nextprops.permissions) {
      console.log('permissions', nextprops.permissions)
      var temp = []
      var count = 0
      var i
      for (i in nextprops.permissions) {
        for (var a = 0; a < this.state.permissionCheckboxes.length; a++) {
          if (i === this.state.permissionCheckboxes[a].nick) {
            temp.push({name: this.state.permissionCheckboxes[a].name, nick: this.state.permissionCheckboxes[a].nick, selected: nextprops.permissions[i]})
          }
        }
        if (nextprops.permissions[i] === true) {
          count = count + 1
        }
      }
      if (count === this.state.permissionCheckboxes.length) {
        this.setState({selectAllChecked: true})
      } else {
        this.setState({selectAllChecked: false})
      }
      console.log('count', count)
      this.setState({permissionCheckboxes: temp})
      console.log('temp', temp)
    }
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false, name: ''})
  }
  updatePermissions () {
    var data = {}
    for (var i = 0; i < this.state.permissionCheckboxes.length; i++) {
      data[this.state.permissionCheckboxes[i].nick] = this.state.permissionCheckboxes[i].selected
    }
    data['role'] = this.state.openTab
    console.log('data', data)
    this.props.updatePermissions(this.state.openTab, {permissions: data}, this.msg)
  }
  showPermissions () {
    let table = []
    for (var i = 0; i < this.state.permissionCheckboxes.length; i += 3) {
      table.push(
        <div className='row' style={{paddingLeft: '50px'}}>
          {this.state.permissionCheckboxes[i] &&
          <div className='col-md-4'>
            <span>
              <input type='checkbox' value={this.state.permissionCheckboxes[i].nick} onChange={this.handleCheckboxClick} checked={this.state.permissionCheckboxes[i].selected} />&nbsp;&nbsp;
              {this.state.permissionCheckboxes[i].name}
            </span>
          </div>
          }
          {this.state.permissionCheckboxes[i + 1] &&
            <div className='col-md-4'>
              <span>
                <input type='checkbox' value={this.state.permissionCheckboxes[i + 1].nick} onChange={this.handleCheckboxClick} checked={this.state.permissionCheckboxes[i + 1].selected} />&nbsp;&nbsp;
                {this.state.permissionCheckboxes[i + 1].name}
              </span>
            </div>
          }
          {this.state.permissionCheckboxes[i + 2] &&
            <div className='col-md-4'>
              <span>
                <input type='checkbox' value={this.state.permissionCheckboxes[i + 2].nick} onChange={this.handleCheckboxClick} checked={this.state.permissionCheckboxes[i + 2].selected} />&nbsp;&nbsp;
                {this.state.permissionCheckboxes[i + 2].name}
              </span>
            </div>
          }
        </div>
        )
    }
    return table
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
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            {
              this.state.isShowingModal &&
              <ModalContainer style={{width: '500px'}}
                onClose={this.closeDialog}>
                <ModalDialog style={{width: '500px'}}
                  onClose={this.closeDialog}>
                  <AddPermission msg={this.msg} closeDialog={this.closeDialog} openTab={this.state.openTab} />
                </ModalDialog>
              </ModalContainer>
            }
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='m-portlet'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Permissions
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog}>
                          <span>
                            <i className='la la-plus' />
                            <span>
                              Add Permission
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
                                    <div className='panel-group accordion' id='accordion1'>
                                      <div className='panel panel-default'>
                                        <div className='panel-heading guidelines-heading'>
                                          <h4 className='panel-title'>
                                            <a onClick={() => this.fetchPermissions('buyer')} className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Buyer Permissions
                                              {this.state.showPlusBuyer
                                              ? <i className='fa fa-plus' style={{float: 'right', fontSize: '1.5rem'}} />
                                              : <i className='fa fa-minus' style={{float: 'right', fontSize: '1.5rem'}} />
                                              }
                                            </a>
                                          </h4>
                                        </div>
                                        <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                                          <div className='panel-body'>
                                            <div className='form-group m-form__group'>
                                              <span style={{width: '30px', overflow: 'inherit'}}>
                                                <input type='checkbox' name='Select All' value='All' checked={this.state.selectAllChecked} onChange={this.handleCheckboxClick} />&nbsp;&nbsp;Select All</span>&nbsp;&nbsp;
                                              <br />
                                              {this.showPermissions()}
                                            </div>
                                            <br />
                                            <div className='m-portlet__foot m-portlet__foot--fit'>
                                              <button className='btn btn-primary' style={{float: 'right', marginTop: '10px'}} onClick={this.updatePermissions}> Save
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className='panel panel-default'>
                                        <div className='panel-heading guidelines-heading'>
                                          <h4 className='panel-title'>
                                            <a onClick={() => this.fetchPermissions('admin')} className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Admin Permissions
                                              {this.state.showPlusAdmin
                                              ? <i className='fa fa-plus' style={{float: 'right', fontSize: '1.5rem'}} />
                                              : <i className='fa fa-minus' style={{float: 'right', fontSize: '1.5rem'}} />
                                              }
                                            </a>
                                          </h4>
                                        </div>
                                        <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                                          <div className='panel-body'>
                                            <div className='form-group m-form__group'>
                                              <span style={{width: '30px', overflow: 'inherit'}}>
                                                <input type='checkbox' name='Select All' value='All' checked={this.state.selectAllChecked} onChange={this.handleCheckboxClick} />&nbsp;&nbsp;Select All</span>&nbsp;&nbsp;
                                              <br />
                                              {this.showPermissions()}
                                            </div>
                                            <br />
                                            <div className='m-portlet__foot m-portlet__foot--fit'>
                                              <button className='btn btn-primary' style={{float: 'right', marginTop: '10px'}} onClick={this.updatePermissions}> Save
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className='panel panel-default'>
                                        <div className='panel-heading guidelines-heading'>
                                          <h4 className='panel-title'>
                                            <a onClick={() => this.fetchPermissions('agent')} className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_3' aria-expanded='false'>Agent Permissions
                                              {this.state.showPlusAgent
                                              ? <i className='fa fa-plus' style={{float: 'right', fontSize: '1.5rem'}} />
                                              : <i className='fa fa-minus' style={{float: 'right', fontSize: '1.5rem'}} />
                                              }
                                            </a>
                                          </h4>
                                        </div>
                                        <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                                          <div className='panel-body'>
                                            <div className='form-group m-form__group'>
                                              <span style={{width: '30px', overflow: 'inherit'}}>
                                                <input type='checkbox' name='Select All' value='All' checked={this.state.selectAllChecked} onChange={this.handleCheckboxClick} />&nbsp;&nbsp;Select All</span>&nbsp;&nbsp;
                                              <br />
                                              {this.showPermissions()}
                                            </div>
                                            <br />
                                            <div className='m-portlet__foot m-portlet__foot--fit'>
                                              <button className='btn btn-primary' style={{float: 'right', marginTop: '10px'}} onClick={this.updatePermissions}> Save
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* <div className='m-widget5'>
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
                                            <center style={{cursor: 'pointer'}} onClick={() => this.showDialogUpdate(plan.unique_ID, plan.name, plan.interval ? plan.interval : 'month', plan.trial_period, plan.amount)}>
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
                                            {plan.unique_ID !== 'plan_B' && plan.unique_ID !== 'plan_D' && !plan.default_individual && !plan.default_team &&
                                            <center style={{cursor: 'pointer'}} onClick={() => this.onDelete(plan.companyCount, plan.unique_ID)}>
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
                                            {plan.unique_ID !== 'plan_B' && plan.unique_ID !== 'plan_D' && !plan.default_individual && !plan.default_team &&
                                              <div>
                                                <center style={{cursor: 'pointer'}} onClick={() => this.openPopover(plan._id, i)} id={'buttonTarget-' + plan._id} ref={(b) => { this.target = b }}>
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
                                            <i className='fa fa-user' />&nbsp;&nbsp;<a onClick={() => this.makeDefault('individual')} className='m-card-profile__email m-link' style={{cursor: 'pointer', marginTop: '5px'}}>
                                              Make Default Individual
                                            </a>
                                            <br />
                                            <i className='fa fa-users' />&nbsp;&nbsp;<a onClick={() => this.makeDefault('team')} className='m-card-profile__email m-link' style={{cursor: 'pointer', marginTop: '10px', marginBottom: '10px'}}>
                                              Make Default Team
                                            </a>
                                          </div>
                                        </PopoverBody>
                                        </Popover>
                                      }
                                    </div>
                                    */ }
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
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    permissions: (state.permissionsInfo.permissions)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllPermissions: fetchAllPermissions,
    updatePermissions: updatePermissions
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Permissions)
