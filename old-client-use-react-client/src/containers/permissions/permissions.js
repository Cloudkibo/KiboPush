/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
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
      permissionCheckboxes: [],
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
  componentDidMount () {
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Permissions`;
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
        this.setState({permissionCheckboxes: permissionCheckboxes, selectAllChecked: false})
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
      var permissions = []
      var count = 0
      var i
      for (i in nextprops.permissions) {
        if (i !== '_id' && i !== 'role' && i !== '__v') {
          var temp = i.split(/(?=[A-Z])/)
          var name = ''
          for (var j = 0; j < temp.length; j++) {
            name = name + ' ' + temp[j].charAt(0).toUpperCase() + temp[j].slice(1)
          }
          if (nextprops.permissions[i] === true) {
            count = count + 1
          }
          permissions.push({name: name, nick: i, selected: nextprops.permissions[i]})
        }
      }
      console.log('nextprops.permissions.length', Object.keys(nextprops.permissions).length)
      if (count === (Object.keys(nextprops.permissions).length - 3)) {
        this.setState({selectAllChecked: true})
      } else {
        this.setState({selectAllChecked: false})
      }
      this.setState({permissionCheckboxes: permissions})
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        {
          this.state.isShowingModal &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeDialog}>
              <AddPermission msg={this.msg} closeDialog={this.closeDialog} openTab={this.state.openTab} permissionCheckboxes={this.state.permissionCheckboxes} />
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
