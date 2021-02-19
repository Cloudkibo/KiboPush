import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchChatbots, createChatbot, createCommerceChatbot } from '../../redux/actions/chatbotAutomation.actions'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import CHATBOT from '../../components/chatbotAutomation/chatbot'
import { fetchShopifyStore, fetchBigCommerceStore, checkShopPermissions, fetchBusinessAccounts } from '../../redux/actions/commerce.actions'

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
      shopChatbot: {
        selectedRadio: 'modify',
        selectedPage: '',
        loading: false
      },
      businessAccount: ''
    }

    this.onRadioClick = this.onRadioClick.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.handleOnCreate = this.handleOnCreate.bind(this)
    this.modifyChatbot = this.modifyChatbot.bind(this)
    this.getPages = this.getPages.bind(this)
    this.onSettingsClick = this.onSettingsClick.bind(this)
    this.goToCommerceSettings = this.goToCommerceSettings.bind(this)
    this.handleShopPermissions = this.handleShopPermissions.bind(this)
    this.onBusinessAccountChange = this.onBusinessAccountChange.bind(this)

    props.fetchChatbots()
    props.fetchShopifyStore()
    props.fetchBigCommerceStore()
    props.checkShopPermissions(this.handleShopPermissions)
  }

  onBusinessAccountChange (e) {
    this.setState({businessAccount: e.target.value})
  }

  handleShopPermissions (res) {
    if (res.payload.permissionsGiven) {
      this.props.fetchBusinessAccounts()
    }
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
    } else if (type === 'shopChatbot') {
      let chatbotState = { ...this.state[type] }
      chatbotState.loading = true;
      this.setState({ [type]: chatbotState })
      this.props.createCommerceChatbot({ pageId: this.state[type].selectedPage, storeType: 'shops' }, (res) => this.handleOnCreate(res, pageFbId, type))
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
    } else if (type === 'shopChatbot') {
      this.props.history.push({
        pathname: '/configureCommerceChatbot',
        state: { chatbot, page, store: this.props.store, existingChatbot }
      })
    }
  }

  UNSAFE_componentWillReceiveProps(nextprops) {
    if (nextprops.businessAccounts && nextprops.businessAccounts.length > 0) {
      this.setState({businessAccount: nextprops.businessAccounts[0].id})
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
      }  else if (type === 'shopChatbot') {
        this.msg.success('Chatbot created successfully')
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
    } else {
      return []
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
    let commerceChatbots = this.props.chatbots && this.props.chatbots.filter(chatbot => chatbot.type === 'automated' && chatbot.vertical === 'commerce' && chatbot.storeType !== 'shops')
    let shopChatbots = this.props.chatbots && this.props.chatbots.filter(chatbot => chatbot.type === 'automated' && chatbot.vertical === 'commerce' && chatbot.storeType === 'shops')

    let manualChatbotPages = this.getPages(manualChatbots)
    let commerceChatbotPages = this.getPages(commerceChatbots)
    let shopChatbotPages = this.getPages(shopChatbots)

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
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet m-portlet-mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        Facebook Shops Chatbot
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  {
                    !this.props.shopPermissions &&
                    <div>
                      <h6 style={{ textAlign: 'center' }}>
                        You do not have facebook permissions for marketing api and commerce manager. Please click on the button below to get permissions.
                      </h6>
                      <div style={{ marginTop: '25px', textAlign: 'center' }}>
                        <a href='/auth/facebook/reauth/shops' className='btn btn-primary'>
                          Get Permissions
                      </a>
                      </div>
                    </div>
                  }
                  {
                    this.props.shopPermissions && this.props.businessAccounts && this.props.businessAccounts.length > 0
                    ? <div>
                    <div className="m-form__group form-group row">
                    <label className='col-3 col-form-label'>Select a Business Account:</label>
                      <div className='col-md-8'>
                          <select
                          style={{width: '50%'}}
                          className="form-control m-input"
                          value={this.state.businessAccount}
                          onChange={this.onBusinessAccountChange}
                        >
                          <option value='' disabled>Select a Business Account...</option>
                          {
                            this.props.businessAccounts.map((businessAccount) => (
                              <option key={businessAccount.id} value={businessAccount.id}>{businessAccount.name}</option>
                            ))
                          }
                        </select>
                      </div>
                      </div>
                      <br />
                      <div className="m-form__group form-group">
                        <div className="m-radio-list">
                        <label className="m-radio m-radio--bold m-radio--state-brand">
                          <input
                            type="radio"
                            onClick={(e) => this.onRadioClick(e, 'shopChatbot')}
                            onChange={() => { }}
                            value='modify'
                            checked={this.state.shopChatbot.selectedRadio === 'modify'}
                          />
                          Modify Existing Chatbot
                        <span />
                        </label>
                        {
                          this.state.shopChatbot.selectedRadio === 'modify' &&
                          <div style={{ marginLeft: '50px' }} className='row'>
                            {
                              shopChatbots && shopChatbots.length > 0
                                ? shopChatbots.map((chatbot) => (
                                  <CHATBOT
                                    key={chatbot._id}
                                    profilePic={chatbot.pageId.pagePic}
                                    name={chatbot.pageId.pageName}
                                    onItemClick={() => this.modifyChatbot(chatbot, 'shopChatbot', shopChatbots.find((c) => c.pageId._id === chatbot.pageId._id))}
                                  />
                                ))
                                : (!shopChatbots) ?
                                  <p>Loading chatbots...</p>
                                  : <p>No data to display</p>
                            }
                          </div>
                        }
                        <label className="m-radio m-radio--bold m-radio--state-brand">
                          <input
                            type="radio"
                            onClick={(e) => this.onRadioClick(e, 'shopChatbot')}
                            onChange={() => { }}
                            value='create'
                            checked={this.state.shopChatbot.selectedRadio === 'create'}
                          />
                          Create New Chatbot
                        <span />
                        </label>
                        {
                          this.state.shopChatbot.selectedRadio === 'create' &&
                          <div style={{ marginLeft: '50px' }} className='row'>
                            {
                              this.props.pages && this.props.pages.length > 0
                                ? shopChatbotPages.length > 0
                                  ? <div style={{ width: '100%' }} className='row'>
                                    <div className='col-md-6'>
                                      <div className="form-group m-form__group">
                                        <select
                                          className="form-control m-input"
                                          value={this.state.shopChatbot.selectedPage}
                                          onChange={(e) => this.onPageChange(e, 'shopChatbot')}
                                        >
                                          <option value='' disabled>Select a page...</option>
                                          {
                                            shopChatbotPages.map((page) => (
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
                                        className={`btn btn-primary ${this.state.shopChatbot.loading && 'm-loader m-loader--light m-loader--left'}`}
                                        onClick={(e) => this.onCreate("shopChatbot")}
                                        disabled={!this.state.shopChatbot.selectedPage}
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
                  </div>
                    : <div>
                      <h6 style={{ textAlign: 'center' }}>
                        You do not have any Business Account. Please create a Business Account and then try to create a chatbot.
                      </h6>
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
    store: (state.commerceInfo.store),
    shopPermissions: (state.commerceInfo.shopPermissions),
    businessAccounts: (state.commerceInfo.businessAccounts)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    createCommerceChatbot,
    fetchChatbots,
    createChatbot,
    fetchBigCommerceStore,
    fetchShopifyStore,
    checkShopPermissions,
    fetchBusinessAccounts
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatbotAutomation)
