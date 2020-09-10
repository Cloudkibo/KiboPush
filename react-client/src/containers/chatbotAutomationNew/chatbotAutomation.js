import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchChatbots, createChatbot, createShopifyChatbot } from '../../redux/actions/chatbotAutomation.actions'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import CHATBOT from '../../components/chatbotAutomation/chatbot'
import MODAL from '../../components/extras/modal'
import { fetchStore } from '../../redux/actions/shopify.actions'

class ChatbotAutomation extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      manualChatbot: {
        selectedRadio: 'modify',
        selectedPage: '',
        loading: false
      },
      shopifyChatbot: {
        selectedRadio: 'modify',
        selectedPage: '',
        loading: false
      },
    }

    this.onRadioClick = this.onRadioClick.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.handleOnCreate = this.handleOnCreate.bind(this)
    this.modifyChatbot = this.modifyChatbot.bind(this)
    this.getPages = this.getPages.bind(this)
    this.onSettingsClick = this.onSettingsClick.bind(this)
    this.getConnectShopifyContent = this.getConnectShopifyContent.bind(this)
    this.goToShopifySettings = this.goToShopifySettings.bind(this)

    props.fetchChatbots()
    props.fetchStore()
  }

  componentDidMount() {
    document.title = 'KiboChat | ChatBot Automation'
  }

  onRadioClick(e, type) {
    let chatbotState = { ...this.state[type] }
    chatbotState.selectedRadio = e.target.value;
    this.setState({ [type]: chatbotState })
  }

  onPageChange(e, type) {
    let chatbotState = { ...this.state[type] }
    chatbotState.selectedPage = e.target.value;
    this.setState({ [type]: chatbotState })
  }

  onCreate(type) {
    const pageFbId = this.props.pages.find((item) => item._id === this.state[type].selectedPage).pageId
    if (type === 'manualChatbot') {
      let chatbotState = { ...this.state[type] }
      chatbotState.loading = true;
      this.setState({ [type]: chatbotState })
      this.props.createChatbot({ pageId: this.state[type].selectedPage }, (res) => this.handleOnCreate(res, pageFbId, type))
    } else if (type === 'shopifyChatbot') {
      if (this.props.store) {
        let chatbotState = { ...this.state[type] }
        chatbotState.loading = true;
        this.setState({ [type]: chatbotState })
        this.props.createShopifyChatbot({ pageId: this.state[type].selectedPage }, (res) => this.handleOnCreate(res, pageFbId, type))
      } else {
        let shopifyConnectModal = document.getElementById('_shopify_integration_trigger')
        if (shopifyConnectModal) {
          shopifyConnectModal.click()
        }
      }
    }
  }

  modifyChatbot(chatbot, type) {
    const page = chatbot.pageId
    if (type === 'manualChatbot') {
      chatbot.pageFbId = chatbot.pageId.pageId
      chatbot.pageId = chatbot.pageId._id
      chatbot.startingBlockId = chatbot.startingBlockId || 'welcome-id'
      this.props.history.push({
        pathname: '/configureChatbotNew',
        state: { chatbot, page }
      })
    } else if (type === 'shopifyChatbot') {
      this.props.history.push({
        pathname: '/configureShopifyChatbot',
        state: { chatbot, page, store: this.props.store }
      })
    }
  }

  handleOnCreate(res, pageFbId, type) {
    if (res.status === 'success') {
      const chatbot = res.payload
      const page = this.props.pages.find((item) => item._id === this.state[type].selectedPage)
      if (type === 'manualChatbot') {
        chatbot.pageFbId = pageFbId
        chatbot.startingBlockId = chatbot.startingBlockId || 'welcome-id'
        this.props.history.push({
          pathname: '/configureChatbotNew',
          state: { chatbot, page }
        })
      } else if (type === 'shopifyChatbot') {
        this.props.history.push({
          pathname: '/configureShopifyChatbot',
          state: { chatbot, page, store: this.props.store }
        })
      }
    } else {
      this.msg.error(res.description)
    }
    let chatbotState = { ...this.state[type] }
    chatbotState.loading = false
    this.setState({ [type]: chatbotState })
  }

  getPages(chatbots) {
    if (chatbots && this.props.pages) {
      const chatbotPages = chatbots.map((item) => item.pageId._id)
      const pages = this.props.pages.filter((item) => chatbotPages.indexOf(item._id) === -1)
      return pages
    }
  }

  onSettingsClick(chatbot) {
    chatbot.backUrl = '/chatbotAutomationNew'
    this.props.history.push({
      pathname: '/chatbotSettings',
      state: chatbot
    })
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
    let manualChatbots = this.props.chatbots && this.props.chatbots.filter(chatbot => chatbot.type === 'manual')
    let shopifyChatbots = this.props.chatbots && this.props.chatbots.filter(chatbot => chatbot.type === 'automated' && chatbot.vertical === 'commerce')


    let manualChatbotPages = this.getPages(manualChatbots)
    let shopifyChatbotPages = this.getPages(shopifyChatbots)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Chatbot Automation</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet m-portlet-mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Manual Chatbot
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className="m-form__group form-group">
                    <div className="m-radio-list">
                      <label className="m-radio m-radio--bold m-radio--state-brand">
                        <input
                          type="radio"
                          onClick={(e) => this.onRadioClick(e, 'manualChatbot')}
                          onChange={() => { }}
                          value='modify'
                          checked={this.state.manualChatbot.selectedRadio === 'modify'}
                        />
                          Modify Existing Chatbot
                        <span />
                      </label>
                      {
                        this.state.manualChatbot.selectedRadio === 'modify' &&
                        <div style={{ marginLeft: '50px' }} className='row'>
                          {
                            manualChatbots && manualChatbots.length > 0
                              ? this.props.chatbots.map((chatbot) => (
                                <CHATBOT
                                  key={chatbot._id}
                                  profilePic={chatbot.pageId.pagePic}
                                  name={chatbot.pageId.pageName}
                                  onItemClick={() => this.modifyChatbot(chatbot, 'manualChatbot')}
                                  onSettingsClick={() => this.onSettingsClick(chatbot)}
                                />
                              ))
                              : (!manualChatbots) ?
                                <p>Loading chatbots...</p>
                                : <p>No data to display</p>
                          }
                        </div>
                      }
                      <label className="m-radio m-radio--bold m-radio--state-brand">
                        <input
                          type="radio"
                          onClick={(e) => this.onRadioClick(e, 'manualChatbot')}
                          onChange={() => { }}
                          value='create'
                          checked={this.state.manualChatbot.selectedRadio === 'create'}
                        />
                          Create New Chatbot
                        <span />
                      </label>
                      {
                        this.state.manualChatbot.selectedRadio === 'create' &&
                        <div style={{ marginLeft: '50px' }} className='row'>
                          {
                            this.props.pages && this.props.pages.length > 0
                              ? manualChatbotPages.length > 0
                                ? <div style={{ width: '100%' }} className='row'>
                                  <div className='col-md-6'>
                                    <div className="form-group m-form__group">
                                      <select
                                        className="form-control m-input"
                                        value={this.state.manualChatbot.selectedPage}
                                        onChange={(e) => this.onPageChange(e, 'manualChatbot')}
                                      >
                                        <option value='' disabled>Select a page...</option>
                                        {
                                          manualChatbotPages.map((page) => (
                                            <option key={page._id} value={page._id}>{page.pageName}</option>
                                          ))
                                        }
                                      </select>
                                    </div>
                                  </div>
                                  <div className='col-md-3'>
                                    <button
                                      type='button'
                                      style={{ border: '1px solid' }}
                                      className={`btn btn-primary ${this.state.manualChatbot.loading && 'm-loader m-loader--light m-loader--left'}`}
                                      onClick={(e) => this.onCreate("manualChatbot")}
                                      disabled={!this.state.manualChatbot.selectedPage}
                                    >
                                      Create
                                  </button>
                                  </div>
                                </div>
                                : <div>
                                  You have created the chatbot for all your connected pages.
                              </div>
                              : (!this.props.pages) ?
                                <div>
                                  Loading Pages...
                            </div>
                                :
                                <div>
                                  Please connect a Facebook page to continue
                              <Link to='/addPages' style={{ border: '1px solid', marginLeft: '10px' }} className="btn btn-outline-success">
                                    Connect
                              </Link>
                                </div>
                          }
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet m-portlet-mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Shopify Chatbot
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className="m-form__group form-group">
                    <div className="m-radio-list">
                      <label className="m-radio m-radio--bold m-radio--state-brand">
                        <input
                          type="radio"
                          onClick={(e) => this.onRadioClick(e, 'shopifyChatbot')}
                          onChange={() => { }}
                          value='modify'
                          checked={this.state.shopifyChatbot.selectedRadio === 'modify'}
                        />
                          Modify Existing Chatbot
                        <span />
                      </label>
                      {
                        this.state.shopifyChatbot.selectedRadio === 'modify' &&
                        <div style={{ marginLeft: '50px' }} className='row'>
                          {
                            shopifyChatbots && shopifyChatbots.length > 0
                              ? shopifyChatbots.map((chatbot) => (
                                <CHATBOT
                                  key={chatbot._id}
                                  profilePic={chatbot.pageId.pagePic}
                                  name={chatbot.pageId.pageName}
                                  onItemClick={() => this.modifyChatbot(chatbot, 'shopifyChatbot')}
                                  onSettingsClick={() => this.modifyChatbot(chatbot, 'shopifyChatbot')}
                                />
                              ))
                              : (!shopifyChatbots) ?
                                <p>Loading chatbots...</p>
                                : <p>No data to display</p>
                          }
                        </div>
                      }
                      <label className="m-radio m-radio--bold m-radio--state-brand">
                        <input
                          type="radio"
                          onClick={(e) => this.onRadioClick(e, 'shopifyChatbot')}
                          onChange={() => { }}
                          value='create'
                          checked={this.state.shopifyChatbot.selectedRadio === 'create'}
                        />
                          Create New Chatbot
                        <span />
                      </label>
                      {
                        this.state.shopifyChatbot.selectedRadio === 'create' &&
                        <div style={{ marginLeft: '50px' }} className='row'>
                          {
                            this.props.pages && this.props.pages.length > 0
                              ? shopifyChatbotPages.length > 0
                                ? <div style={{ width: '100%' }} className='row'>
                                  <div className='col-md-6'>
                                    <div className="form-group m-form__group">
                                      <select
                                        className="form-control m-input"
                                        value={this.state.shopifyChatbot.selectedPage}
                                        onChange={(e) => this.onPageChange(e, 'shopifyChatbot')}
                                      >
                                        <option value='' disabled>Select a page...</option>
                                        {
                                          shopifyChatbotPages.map((page) => (
                                            <option key={page._id} value={page._id}>{page.pageName}</option>
                                          ))
                                        }
                                      </select>
                                    </div>
                                  </div>
                                  <div className='col-md-3'>
                                    <button
                                      type='button'
                                      style={{ border: '1px solid' }}
                                      className={`btn btn-primary ${this.state.shopifyChatbot.loading && 'm-loader m-loader--light m-loader--left'}`}
                                      onClick={(e) => this.onCreate("shopifyChatbot")}
                                      disabled={!this.state.shopifyChatbot.selectedPage}
                                    >
                                      Create
                                  </button>
                                  </div>
                                </div>
                                : <div>
                                  You have created the chatbot for all your connected pages.
                              </div>
                              : (!this.props.pages) ?
                                <div>
                                  Loading Pages...
                            </div>
                                :
                                <div>
                                  Please connect a Facebook page to continue
                              <Link to='/addPages' style={{ border: '1px solid', marginLeft: '10px' }} className="btn btn-outline-success">
                                    Connect
                              </Link>
                                </div>
                          }
                        </div>
                      }
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
    chatbots: (state.chatbotsInfo.chatbots),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createShopifyChatbot,
    fetchChatbots,
    createChatbot,
    fetchStore
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatbotAutomation)
