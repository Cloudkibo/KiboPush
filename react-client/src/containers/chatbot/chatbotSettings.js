import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import { fetchDialogflowAgents, removeDialogFlowAgent } from '../../redux/actions/chatbotAutomation.actions'
import { getIntegrations } from '../../redux/actions/settings.actions'
import { updateChatbot, updateEcommerceChatbot } from '../../redux/actions/chatbot.actions'
import Select from 'react-select'
import { cloneDeep } from 'lodash'
import TRIGGERAREA from '../../components/chatbotAutomation/triggerArea'
import { uploadFile } from '../../redux/actions/convos.actions'
import Files from 'react-files'
import { RingLoader } from 'halogenium'
import BACKBUTTON from '../../components/extras/backButton'
import CONFIRMATIONMODAL from '../../components/extras/confirmationModal'
import { validateCommaSeparatedPhoneNumbers } from "../../utility/utils"
import { UncontrolledTooltip } from 'reactstrap'
import MODAL from '../../components/extras/modal'

class ChatbotSettings extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      chatbot: props.location.state,
      dialogFlowAgent: '',
      dialogflowAgents: [],
      dialogflowIntegrated: false,
      agentsLoading: true,
      integrationsLoading: true,
      triggers: props.location.state.triggers,
      catalog: props.location.state.catalog || {},
      uploadingAttachment: false,
      numberOfProducts: props.location.state.numberOfProducts,
      published: props.location.state.published,
      testSubscribers: props.location.state.testSubscribers ? props.location.state.testSubscribers.join(',') : '',
      arePhoneNumbersValid: true
    }
    this.onBack = this.onBack.bind(this)
    this.onSave = this.onSave.bind(this)
    this.afterSave = this.afterSave.bind(this)
    this.handleIntegrations = this.handleIntegrations.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.gotoIntegerations = this.gotoIntegerations.bind(this)
    this.removeDialogFlowAgent = this.removeDialogFlowAgent.bind(this)
    this.afterRemove = this.afterRemove.bind(this)
    this.onFilesChange = this.onFilesChange.bind(this)
    this.handleFile = this.handleFile.bind(this)
    this.onFilesError = this.onFilesError.bind(this)
    this.removeCatalog = this.removeCatalog.bind(this)
    this.updateState = this.updateState.bind(this)
    this.setNumberOfProducts = this.setNumberOfProducts.bind(this)
    this.handleSwitch = this.handleSwitch.bind(this)
    this.getTestChatbotContent = this.getTestChatbotContent.bind(this)
    this.handleTestSubscribers = this.handleTestSubscribers.bind(this)
    this.saveTestSubscribers = this.saveTestSubscribers.bind(this)
    this.clearTestSubscribers = this.clearTestSubscribers.bind(this)
  }

  handleTestSubscribers(e) {
    if (!e.target.value || validateCommaSeparatedPhoneNumbers(e.target.value)) {
      this.setState({ arePhoneNumbersValid: true, testSubscribers: e.target.value })
    } else {
      this.setState({ arePhoneNumbersValid: false, testSubscribers: e.target.value })
    }
  }

  saveTestSubscribers(e) {
    e.preventDefault()
    this.refs._test_subscribers_trigger.click()
  }

  clearTestSubscribers() {
    // this.setState({
    //   testSubscribers: this.state.chatbot.testSubscribers.join(','),
    //   arePhoneNumbersValid: true
    // })
  }

  getTestChatbotContent() {
    return (
      <form onSubmit={this.saveTestSubscribers} className="m-form m-form--fit m-form--label-align-right">
        <div className="m-portlet__body">
          <div className="form-group m-form__group">
            <label htmlFor="exampleInputEmail1">
              Phone Numbers
            </label>
            <div style={{ display: 'flex' }}>
              <input
                value={this.state.testSubscribers}
                onChange={this.handleTestSubscribers}
                type="text"
                className={"m-input " + (this.state.arePhoneNumbersValid ? 'form-control' : 'form-control border-danger')}
                id="_testSubscribers"
                aria-describedby="testSubscribers"
                placeholder="Enter Phone Numbers separated by commas" />
              {!this.state.arePhoneNumbersValid &&
                <div style={{ marginLeft: '5px', marginTop: '3px' }}>
                  <UncontrolledTooltip style={{ minWidth: '100px', opacity: '1.0' }} target='phoneNumbersWarning'>
                    <span>Please enter valid phone numbers separated by commas</span>
                  </UncontrolledTooltip>
                  <i id='phoneNumbersWarning' className='flaticon-exclamation m--font-danger' />
                </div>
              }
            </div>
            <span className="m-form__help">
              These phone numbers will receive chatbot messages even if your chatbot is unpublished
            </span>
          </div>
        </div>
        <div className="m-portlet__foot m-portlet__foot--fit">
          <div style={{ float: 'right', paddingBottom: '0' }} className="m-form__actions">
            <button disabled={!this.state.arePhoneNumbersValid ? true : null} type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    )
  }

  handleSwitch (e) {
    this.setState({published: e.target.checked})
  }

  onFilesError (error, file) {
    this.msg.error('Attachment exceeds the limit of 25MB')
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

  removeCatalog () {
    this.setState({catalog: {}})
  }

  updateState (state) {
    this.setState(state)
  }

  setNumberOfProducts(value) {
    this.setState({
      numberOfProducts: value
    })
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
    if (this.state.chatbot.vertical && this.state.chatbot.vertical === 'ecommerce') {
      if (this.state.triggers.length === 0) {
        this.msg.error('At least one trigger is required')
      } else if (this.state.numberOfProducts < 2) {
        this.msg.error('Number of products must be greater than or equal to 2')
      } else if (this.state.numberOfProducts > 9) {
        this.msg.error('Number of products must be less than or equal to 9')
      } else {
        this.props.updateEcommerceChatbot(this.state.chatbot._id, {
          triggers: this.state.triggers,
          numberOfProducts: this.state.numberOfProducts,
          published: this.state.published,
          testSubscribers: this.state.testSubscribers ? this.state.testSubscribers.split(',').map(number => number.replace(/ /g, '')) : [],
          catalog: this.state.catalog
        }, this.afterSave)
      }
    } else {
      const data = {
        chatbotId: this.state.chatbot.chatbotId,
        dialogFlowAgentId: this.state.dialogFlowAgent.value
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

  removeDialogFlowAgent () {
    const data = {
      chatbotId: this.state.chatbot.chatbotId,
      dialogFlowAgentId: this.state.dialogFlowAgent.value,
      platform: this.props.user.platform
    }
    this.props.removeDialogFlowAgent(data, this.afterRemove)
  }

  afterRemove (res) {
    if (res.status === 'success') {
      let chatbot = cloneDeep(this.state.chatbot)
      delete chatbot.dialogFlowAgentId
      this.setState({dialogFlowAgent: '', chatbot})
      this.msg.success('DialogFlow agent removed successfully!')
    } else {
      this.msg.error(res.description || 'Failed to remove DialogFlow agent!')
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
      <div className='m-grid__item m-grid__item--fluid m-wrapper' style={{overflow: 'visible'}}>
        <AlertContainer ref={(a) => { this.msg = a }} {...alertOptions} />
        <BACKBUTTON
          onBack={this.onBack}
        />

        <button
          ref='_open_DFA_modal'
          style={{ display: 'none' }}
          data-backdrop='static'
          data-keyboard='false'
          data-toggle='modal'
          data-target='#__remove_DFA'
        />
        <CONFIRMATIONMODAL
          id='__remove_DFA'
          title='Remove DialogFlow Agent'
          description='If you remove this DialogFlow agent, chatbot NLP will not work. Are you sure you want to remove the DialogFlow agent?'
          onConfirm={this.removeDialogFlowAgent}
        />
        <MODAL
          id='_test_subscribers'
          title='Add Test Subscribers'
          content={this.getTestChatbotContent()}
          onClose={this.clearTestSubscribers}
        />
        <button
          ref='_test_subscribers_trigger'
          id="_test_subscribers_trigger"
          data-target='#_test_subscribers'
          data-backdrop="static"
          data-keyboard="false"
          data-toggle='modal'
          type='button'
          style={{ display: 'none' }}>
          Test Subscribers Modal
        </button>

        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>
              {this.state.chatbot.integration ? 'Configure E-Commerce Chatbot' : 'Settings'}
              </h3>
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
                      { this.state.chatbot.integration && this.state.chatbot.integration === 'shopify' &&
                        <span className='m-portlet__head-icon'>
                          <img alt="shopify-logo" style={{ width: '100px', marginLeft: '-20px', marginRight: '-20px' }} src='https://i.pcmag.com/imagery/reviews/02lLbDwVdtIQN2uDFnHeN41-11..v_1569480019.jpg' />
                        </span>
                      }
                      <h3 className='m-portlet__head-text'>
                      {this.state.chatbot.title}
                      </h3>
                    </div>
                  </div>
                  <div className='m-portlet__head-tools'>
                    {this.state.chatbot.vertical &&
                      <button className='btn btn-primary m-btn m-btn--custom'
                      style={{marginRight: '10px'}} onClick={() => { this.refs._test_subscribers_trigger.click() }}>
                        <span>Test</span>
                      </button>
                    }
                    {this.state.chatbot && (!this.state.chatbot.dialogFlowAgentId || this.state.chatbot.vertical) &&
                      <button className='btn btn-primary m-btn m-btn--custom' onClick={this.onSave}>
                        <span>
                          Save
                        </span>
                      </button>
                    }
                  </div>
                </div>
                <div className='m-portlet__body'>
                  {this.state.chatbot.vertical && this.state.chatbot.vertical === 'ecommerce' &&
                    <form>
                      <div className="m-form m-form--fit row">
                        <div className='form-group m-form__group col-8 row'>
                          <div className='col-md-2'>
                            <span className='m--font-boldest'>Status:</span>
                          </div>
                          <div className='col-md-10'>
                            <span
                              style={{marginTop: '-8px'}}
                              className={"m-switch m-switch--icon " + (this.state.published ? "m-switch--success" : "m-switch--danger")}>
                              <label>
                                <input checked={this.state.published} onChange={this.handleSwitch} type="checkbox" />
                                <span />
                              </label>
                            </span>
                          </div>
                        </div>
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
                          <div className='ui-block hoverborder' style={{padding: 25, marginLeft: '0', width: '97%'}}>
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
                          <span className="m--font-boldest">Number of Products:</span>
                          <input
                            type='number' min='2' step='1' max='9'
                            value={this.state.numberOfProducts}
                            style={{marginBottom: '10px', width: '97%'}}
                            onChange={(e) => { this.setNumberOfProducts(parseInt(e.target.value))}}
                            onKeyDown={e => /[+\-.,\s]$/.test(e.key) && e.preventDefault()}
                            className="form-control m-input" id="_faqs_url" />
                          <span>This refers to the maximum number of products shown in a message</span>
                        </div>
                        <div className="form-group m-form__group m--margin-top-10">
                          <span>
                            <strong>Note: </strong>
                            We recommend first testing the chatbot before enabling it for your customers.
                          </span>
                        </div>
                      </div>
                    </form>
                  }
                  {!this.state.chatbot.integration &&
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
                        {
                          !(this.state.integrationsLoading || this.state.agentsLoading) &&
                          this.state.dialogflowIntegrated && this.state.dialogflowAgents.length > 0 &&
                          this.state.chatbot && this.state.chatbot.dialogFlowAgentId &&
                          <div className='col-3'>
                            <button
                              type="button"
                              className="btn btn-link"
                              onClick={() => { this.refs._open_DFA_modal.click() }}
                            >
                              Remove
                            </button>
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
function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getIntegrations,
    fetchDialogflowAgents,
    updateChatbot,
    removeDialogFlowAgent,
    uploadFile,
    updateEcommerceChatbot
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ChatbotSettings)
