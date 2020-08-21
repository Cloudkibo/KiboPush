import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchChatbotDetails,
  uploadAttachment,
  handleAttachment,
  handleMessageBlock,
  updateChatbot,
  deleteMessageBlock,
  fetchChatbot
} from '../../redux/actions/chatbotAutomation.actions'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { checkWhitelistedDomains } from '../../redux/actions/broadcast.actions'
import { saveWhiteListDomains, fetchWhiteListedDomains, deleteDomain } from '../../redux/actions/settings.actions'
import { registerAction } from '../../utility/socketio'
import { Prompt } from 'react-router'
import AlertContainer from 'react-alert'
import PROGRESS from '../../components/chatbotAutomation/progress'
import SIDEBAR from '../../components/chatbotAutomationNew/sidebar'
import MESSAGEAREA from '../../components/chatbotAutomationNew/messageArea'
import BACKBUTTON from '../../components/extras/backButton'
import HELPWIDGET from '../../components/extras/helpWidget'
import MODAL from '../../components/extras/modal'
import WHITELISTDOMAINS from '../../components/chatbotAutomation/whitelistDomains'
import TREESTRUCTURE from '../../components/chatbotAutomationNew/treeStructure'
import $ from 'jquery'

const MessengerPlugin = require('react-messenger-plugin').default

