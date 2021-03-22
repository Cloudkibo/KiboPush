import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'

class CreateChatbot extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      page: '',
      title: '',
      dialogFlowAgent: '',
      dialogflowAgents: [],
      dialogflowIntegrated: false,
      agentsLoading: true,
      integrationsLoading: true,
      createLoading: false
    }

    this.onPageChange = this.onPageChange.bind(this)
    this.onTitleChange = this.onTitleChange.bind(this)
    this.onAgentChange = this.onAgentChange.bind(this)
    this.handleIntegrations = this.handleIntegrations.bind(this)
    this.handleAgents = this.handleAgents.bind(this)
    this.gotoIntegerations = this.gotoIntegerations.bind(this)
    this.onCreate = this.onCreate.bind(this)
    this.disableCreate = this.disableCreate.bind(this)
  }

  componentDidMount () {
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
      this.setState({dialogflowAgents, agentsLoading: false})
    } else {
      this.setState({dialogflowAgents: [], agentsLoading: false})
    }
  }

  onPageChange (e) {
    this.setState({page: e.target.value})
  }

  onTitleChange (e) {
    if (e.target.value.length <= 30) {
      this.setState({title: e.target.value})
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

  onCreate () {
    this.setState({ createLoading: true })
    let data = {}
    let pageFbId = ''
    if (this.state.dialogFlowAgent) {
      data.dialogFlowAgentId = this.state.dialogFlowAgent.value
    }

    switch (this.props.channel) {
      case 'messenger':
        data.pageId = this.state.page
        pageFbId = this.props.pages.find((item) => item._id === this.state.page).pageId
        break
      default:
        data.title = this.state.title
        data.startingBlockId = `${new Date().getTime()}`
    }

    if (['whatsApp', 'sms'].includes(this.props.channel)) {
      const titles = this.props.chatbots.map((item) => item.title)
      if (titles.includes(this.state.title)) {
        this.setState({ createLoading: false })
        this.props.alertMsg.error('A chatbot already exists with this title. Please enter a different title.')
      } else {
        this.props.createChatbot(data, (res) => this.handleOnCreate(res, pageFbId))
      }
    } else {
      this.props.createChatbot(data, (res) => this.handleOnCreate(res, pageFbId))
    }
  }

  handleOnCreate (res, pageFbId) {
    this.setState({ createLoading: false })
    if (res.status === 'success') {
      const chatbot = res.payload
      if (this.props.channel === 'messenger') {
        const page = this.props.pages.find((item) => item._id === this.state.page)
        const commerceChatbots = this.props.chatbots ? this.props.chatbots.filter(chatbot => chatbot.type === 'automated' && chatbot.vertical === 'commerce') : []
        const existingChatbot = commerceChatbots.find(c => c.pageId._id === chatbot.pageId._id)
        chatbot.pageFbId = pageFbId
        chatbot.startingBlockId = chatbot.startingBlockId || 'welcome-id'
        this.props.history.push({
          pathname: '/configureChatbot',
          state: { chatbot, page, existingChatbot }
        })
      } else {
        this.props.history.push({
          pathname: '/chatbots/configure',
          state: { chatbot }
        })
      }
    } else {
      this.props.alertMsg.error(res.description || 'Failed to create chatbot')
    }
  }

  disableCreate () {
    let flag = false
    switch (this.props.channel) {
      case 'messenger':
        flag = this.state.page ? false : true
        break
      default:
        flag = this.state.title ? false : true
    }
    return flag
  }

  render () {
    return (
      <>
        {
          this.props.channel === 'messenger' &&
          <div className='form-group m-form__group row'>
            <label style={{fontWeight: 'normal'}} className='col-md-4 col-form-label'>
              Facebook Page:
            </label>
            <div className='col-md-8'>
              <select
                className="form-control m-input"
                value={this.state.page}
                onChange={this.onPageChange}
              >
                <option value='' disabled>Select a page...</option>
                {
                  this.props.pages.map((page) => (
                    <option key={page._id} value={page._id}>{page.pageName}</option>
                  ))
                }
              </select>
            </div>
          </div>
        }
        {
          ['sms', 'whatsApp'].includes(this.props.channel) &&
          <div className='form-group m-form__group row'>
            <label style={{fontWeight: 'normal'}} className='col-md-4 col-form-label'>
              Chatbot Title:
            </label>
            <div className='col-md-8'>
              <input
                className="form-control m-input"
                value={this.state.title}
                placeholder='Enter chatbot title...'
                onChange={this.onTitleChange}
              />
            </div>
          </div>
        }
        <div className='m--space-30' />
        <div className='form-group m-form__group row'>
          <label style={{fontWeight: 'normal'}} className='col-md-4 col-form-label'>
            DialogFlow Agent (Optional):
          </label>
          <div className='col-md-8'>
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
        <div className='m--space-30' />
        <div className='form-group m-form__group row'>
          <div className='col-md-12'>
            <button
              type='button'
              style={{ border: '1px solid' }}
              className={`btn btn-primary ${this.state.createLoading && 'm-loader m-loader--light m-loader--left'} pull-right`}
              onClick={this.onCreate}
              disabled={this.disableCreate()}
            >
              Create
          </button>
          </div>
        </div>
      </>
    )
  }
}

CreateChatbot.propTypes = {
  'getIntegrations': PropTypes.func.isRequired,
  'fetchDialogflowAgents': PropTypes.func.isRequired,
  'createChatbot': PropTypes.func.isRequired,
  'chatbots': PropTypes.array.isRequired,
  'channel': PropTypes.string.isRequired
}

export default CreateChatbot
