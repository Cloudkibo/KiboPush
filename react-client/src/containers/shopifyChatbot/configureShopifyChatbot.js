import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { createShopifyChatbot } from '../../redux/actions/chatbotAutomation.actions'
import AlertContainer from 'react-alert'
import MODAL from '../../components/extras/modal'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'

const MessengerPlugin = require('react-messenger-plugin').default

class ConfigureShopifyChatbot extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      store: props.location.state.store,
      page: props.location.state.page,
      chatbot: props.location.state.chatbot,
      paymentMethod: props.location.state.chatbot.botLinks.paymentMethod,
      returnPolicy: props.location.state.chatbot.botLinks.returnPolicy,
      faqs: props.location.state.chatbot.botLinks.faqs,
      published: props.location.state.chatbot.published,
      testSubscribers: '',
      arePhoneNumbersValid: true,
    }
    this.selectStore = this.selectStore.bind(this)
    this.setPublished = this.setPublished.bind(this)
    this.setPaymentMethod = this.setPaymentMethod.bind(this)
    this.setReturnPolicy = this.setReturnPolicy.bind(this)
    this.setFAQs = this.setFAQs.bind(this)
    this.saveChatbot = this.saveChatbot.bind(this)
    this.onBack = this.onBack.bind(this)
    this.showTestModal = this.showTestModal.bind(this)
    this.getTestModalContent = this.getTestModalContent.bind(this)

    props.getFbAppId()
  }

  showTestModal() {
    this.setState({ showTestContent: true }, () => {
      this.refs._open_test_chatbot_modal.click()
    })
  }

  getTestModalContent() {
    return (
      <MessengerPlugin
        appId={this.props.fbAppId}
        pageId={this.state.page.pageId}
        size='large'
        passthroughParams='_chatbot'
      />
    )
  }

  componentDidMount() {
    document.title = `KiboChat | Shopify Chatbot for ${this.state.page.pageName}`
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
    }, () => {
      this.props.createShopifyChatbot({
        pageId: this.state.page._id,
        published: this.state.published
      }, (res) => {
        if (res.status === 'success') {
          if (this.state.published) {
            this.msg.success('Shopify Chatbot Enabled')
          } else {
            this.msg.success('Shopify Chatbot Disabled')
          }
        } else {
          this.msg.error(res.description)
        }
      })
    })
  }

  setTestSubscribers() {
    let testSubscribersModal = document.getElementById('_test_subscribers_trigger')
    if (testSubscribersModal) {
      testSubscribersModal.click()
    }
  }

  saveChatbot(e) {
    e.preventDefault()
    this.props.createShopifyChatbot({
      pageId: this.state.page._id,
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

  onBack() {
    this.props.history.push({
      pathname: '/chatbotAutomationNew'
    })
  }

  render() {
    var alertOptions = {
      offset: 75,
      position: 'bottom right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <button ref='_open_test_chatbot_modal' style={{ display: 'none' }} data-toggle='modal' data-target='#_test_chatbot' />
        <MODAL
          id='_test_chatbot'
          title='Test Chatbot'
          content={this.getTestModalContent()}
          onClose={this.toggleTestModalContent}
        />


        <div className='m-subheader'>
          <h3 className='m-subheader__title'>Shopify Chatbot for {this.state.page.pageName}</h3>


          <span style={{ float: 'right' }} className={"m-switch m-switch--lg m-switch--icon " + (this.state.published ? "m-switch--success" : "m-switch--danger")}>
            <label>
              <input disabled={!this.state.chatbot ? true : null} checked={this.state.published} onChange={this.setPublished} type="checkbox" />
              <span />
            </label>
          </span>
          {
            this.state.chatbot &&
            <Link to={{ pathname: '/shopifyChatbotAnalytics', state: { chatbot: this.state.chatbot, page: this.state.page, store: this.state.store } }} >
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
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-12'>
                      <form onSubmit={this.saveChatbot}>

                        <div className="m-form m-form--fit row">

                          <div className="form-group m-form__group col-lg-8">
                            <h6>Store:</h6>
                            <input required type="text" disabled value={this.state.store ? this.state.store.name : ''} className="form-control m-input" id="_shopify_store" />
                          </div>

                          <div className="col-lg-4">
                            <img alt="shopify-logo" style={{ width: '100px', marginTop: '15px', opacity: this.state.store ? '1' : '0.5' }} src='https://i.pcmag.com/imagery/reviews/02lLbDwVdtIQN2uDFnHeN41-11..v_1569480019.jpg' />
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <h6>
                              FAQs URL (Optional):
                            </h6>
                            <input type="text" onChange={this.setFAQs} value={this.state.faqs} className="form-control m-input" id="_faqs_url" placeholder="Enter FAQs URL..." />
                          </div>

                          <div class="form-group m-form__group m--margin-top-10">
                            <span>
                              <strong>Note: </strong>
                              We recommend first testing the chatbot before enabling it for your customers.
                            </span>
                          </div>

                          <div className="m-form__actions col-12">
                            <button
                              type='button'
                              className='btn btn-primary m-btn m-btn--icon'
                              onClick={this.onBack}
                            >
                              <span>
                                <i className="la la-arrow-left" />
                                <span>Back</span>
                              </span>
                            </button>
                            <button type='submit' style={{ float: 'right', marginLeft: '20px' }} className="btn btn-primary">
                              Save
                            </button>
                            <button
                              onClick={this.showTestModal}
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
    store: (state.shopifyInfo.store),
    fbAppId: state.basicInfo.fbAppId
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createShopifyChatbot,
    getFbAppId
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureShopifyChatbot)
