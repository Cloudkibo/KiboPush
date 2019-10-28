/* eslint-disable no-useless-constructor */
import React from 'react'
import { Link } from 'react-router-dom'
import Header from './header'
import Sidebar from './sidebar'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {StripeProvider, Elements} from 'react-stripe-elements'
import { getuserdetails, updatePlan, updateCard, getKeys } from '../../redux/actions/basicinfo.actions'
import InjectedCheckoutForm from './checkout'
import AlertContainer from 'react-alert'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class PaymentMethods extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    props.getKeys()
    this.state = {
      selectedRadio: 'free',
      change: false
    }
    this.change = this.change.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.setCard = this.setCard.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }

  closeDialog () {
    this.setState({change: false})
  }

  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.body.appendChild(addScript)
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Payment Methodes`;
  }
  componentWillReceiveProps (nextprops) {
    console.log('in componentWillReceiveProps plan', nextprops)
    if (nextprops.user) {
      if (nextprops.user.currentPlan.unique_ID === 'plan_A' || nextprops.user.currentPlan.unique_ID === 'plan_C') {
        this.setState({selectedRadio: 'premium'})
      } else if (nextprops.user.currentPlan.unique_ID === 'plan_B' || nextprops.user.currentPlan.unique_ID === 'plan_D') {
        this.setState({selectedRadio: 'free'})
      }
    }
    if (nextprops.error) {
      this.msg.error(nextprops.error)
    }
  }
  change (value) {
    this.setState({change: value})
  }

  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
  }
  setCard (payload, value) {
    console.log('in setCard', payload)
    this.props.updateCard({companyId: this.props.user.companyId, stripeToken: payload}, this.msg)
    this.setState({change: false})
  }
  save () {
    if (this.state.selectedRadio === 'free') {
      if (this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_B') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_B'}, this.msg)
      } else if (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_D'}, this.msg)
      }
    } else if (this.state.selectedRadio === 'premium') {
      if (this.props.user.currentPlan.unique_ID === 'plan_A' || this.props.user.currentPlan.unique_ID === 'plan_B') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_A'}, this.msg)
      } else if (this.props.user.currentPlan.unique_ID === 'plan_C' || this.props.user.currentPlan.unique_ID === 'plan_D') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_C'}, this.msg)
      }
    }
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-portlet m-portlet--full-height'>
                <div className='m-portlet__body m-portlet__body--no-padding'>
                  <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                    <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                      <Sidebar step='8' />
                      <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', boxShadow: 'none'}}>
                        <div className='m-portlet__head'>
                          <div className='m-portlet__head-caption'>
                            <div className='m-portlet__head-title'>
                              <h3 className='m-portlet__head-text'>
                                Step 8: Choose Plan
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className='m-portlet__body'>
                          <div className='tab-pane active m-scrollable' role='tabpanel'>
                            <label>Billing Plan:</label>
                            <div className='radio-buttons' style={{marginLeft: '37px'}}>
                              <div className='radio'>
                                <input id='segmentAll'
                                  type='radio'
                                  value='free'
                                  name='segmentationType'
                                  onChange={this.handleRadioButton}
                                  checked={this.state.selectedRadio === 'free'} />
                                <label>Free</label>
                              </div>
                              <div className='radio'>
                                <input id='segmentList'
                                  type='radio'
                                  value='premium'
                                  name='segmentationType'
                                  onChange={this.handleRadioButton}
                                  checked={this.state.selectedRadio === 'premium'} />
                                <label>Premium</label>
                              </div>
                            </div>
                            {this.state.selectedRadio === 'premium' &&
                            <div>
                              <label>Select Payment Method:</label>
                              <br />
                              {this.props.user && this.props.user.last4
                              ? <div className='tab-pane active' id='m_widget4_tab1_content'>
                                <div className='m-widget4' >
                                  <div className='m-widget4__item'>
                                    <div className='m-widget4__info'>
                                      <i className='fa fa-credit-card-alt' />&nbsp;&nbsp;
                                      <span className='m-widget4__title'>
                                       xxxx xxxx xxxx {this.props.user.last4}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              : <div className='btn' style={{border: '1px solid #cccc', borderStyle: 'dotted', marginLeft: '15px'}} onClick={() => this.change(true)} data-toggle='modal' data-target='#m_modal_1_2'>
                                <i className='fa fa-plus' style={{marginRight: '10px'}} />
                                <span style={{fontWeight: 'inherit'}}>Add Payment Method</span>
                              </div>
                            }
                            </div>
                            }
                            <br /><br />
                            <button onClick={this.save.bind(this)} className='btn btn-primary pull-left'>
                              Save
                            </button>
                          </div>
                          {/*this.state.change &&
                            <ModalContainer style={{width: '500px'}}
                              onClose={this.closeDialog}>
                              <ModalDialog style={{width: '500px'}}
                                onClose={this.closeDialog}>
                                <center><h4>Credit/Debit Card Details</h4></center>
                                <br /><br />
                                <div className='col-12'>
                                  {this.props.stripeKey && this.props.captchaKey &&
                                  <StripeProvider apiKey={this.props.stripeKey}>
                                    <Elements>
                                      <InjectedCheckoutForm setCard={this.setCard} captchaKey={this.props.captchaKey} />
                                    </Elements>
                                  </StripeProvider>
                                }
                                </div>
                              </ModalDialog>
                            </ModalContainer>
                        */}
                        </div>
                        <div className='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                          <div className='m-form__actions'>
                            <div className='row'>
                              <div className='col-lg-6 m--align-left' >
                                <Link to='/responseMethods' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <i className='la la-arrow-left' />
                                    <span>Back</span>&nbsp;&nbsp;
                                  </span>
                                </Link>
                              </div>
                              <div className='col-lg-6 m--align-right'>
                                <Link to='/finish' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
                                  <span>
                                    <span>Next</span>&nbsp;&nbsp;
                                    <i className='la la-arrow-right' />
                                  </span>
                                </Link>
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
  return {
    user: (state.basicInfo.user),
    error: (state.basicInfo.error),
    captchaKey: (state.basicInfo.captchaKey),
    stripeKey: (state.basicInfo.stripeKey)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePlan: updatePlan,
    updateCard: updateCard,
    getuserdetails: getuserdetails,
    getKeys: getKeys
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods)
