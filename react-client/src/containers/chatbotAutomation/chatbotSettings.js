import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import {
  fetchChatbotDetails,
  updateChatbot,
  fetchDialogflowAgents
} from '../../redux/actions/chatbotAutomation.actions'
import { getIntegrations } from '../../redux/actions/settings.actions'
import Select from 'react-select'

import BACKBUTTON from '../../components/extras/backButton'
import TEXTAREA from '../../components/chatbotAutomation/textArea'
import MOREOPTIONS from '../../components/chatbotAutomation/moreOptions'

class ChatbotSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      chatbot: props.location.state,
      blocks: [],
      text: '',
      options: [],
      fallbackReplyEnabled: false,
      isYoutubePlayable: true,
      dialogFlowAgent: '',
      dialogflowAgents: [],
      dialogflowIntegrated: false,
      agentsLoading: true,
      integrationsLoading: true
    }
    this.setStateData = this.setStateData.bind(this)
    this.onBack = this.onBack.bind(this)
    this.updateState = this.updateState.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.handleYoutubeSwitch = this.handleYoutubeSwitch.bind(this)
    this.handleChatbotDetails = this.handleChatbotDetails.bind(this)
    this.addOption = this.addOption.bind(this)
    this.updateOption = this.updateOption.bind(this)
    this.removeOption = this.removeOption.bind(this)
    this.preparePayload = this.preparePayload.bind(this)
    this.onSave = this.onSave.bind(this)
    this.afterSave = this.afterSave.bind(this)
    this.handleIntegrations = this.handleIntegrations.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.gotoIntegerations = this.gotoIntegerations.bind(this)
  }

  componentDidMount () {
    this.props.fetchChatbotDetails(this.props.location.state._id, this.handleChatbotDetails)
    document.title = 'KiboChat | ChatBot Settings'
    this.props.getIntegrations(this.handleIntegrations)
    this.props.fetchDialogflowAgents(this.handleAgents)
  }

  handleIntegrations (res) {
    if (res.status === 'success') {
      const integrations = res.payload
      const dialogflowIntegration = integrations.find((item) => item.integrationName === 'DIALOGFLOW')
      if (dialogflowIntegration) {
        this.setState({dialogflowIntegrated: true, integrationsLoading: false})
      } else {
        this.setState({dialogflowIntegrated: false, integrationsLoading: false})
      }
    } else {
      this.setState({dialogflowIntegrated: false, integrationsLoading: false})
    }
  }

  handleAgents (res) {
    if (res.status === 'success') {
      const agents = res.payload
      const dialogflowAgents = agents.map((item) => {
        return {
          label: item.displayName,
          value: item.parent
        }
      })
      let dialogFlowAgent = this.state.dialogFlowAgent
      if (this.state.chatbot && this.state.chatbot.dialogFlowAgentId) {
        const agent = dialogflowAgents.find((item) => item.value === this.state.chatbot.dialogFlowAgentId)
        if (agent) dialogFlowAgent = agent
      }
      this.setState({dialogflowAgents, agentsLoading: false, dialogFlowAgent})
    } else {
      this.setState({dialogflowAgents: [], agentsLoading: false})
    }
  }

  onAgentChange (value, other) {
    this.setState({dialogFlowAgent: value})
  }

  gotoIntegerations () {
    this.props.history.push({
      pathname: '/settings',
      state: { tab: 'integrations' }
    })
  }

  setStateData () {
    const payload = this.state.chatbot.fallbackReply
    const welcomeBlock = this.state.blocks.find((b) => b._id === this.state.chatbot.startingBlockId)
    if (payload.length > 0) {
      this.setState({
        text: payload[0].text,
        options: payload[0].quickReplies,
        fallbackReplyEnabled: this.state.chatbot.fallbackReplyEnabled,
        isYoutubePlayable: this.state.chatbot.isYoutubePlayable
      })
    } else {
      if (welcomeBlock && welcomeBlock.uniqueId) {
        this.setState({
          text: 'Sorry, I do not understand this. Please select from the following:',
          options: [{
            title: 'Home',
            content_type: 'text',
            payload: JSON.stringify([{action: '_chatbot', blockUniqueId: welcomeBlock.uniqueId}])
          }]
        })
      } else {
        this.setState({text: 'Sorry, I do not understand this. Please select from the following:'})
      }
    }
  }

  updateState (state) {
    this.setState(state)
  }

  onBack() {
    this.props.history.push({
      pathname: this.props.location.state.backUrl
    })
  }

  handleSwitch (e) {
    this.setState({fallbackReplyEnabled: e.target.checked})
  }

  handleYoutubeSwitch (e) {
    this.setState({isYoutubePlayable: e.target.checked})
  }

  handleChatbotDetails (res) {
    if (res.status === 'success') {
      this.setState({blocks: res.payload})
      this.setStateData()
    } else {
      this.msg.error('An unexpected error occured. Please try again later')
      this.setState({loading: false})
    }
  }

  addOption (title, action, uniqueId) {
    console.log('this.props.addoption', this.props)
    const options = this.state.options
    let option = {
      content_type: 'text',
      title,
      payload: JSON.stringify([{action: '_chatbot', blockUniqueId: uniqueId}])
    }
    options.push(option)
    this.setState({options})
  }

  updateOption (uniqueId, index, title) {
    const quickReplies = this.state.options
    quickReplies[index].title = title
    const payload = JSON.parse(quickReplies[index].payload)
    payload[0].blockUniqueId = uniqueId
    quickReplies[index].payload = JSON.stringify(payload)

    this.setState({options: quickReplies})
  }

  removeOption (uniqueId, index) {
    const quickReplies = this.state.options
    quickReplies.splice(index, 1)
    this.setState({options: quickReplies})
  }

  preparePayload (state) {
    let payload = []
    if (state.text) {
      payload.push({
        componentType: 'text',
        text: state.text
      })
    }
    if (payload.length > 0) {
      payload[payload.length - 1].quickReplies = state.options
    }
    return payload
  }

  onSave () {
    if (!this.state.text) {
      this.msg.error('Text is required')
    } else {
      const data = {
        chatbotId: this.state.chatbot._id,
        fallbackReply: this.preparePayload(this.state),
        fallbackReplyEnabled: this.state.fallbackReplyEnabled,
        isYoutubePlayable: this.state.isYoutubePlayable
      }
      this.props.updateChatbot(data, this.afterSave)
    }
  }

  afterSave (res) {
    if (res.status === 'success') {
      this.msg.success('Settings saved successfully!')
    } else {
      this.msg.error(res.description || 'Failed to save settings!')
    }
  }

  render () {
    var alertOptions = {
      offset: 75,
      position: 'top right',
      theme: 'dark',
      time: 3000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={(a) => { this.msg = a }} {...alertOptions} />
        <BACKBUTTON
          onBack={this.onBack}
        />

        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>{this.state.chatbot.pageId.pageName}</h3>
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
                        Settings
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    <button className='btn btn-primary m-btn m-btn--custom m-btn--air m-btn--pill' onClick={this.onSave}>
                      <span>
                        Save
                      </span>
                    </button>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className="m-form">
                    <div className="m-form__group form-group row" style={{padding: 0}}>
                      <label className="col-6 col-form-label">
                        Play YouTube video (size less than 25MB) inside Facebook Messenger:
                      </label>
                      <div className="col-3">
                        <span className="m-switch m-switch--icon">
                          <label>
                            <input type="checkbox" onChange={this.handleYoutubeSwitch} checked={this.state.isYoutubePlayable} name="" />
                            <span />
                          </label>
                        </span>
                      </div>
                    </div>
                    <div className="m-form__group form-group row">
                      <label className="col-3 col-form-label">
                        Enable fallback reply:
                      </label>
                      <div className="col-3">
                        <span className="m-switch m-switch--icon">
                          <label>
                            <input type="checkbox" onChange={this.handleSwitch} checked={this.state.fallbackReplyEnabled} name="" />
                            <span />
                          </label>
                        </span>
                      </div>
                    </div>
                    <TEXTAREA
                      text={this.state.text}
                      updateParentState={this.updateState}
                      label='Fallback Reply'
                      disabled={!this.state.fallbackReplyEnabled}
                    />
                    <div className='m--space-10' />
                    {
                      this.state.fallbackReplyEnabled && this.state.blocks.length > 0 &&
                      <MOREOPTIONS
                        data={this.state.options}
                        alertMsg={this.msg}
                        currentLevel={0}
                        maxLevel={3}
                        blocks={this.state.blocks}
                        addOption={this.addOption}
                        removeOption={this.removeOption}
                        updateOption={this.updateOption}
                        showLabel={false}
                        isCreatable={false}
                      />
                    }
                    <div className='m--space-10' />
                    <div className="m-form__group form-group row">
                      <label className="col-3 col-form-label">
                        DialogFlow Agent (Optional):
                      </label>
                      <div className="col-6">
                        {
                          this.state.integrationsLoading || this.state.agentsLoading
                          ? <center>
                            <div className="m-loader m-loader--brand" style={{width: '30px', display: 'inline-block'}} />
                          </center>
                          : !this.state.dialogflowIntegrated
                          ? <center>
                            <button
                              style={{border: '1px dashed #5867dd'}}
                              type="button"
                              className="btn m-btn m-btn--air btn-outline-primary m-btn m-btn--custom"
                              onClick={this.gotoIntegerations}
                            >
                              Integrate DialogFlow
                            </button>
                          </center>
                          : this.state.dialogflowAgents.length === 0
                          ? <span className='m--font-danger'>You have not created any DialogFlow agents yet. Please visit <a href='https://dialogflow.cloud.google.com/' target='_blank' rel="noopener noreferrer">https://dialogflow.cloud.google.com/</a> and create an agent first.</span>
                          : this.state.chatbot && this.state.chatbot.dialogFlowAgentId
                          ? <input type='text' className='m-input form-control' placeholder={this.state.dialogFlowAgent.label} disabled />
                          : <Select
                            className='basic-single'
                            classNamePrefix='select'
                            isClearable={true}
                            isSearchable={true}
                            options={this.state.dialogflowAgents}
                            value={this.state.dialogFlowAgent}
                            onChange={this.onAgentChange}
                          />
                        }
                      </div>
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
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchChatbotDetails,
    updateChatbot,
    getIntegrations,
    fetchDialogflowAgents
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatbotSettings)
