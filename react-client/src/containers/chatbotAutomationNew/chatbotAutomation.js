import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchChatbots, createChatbot } from '../../redux/actions/chatbotAutomation.actions'
import AlertContainer from 'react-alert'
import { Link } from 'react-router-dom'
import CHATBOT from '../../components/chatbotAutomation/chatbot'

class ChatbotAutomation extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedRadio: 'modify',
      selectedPage: '',
      loading: false
    }

    this.onRadioClick = this.onRadioClick.bind(this)
    this.onPageChange = this.onPageChange.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.handleOnCreate = this.handleOnCreate.bind(this)
    this.modifyChatbot = this.modifyChatbot.bind(this)
    this.getPages = this.getPages.bind(this)
    this.onSettingsClick = this.onSettingsClick.bind(this)

    props.fetchChatbots()
  }

  componentDidMount () {
    document.title = 'KiboChat | ChatBot Automation'
  }

  onRadioClick (e) {
    this.setState({selectedRadio: e.target.value})
  }

  onPageChange (e) {
    this.setState({selectedPage: e.target.value})
  }

  onCreate () {
    const pageFbId = this.props.pages.find((item) => item._id === this.state.selectedPage).pageId
    this.setState({loading: true})
    this.props.createChatbot({pageId: this.state.selectedPage}, (res) => this.handleOnCreate(res, pageFbId))
  }

  modifyChatbot (chatbot) {
    const page = chatbot.pageId
    chatbot.pageFbId = chatbot.pageId.pageId
    chatbot.pageId = chatbot.pageId._id
    chatbot.startingBlockId = chatbot.startingBlockId || 'welcome-id'
    this.props.history.push({
      pathname: '/configureChatbotNew',
      state: {chatbot, page}
    })
  }

  handleOnCreate (res, pageFbId) {
    const chatbot = res.payload
    const page = this.props.pages.find((item) => item._id === this.state.selectedPage)
    chatbot.pageFbId = pageFbId
    chatbot.startingBlockId = chatbot.startingBlockId || 'welcome-id'
    if (res.status === 'success') {
      this.props.history.push({
        pathname: '/configureChatbotNew',
        state: {chatbot, page}
      })
    } else {
      this.msg.error(res.description)
    }
    this.setState({loading: false})
  }

  getPages () {
    if (this.props.chatbots && this.props.pages) {
      const chatbotPages = this.props.chatbots.map((item) => item.pageId._id)
      const pages = this.props.pages.filter((item) => chatbotPages.indexOf(item._id) === -1)
      return pages
    }
  }

  onSettingsClick (chatbot) {
    this.props.history.push({
      pathname: '/chatbotSettings',
      state: chatbot
    })
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    let pages = this.getPages()
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
                <div className='m-portlet__body'>
                  <div className="m-form__group form-group">
                    <div className="m-radio-list">
                      <label className="m-radio m-radio--bold m-radio--state-brand">
                        <input
                          type="radio"
                          onClick={this.onRadioClick}
                          onChange={() => {}}
                          value='modify'
                          checked={this.state.selectedRadio === 'modify'}
                        />
                          Modify Existing Chatbot
                        <span />
                      </label>
                      {
                        this.state.selectedRadio === 'modify' &&
                        <div style={{marginLeft: '50px'}} className='row'>
                          {
                            this.props.chatbots && this.props.chatbots.length > 0
                            ? this.props.chatbots.map((chatbot) => (
                              <CHATBOT
                                key={chatbot._id}
                                profilePic={chatbot.pageId.pagePic}
                                name={chatbot.pageId.pageName}
                                onItemClick={() => this.modifyChatbot(chatbot)}
                                onSettingsClick={() => this.onSettingsClick(chatbot)}
                              />
                            ))
                            : (!this.props.chatbots) ?
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
                        this.state.selectedRadio === 'create' &&
                        <div style={{marginLeft: '50px'}} className='row'>
                          {
                            this.props.pages && this.props.pages.length > 0
                            ? pages.length > 0
                              ? <div style={{width: '100%'}} className='row'>
                                <div className='col-md-6'>
                                  <div className="form-group m-form__group">
                                    <select
                                      className="form-control m-input"
                                      value={this.state.selectedPage}
                                      onChange={this.onPageChange}
                                    >
                                      <option value='' disabled>Select a page...</option>
                                      {
                                        pages.map((page) => (
                                          <option key={page._id} value={page._id}>{page.pageName}</option>
                                        ))
                                      }
                                    </select>
                                  </div>
                                </div>
                                <div className='col-md-3'>
                                  <button
                                    type='button'
                                    style={{border: '1px solid'}}
                                    className={`btn btn-primary ${this.state.loading && 'm-loader m-loader--light m-loader--left'}`}
                                    onClick={this.onCreate}
                                    disabled={!this.state.selectedPage}
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
                              <Link to='/addPages' style={{border: '1px solid', marginLeft: '10px'}} className="btn btn-outline-success">
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

function mapStateToProps (state) {
  return {
    chatbots: (state.chatbotsInfo.chatbots),
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchChatbots,
    createChatbot
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatbotAutomation)
