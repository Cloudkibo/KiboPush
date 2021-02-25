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
import { uploadFile } from '../../redux/actions/convos.actions'
import Files from 'react-files'
import { RingLoader } from 'halogenium'
import { cloneDeep } from 'lodash'

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
      returnOrder: props.location.state.chatbot.returnOrder,
      returnOrderMessage: props.location.state.chatbot.returnOrderMessage,
      cancelOrder: props.location.state.chatbot.cancelOrder,
      cancelOrderMessage: props.location.state.chatbot.cancelOrderMessage,
      catalog: props.location.state.chatbot.catalog ? props.location.state.chatbot.catalog : {},
      uploadingAttachment: false
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
    this.handleCancelOrder=this.handleCancelOrder.bind(this)
    this.handleReturnOrder=this.handleReturnOrder.bind(this)
    this.onFilesChange = this.onFilesChange.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.removeCatalog = this.removeCatalog.bind(this)

    props.getFbAppId()
    props.getCommerceChatbotTriggers(this.state.chatbot._id, (res) => {
      this.setState({ triggers: res.payload })
    })
  }

  removeCatalog () {
    this.setState({catalog: {}})
  }

  onFilesError (error, file) {
    this.props.alertMsg.error('Attachment exceeds the limit of 25MB')
  }

  onFilesChange (files) {
    if (files.length > 0) {
      var file = files[files.length - 1]
      this.setState({file: file})
      if (file.size > 25000000) {
        this.msg.error('Attachment exceeds the limit of 25MB')
      } else {
        var fileData = new FormData()
        const type = 'file'
        fileData.append('file', file)
        fileData.append('filename', file.name)
        fileData.append('filetype', file.type)
        fileData.append('filesize', file.size)
        fileData.append('componentType', type)
        var fileInfo = {
          componentType: type,
          componentName: 'file',
          fileName: file.name,
          type: file.type,
          size: file.size
        }
        this.setState({uploadingAttachment: true})
        this.props.uploadFile(fileData, fileInfo, this.handleFile)
      }
    }
  }

  handleFile (fileInfo) {
    let attachment = cloneDeep(this.state.catalog)
    attachment.url = fileInfo.fileurl.url
    attachment.name = fileInfo.fileurl.name
    this.setState({
      catalog: attachment,
      uploadingAttachment: false
    })
  }


  handleReturnOrder (e) {
    this.setState({returnOrder: e.target.checked})
  }

  handleCancelOrder (e) {
    this.setState({cancelOrder: e.target.checked})
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
        comp.msg.success('Sent successfully on messenger')
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
    } else if (this.state.cancelOrder && !this.state.cancelOrderMessage) {
      this.msg.error('Please enter a cancel order message')
    } else if (this.state.returnOrder && !this.state.returnOrderMessage) {
      this.msg.error('Please enter a return order message')
    } else {
      this.props.updateCommerceChatbot({
        chatbotId: this.state.chatbot._id,
        numberOfProducts: this.state.numberOfProducts,
        cancelOrder: this.state.cancelOrder,
        cancelOrderMessage: this.state.cancelOrderMessage,
        returnOrder: this.state.returnOrder,
        returnOrderMessage: this.state.returnOrderMessage,
        catalog: this.state.catalog,
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
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <span className='m-portlet__head-icon'>
                        {
                          this.state.store && this.state.store.storeType === 'bigcommerce' &&
                            <img alt="bigcommerce-logo" style={{ width: '100px', marginBottom: '6px'}} src='https://s3.amazonaws.com/www1.bigcommerce.com/assets/mediakit/downloads/BigCommerce-logo-dark.png' />
                        }
                        {
                          this.state.store && this.state.store.storeType === 'shopify' &&
                        <img alt="shopify-logo" style={{ width: '100px', marginLeft: '-20px', marginRight: '-20px' }} src='https://i.pcmag.com/imagery/reviews/02lLbDwVdtIQN2uDFnHeN41-11..v_1569480019.jpg' />
                        }
                      </span>
                      <h3 className='m-portlet__head-text'>
                        {this.state.store ? this.state.store.name : ''}
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <ul className='m-portlet__nav'>
                      {this.state.chatbot &&
                      <li className='m-portlet__nav-item'>
                        <Link to={{ pathname: '/commerceChatbotAnalytics', state: { chatbot: this.state.chatbot, page: this.state.page, store: this.state.store, triggers: this.state.triggers } }} >
                          <button
                            id='_chatbot_message_area_header_analytics'
                            type='button'
                            className='btn btn-brand pull-right m-btn m-btn--icon'
                          >
                            <span>
                              <i className='fa flaticon-analytics' />
                              <span>Analytics</span>
                            </span>
                          </button>
                        </Link>
                      </li>
                      }
                      <li className='m-portlet__nav-item'>
                        <span
                          style={{marginTop: '10px', marginLeft: '15px'}}
                          className={"m-switch m-switch--lg m-switch--icon " + (this.state.published ? "m-switch--success" : "m-switch--danger")}>
                          <label>
                            <input disabled={!this.state.chatbot ? true : null} checked={this.state.published} onChange={(e) => this.setPublished(e.target.checked)} type="checkbox" />
                            <span />
                          </label>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='row'>
                    <div className='col-12'>
                      <form onSubmit={this.saveChatbot}>
                        <div className="m-form m-form--fit row">
                          <div className="form-group m-form__group col-lg-8">
                            <TRIGGERAREA
                              triggers={this.state.triggers}
                              updateParentState={this.updateState}
                              alertMsg={this.msg}
                            />
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <span className="m--font-boldest">Catalog:</span>
                              {this.state.catalog && this.state.catalog.name &&
                                <div style={{float: 'right', marginRight: '-10px', marginTop: '16px'}} onClick={this.removeCatalog}>
                                <span className="fa-stack" style={{cursor: 'pointer'}}>
                                  <i className="fa fa-times fa-stack-2x" />
                                  </span>
                                </div>
                              }
                            <div className='ui-block hoverborder' style={{padding: 25}}>
                              <Files
                                className='files-dropzone'
                                onChange={this.onFilesChange}
                                onError={this.onFilesError}
                                accepts={['application/pdf']}
                                maxFileSize={25000000}
                                minFileSize={0}
                                clickable>
                                {this.state.uploadingAttachment
                                  ? <div className='align-center'><center><RingLoader color='#FF5E3A' /></center></div>
                                  : <div className='align-center' style={{padding: '5px'}}>
                                    <img src='https://cdn.cloudkibo.com/public/icons/file.png' alt='Text' style={{pointerEvents: 'none', zIndex: -1, maxHeight: 40}} />
                                    <h4 style={{pointerEvents: 'none', zIndex: -1, marginLeft: '10px', display: 'inline', wordBreak: 'break-all'}}>{this.state.catalog && this.state.catalog.name ? this.state.catalog.name : 'Upload Catalog'}</h4>
                                  </div>
                                }
                              </Files>
                            </div>
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <span className='m--font-boldest'>Number of Products:</span>
                            <input
                              type='number' min='2' step='1' max='9'
                              value={this.state.numberOfProducts}
                              style={{marginBottom: '10px'}}
                              onChange={(e) => { this.setNumberOfProducts(parseInt(e.target.value))}}
                              onKeyDown={e => /[+\-.,\s]$/.test(e.key) && e.preventDefault()}
                              className="form-control m-input" />
                            <span>This refers to the maximum number of products shown in a message</span>
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <span className='m--font-boldest'>FAQs URL (Optional):</span>
                            <input type="text" onChange={this.setFAQs} value={this.state.faqs} className="form-control m-input" id="_faqs_url" placeholder="Enter FAQs URL..." />
                          </div>

                          <div className="form-group m-form__group col-lg-8">
                            <label className="m-checkbox m--font-boldest" style={{fontWeight: '600'}}>
                              <input
                                type="checkbox"
                                onChange={this.handleCancelOrder}
                                onClick={this.handleCancelOrder}
                                checked={this.state.cancelOrder}
                              />
                            Allow cancel order
                              <span></span>
                            </label>
                            {this.state.cancelOrder &&
                              <div style={{marginTop: '10px'}}>
                                <span className='m--font-boldest'>Cancel Order Message:</span>
                                <textarea
                                  rows='6'
                                  value={this.state.cancelOrderMessage}
                                  onChange={(e) => { this.updateState({cancelOrderMessage: e.target.value})}}
                                  className="form-control m-input" />
                              </div>
                          }
                          </div>
                          <div className="form-group m-form__group col-lg-8">
                            <label className="m-checkbox m--font-boldest" style={{fontWeight: '600'}}>
                              <input
                                type="checkbox"
                                onChange={this.handleReturnOrder}
                                checked={this.state.returnOrder}
                              />
                            Allow return order
                              <span></span>
                            </label>
                            {this.state.returnOrder &&
                              <div style={{marginTop: '10px'}}>
                                <span className='m--font-boldest'>Return Order Message:</span>
                                <textarea
                                  rows='6'
                                  value={this.state.returnOrderMessage}
                                  onChange={(e) => { this.updateState({returnOrderMessage: e.target.value})}}
                                  className="form-control m-input" />
                              </div>
                          }
                        </div>

                          <div className="form-group m-form__group m--margin-top-10">
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
    getCommerceChatbotTriggers,
    uploadFile
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureCommerceChatbot)
