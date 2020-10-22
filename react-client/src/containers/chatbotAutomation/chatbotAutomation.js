import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchChatbots, createChatbot, createCommerceChatbot } from '../../redux/actions/chatbotAutomation.actions'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import CHATBOT from '../../components/chatbotAutomation/chatbot'
import { fetchShopifyStore, fetchBigCommerceStore } from '../../redux/actions/commerce.actions'

class ChatbotAutomation extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      manualChatbot: {
        selectedRadio: 'modify',
        selectedPage: '',
        loading: false
      },
      commerceChatbot: {
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
    this.goToCommerceSettings = this.goToCommerceSettings.bind(this)

    props.fetchChatbots()
    props.fetchShopifyStore()
    props.fetchBigCommerceStore()
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
    } else if (type === 'commerceChatbot') {
      let chatbotState = { ...this.state[type] }
      chatbotState.loading = true;
      this.setState({ [type]: chatbotState })
      this.props.createCommerceChatbot({ pageId: this.state[type].selectedPage, storeType: this.props.store.storeType }, (res) => this.handleOnCreate(res, pageFbId, type))
    }
  }

  modifyChatbot(chatbot, type, existingChatbot) {
    const page = chatbot.pageId
    if (type === 'manualChatbot') {
      chatbot.pageFbId = chatbot.pageId.pageId
      chatbot.pageId = chatbot.pageId._id
      chatbot.startingBlockId = chatbot.startingBlockId || 'welcome-id'
      this.props.history.push({
        pathname: '/configureChatbot',
        state: { chatbot, page, existingChatbot }
      })
    } else if (type === 'commerceChatbot') {
      this.props.history.push({
        pathname: '/configureCommerceChatbot',
        state: { chatbot, page, store: this.props.store, existingChatbot }
      })
    }
  }

  handleOnCreate(res, pageFbId, type) {
    if (res.status === 'success') {
      const chatbot = res.payload
      const page = this.props.pages.find((item) => item._id === this.state[type].selectedPage)
      if (type === 'manualChatbot') {
        const commerceChatbots = this.props.chatbots && this.props.chatbots.filter(chatbot => chatbot.type === 'automated' && chatbot.vertical === 'commerce')
        const existingChatbot = commerceChatbots.find(c => c.pageId._id === chatbot.pageId._id)
        chatbot.pageFbId = pageFbId
        chatbot.startingBlockId = chatbot.startingBlockId || 'welcome-id'
        this.props.history.push({
          pathname: '/configureChatbot',
          state: { chatbot, page, existingChatbot }
        })
      } else if (type === 'commerceChatbot') {
        const manualChatbots = this.props.chatbots && this.props.chatbots.filter(chatbot => chatbot.type === 'manual')
        const existingChatbot = manualChatbots.find(c => c.pageId._id === chatbot.pageId._id)
        this.props.history.push({
          pathname: '/configureCommerceChatbot',
          state: { chatbot, page, store: this.props.store, existingChatbot }
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
    chatbot.backUrl = '/chatbotAutomation'
    this.props.history.push({
      pathname: '/chatbotSettings',
      state: chatbot
    })
  }

  goToCommerceSettings() {
    this.props.history.push({
      pathname: '/settings',
      state: { tab: 'commerceIntegration' }
    })
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
    let commerceChatbots = this.props.chatbots && this.props.chatbots.filter(chatbot => chatbot.type === 'automated' && chatbot.vertical === 'commerce')

    let manualChatbotPages = this.getPages(manualChatbots)
    let commerceChatbotPages = this.getPages(commerceChatbots)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
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
                              ? manualChatbots.map((chatbot) => (
                                <CHATBOT
                                  key={chatbot._id}
                                  profilePic={chatbot.pageId.pagePic}
                                  name={chatbot.pageId.pageName}
                                  onItemClick={() => this.modifyChatbot(chatbot, 'manualChatbot', commerceChatbots.find((c) => c.pageId._id === chatbot.pageId._id))}
                                  onSettingsClick={() => this.onSettingsClick(chatbot)}
                                />
                              ))
                              : (!manualChatbots) ?
                                <p>Loading chatbots...</p>
                                : <p>No data to display</p>
                          }
                        </div>
                      }
                      {
                        this.props.user.permissions['create_chatbot_automation'] &&
                        <label className="m-radio m-radio--bold m-radio--state-brand">
                          <input
                            type="radio"
                            onClick={this.onRadioClick}
                            onChange={() => {}}
                            value='create'
                            checked={this.state.selectedRadio === 'create'}
                          />
                            Create New Chatbot
                          <span />
                        </label>
                      }
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
                        Commerce Chatbot
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  {
                    !this.props.store &&
                    <div>
                      <h6 style={{ textAlign: 'center' }}>
                        You have not integrated an e-commerce provider with KiboPush. Please integrate an e-commerce provider to create a commerce chatbot.
                      </h6>
                      <div style={{ marginTop: '25px', textAlign: 'center' }}>
                        <div onClick={this.goToCommerceSettings} className='btn btn-primary'>
                          Integrate
                      </div>
                      </div>
                    </div>
                  }
                  {
                    this.props.store &&
                    <div className="m-form__group form-group">
                      <div className="m-radio-list">
                        <label className="m-radio m-radio--bold m-radio--state-brand">
                          <input
                            type="radio"
                            onClick={(e) => this.onRadioClick(e, 'commerceChatbot')}
                            onChange={() => { }}
                            value='modify'
                            checked={this.state.commerceChatbot.selectedRadio === 'modify'}
                          />
                          Modify Existing Chatbot
                        <span />
                        </label>
                        {
                          this.state.commerceChatbot.selectedRadio === 'modify' &&
                          <div style={{ marginLeft: '50px' }} className='row'>
                            {
                              commerceChatbots && commerceChatbots.length > 0
                                ? commerceChatbots.map((chatbot) => (
                                  <CHATBOT
                                    key={chatbot._id}
                                    profilePic={chatbot.pageId.pagePic}
                                    name={chatbot.pageId.pageName}
                                    onItemClick={() => this.modifyChatbot(chatbot, 'commerceChatbot', manualChatbots.find((c) => c.pageId._id === chatbot.pageId._id))}
                                  />
                                ))
                                : (!commerceChatbots) ?
                                  <p>Loading chatbots...</p>
                                  : <p>No data to display</p>
                            }
                          </div>
                        }
                        <label className="m-radio m-radio--bold m-radio--state-brand">
                          <input
                            type="radio"
                            onClick={(e) => this.onRadioClick(e, 'commerceChatbot')}
                            onChange={() => { }}
                            value='create'
                            checked={this.state.commerceChatbot.selectedRadio === 'create'}
                          />
                          Create New Chatbot
                        <span />
                        </label>
                        {
                          this.state.commerceChatbot.selectedRadio === 'create' &&
                          <div style={{ marginLeft: '50px' }} className='row'>
                            {
                              this.props.pages && this.props.pages.length > 0
                                ? commerceChatbotPages.length > 0
                                  ? <div style={{ width: '100%' }} className='row'>
                                    <div className='col-md-6'>
                                      <div className="form-group m-form__group">
                                        <select
                                          className="form-control m-input"
                                          value={this.state.commerceChatbot.selectedPage}
                                          onChange={(e) => this.onPageChange(e, 'commerceChatbot')}
                                        >
                                          <option value='' disabled>Select a page...</option>
                                          {
                                            commerceChatbotPages.map((page) => (
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
                                        className={`btn btn-primary ${this.state.commerceChatbot.loading && 'm-loader m-loader--light m-loader--left'}`}
                                        onClick={(e) => this.onCreate("commerceChatbot")}
                                        disabled={!this.state.commerceChatbot.selectedPage}
                                      >
                                        Create
                                  </button>
                                    </div>
                                  </div>
                                  : <div>
                                    You have created the chatbot for all your connected pages.
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
                  }
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
    chatbots: (state.chatbotAutomationInfo.chatbots),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    store: (state.commerceInfo.store)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createCommerceChatbot,
    fetchChatbots,
    createChatbot,
    fetchBigCommerceStore,
    fetchShopifyStore
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatbotAutomation)