class ConfigureChatbot extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      powerLoading: false,
      showTestContent: false,
      chatbot: props.location.state.chatbot,
      blocks: [],
      sidebarItems: [],
      currentBlock: {title: ''},
      currentLevel: 1,
      progress: 0,
      showWhitelistDomains: false,
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
    this.fetchChatbot = this.fetchChatbot.bind(this)
    this.handleChatbot = this.handleChatbot.bind(this)
    this.toggleWhitelistModal = this.toggleWhitelistModal.bind(this)
    this.getWhitelistModalContent = this.getWhitelistModalContent.bind(this)
    this.onAnalytics = this.onAnalytics.bind(this)
    this.onPublish = this.onPublish.bind(this)
    this.onDisable = this.onDisable.bind(this)
    this.afterPublish = this.afterPublish.bind(this)
    this.afterDisable = this.afterDisable.bind(this)
    this.showTestModal = this.showTestModal.bind(this)
    this.getTestModalContent = this.getTestModalContent.bind(this)
    this.toggleTestModalContent = this.toggleTestModalContent.bind(this)
    this.showTreeStructure = this.showTreeStructure.bind(this)
    this.closeTreeStructure = this.closeTreeStructure.bind(this)

    props.getFbAppId()
  }

  onAnalytics () {
    this.props.history.push({
      pathname: '/chatbotAnalytics',
      state: {chatbot: this.state.chatbot, page: this.props.location.state.page, backUrl: '/configureChatbotNew'}
    })
  }

  componentDidMount () {
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

    let comp = this
    registerAction({
      event: 'chatbot.test.message',
      action: function (data) {
        comp.msg.success('Sent successfully on messenger')
        comp.refs._open_test_chatbot_modal.click()
        comp.toggleTestModalContent()
      }
    })
  }

  toggleTestModalContent () {
    this.setState({showTestContent: !this.state.showTestContent})
  }

  updateState (state) {
    this.setState(state)
  }

  fetchChatbot () {
    this.props.fetchChatbot(this.state.chatbot._id, this.handleChatbot)
  }

  handleChatbot (res) {
    if (res.status === 'success') {
      this.setState({chatbot: res.payload})
    }
  }

  fetchChatbotDetails () {
    this.props.fetchChatbotDetails(this.props.location.state.chatbot._id, this.handleChatbotDetails)
  }

  handleChatbotDetails (res) {
    if (res.status === 'success') {
      const blocks = this.getAllBlocks(res.payload)
      this.preparePayload(blocks)
    } else {
      this.msg.error('An unexpected error occured. Please try again later')
      this.setState({loading: false})
    }
  }

  preparePayload (data) {
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
      const id = new Date().getTime()
      blocks = [{
        _id: 'welcome-id',
        title: 'Welcome',
        payload: [],
        uniqueId: id,
        triggers: []
      }]
      sidebarItems = [{
        title: 'Welcome',
        id,
        isParent: false
      }]
    }
    this.setState({
      blocks,
      sidebarItems,
      currentBlock: blocks[0],
      loading: false,
      progress,
      allTriggers
    })
  }

  isItParent (data) {
    if (data.payload.length === 0) {
      return false
    } else {
      let quickReplies = data.payload[data.payload.length - 1].quickReplies
      if (quickReplies && quickReplies.length > 0) {
        quickReplies = quickReplies.filter((item) => JSON.parse(item.payload)[0].payloadAction === 'create')
        if (quickReplies.length > 0) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
  }

  getParentId (data, current) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].payload.length > 0) {
        let replies = data[i].payload[data[i].payload.length - 1].quickReplies
        if (replies) {
          replies = replies.filter((item) => JSON.parse(item.payload)[0].payloadAction === 'create')
          if (replies.length > 0) {
            let payload = replies.map((item) => JSON.parse(item.payload))
            payload = payload.map((item) => item[0].blockUniqueId.toString())
            if (payload.includes(current.uniqueId.toString())) {
              return data[i].uniqueId
            }
          }
        }
      }
    }
  }

  getAllBlocks (data) {
    let blocks = data
    for (let i = 0; i < data.length; i++) {
      if (data[i].payload.length > 0) {
        let quickReplies = data[i].payload[data[i].payload.length - 1].quickReplies
        if (quickReplies && quickReplies.length > 0) {
          for (let j = 0; j < quickReplies.length; j++) {
            let payload = JSON.parse(quickReplies[j].payload)
            let uniqueIds = blocks.map((item) => item.uniqueId.toString())
            if (!uniqueIds.includes(payload[0].blockUniqueId.toString())) {
              blocks.push({
                title: quickReplies[j].title,
                payload: [],
                uniqueId: payload[0].blockUniqueId
              })
            }
          }
        }
      }
    }
    return blocks
  }

  onBack() {
    this.props.history.push({
      pathname: '/chatbotAutomationNew'
    })
  }

  toggleWhitelistModal () {
    this.setState({showWhitelistDomains: true})
  }

  getWhitelistModalContent () {
    if (this.state.showWhitelistDomains) {
      return (
        <WHITELISTDOMAINS
          pages={[this.props.location.state.page]}
          alertMsg={this.msg}
          deleteDomain={this.props.deleteDomain}
          saveWhiteListDomains={this.props.saveWhiteListDomains}
          fetchWhiteListedDomains={this.props.fetchWhiteListedDomains}
        />
      )
    } else {
      return (<div />)
    }
  }

  onDisable () {
    this.setState({powerLoading: true})
    const data = {
      chatbotId: this.state.chatbot._id,
      published: false
    }
    this.props.updateChatbot(data, (res) => this.afterDisable(res))
  }

  afterDisable (res) {
    if (res.status === 'success') {
      this.msg.success('Chatbot disabled successfully')
      let chatbot = this.state.chatbot
      chatbot.published = false
      this.setState({chatbot, powerLoading: false})
    } else {
      this.msg.error(res.description)
    }
  }

  onPublish () {
    this.setState({powerLoading: true})
    const data = {
      chatbotId: this.state.chatbot._id,
      published: true
    }
    this.props.updateChatbot(data, (res) => this.afterPublish(res))
  }

  afterPublish (res) {
    if (res.status === 'success') {
      this.msg.success('Chatbot published successfully')
      let chatbot = this.state.chatbot
      chatbot.published = true
      this.setState({chatbot, powerLoading: false})
    } else {
      this.msg.error(res.description)
    }
  }

  showTestModal () {
    this.setState({showTestContent: true}, () => {
      this.refs._open_test_chatbot_modal.click()
    })
  }

  getTestModalContent () {
    if (this.state.showTestContent) {
      return (
        <MessengerPlugin
          appId={this.props.fbAppId}
          pageId={this.state.chatbot.pageFbId}
          size='large'
          passthroughParams='_chatbot'
        />
      )
    } else {
      return (<div />)
    }
  }

  showTreeStructure () {
    this.setState({showTreeStructure: true})
  }

  closeTreeStructure () {
    this.setState({showTreeStructure: false})
  }

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  componentDidUpdate () {
    if (this.state.unsavedChanges) {
      window.onbeforeunload = () => true
    } else {
      window.onbeforeunload = undefined
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
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Configure Chatbot - {this.props.location.state.page.pageName}</h3>
            </div>
            <div className='pull-right'>
              <button
                id='_chatbot_message_area_header_publish'
                style={{marginLeft: '10px', borderColor: this.state.chatbot.published ? '#34bfa3' : '#f4516c'}}
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
                id='_chatbot_message_area_header_test'
                style={{marginLeft: '10px', borderColor: '#716aca'}}
                className="pull-right btn btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill m-btn--air"
                onClick={this.showTestModal}
                data-tip='Test Chatbot'
                data-place='bottom'
                disabled={this.state.progress !== 100}
              >
                <i className="fa flaticon-paper-plane"></i>
              </button>
              <button
                id='_chatbot_message_area_header_analytics'
                style={{marginLeft: '10px', borderColor: '#36a3f7'}}
                className="pull-right btn btn-info m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill m-btn--air"
                onClick={this.onAnalytics}
                data-tip='Chatbot Analytics'
                data-place='bottom'
              >
                <i className="fa flaticon-analytics"></i>
              </button>
              <button
                id='_chatbot_message_area_header_analytics'
                style={{marginLeft: '10px', borderColor: '#ffb822'}}
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
          ? <div id='_chatbot_please_wait' style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
            <div className="m-loader m-loader--brand" style={{width: "30px", display: "inline-block"}} />
            <span className='m--font-brand'>Please wait...</span>
          </div>
          : <div id='_chatbot_main_container'>
            <div id='_chatbot_configure_area' style={{margin: '15px'}} className='row'>
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
              <MESSAGEAREA
                block={this.state.currentBlock}
                chatbot={this.state.chatbot}
                alertMsg={this.msg}
                uploadAttachment={this.props.uploadAttachment}
                handleAttachment={this.props.handleAttachment}
                currentLevel={this.state.currentLevel}
                maxLevel={this.state.chatbot.maxLevels}
                blocks={this.state.blocks}
                handleMessageBlock={this.props.handleMessageBlock}
                fbAppId={this.props.fbAppId}
                changeActiveStatus={this.props.updateChatbot}
                deleteMessageBlock={this.props.deleteMessageBlock}
                registerSocketAction={registerAction}
                progress={this.state.progress}
                updateParentState={this.updateState}
                sidebarItems={this.state.sidebarItems}
                checkWhitelistedDomains={this.props.checkWhitelistedDomains}
                toggleWhitelistModal={this.toggleWhitelistModal}
                onAnalytics={this.onAnalytics}
                allTriggers={this.state.allTriggers}
                attachmentUploading={this.state.attachmentUploading}
              />
            </div>
            <PROGRESS progress={`${this.state.progress}%`} />
            <BACKBUTTON
              onBack={this.onBack}
              position='bottom-left'
            />
            <HELPWIDGET
              documentation={{visibility: true, link: 'https://kibopush.com/chatbot-automation/'}}
              videoTutorial={{visibility: true, videoId: 'eszeTV3-Uzs'}}
            />
            <MODAL
              zIndex={9999}
              id='_cb_whitelist_domains'
              title='Manage Whitelist Domains'
              content={this.getWhitelistModalContent()}
            />
            <button ref='_open_test_chatbot_modal' style={{display: 'none'}} data-toggle='modal' data-target='#_test_chatbot' />
            <MODAL
              id='_test_chatbot'
              title='Test Chatbot'
              content={this.getTestModalContent()}
              onClose={this.toggleTestModalContent}
            />
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

function mapStateToProps (state) {
  return {
    fbAppId: state.basicInfo.fbAppId
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchChatbotDetails,
    uploadAttachment,
    handleAttachment,
    handleMessageBlock,
    updateChatbot,
    deleteMessageBlock,
    getFbAppId,
    fetchChatbot,
    checkWhitelistedDomains,
    deleteDomain,
    saveWhiteListDomains,
    fetchWhiteListedDomains
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureChatbot)
