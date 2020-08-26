import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { updateChatbot, createChatbot, fetchChatbot } from '../../redux/actions/whatsAppChatbot.actions'
import AlertContainer from 'react-alert'
import MODAL from '../../components/extras/modal'
import { validateCommaSeparatedPhoneNumbers } from "../../utility/utils"
import { UncontrolledTooltip } from 'reactstrap'
import { fetchStore } from '../../redux/actions/shopify.actions'

class WhatsAppChatbot extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      store: '',
      paymentMethod: '',
      returnPolicy: '',
      faqs: '',
      published: false,
      testSubscribers: '',
      arePhoneNumbersValid: false
    }
    this.selectStore = this.selectStore.bind(this)
    this.setPublished = this.setPublished.bind(this)
    this.setPaymentMethod = this.setPaymentMethod.bind(this)
    this.setReturnPolicy = this.setReturnPolicy.bind(this)
    this.setFAQs = this.setFAQs.bind(this)
    this.saveChatbot = this.saveChatbot.bind(this)
    this.getTestChatbotContent = this.getTestChatbotContent.bind(this)
    this.setTestSubscribers = this.setTestSubscribers.bind(this)
    this.handleTestSubscribers = this.handleTestSubscribers.bind(this)
    this.saveTestSubscribers = this.saveTestSubscribers.bind(this)
    this.clearTestSubscribers = this.clearTestSubscribers.bind(this)
    this.goToShopifySettings = this.goToShopifySettings.bind(this)
    this.getConnectShopifyContent = this.getConnectShopifyContent.bind(this)

    props.fetchChatbot()
    props.fetchStore()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.chatbot && nextProps.chatbot.botLinks) {
      this.setState({
        paymentMethod: nextProps.chatbot.botLinks.paymentMethod,
        returnPolicy: nextProps.chatbot.botLinks.returnPolicy,
        faqs: nextProps.chatbot.botLinks.faqs,
        published: nextProps.chatbot.published
      })
    } else if (nextProps.chatbot) {
      this.setState({
        published: nextProps.chatbot.published
      })
    }
  }

  componentDidMount() {
    document.title = 'KiboChat | WhatsApp Chatbot'
  }

  setPaymentMethod(e) {
    this.setState({
      paymentMethod: e.target.value
    })
  }

  setFAQs(e) {
    this.setState({
      faqs: e.target.value
    })
  }

  setReturnPolicy(e) {
    this.setState({
      returnPolicy: e.target.value
    })
  }

  selectStore(e) {
    this.setState({
      store: e.target.value
    })
  }

  setPublished(e) {
    console.log('setPublished', e.target.checked)
    this.setState({
      published: e.target.checked
    })
    this.props.updateChatbot({
      published: e.target.checked
    })
  }

  setTestSubscribers() {
    if (!this.props.store) {
      let shopifyConnectModal = document.getElementById('_shopify_integration_trigger')
      if (shopifyConnectModal) {
        shopifyConnectModal.click()
      }
    } else {
      let testSubscribersModal = document.getElementById('_test_subscribers_trigger')
      if (testSubscribersModal) {
        testSubscribersModal.click()
      }
    }
  }

  saveChatbot(e) {
    e.preventDefault()
    if (!this.props.store) {
      let shopifyConnectModal = document.getElementById('_shopify_integration_trigger')
      if (shopifyConnectModal) {
        shopifyConnectModal.click()
      }
    } else {
      if (!this.props.chatbot) {
        this.props.createChatbot({
          botLinks: {
            paymentMethod: this.state.paymentMethod,
            returnPolicy: this.state.returnPolicy,
            faqs: this.state.faqs
          }
        }, (res) => {
          if (res.status === 'success') {
            this.msg.success(res.description)
          } else {
            this.msg.error(res.description)
          }
        })
      } else {
        this.props.updateChatbot({
          botLinks: {
            paymentMethod: this.state.paymentMethod,
            returnPolicy: this.state.returnPolicy,
            faqs: this.state.faqs
          }
        }, (res) => {
          if (res.status === 'success') {
            this.msg.success(res.description)
          } else {
            this.msg.error(res.description)
          }
        })
      }
    }
  }

  handleTestSubscribers(e) {
    if (validateCommaSeparatedPhoneNumbers(e.target.value)) {
      this.setState({ arePhoneNumbersValid: true, testSubscribers: e.target.value })
    } else {
      this.setState({ arePhoneNumbersValid: false, testSubscribers: e.target.value })
    }
  }

  saveTestSubscribers(e) {
    e.preventDefault()
    if (!this.props.chatbot) {
      let modalClose = document.getElementById('_close_test_subscribers')
      if (modalClose) {
        modalClose.click()
      }
      this.props.createChatbot({
        botLinks: {
          paymentMethod: this.state.paymentMethod,
          returnPolicy: this.state.returnPolicy,
          faqs: this.state.faqs
        },
        testSubscribers: this.state.testSubscribers.split(",").map(number => number.replace(/ /g, ''))
      }, (res) => {
        if (res.status === 'success') {
          this.msg.success(res.description)
        } else {
          this.msg.error(res.description)
        }
      })
    } else {
      let modalClose = document.getElementById('_close_test_subscribers')
      if (modalClose) {
        modalClose.click()
      }
      this.props.updateChatbot({
        testSubscribers: this.state.testSubscribers.split(",").map(number => number.replace(/ /g, ''))
      }, (res) => {
        if (res.status === 'success') {
          this.msg.success(res.description)
        } else {
          this.msg.error(res.description)
        }
      })
    }
  }

  clearTestSubscribers() {
    this.setState({
      testSubscribers: '',
      arePhoneNumbersValid: false
    })
  }

  getTestChatbotContent() {
    return (
      <form onSubmit={this.saveTestSubscribers} className="m-form m-form--fit m-form--label-align-right">
        <div className="m-portlet__body">
          <div className="form-group m-form__group">
            <label htmlFor="exampleInputEmail1">
              Phone Numbers
            </label>
            <div style={{ display: 'flex' }}>
              <input
                required
                value={this.state.testSubscribers}
                onChange={this.handleTestSubscribers}
                type="text"
                className={"m-input " + (this.state.arePhoneNumbersValid ? 'form-control' : 'form-control border-danger')}
                id="_testSubscribers"
                aria-describedby="testSubscribers"
                placeholder="Enter Phone Numbers separated by commas" />
              {!this.state.arePhoneNumbersValid &&
                <div style={{ marginLeft: '5px', marginTop: '3px' }}>
                  <UncontrolledTooltip style={{ minWidth: '100px', opacity: '1.0' }} target='phoneNumbersWarning'>
                    <span>Please enter valid phone numbers separated by commas</span>
                  </UncontrolledTooltip>
                  <i id='phoneNumbersWarning' className='flaticon-exclamation m--font-danger' />
                </div>
              }
            </div>
            <span className="m-form__help">
              These phone numbers will receive chatbot messages even if your chatbot is unpublished
            </span>
          </div>
        </div>
        <div className="m-portlet__foot m-portlet__foot--fit">
          <div style={{ float: 'right', paddingBottom: '0' }} className="m-form__actions">
            <button disabled={!this.state.arePhoneNumbersValid ? true : null} type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    )
  }

  goToShopifySettings() {
    document.getElementById('_close_shopify_integration').click()
    this.props.history.push({
      pathname: '/settings',
      state: { tab: 'shopifyIntegration' }
    })
  }

  getConnectShopifyContent() {
    return (
      <div>
        <div>
          <span>
            You have not integrated Shopify with KiboPush. Please integrate Shopify to continue.
        </span>
        </div>
        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <div onClick={this.goToShopifySettings} className='btn btn-primary'>
            Integrate
        </div>
        </div>
      </div>
    )
  }

  render() {
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
        <MODAL
          id='_test_subscribers'
          title='Add Test Subscribers'
          content={this.getTestChatbotContent()}
          onClose={this.clearTestSubscribers}
        />
        <button
          id="_test_subscribers_trigger"
          data-target='#_test_subscribers'
          data-backdrop="static"
          data-keyboard="false"
          data-toggle='modal'
          type='button'
          style={{ display: 'none' }}>
          Test Subscribers Modal
        </button>
        <MODAL
          id='_shopify_integration'
          title='Shopify Integration'
          content={this.getConnectShopifyContent()}
        />
        <button
          id="_shopify_integration_trigger"
          data-target='#_shopify_integration'
          data-backdrop="static"
          data-keyboard="false"
          data-toggle='modal'
          type='button'
          style={{ display: 'none' }}>
          Shopify Integration Modal
        </button>


        <div className='m-subheader'>
          <h3 className='m-subheader__title'>WhatsApp Chatbot</h3>


          <span style={{ float: 'right' }} className={"m-switch m-switch--lg m-switch--icon " + (this.state.published ? "m-switch--success" : "m-switch--danger")}>
            <label>
              <input disabled={!this.props.chatbot ? true : null} checked={this.state.published} onChange={this.setPublished} type="checkbox" />
              <span />
            </label>
          </span>
          {
            this.props.chatbot &&
            <Link to='/whatsAppChatbotAnalytics' >
              <button
                id='_chatbot_message_area_header_analytics'
                style={{ marginRight: '20px', marginTop: '5px' }}
                type='button'
                className='btn btn-brand pull-right m-btn m-btn--icon'
              >
                <span>
                  <i className='fa flaticon-analytics' />
                  <span>Analytics</span>
                </span>
              </button>
            </Link>
          }

        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>

                {/* <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <p className='m-portlet__head-text'>
                        People fill the form below to generate a WhatsApp Chatbot
                      </p>
                    </div>
                  </div>
                </div> */}

                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-12'>
                      <form onSubmit={this.saveChatbot}>

                        <div className="m-form m-form--fit row">

                          <div className="form-group m-form__group col-lg-8">
                            <h6>Store:</h6>
                            <input required type="text" disabled value={this.props.store ? this.props.store.name : ''} className="form-control m-input" id="_shopify_store" />
                          </div>

                          <div className="col-lg-4">
                            <img alt="shopify-logo" style={{ width: '100px', marginTop: '15px', opacity: this.props.store ? '1' : '0.5' }} src='https://i.pcmag.com/imagery/reviews/02lLbDwVdtIQN2uDFnHeN41-11..v_1569480019.jpg' />
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <h6>
                              Payment Methods (Optional):
                            </h6>
                            <input type="text" onChange={this.setPaymentMethod} value={this.state.paymentMethod} className="form-control m-input" id="_payment_method" placeholder="Enter payment method url..." />
                            <span className="m-form__help">
                              By default, chatbot is configured with "Cash on delivery" payment method.
                              If you wish to provide other payment methods as well then please provide a link to other payment methods.
                              If you leave this empty, then only "Cash on delivery" option will be shown as a payment method to your subscribers.
                            </span>
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <h6>
                              Refund Policy URL (Optional):
                            </h6>
                            <input type="text" onChange={this.setReturnPolicy} value={this.state.returnPolicy} className="form-control m-input" id="_refund_policy_url" placeholder="Enter refund policy URL..." />
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <h6>
                              FAQs URL (Optional):
                            </h6>
                            <input type="text" onChange={this.setFAQs} value={this.state.faqs} className="form-control m-input" id="_faqs_url" placeholder="Enter FAQs URL..." />
                          </div>



                          {/* <div class="form-group m-form__group m--margin-top-10">
                            <h6>Payment Methods (Optional)</h6>
                            <span>
                              By default, chatbot is configured with "Cash on delivery" payment method.
                              If you wish to provide other payment methods as well then please provide a link to other payment methods.
                              If you leave this empty, then only "Cash on delivery" option will be shown as a payment method to your subscribers.
                            </span>
                          </div> */}


                          <div class="form-group m-form__group m--margin-top-10">
                            <span>
                              <strong>Note: </strong>
                              We recommend first testing the chatbot before enabling it for your customers.
                            </span>
                          </div>

                          <div className="m-form__actions col-12">
                            {/* <button type='button' className="btn btn-secondary">
                              Back
                            </button> */}
                            <button type='submit' style={{ float: 'right', marginLeft: '20px' }} className="btn btn-primary">
                              Save
                            </button>
                            <button
                              onClick={this.setTestSubscribers}
                              type='button'
                              style={{ float: 'right', marginLeft: '20px' }}
                              className="btn btn-primary">
                              Test
                            </button>
                          </div>

                          {/* <div style={{ paddingBottom: '0', paddingRight: '0', paddingLeft: '0', float: 'right' }} className="m-form__actions">
                            <button disabled={this.state.zoomMeetingLoading} style={{ float: 'right', marginLeft: '20px' }} type='submit' className="btn btn-primary">
                              Save
                            </button>
                            <button disabled={this.state.zoomMeetingLoading} style={{ float: 'right', marginLeft: '20px' }} type='submit' className="btn btn-primary">
                              Test
                            </button>
                            <button disabled={this.state.zoomMeetingLoading} style={{ float: 'right', marginLeft: '20px' }} type='submit' className="btn btn-primary">
                              Back
                            </button>
                          </div> */}

                        </div>

                      </form>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

function mapStateToProps(state) {
  return {
    user: (state.basicInfo.user),
    chatbot: (state.whatsAppChatbot.chatbot),
    store: (state.shopifyInfo.store)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateChatbot,
    createChatbot,
    fetchChatbot,
    fetchStore
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppChatbot)
