import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { fetchDialogflowAgents } from '../../redux/actions/chatbotAutomation.actions'
import { getIntegrations } from '../../redux/actions/settings.actions'
import Select from 'react-select'

import BACKBUTTON from '../../components/extras/backButton'

class ChatbotSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      chatbot: props.location.state,
      dialogFlowAgent: '',
      dialogflowAgents: [],
      dialogflowIntegrated: false,
      agentsLoading: true,
      integrationsLoading: true
    }
    this.onBack = this.onBack.bind(this)
    this.onSave = this.onSave.bind(this)
    this.afterSave = this.afterSave.bind(this)
    this.handleIntegrations = this.handleIntegrations.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.gotoIntegerations = this.gotoIntegerations.bind(this)
  }

  componentDidMount () {
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

  onBack() {
    this.props.history.push({
      pathname: this.props.location.state.backUrl
    })
  }

  onSave () {
    
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
              <h3 className='m-subheader__title'>{this.state.chatbot.title}</h3>
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
    getIntegrations,
    fetchDialogflowAgents
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatbotSettings)
