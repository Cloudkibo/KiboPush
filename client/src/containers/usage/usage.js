/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { fetchAllUsage, updateUsage } from '../../redux/actions/usage.actions'
import { fetchAllPlans } from '../../redux/actions/billingPricing.actions'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'
import AddUsage from './addUsage'

class Usage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      isShowingModal: false,
      isShowingModalUpdate: false,
      selectedPlan: '',
      name: '',
      limitValue: ''
    }
    props.fetchAllPlans()
    this.showData = this.showData.bind(this)
    this.updatePlan = this.updatePlan.bind(this)
    this.showDialogUpdate = this.showDialogUpdate.bind(this)
    this.closeDialogUpdate = this.closeDialogUpdate.bind(this)
    this.showDialog = this.showDialog.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }
  showDialogUpdate (name, value) {
    console.log('name', name)
    console.log('value', value)
    let temp = name.split('_')
    let sendName = ''
    for (let j = 0; j < temp.length; j++) {
      if (sendName !== '') {
        sendName = sendName + ' ' + temp[j].charAt(0).toUpperCase() + temp[j].slice(1)
      } else {
        sendName = temp[j].charAt(0).toUpperCase() + temp[j].slice(1)
      }
    }
    this.setState({isShowingModalUpdate: true, name: sendName, limitValue: value})
  }

  closeDialogUpdate () {
    this.setState({isShowingModalUpdate: false})
  }
  showData () {
    let table = []
    let name = ''
    let name1 = ''
    let keys = Object.keys(this.props.usage)
    console.log('keys', keys)
    for (let i = 0; i < keys.length; i += 2) {
      if (keys[i] !== '_id' && keys[i] !== '__v' && keys[i] !== 'planId') {
        let temp = keys[i].split('_')
        name = ''
        for (let j = 0; j < temp.length; j++) {
          name = name + ' ' + temp[j].charAt(0).toUpperCase() + temp[j].slice(1)
        }
        if (keys[i + 1] && keys[i + 1] !== '_id' && keys[i + 1] !== '__v' && keys[i + 1] !== 'planId') {
          temp = keys[i + 1].split('_')
          name1 = ''
          for (let k = 0; k < temp.length; k++) {
            name1 = name1 + ' ' + temp[k].charAt(0).toUpperCase() + temp[k].slice(1)
          }
        }
        table.push(<div className='row'>
          {keys[i] && keys[i] !== '_id' && keys[i] !== '__v' && keys[i] !== 'planId' &&
            <div className='col-md-6'>
              <div className='m-widget5__item' key={i} style={{borderBottom: '.07rem dashed #ebedf2'}}>
                <div className='m-widget5__content' style={{verticalAlign: 'middle'}}>
                  {name}
                </div>
                <div className='m-widget5__stats1'>
                  <span className='m-widget5__number' style={{color: '#36a3f7'}}>
                    {this.props.usage[keys[i]]}
                  </span>
                </div>
                <div className='m-widget5__stats2'>
                  <center style={{cursor: 'pointer'}}>
                    <span className='m-widget5__number' style={{fontSize: '1rem', fontWeight: 'normal'}} onClick={() => this.showDialogUpdate(keys[i], this.props.usage[keys[i]])}>
                      <i className='fa fa-edit' />
                      Edit
                    </span>
                  </center>
                </div>
              </div>
            </div>
          }
          {keys[i + 1] && keys[i + 1] && keys[i + 1] !== '_id' && keys[i + 1] !== '__v' && keys[i + 1] !== 'planId' &&
          <div className='col-md-6' style={{borderLeft: '.07rem dashed #ebedf2'}}>
            <div className='m-widget5__item' key={i + 1} style={{borderBottom: '.07rem dashed #ebedf2'}}>
              <div className='m-widget5__content'style={{verticalAlign: 'middle'}}>
                {name1}
              </div>
              <div className='m-widget5__stats1'>
                <span className='m-widget5__number' style={{color: '#36a3f7'}}>
                  {this.props.usage[keys[i + 1]]}
                </span>
              </div>
              <div className='m-widget5__stats2'>
                <center style={{cursor: 'pointer'}} onClick={() => this.showDialogUpdate(keys[i + 1], this.props.usage[keys[i + 1]])}>
                  <span className='m-widget5__number' style={{fontSize: '1rem', fontWeight: 'normal'}}>
                    <i className='fa fa-edit' />
                    Edit
                  </span>
                </center>
              </div>
            </div>
          </div>
        }
        </div>
        )
      }
    }
    return table
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.usage) {
      console.log('in nextprops usage', nextprops)
    } else if (nextprops.plans && nextprops.plans.length > 0) {
      console.log('in nextprops', nextprops)
      this.setState({selectedPlan: nextprops.plans[0]._id})
      this.props.fetchAllUsage(nextprops.plans[0]._id)
    }
  }
  showDialog () {
    this.setState({isShowingModal: true})
  }

  closeDialog () {
    this.setState({isShowingModal: false, name: ''})
  }

  updatePlan (e) {
    this.setState({selectedPlan: e.target.value})
    this.props.fetchAllUsage(e.target.value)
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
                  <AddUsage msg={this.msg} closeDialog={this.closeDialog} selectedPlan={this.state.selectedPlan} />
                </ModalDialog>
              </ModalContainer>
            }
            {
              this.state.isShowingModalUpdate &&
              <ModalContainer style={{width: '500px'}}
                onClose={this.closeDialogUpdate}>
                <ModalDialog style={{width: '500px'}}
                  onClose={this.closeDialogUpdate}>
                  <AddUsage msg={this.msg} closeDialog={this.closeDialogUpdate} name={this.state.name} selectedPlan={this.state.selectedPlan} limitValue={this.state.limitValue} />
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
                            Features Usage
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.showDialog}>
                          <span>
                            <i className='la la-plus' />
                            <span>
                              Add Usage Item
                            </span>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='tab-content'>
                        <select className='custom-select' id='m_form_type' style={{width: '100%'}} tabIndex='-98' value={this.state.selectedPlan} onChange={(e) => this.updatePlan(e)}>
                          {
                            this.props.plans && this.props.plans.map((plan, i) => (
                              <option key={i} value={plan._id}>{plan.name + ' - ' + plan.unique_ID}</option>
                            ))
                          }
                        </select>
                        <div className='tab-pane active m-scrollable' role='tabpanel'>
                          <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                            <div style={{height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                              <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                                <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                                  <br /><br />
                                  <div className='tab-pane active' id='m_widget5_tab1_content' aria-expanded='true'>
                                    {
                                      this.props.usage
                                      ? <div className='m-widget5'>
                                        {this.showData()}
                                      </div>
                                        : <div>No Data to display</div>
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
      </div>
    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    usage: (state.usageInfo.usage),
    plans: (state.billingPricingInfo.plans)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllUsage: fetchAllUsage,
    updateUsage: updateUsage,
    fetchAllPlans: fetchAllPlans
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Usage)
