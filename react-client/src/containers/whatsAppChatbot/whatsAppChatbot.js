import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateChatbot, createChatbot, fetchChatbot } from '../../redux/actions/whatsAppChatbot.actions'
import AlertContainer from 'react-alert'

class WhatsAppChatbot extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      storeUrl: '',
      paymentMethod: '',
      returnPolicy: '',
      faqs: '',
      published: false
    }
    this.selectStore = this.selectStore.bind(this)
    this.setPublished = this.setPublished.bind(this)
    this.setPaymentMethod = this.setPaymentMethod.bind(this)
    this.setReturnPolicy = this.setReturnPolicy.bind(this)
    this.setFAQs = this.setFAQs.bind(this)
    this.saveChatbot = this.saveChatbot.bind(this)

    props.fetchChatbot()
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
      storeUrl: e.target.value
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

  saveChatbot(e) {
    e.preventDefault()
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
        <div className='m-subheader'>
          <h3 className='m-subheader__title'>WhatsApp Chatbot</h3>

          <span style={{ float: 'right' }} className={"m-switch m-switch--lg m-switch--icon " + (this.state.published ? "m-switch--success" : "m-switch--danger")}>
            <label>
              <input disabled={!this.props.chatbot ? true : null} checked={this.state.published} onChange={this.setPublished} type="checkbox" />
              <span />
            </label>
          </span>
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
                            <h6>Store URL:</h6>
                            <select required onChange={this.selectStore} className="form-control m-input" value={this.state.storeUrl} id="_store_select" required>
                              <option key='' value='' disabled>Select a Store...</option>
                              <option value='shopify'>Shopify</option>
                            </select>
                          </div>

                          <div className="col-lg-4">
                            <img style={{ width: '100px', marginTop: '15px', opacity: this.state.storeUrl ? '1' : '0.5' }} src='https://i.pcmag.com/imagery/reviews/02lLbDwVdtIQN2uDFnHeN41-11..v_1569480019.jpg' />
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
                            <button type='button' disabled={this.state.zoomMeetingLoading} className="btn btn-secondary">
                              Back
                            </button>
                            <button type='submit' disabled={this.state.zoomMeetingLoading} style={{ float: 'right', marginLeft: '20px' }} className="btn btn-primary">
                              Save
                            </button>
                            <button type='button' disabled={this.state.zoomMeetingLoading} style={{ float: 'right', marginLeft: '20px' }} className="btn btn-primary">
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
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: (state.basicInfo.user),
    chatbot: (state.whatsAppChatbot.chatbot)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateChatbot,
    createChatbot,
    fetchChatbot
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(WhatsAppChatbot)
