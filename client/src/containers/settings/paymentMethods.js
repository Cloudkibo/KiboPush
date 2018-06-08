/* eslint-disable no-useless-constructor */
import React from 'react'
import { browserHistory, Link } from 'react-router'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
import {isWelcomeMessageEnabled} from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {StripeProvider, Elements, CardElement, CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, PaymentRequestButtonElement} from 'react-stripe-elements'
const handleBlur = () => {
  console.log('[blur]');
};
const handleChange = (change) => {
  console.log('[change]', change);
};
const handleClick = () => {
  console.log('[click]');
};
const handleFocus = () => {
  console.log('[focus]');
};
const handleReady = () => {
  console.log('[ready]');
};

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};


class PaymentMethods extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showDropDown: false,
      surveysData: [],
      totalLength: 0,
      filterValue: '',
      change: false
    }
    props.loadMyPagesList()
    this.switchInitialized = false
    this.initializeSwitch = this.initializeSwitch.bind(this)
    this.gotoCreate = this.gotoCreate.bind(this)
    this.gotoEdit = this.gotoEdit.bind(this)
    this.gotoView = this.gotoView.bind(this)
    this.change = this.change.bind(this)
  }
  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.body.appendChild(addScript)
    console.log('welcomeMessage componentDidMount')
    if (this.props.pages) {
      for (var i = 0; i < this.props.pages.length; i++) {
        this.initializeSwitch(this.props.pages[i].isWelcomeMessageEnabled, this.props.pages[i]._id)
      }
    }
  }
  initializeSwitch (state, id) {
    if (!this.switchInitialized) {
      var self = this
      var temp = '#' + id
      /* eslint-disable */
      $(temp).bootstrapSwitch({
        /* eslint-enable */
        onText: 'Enabled',
        offText: 'Disabled',
        offColor: 'danger',
        state: state
      })
      /* eslint-disable */
      $(temp).on('switchChange.bootstrapSwitch', function (event) {
        /* eslint-enable */
        var state = event.target.checked
        if (state === true) {
          self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: true})
        } else {
          self.props.isWelcomeMessageEnabled({_id: event.target.attributes.id.nodeValue, isWelcomeMessageEnabled: false})
        }
      })
    }
  }

  gotoCreate (page) {
    browserHistory.push({
      pathname: `/createBroadcast`,
      state: {module: 'welcome', _id: page}
    })
  }

  gotoEdit (page) {
    browserHistory.push({
      pathname: `/editWelcomeMessage`,
      state: {module: 'welcome', _id: page._id, payload: page.welcomeMessage}
    })
  }

  gotoView (page) {
    browserHistory.push({
      pathname: `/viewWelcomeMessage`,
      state: {module: 'welcome', _id: page._id, payload: page}
    })
  }
  change () {
    this.setState({change: true})
  }
  render () {
    return (
      <div id='target' className='col-lg-8 col-md-8 col-sm-8 col-xs-12'>
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
              {!this.props.payment &&
              <label style={{fontWeight: 'inherit'}} onClick={this.change}>
                You haven't provided any payment method as yet. Click on Add button to enter credit/debit card details
              </label>
              }
              <div className='row'>
                <div className='col-xl-12 col-md-12 col-sm-12'>
                  <div>
                    <div className='m-portlet__body'>
                      <div className='tab-content'>
                        <div className='tab-pane active m-scrollable' role='tabpanel'>
                          <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
                            <div style={{height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
                              <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
                                <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                                  <div className='tab-pane active' id='m_widget4_tab1_content'>
                                    {
                                      this.props.pages && this.props.pages.length > 0
                                    ? <div className='m-widget4' >
                                      {
                                       this.props.pages.map((page, i) => (
                                         <div className='m-widget4__item' key={i}>
                                           <div className='m-widget4__img m-widget4__img--pic'>
                                             <img alt='pic' src={(page.pagePic) ? page.pagePic : ''} />
                                           </div>
                                           <div className='m-widget4__info'>
                                             <span className='m-widget4__title'>
                                               {page.pageName}
                                             </span>
                                             <br />
                                             <span className='m-widget4__sub'>
                                               <div className='bootstrap-switch-id-test bootstrap-switch bootstrap-switch-wrapper bootstrap-switch-animate bootstrap-switch-on' style={{width: '130px'}}>
                                                 <div className='bootstrap-switch-container'>
                                                   <input data-switch='true' type='checkbox' id={page._id} data-on-color='success' data-off-color='warning' aria-describedby='switch-error' aria-invalid='false' checked={page.isWelcomeMessageEnabled} />
                                                 </div>
                                               </div>
                                             </span>
                                           </div>
                                           <div className='m-widget4__ext'>
                                             <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={() => this.gotoView(page)}>
                                              View Message
                                            </button>
                                           </div>
                                           <div className='m-widget4__ext'>
                                             <button className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-secondary' onClick={() => this.gotoEdit(page)}>
                                             Edit Message
                                           </button>
                                           </div>
                                         </div>
                                      ))}
                                    </div>
                                      : <div className='alert alert-success'>
                                        <h4 className='block'>0 Connected Pages</h4>
                                          You do not have any connected pages. You need to connect facebook pages to set the welcome message for them. Please click <Link to='/addPages' style={{color: 'blue', cursor: 'pointer'}}> here </Link> to connect pages
                                        </div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
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
                                  <StripeProvider apiKey="pk_test_12345">
                                    <Elements>
                                  <form onSubmit={this.handleSubmit}>
                          <label>
                            Card number
                          </label>
                          <CardNumberElement
                            onBlur={handleBlur}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            onReady={handleReady}
                            {...createOptions(this.props.fontSize)}
                          /><br />
                          <label>
          Expiration date
        </label>
        <CardExpiryElement
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          onReady={handleReady}
          {...createOptions(this.props.fontSize)}
        /><br />
        <label>
          CVC
        </label>
        <CardCVCElement
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          onReady={handleReady}
          {...createOptions(this.props.fontSize)}
        /><br />
        <label>
          Postal code
        </label>
        <PostalCodeElement
          onBlur={handleBlur}
          onChange={handleChange}
          onFocus={handleFocus}
          onReady={handleReady}
          {...createOptions(this.props.fontSize)}
        /><br />
      <button className='btn btn-primary'>Pay</button>

                        </form>
                      </Elements>
                    </StripeProvider>}
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
    loadMyPagesList: loadMyPagesList,
    isWelcomeMessageEnabled: isWelcomeMessageEnabled
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods)
