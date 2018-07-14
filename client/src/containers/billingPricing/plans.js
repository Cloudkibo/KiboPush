/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import { connect } from 'react-redux'
import { fetchAllPlans, deletePlan } from '../../redux/actions/billingPricing.actions'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import AlertContainer from 'react-alert'

class Plans extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      teamsData: [],
      totalLength: 0,
      filterValue: '',
      searchValue: '',
      isShowingModalDelete: false,
      deleteid: ''
    }
    props.fetchAllPlans()
    this.showDialogDelete = this.showDialogDelete.bind(this)
    this.closeDialogDelete = this.closeDialogDelete.bind(this)
    this.onDelete = this.onDelete.bind(this)
  }

  onDelete (companyCount, id) {
    console.log('id', id)
    if (companyCount > 0) {
      this.msg.error('Please migrate all companies of this plan before deleting')
    } else {
      this.showDialogDelete(id)
    }
  }

  showDialogDelete (id) {
    this.setState({isShowingModalDelete: true})
    this.setState({deleteid: id})
  }

  closeDialogDelete () {
    this.setState({isShowingModalDelete: false})
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
              this.state.isShowingModalDelete &&
              <ModalContainer style={{width: '500px'}}
                onClose={this.closeDialogDelete}>
                <ModalDialog style={{width: '500px'}}
                  onClose={this.closeDialogDelete}>
                  <h3>Delete Plan</h3>
                  <p>Are you sure you want to delete this plan?</p>
                  <button style={{float: 'right'}}
                    className='btn btn-primary btn-sm'
                    onClick={() => {
                      this.props.deletePlan(this.state.deleteid, this.msg)
                      this.closeDialogDelete()
                    }}>Delete
                  </button>
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
                            Plans
                          </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
                          <span>
                            <span>
                              Migrate Companies
                            </span>
                          </span>
                        </button>&nbsp;&nbsp;
                        <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
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
                                            <center style={{cursor: 'pointer'}}>
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
                                        </div>
                                      ))}
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
    plans: (state.billingPricingInfo.plans)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchAllPlans: fetchAllPlans,
    deletePlan: deletePlan
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Plans)
