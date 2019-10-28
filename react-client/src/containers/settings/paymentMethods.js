/* eslint-disable no-useless-constructor */
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {StripeProvider, Elements} from 'react-stripe-elements'
import InjectedCheckoutForm from './../wizard/checkout'
import { updateCard, getKeys } from '../../redux/actions/basicinfo.actions'
import AlertContainer from 'react-alert'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class PaymentMethods extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      change: false
    }
    props.getKeys()
    this.change = this.change.bind(this)
    this.setCard = this.setCard.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }

  closeDialog () {
    this.setState({change: false})
  }
  change (value) {
    this.setState({change: value})
  }
  componentDidMount () {
  }
  setCard (payload, value) {
    console.log('in setCard', payload)
    this.props.updateCard({companyId: this.props.user.companyId, stripeToken: payload}, this.msg)
    this.setState({change: false})
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Payment Methods
                  </span>
                </li>
              </ul>
              <button className='btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.change} style={{marginTop: '15px'}} data-toggle='modal' data-target='#m_modal_1_2'>
                <span>
                  <i className='la la-plus' />
                  <span>
                    Add
                  </span>
                </span>
              </button>
            </div>
          </div>
          <div className='tab-content'>
            <div className='m-content'>
              {this.props.user && !this.props.user.last4 &&
              <label style={{fontWeight: 'inherit'}} onClick={this.change}>
                You haven't provided any payment method as yet. Click on Add button to enter credit/debit card details
              </label>
              }
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div>
                    <div className='m-portlet__body'>
                      <div className='tab-content'>
                        {this.props.user && this.props.user.last4 &&
                        <div className='tab-pane active' id='m_widget4_tab1_content'>
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
                      }
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
    captchaKey: (state.basicInfo.captchaKey),
    stripeKey: (state.basicInfo.stripeKey)
  }
}
function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateCard: updateCard,
    getKeys: getKeys
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods)
