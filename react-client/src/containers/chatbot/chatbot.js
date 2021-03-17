import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchChatbots, createChatbot } from '../../redux/actions/chatbot.actions'
import AlertContainer from 'react-alert'
import { getIntegrations } from '../../redux/actions/settings.actions'
import { fetchDialogflowAgents } from '../../redux/actions/chatbotAutomation.actions'

import CHATBOTITEM from '../../components/chatbot/chatbotItem'
import MODAL from '../../components/extras/modal'
import CREATECHATBOT from '../chatbotAutomation/createChatbot'

class Chatbots extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedRadio: 'modify',
      loading: false,
      showCreateChatbotModal: false
    }

    this.onRadioClick = this.onRadioClick.bind(this)
    this.modifyChatbot = this.modifyChatbot.bind(this)
    this.getCreateChatbotContent = this.getCreateChatbotContent.bind(this)
    this.closeCreateChatbotModal = this.closeCreateChatbotModal.bind(this)
    this.openCreateChatbotModal = this.openCreateChatbotModal.bind(this)

    props.fetchChatbots()
  }

  componentDidMount() {
    document.title = 'KiboChat | ChatBot'
  }

  onRadioClick (e) {
    this.setState({selectedRadio: e.target.value})
  }

  modifyChatbot(chatbot) {
    this.props.history.push({
      pathname: '/chatbots/configure',
      state: { chatbot }
    })
  }

  openCreateChatbotModal () {
    this.setState({showCreateChatbotModal: true}, () => {
      this.refs._open_create_chatbot_modal.click()
    })
  }

  closeCreateChatbotModal () {
    this.setState({showCreateChatbotModal: false})
  }

  getCreateChatbotContent () {
    if (this.state.showCreateChatbotModal) {
      return (
        <CREATECHATBOT
          getIntegrations={this.props.getIntegrations}
          fetchDialogflowAgents={this.props.fetchDialogflowAgents}
          history={this.props.history}
          alertMsg={this.msg}
          chatbots={this.props.chatbots}
          createChatbot={this.props.createChatbot}
          channel={this.props.user.platform}
        />
      )
    } else {
      return (<div />)
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />

        <button
          ref='_open_create_chatbot_modal'
          style={{ display: 'none' }}
          data-backdrop='static'
          data-keyboard='false'
          data-toggle='modal'
          data-target='#__create_chatbot'
        />
        <MODAL
          id='__create_chatbot'
          title='Create Chatbot'
          size='large'
          content={this.getCreateChatbotContent()}
          onClose={this.closeCreateChatbotModal}
        />

        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Chatbots</h3>
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
                          onChange={() => { }}
                          value='modify'
                          checked={this.state.selectedRadio === 'modify'}
                        />
                          Modify Existing Chatbot
                        <span />
                      </label>
                      {
                        this.state.selectedRadio === 'modify' &&
                        <div style={{ marginLeft: '50px' }} className='row'>
                          {
                            this.props.chatbots && this.props.chatbots.length > 0
                              ? this.props.chatbots.map((chatbot) => (
                                <CHATBOTITEM
                                  key={chatbot.chatbotId}
                                  name={chatbot.title}
                                  onItemClick={() => this.modifyChatbot(chatbot)}
                                />
                              ))
                              : (!this.props.chatbots)
                              ? <p>Loading chatbots...</p>
                              : <p>No data to display</p>
                          }
                        </div>
                      }
                      <label className="m-radio m-radio--bold m-radio--state-brand">
                        <input
                          type="radio"
                          onClick={this.onRadioClick}
                          onChange={() => { }}
                          value='create'
                          checked={this.state.selectedRadio === 'create'}
                        />
                          Create New Chatbot
                        <span />
                      </label>
                      {
                        this.state.selectedRadio === 'create' &&
                        <div style={{ marginLeft: '50px' }} className='row'>
                          <button
                            style={{border: '1px dashed #5867dd'}}
                            type="button"
                            className="btn m-btn m-btn--air btn-outline-primary m-btn m-btn--custom m-btn--icon"
                            onClick={this.openCreateChatbotModal}
                          >
                            <span>
                              <i className='la la-plus' />
                              <span>Create</span>
                            </span>
                          </button>
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
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchChatbots,
    createChatbot,
    getIntegrations,
    fetchDialogflowAgents
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Chatbots)
