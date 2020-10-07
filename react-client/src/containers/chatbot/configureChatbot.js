import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchChatbotDetails,
  handleMessageBlock,
  updateChatbot,
  deleteMessageBlock,
} from '../../redux/actions/chatbot.actions'
import { uploadAttachment, handleAttachment } from '../../redux/actions/attachment.actions'
import { Prompt } from 'react-router'
import AlertContainer from 'react-alert'
import PROGRESS from '../../components/chatbot/progress'
import SIDEBAR from '../../components/chatbot/sidebar'
import MESSAGEAREA from '../../components/chatbot/messageArea'
import BACKBUTTON from '../../components/extras/backButton'
// import HELPWIDGET from '../../components/extras/helpWidget'
import TREESTRUCTURE from '../../components/chatbot/treeStructure'
import $ from 'jquery'
import { validateAttachment } from '../../global/chatbot'

class ConfigureChatbot extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: true,
      powerLoading: false,
      chatbot: props.location.state.chatbot,
      blocks: [],
      sidebarItems: [],
      currentBlock: { title: '' },
      progress: 0,
      unsavedChanges: false,
      attachmentUploading: false,
      allTriggers: [],
      showTreeStructure: false
    }

    this.fetchChatbotDetails = this.fetchChatbotDetails.bind(this)
    this.handleChatbotDetails = this.handleChatbotDetails.bind(this)
    this.preparePayload = this.preparePayload.bind(this)
    this.isItParent = this.isItParent.bind(this)
    this.getParentId = this.getParentId.bind(this)
    this.updateState = this.updateState.bind(this)
    this.getAllBlocks = this.getAllBlocks.bind(this)
    this.onBack = this.onBack.bind(this)
    this.onPublish = this.onPublish.bind(this)
    this.onDisable = this.onDisable.bind(this)
    this.afterPublish = this.afterPublish.bind(this)
    this.afterDisable = this.afterDisable.bind(this)
    this.showTreeStructure = this.showTreeStructure.bind(this)
    this.closeTreeStructure = this.closeTreeStructure.bind(this)
    this.validateAttachment = this.validateAttachment.bind(this)
  }

  componentDidMount() {
    this.fetchChatbotDetails()
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push'
    document.title = 'KiboChat | Configure ChatBot'

    var addScript = document.createElement('script')
    addScript.setAttribute('type', 'text/javascript')
    addScript.setAttribute('src', 'https://cdn.cloudkibo.com/public/assets/demo/default/custom/components/base/toastr.js')
    addScript.type = 'text/javascript'
    document.body.appendChild(addScript)

    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    /* eslint-enable */
  }

  updateState(state) {
    this.setState(state)
  }

  fetchChatbotDetails() {
    this.props.fetchChatbotDetails(this.props.location.state.chatbot.chatbotId, this.handleChatbotDetails)
  }

  handleChatbotDetails(res) {
    if (res.status === 'success') {
      const blocks = this.getAllBlocks(res.payload)
      this.preparePayload(blocks)
    } else {
      this.msg.error('An unexpected error occured. Please try again later')
      this.setState({ loading: false })
    }
  }

  preparePayload(data) {
    let blocks = data
    let allTriggers = []
    let sidebarItems = []
    let completed = 0
    let progress = 0
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        sidebarItems.push({
          title: data[i].title,
          id: data[i].uniqueId,
          isParent: this.isItParent(data[i]),
          parentId: this.getParentId(data, data[i])
        })
        let triggers = data[i].triggers || []
        allTriggers = [...allTriggers, ...triggers]
        if (data[i].payload.length > 0) {
          completed = completed + 1
        }
      }
      progress = Math.floor((completed / data.length) * 100)
    } else {
      blocks = [{
        title: 'Welcome',
        payload: [],
        uniqueId: this.state.chatbot.startingBlockId,
        triggers: [],
        options: []
      }]
      sidebarItems = [{
        title: 'Welcome',
        id: this.state.chatbot.startingBlockId,
        isParent: false
      }]
    }
    this.setState({
      blocks,
      sidebarItems,
      currentBlock: blocks.find((item) => item.uniqueId === this.state.chatbot.startingBlockId),
      loading: false,
      progress,
      allTriggers
    })
  }

  isItParent(data) {
    if (data.payload.length === 0) {
      return false
    } else {
      let options = data.options
      options = options.filter((item) => ['home', 'back'].indexOf(item.title.toLowerCase()) === -1)
      if (options && options.length > 0) {
        return true
      } else {
        return false
      }
    }
  }

  getParentId(data, current) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].payload.length > 0) {
        let options = data[i].options
        options = options.filter((item) => ['home', 'back'].indexOf(item.title.toLowerCase()) === -1)
        if (options && options.length > 0) {
          let blockIds = options.map((item) => item.blockId)
          if (blockIds.includes(current.uniqueId)) {
            return data[i].uniqueId
          }
        }
      }
    }
  }

  getAllBlocks(data) {
    let blocks = data
    for (let i = 0; i < data.length; i++) {
      if (data[i].options.length > 0) {
        for (let j = 0; j < data[i].options.length; j++) {
          let uniqueIds = blocks.map((item) => item.uniqueId)
          if (!uniqueIds.includes(data[i].options[j].blockId)) {
            blocks.push({
              title: data[i].options[j].title,
              payload: [],
              uniqueId: data[i].options[j].blockId,
              options: []
            })
          }
        }
      }
    }
    return blocks
  }

  onBack() {
    this.props.history.push({
      pathname: '/chatbots'
    })
  }

  onDisable() {
    this.setState({ powerLoading: true })
    const data = {
      chatbotId: this.state.chatbot.chatbotId,
      published: false
    }
    this.props.updateChatbot(data, (res) => this.afterDisable(res))
  }

  afterDisable(res) {
    if (res.status === 'success') {
      this.msg.success('Chatbot disabled successfully')
      let chatbot = this.state.chatbot
      chatbot.published = false
      this.setState({ chatbot, powerLoading: false })
    } else {
      this.msg.error(res.description || 'Failed to disable chatbot')
    }
  }

  onPublish() {
    this.setState({ powerLoading: true })
    const data = {
      chatbotId: this.state.chatbot.chatbotId,
      published: true
    }
    this.props.updateChatbot(data, (res) => this.afterPublish(res))
  }

  afterPublish(res) {
    if (res.status === 'success') {
      this.msg.success('Chatbot published successfully')
      let chatbot = this.state.chatbot
      chatbot.published = true
      this.setState({ chatbot, powerLoading: false })
    } else {
      this.msg.error(res.description || 'Failed to publish chatbot')
      this.setState({ powerLoading: false })
    }
  }

  showTreeStructure() {
    this.setState({ showTreeStructure: true })
  }

  closeTreeStructure() {
    this.setState({ showTreeStructure: false })
  }

  validateAttachment (file) {
    return validateAttachment(file, this.props.automated_options, this.props.user.platform)
  }

  componentWillUnmount() {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  componentDidUpdate() {
    if (this.state.unsavedChanges) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
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
        <AlertContainer ref={(a) => { this.msg = a }} {...alertOptions} />
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Configure Chatbot - {this.state.chatbot.title}</h3>
            </div>
            <div className='pull-right'>
              <button
                id='_chatbot_message_area_header_publish'
                style={{ marginLeft: '10px', borderColor: this.state.chatbot.published ? '#34bfa3' : '#f4516c' }}
                className={`pull-right btn btn-${this.state.chatbot.published ? 'success' : 'danger'} m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill m-btn--air`}
                onClick={this.state.chatbot.published ? this.onDisable : this.onPublish}
                data-tip={this.state.chatbot.published ? 'Disable Chatbot' : 'Publish Chatbot'}
                data-place='bottom'
                disabled={this.state.progress !== 100}
              >
                {
                  this.state.powerLoading
                    ? <i className="m-loader" />
                    : <i className="la la-power-off" />
                }
              </button>
              <button
                id='_chatbot_message_area_header_tree'
                style={{ marginLeft: '10px', borderColor: '#ffb822' }}
                className="pull-right btn btn-warning m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill m-btn--air"
                onClick={this.showTreeStructure}
                data-tip='View Tree Structure'
                data-place='bottom'
              >
                <i className="fa flaticon-network"></i>
              </button>
            </div>
          </div>
        </div>

        <Prompt
          when={this.state.unsavedChanges}
          message='You have unsaved changes, are you sure you want to leave?'
        />

        {
          this.state.loading
          ? <div id='_chatbot_please_wait' style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
            <div className="m-loader m-loader--brand" style={{ width: "30px", display: "inline-block" }} />
            <span className='m--font-brand'>Please wait...</span>
          </div>
          : <div id='_chatbot_main_container'>
            <div id='_chatbot_configure_area' style={{ margin: '15px' }} className='row'>
              <SIDEBAR
                data={this.state.sidebarItems}
                currentBlock={this.state.currentBlock}
                blocks={this.state.blocks}
                updateParentState={this.updateState}
                chatbot={this.state.chatbot}
                alertMsg={this.msg}
                unsavedChanges={this.state.unsavedChanges}
                attachmentUploading={this.state.attachmentUploading}
                handleMessageBlock={this.props.handleMessageBlock}
              />
              {
                <MESSAGEAREA
                  block={this.state.currentBlock}
                  chatbot={this.state.chatbot}
                  alertMsg={this.msg}
                  uploadAttachment={this.props.uploadAttachment}
                  handleAttachment={this.props.handleAttachment}
                  blocks={this.state.blocks}
                  handleMessageBlock={this.props.handleMessageBlock}
                  changeActiveStatus={this.props.updateChatbot}
                  deleteMessageBlock={this.props.deleteMessageBlock}
                  progress={this.state.progress}
                  updateParentState={this.updateState}
                  sidebarItems={this.state.sidebarItems}
                  allTriggers={this.state.allTriggers}
                  attachmentUploading={this.state.attachmentUploading}
                  validateAttachment={this.validateAttachment}
                />
              }
            </div>
            <PROGRESS progress={`${this.state.progress}%`} />
            <BACKBUTTON
              onBack={this.onBack}
              position='bottom-left'
            />
            {
              /*
              <HELPWIDGET
                documentation={{ visibility: true, link: 'https://kibopush.com/chatbot-automation/' }}
                videoTutorial={{ visibility: true, videoId: 'eszeTV3-Uzs' }}
              />
              */
            }
          </div>
        }
        {
          this.state.showTreeStructure &&
          <TREESTRUCTURE
            data={this.state.sidebarItems}
            blocks={this.state.blocks}
            onClose={this.closeTreeStructure}
            updateParentState={this.updateState}
          />
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    automated_options: (state.basicInfo.automated_options),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchChatbotDetails,
    uploadAttachment,
    handleAttachment,
    handleMessageBlock,
    updateChatbot,
    deleteMessageBlock
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureChatbot)
