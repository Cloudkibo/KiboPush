/* eslint-disable no-useless-constructor */
import React from 'react'
import { Link } from 'react-router'
import Header from './header'
import Sidebar from './sidebar'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {StripeProvider, Elements} from 'react-stripe-elements'
import { getuserdetails, updatePlan } from '../../redux/actions/basicinfo.actions'
import InjectedCheckoutForm from './checkout'

class PaymentMethods extends React.Component {
  constructor (props, context) {
    super(props, context)
    props.getuserdetails()
    this.state = {
      selectedRadio: 'free',
      change: false
    }
    this.change = this.change.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.setCard = this.setCard.bind(this)
  }
  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.body.appendChild(addScript)
  }
  change () {
    this.setState({change: true})
  }

  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
  }
  setCard (payload) {
    console.log('in setCard', payload)
    if (this.state.selectedRadio === 'free') {
      if (this.props.user.currentPlan === 'plan_A' || this.props.user.currentPlan === 'plan_B') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_B', stripeToken: payload})
      } else if (this.props.user.currentPlan === 'plan_C' || this.props.user.currentPlan === 'plan_D') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_D', stripeToken: payload})
      }
    } else if (this.state.selectedRadio === 'premium') {
      if (this.props.user.currentPlan === 'plan_A' || this.props.user.currentPlan === 'plan_B') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_A', stripeToken: payload})
      } else if (this.props.user.currentPlan === 'plan_C' || this.props.user.currentPlan === 'plan_D') {
        this.props.updatePlan({companyId: this.props.user.companyId, plan: 'plan_C', stripeToken: payload})
      }
    }
  }
  render () {
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='m-portlet m-portlet--full-height'>
                <div className='m-portlet__body m-portlet__body--no-padding'>
                  <div className='m-wizard m-wizard--4 m-wizard--brand m-wizard--step-first' id='m_wizard'>
                    <div className='row m-row--no-padding' style={{marginLeft: '0', marginRight: '0', display: 'flex', flexWrap: 'wrap'}}>
                      <Sidebar step='7' />
                      <div className='col-xl-9 col-lg-12 m-portlet m-portlet--tabs' style={{padding: '1rem 2rem 4rem 2rem', borderLeft: '0.07rem solid #EBEDF2', color: '#575962', lineHeight: '1.5', boxShadow: 'none'}}>
                        <div className='m-portlet__head'>
                          <div className='m-portlet__head-caption'>
                            <div className='m-portlet__head-title'>
                              <h3 className='m-portlet__head-text'>
                                Step 7: Choose Plan
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
                              <div className='tab-pane active' id='m_widget4_tab1_content'>
                                {this.props.user && this.props.user.lastFour &&
                                  <div className='m-widget4' >
                                    <div className='m-widget4__item'>
                                      <div className='m-widget4__info'>
                                        <i className='fa fa-credit-card-alt' />&nbsp;&nbsp;
                                        <span className='m-widget4__title'>
                                         xxxx xxxx xxxx xxxx
                                        </span>
                                      </div>
                                      <div className='m-widget4__ext'>
                                        <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={() => this.gotoView()} style={{marginRight: '10px'}}>
                                        Update
                                       </button>
                                      </div>
                                      <div className='m-widget4__ext'>
                                        <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={() => this.gotoEdit()} style={{marginRight: '80px'}}>
                                        Delete
                                      </button>
                                      </div>
                                    </div>
                                  </div>
                                }
                              </div>
                              <div className='btn' style={{border: '1px solid #cccc', borderStyle: 'dotted', marginLeft: '15px'}} onClick={this.change} data-toggle='modal' data-target='#m_modal_1_2'>
                                <i className='fa fa-plus' style={{marginRight: '10px'}} />
                                <span>Add Payment Method</span>
                              </div>
                              <br /><br />
                              <label style={{fontWeight: 'inherit'}}><b>Note:</b> You can add maximum of three cards only</label>
                            </div>
                            }
                          </div>
                          <div style={{background: 'rgba(33, 37, 41, 0.6)'}} className='modal fade' id='m_modal_1_2' tabindex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
                            <div style={{transform: 'translate(0, 0)'}} className='modal-dialog' role='document'>
                              <div className='modal-content'>
                                <div style={{display: 'block'}} className='modal-header'>
                                  <h5 className='modal-title' id='exampleModalLabel'>
                                    Credit/Debit Card Details
                                  </h5>
                                  <button style={{marginTop: '-10px', opacity: '0.5'}} type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                    <span aria-hidden='true'>
                                      &times;
                                    </span>
                                  </button>
                                </div>
                                <div className='modal-body'>
                                  <div className='col-12'>
                                    {this.state.change &&
                                      <StripeProvider apiKey='pk_test_ozzmt2lgDgltSYx1pO4W2IE2'>
                                        <Elements>
                                          <InjectedCheckoutForm setCard={this.setCard} />
                                        </Elements>
                                      </StripeProvider>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                          <div className='m-form__actions'>
                            <div className='row'>
                              <div className='col-lg-6 m--align-left' >
                                <Link to='/menuWizard' className='btn btn-secondary m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
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
    user: (state.basicInfo.user)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePlan: updatePlan,
    getuserdetails: getuserdetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods)
