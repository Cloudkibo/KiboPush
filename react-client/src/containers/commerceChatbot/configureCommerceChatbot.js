import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { updateCommerceChatbot, updateChatbot, getCommerceChatbotTriggers } from '../../redux/actions/chatbotAutomation.actions'
import AlertContainer from 'react-alert'
import MODAL from '../../components/extras/modal'
import CONFIRMATIONMODAL from '../../components/extras/confirmationModal'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { registerAction } from '../../utility/socketio'
import TRIGGERAREA from '../../components/chatbotAutomation/triggerArea'
import HELPWIDGET from '../../components/extras/helpWidget'

const MessengerPlugin = require('react-messenger-plugin').default

class ConfigureCommerceChatbot extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      triggers: props.location.state.triggers ? props.location.state.triggers : [],
      existingChatbot: props.location.state.existingChatbot,
      store: props.location.state.store,
      page: props.location.state.page,
      chatbot: props.location.state.chatbot,
      paymentMethod: props.location.state.chatbot.botLinks.paymentMethod,
      returnPolicy: props.location.state.chatbot.botLinks.returnPolicy,
      faqs: props.location.state.chatbot.botLinks.faqs,
      numberOfProducts: props.location.state.chatbot.numberOfProducts,
      published: props.location.state.chatbot.published,
      testSubscribers: '',
      arePhoneNumbersValid: true,
    }
    this.selectStore = this.selectStore.bind(this)
    this.setPublished = this.setPublished.bind(this)
    this.setPaymentMethod = this.setPaymentMethod.bind(this)
    this.setReturnPolicy = this.setReturnPolicy.bind(this)
    this.setFAQs = this.setFAQs.bind(this)
    this.setNumberOfProducts = this.setNumberOfProducts.bind(this)
    this.saveChatbot = this.saveChatbot.bind(this)
    this.onBack = this.onBack.bind(this)
    this.showTestModal = this.showTestModal.bind(this)
    this.getTestModalContent = this.getTestModalContent.bind(this)
    this.disableManualChatbot = this.disableManualChatbot.bind(this)
    this.updateState = this.updateState.bind(this)

    props.getFbAppId()
    props.getCommerceChatbotTriggers(this.state.chatbot._id, (res) => {
      this.setState({ triggers: res.payload })
    })
  }

  updateState(state) {
    this.setState(state)
  }

  showTestModal() {
    if (!this.props.superUser) {
      this.setState({ showTestContent: true }, () => {
        this.refs._open_test_chatbot_modal.click()
      })
    } else {
      this.msg.error('You are not allowed to perform this action')
    }
  }

  getTestModalContent() {
    return (
      <MessengerPlugin
        appId={this.props.fbAppId}
        pageId={this.state.page.pageId}
        size='large'
        passthroughParams='_commerce_chatbot'
      />
    )
  }

  componentDidMount() {
    document.title = `KiboChat | Commerce Chatbot for ${this.state.page.pageName}`

    let comp = this
    registerAction({
      event: 'chatbot.test.message',
      action: function (data) {
        comp.msg.success('Sent successfully on messenger. Test session is activated on unpublished bot for next 1 hour.')
        comp.refs._open_test_chatbot_modal.click()
      }
    })
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

  setNumberOfProducts(value) {
    this.setState({
      numberOfProducts: value
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

  setPublished(published) {
    console.log('setPublished', published)
    if (published && this.state.existingChatbot && this.state.existingChatbot.published) {
      this.disableManualChatbotTrigger.click()
    } else {
      this.setState({
        published
      }, () => {
        this.props.updateCommerceChatbot({
          chatbotId: this.state.chatbot._id,
          published: this.state.published
        }, (res) => {
          if (res.status === 'success') {
            let chatbot = this.state.chatbot
            chatbot.published = published
            this.setState({ chatbot })
            if (this.state.published) {
              this.msg.success('Commerce Chatbot Enabled')
            } else {
              this.msg.success('Commerce Chatbot Disabled')
            }
          } else {
            this.msg.error(res.description)
          }
        })
      })
    }
  }

  saveChatbot(e) {
    e.preventDefault()
    if (this.state.triggers.length === 0) {
      this.msg.error('At least one trigger is required')
    } else {
      this.props.updateCommerceChatbot({
        chatbotId: this.state.chatbot._id,
        numberOfProducts: this.state.numberOfProducts,
        botLinks: {
          paymentMethod: this.state.paymentMethod,
          returnPolicy: this.state.returnPolicy,
          faqs: this.state.faqs
        },
        triggers: this.state.triggers
      }, (res) => {
        if (res.status === 'success') {
          let chatbot = this.state.chatbot
          chatbot.botLinks = {
            paymentMethod: this.state.paymentMethod,
            returnPolicy: this.state.returnPolicy,
            faqs: this.state.faqs
          }
          chatbot.numberOfProducts = this.state.numberOfProducts
          this.setState({ chatbot })
          this.msg.success(res.description)
        } else {
          this.msg.error(res.description)
        }
      })
    }
  }

  onBack() {
    this.props.history.push({
      pathname: '/chatbotAutomation'
    })
  }

  disableManualChatbot() {
    this.props.updateChatbot({
      chatbotId: this.state.existingChatbot._id,
      published: false
    }, (res) => {
      if (res.status === 'success') {
        let existingChatbot = this.state.existingChatbot
        existingChatbot.published = false
        this.setState({ existingChatbot }, () => {
          this.setPublished(true)
        })
      } else {
        this.msg.error(res.description)
      }
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
        <HELPWIDGET
          documentation={{visibility: true, link: 'https://kibopush.com/messenger-commerce-chatbot/'}}
          videoTutorial={{visibility: true, videoId: 'bLCUt3qMohc'}}
        />
        <button ref='_open_test_chatbot_modal' style={{ display: 'none' }} data-toggle='modal' data-target='#_test_chatbot' />
        <MODAL
          id='_test_chatbot'
          title='Test Chatbot'
          content={this.getTestModalContent()}
        />
        <button style={{ display: 'none' }} ref={el => this.disableManualChatbotTrigger = el} data-toggle='modal' data-target='#disableManualChatbot' />
        <CONFIRMATIONMODAL
          id="disableManualChatbot"
          title='Disable Manual Chatbot'
          description='You have a manual chatbot already enabled for this page. By enabling this Commerce chatbot, that manual chatbot will be disabled. Do you wish to continue?'
          onConfirm={this.disableManualChatbot}
        />

        <div className='m-subheader'>
          <h3 className='m-subheader__title'>Commerce Chatbot for {this.state.page.pageName}</h3>


          <span style={{ float: 'right' }} className={"m-switch m-switch--lg m-switch--icon " + (this.state.published ? "m-switch--success" : "m-switch--danger")}>
            <label>
              <input disabled={!this.state.chatbot ? true : null} checked={this.state.published} onChange={(e) => this.setPublished(e.target.checked)} type="checkbox" />
              <span />
            </label>
          </span>
          {
            this.state.chatbot &&
            <Link to={{ pathname: '/commerceChatbotAnalytics', state: { chatbot: this.state.chatbot, page: this.state.page, store: this.state.store, triggers: this.state.triggers } }} >
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
                            <span className='m--font-boldest'>Store:</span>
                            <input required type="text" disabled value={this.state.store ? this.state.store.name : ''} className="form-control m-input" id="_commerce_store" />
                          </div>

                          {
                            this.state.store && this.state.store.storeType === 'shopify' &&
                            <div className="col-lg-4">
                              <img alt="shopify-logo" style={{ width: '100px', marginTop: '15px' }} src='https://i.pcmag.com/imagery/reviews/02lLbDwVdtIQN2uDFnHeN41-11..v_1569480019.jpg' />
                            </div>
                          }
                          {
                            this.state.store && this.state.store.storeType === 'bigcommerce' &&
                            <div className="col-lg-4">
                              <img alt="bigcommerce-logo" style={{ width: '100px', marginTop: '25px' }} src='https://s3.amazonaws.com/www1.bigcommerce.com/assets/mediakit/downloads/BigCommerce-logo-dark.png' />
                            </div>
                          }

                          <div className="form-group m-form__group col-lg-8">
                            <TRIGGERAREA
                              triggers={this.state.triggers}
                              updateParentState={this.updateState}
                              alertMsg={this.msg}
                            />
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <span className='m--font-boldest'>FAQs URL (Optional):</span>
                            <input type="text" onChange={this.setFAQs} value={this.state.faqs} className="form-control m-input" id="_faqs_url" placeholder="Enter FAQs URL..." />
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <span className='m--font-boldest'>Number of Products:</span>
                            <input
                              type='number' min='2' step='1' max='9'
                              value={this.state.numberOfProducts}
                              onChange={(e) => { this.setNumberOfProducts(parseInt(e.target.value))}}
                              onKeyDown={e => /[+\-.,\s]$/.test(e.key) && e.preventDefault()}
                              className="form-control m-input" id="_faqs_url" />
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
    store: (state.commerceInfo.store),
    fbAppId: state.basicInfo.fbAppId,
    superUser: (state.basicInfo.superUser)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateCommerceChatbot,
    getFbAppId,
    updateChatbot,
    getCommerceChatbotTriggers
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureCommerceChatbot)
