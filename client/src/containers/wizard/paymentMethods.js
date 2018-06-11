/* eslint-disable no-useless-constructor */
import React from 'react'
import { browserHistory, Link } from 'react-router'
import Header from './header'
import Sidebar from './sidebar'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReCAPTCHA from 'react-google-recaptcha'
import {StripeProvider, Elements, CardElement} from 'react-stripe-elements'
import { updatePlan, setCardDetails } from '../../redux/actions/smart_replies.actions'
const handleBlur = () => {
  console.log('[blur]')
}
// const handleChange = (change) => {
//   console.log('[change]', change)
//  }
const handleClick = () => {
  console.log('[click]')
}
const handleFocus = () => {
  console.log('[focus]')
}
const handleReady = () => {
  console.log('[ready]')
}

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4'
        },
        padding
      },
      invalid: {
        color: '#9e2146'
      }
    }
  }
}

class PaymentMethods extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedRadio: 'free',
      change: false,
      error: false,
      email: ''
    }
    this.change = this.change.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
    this.updateEmail = this.updateEmail.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.body.appendChild(addScript)
  }
  change () {
    this.setState({change: true})
  }
  updateEmail (e) {
    this.setState({email: e.target.value, error: false})
  }
  handleRadioButton (e) {
    this.setState({
      selectedRadio: e.currentTarget.value
    })
    if (e.currentTarget.value === 'list') {
      this.setState({genderValue: [], localeValue: [], tagValue: [], isList: true, pollValue: [], surveyValue: []})
      /* eslint-disable */
      $('#selectPage').val('').trigger('change')
      $('#selectGender').val('').trigger('change')
      $('#selectLocale').val('').trigger('change')
      $('#selectTags').val('').trigger('change')
      $('#selectPoll').val('').trigger('change')
      $('#selectSurvey').val('').trigger('change')
      $('.selectSegmentation').addClass('hideSegmentation')
      $('.selectList').removeClass('hideSegmentation')
      /* eslint-enable */
    } if (e.currentTarget.value === 'segmentation') {
      /* eslint-disable */
      $('.selectSegmentation').removeClass('hideSegmentation')
      $('.selectList').addClass('hideSegmentation')
      $('#selectLists').val('').trigger('change')
      /* eslint-enable */
      this.setState({listSelected: [], isList: false})
    }
  }
  save () {
    if (this.state.email === '') {
      this.setState({error: true})
    }
  }
  handleChange (change) {
    console.log('[change]', change)
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
                                  <br />
                                  <div className='btn' style={{border: '1px solid #cccc', borderStyle: 'dotted', marginLeft: '15px'}} onClick={this.change} data-toggle='modal' data-target='#m_modal_1_2'>
                                    <i className='fa fa-plus' style={{marginRight: '10px'}} />
                                    <span>Add Payment Method</span>
                                  </div>
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
                                          <StripeProvider apiKey='pk_test_12345'>
                                            <Elements>
                                              <form onSubmit={this.handleSubmit}>
                                                <label>Email Address:</label>
                                                  {this.state.error &&
                                                    <div id='email-error' style={{color: 'red', fontWeight: 'inherit'}}><bold>Please enter your email address</bold></div>
                                                    }
                                                <input type='text' className='form-control m-input m-input--solid' value={this.state.email} onChange={(e) => this.updateEmail(e)} id='generalSearch' />
                                                <br />
                                                <label>
                                                  Card details:
                                                </label>
                                                <CardElement
                                                  onBlur={handleBlur}
                                                  onChange={this.handleChange}
                                                  onFocus={handleFocus}
                                                  onReady={handleReady}
                                                  {...createOptions(this.props.fontSize)}
                                                />
                                                <br /><br />
                                                <ReCAPTCHA ref='recaptcha' sitekey='6LckQ14UAAAAAFH2D15YXxH9o9EQvYP3fRsL2YOU' />
                                                <br /><br />
                                                <center>
                                                  <button className='btn btn-primary'>Save</button>
                                                </center>
                                              </form>
                                            </Elements>
                                          </StripeProvider>}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            <div class='m-portlet__foot m-portlet__foot--fit m--margin-top-40'>
                              <div className='m-form__actions'>
                                <div className='row'>
                                  <div className='col-lg-6 m--align-left' />
                                  <div className='col-lg-6 m--align-right'>
                                    <Link to='/inviteUsingLinkWizard' className='btn btn-success m-btn m-btn--custom m-btn--icon' data-wizard-action='next'>
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
        </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    //  payment: (state.paymentInfo.payment)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updatePlan: updatePlan,
    setCardDetails: setCardDetails
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods)
