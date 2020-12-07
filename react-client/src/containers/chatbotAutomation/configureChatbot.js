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
  fetchBackup,
  createBackup,
  restoreBackup,
  fetchChatbot
} from '../../redux/actions/chatbotAutomation.actions'
import { getMessengerComponents } from '../../redux/actions/messengerComponents.actions'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { checkWhitelistedDomains } from '../../redux/actions/broadcast.actions'
import { saveWhiteListDomains, fetchWhiteListedDomains, deleteDomain } from '../../redux/actions/settings.actions'
import { registerAction } from '../../utility/socketio'
import { Prompt } from 'react-router'
import AlertContainer from 'react-alert'
import $ from 'jquery'
import ReactTooltip from 'react-tooltip'
import { urlMetaData } from '../../redux/actions/convos.actions'

import ADVANCEDBUILDER from './builder/advancedBuilder'
import BASICBUILDER from './builder/basicBuilder'
import PROGRESS from '../../components/chatbotAutomation/progress'
import BACKBUTTON from '../../components/extras/backButton'
import HELPWIDGET from '../../components/extras/helpWidget'
import MODAL from '../../components/extras/modal'
import CONFIRMATIONMODAL from '../../components/extras/confirmationModal'
import WHITELISTDOMAINS from '../../components/chatbotAutomation/whitelistDomains'
import DROPDOWN from '../../components/extras/dropdown'

const MessengerPlugin = require('react-messenger-plugin').default

class ConfigureChatbot extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      chatbot: props.location.state.chatbot,
      blocks: [],
      sidebarItems: [],
      currentBlock: {title: ''},
      progress: 0,
      showWhitelistDomains: false,
      unsavedChanges: false,
      attachmentUploading: false,
      allTriggers: [],
      powerLoading: false,
      showTestContent: false,
      existingChatbot: props.location.state.existingChatbot,
      showTreeStructure: false,
      builder: props.location.state.chatbot.builderPreference,
      builderText: 'Basic Builder'
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
    this.onDisable = this.onDisable.bind(this)
    this.afterDisable = this.afterDisable.bind(this)
    this.onPublish = this.onPublish.bind(this)
    this.afterPublish = this.afterPublish.bind(this)
    this.showTestModal = this.showTestModal.bind(this)
    this.toggleTestModalContent = this.toggleTestModalContent.bind(this)
    this.getTestModalContent = this.getTestModalContent.bind(this)
    this.showTreeStructure = this.showTreeStructure.bind(this)
    this.closeTreeStructure = this.closeTreeStructure.bind(this)
    this.disableShopifyChatbot = this.disableShopifyChatbot.bind(this)
    this.switchBuilder = this.switchBuilder.bind(this)

    props.getFbAppId()
    props.getMessengerComponents()
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

  updateState (state) {
    this.setState(state)
  }

  getAllBlocks (data) {
    const blocks = data
    const uniqueIds = blocks.map((item) => item.uniqueId.toString())
    for (let i = 0; i < data.length; i++) {
      if (data[i].payload.length > 0) {
        let quickReplies = data[i].payload[data[i].payload.length - 1].quickReplies
        if (quickReplies && quickReplies.length > 0) {
          for (let j = 0; j < quickReplies.length; j++) {
            let payload = JSON.parse(quickReplies[j].payload)
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
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].payload.length; j++) {
        if (data[i].payload[j].cards) {
          for (let k = 0; k < data[i].payload[j].cards.length; k++) {
            const button = data[i].payload[j].cards[k].buttons[0]
            if (button) {
              const payload = JSON.parse(button.payload)
              if (!uniqueIds.includes(payload[0].blockUniqueId.toString())) {
                blocks.push({
                  title: button.title,
                  payload: [],
                  uniqueId: payload[0].blockUniqueId
                })
              }
            }
          }
        }
      }
    }
    return blocks
  }

  onBack() {
    this.props.history.push({
      pathname: '/chatbotAutomation'
    })
  }

  fetchChatbot () {
    this.props.fetchChatbot(this.state.chatbot._id, this.handleChatbot)
  }

  handleChatbot (res) {
    if (res.status === 'success') {
      this.setState({chatbot: res.payload})
    }
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

  onAnalytics () {
    this.props.history.push({
      pathname: '/chatbotAnalytics',
      state: {chatbot: this.state.chatbot, page: this.props.location.state.page, backUrl: '/configureChatbot'}
    })
  }

  onDisable() {
    this.setState({ powerLoading: true })
    const data = {
      chatbotId: this.state.chatbot._id,
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
      this.msg.error(res.description)
    }
  }

  onPublish() {
    if (this.state.existingChatbot && this.state.existingChatbot.published) {
      this.disableShopifyChatbotTrigger.click()
    } else {
      this.setState({ powerLoading: true })
      const data = {
        chatbotId: this.state.chatbot._id,
        published: true
      }
      this.props.updateChatbot(data, (res) => this.afterPublish(res))
    }
  }

  afterPublish(res) {
    if (res.status === 'success') {
      this.msg.success('Chatbot published successfully')
      let chatbot = this.state.chatbot
      chatbot.published = true
      this.setState({ chatbot, powerLoading: false })
    } else {
      this.msg.error(res.description)
    }
  }

  showTestModal() {
    if (!this.props.superUser) {
      this.setState({ showTestContent: true }, () => {
        this.refs._open_test_chatbot_modal.click()
      })
    } else {
      this.msg.error('You are not allowed to perform this action')
    }
  }

  toggleTestModalContent() {
    this.setState({ showTestContent: !this.state.showTestContent })
  }

  getTestModalContent() {
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

  showTreeStructure() {
    this.setState({ showTreeStructure: true })
  }

  closeTreeStructure() {
    this.setState({ showTreeStructure: false })
  }

  disableShopifyChatbot() {
    this.props.updateChatbot({
      chatbotId: this.state.existingChatbot._id,
      published: false
    }, (res) => {
      if (res.status === 'success') {
        let existingChatbot = this.state.existingChatbot
        existingChatbot.published = false
        this.setState({ existingChatbot }, () => {
          this.onPublish()
        })
      } else {
        this.msg.error(res.description)
      }
    })
  }

  switchBuilder () {
    let selectedText = 'Advanced Builder'
    const data = {
      chatbotId: this.state.chatbot._id,
      builderPreference: 'advanced'
    }
    this.props.updateChatbot(data, (res) => {
      if (res.status === 'success') {
        this.setState({builder: 'advanced', selectedText})
      } else {
        this.msg.error(res.description || 'Failed to set builder preference')
      }
    })
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
            <div className='row'>
              {
                this.state.builder === 'basic' &&
                <ReactTooltip
                  id='tree-tructure'
                  place='bottom'
                  type='dark'
                  effect='solid'
                />
              }
              {
                this.state.builder === 'basic' &&
                <button
                  id='_chatbot_message_area_header_analytics'
                  style={{ marginLeft: '10px', borderColor: '#ffb822' }}
                  className="pull-right btn btn-warning m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill m-btn--air"
                  onClick={this.showTreeStructure}
                  data-tip='View Tree Structure'
                  data-for='tree-tructure'
                >
                  <i className="fa flaticon-network"></i>
                </button>
              }
              <ReactTooltip
                id='chatbot-analytics'
                place='bottom'
                type='dark'
                effect='solid'
              />
              <button
                id='_chatbot_message_area_header_analytics'
                style={{ marginLeft: '10px', borderColor: '#36a3f7' }}
                className="pull-right btn btn-info m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill m-btn--air"
                onClick={this.onAnalytics}
                data-tip='Chatbot Analytics'
                data-for='chatbot-analytics'
              >
                <i className="fa flaticon-analytics"></i>
              </button>
              <ReactTooltip
                id='test-chatbot'
                place='bottom'
                type='dark'
                effect='solid'
              />
              <button
                id='_chatbot_message_area_header_test'
                style={{ marginLeft: '10px', borderColor: '#716aca' }}
                className="pull-right btn btn-brand m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill m-btn--air"
                onClick={this.showTestModal}
                data-tip='Test Chatbot'
                data-for='test-chatbot'
                disabled={this.state.progress !== 100}
              >
                <i className="fa flaticon-paper-plane"></i>
              </button>
              <ReactTooltip
                id='publish-chatbot'
                place='bottom'
                type='dark'
                effect='solid'
              />
              <button
                id='_chatbot_message_area_header_publish'
                style={{ margin: '0px 10px', borderColor: this.state.chatbot.published ? '#34bfa3' : '#f4516c' }}
                className={`pull-right btn btn-${this.state.chatbot.published ? 'success' : 'danger'} m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill m-btn--air`}
                onClick={this.state.chatbot.published ? this.onDisable : this.onPublish}
                data-tip={this.state.chatbot.published ? 'Disable Chatbot' : 'Publish Chatbot'}
                data-for='publish-chatbot'
                disabled={this.state.progress !== 100}
              >
                {
                  this.state.powerLoading
                    ? <i className="m-loader" />
                    : <i className="la la-power-off" />
                }
              </button>
              {
                this.state.builder === 'basic' &&
                <DROPDOWN
                  id='chatbot-builder'
                  selectedText={this.state.builderText}
                  builder={this.state.builder}
                  colorStyle='brand'
                  options={[
                    {action: () => {}, text: 'Basic Builder', value: 'basic'},
                    {action: () => {this.switchBuilderTrigger.click()}, text: 'Advanced Builder', value: 'advanced'}
                  ]}
                />
              }
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
            {
              this.state.builder === 'basic'
              ? <BASICBUILDER
                blocks={this.state.blocks}
                chatbot={this.state.chatbot}
                sidebarItems={this.state.sidebarItems}
                currentBlock={this.state.currentBlock}
                progress={this.state.progress}
                unsavedChanges={this.state.unsavedChanges}
                attachmentUploading={this.state.attachmentUploading}
                allTriggers={this.state.allTriggers}
                updateParentState={this.updateState}
                handleMessageBlock={this.props.handleMessageBlock}
                user={this.props.user}
                uploadAttachment={this.props.uploadAttachment}
                handleAttachment={this.props.handleAttachment}
                updateChatbot={this.props.updateChatbot}
                deleteMessageBlock={this.props.deleteMessageBlock}
                checkWhitelistedDomains={this.props.checkWhitelistedDomains}
                toggleWhitelistModal={this.toggleWhitelistModal}
                alertMsg={this.msg}
              />
              : <ADVANCEDBUILDER
                blocks={this.state.blocks}
                chatbot={this.state.chatbot}
                sidebarItems={this.state.sidebarItems}
                currentBlock={this.state.currentBlock}
                progress={this.state.progress}
                unsavedChanges={this.state.unsavedChanges}
                attachmentUploading={this.state.attachmentUploading}
                allTriggers={this.state.allTriggers}
                updateParentState={this.updateState}
                fetchBackup={this.props.fetchBackup}
                createBackup={this.props.createBackup}
                restoreBackup={this.props.restoreBackup}
                fetchChatbotDetails={this.fetchChatbotDetails}
                fetchChatbot={this.fetchChatbot}
                handleMessageBlock={this.props.handleMessageBlock}
                superUser={this.props.superUser}
                uploadAttachment={this.props.uploadAttachment}
                handleAttachment={this.props.handleAttachment}
                updateChatbot={this.props.updateChatbot}
                deleteMessageBlock={this.props.deleteMessageBlock}
                checkWhitelistedDomains={this.props.checkWhitelistedDomains}
                toggleWhitelistModal={this.toggleWhitelistModal}
                alertMsg={this.msg}
                urlMetaData={this.props.urlMetaData}
                messengerComponents={this.props.messengerComponents}
              />
            }
            <PROGRESS progress={`${this.state.progress}%`} />
            <BACKBUTTON
              onBack={this.onBack}
              position='bottom-left'
            />
            <HELPWIDGET
              documentation={{visibility: true, link: 'https://kibopush.com/chatbot-automation/'}}
              videoTutorial={{visibility: true, videoId: '6v1bnraz6CQ'}}
            />
            <MODAL
              zIndex={9999}
              id='_cb_whitelist_domains'
              title='Manage Whitelist Domains'
              content={this.getWhitelistModalContent()}
            />
            <button ref='_open_test_chatbot_modal' style={{ display: 'none' }} data-toggle='modal' data-target='#_test_chatbot' />
            <MODAL
              id='_test_chatbot'
              title='Test Chatbot'
              content={this.getTestModalContent()}
              onClose={this.toggleTestModalContent}
            />
            <button style={{ display: 'none' }} ref={el => this.disableShopifyChatbotTrigger = el} data-toggle='modal' data-target='#disableShopifyChatbot' />
            <CONFIRMATIONMODAL
              id='disableShopifyChatbot'
              title='Disable Shopify Chatbot'
              description='You have a Shopify chatbot already enabled for this page. By enabling this manual chatbot, that Shopify chatbot will be disabled. Do you wish to continue?'
              onConfirm={this.disableShopifyChatbot}
            />
            <button style={{ display: 'none' }} ref={el => this.switchBuilderTrigger = el} data-toggle='modal' data-target='#switchBuilder' />
            <CONFIRMATIONMODAL
              id='switchBuilder'
              title='Warning'
              description="Please note that if you set the builder preference to advanced, then you won't be able to switch back to basic. Are you sure you want to continue?"
              onConfirm={this.switchBuilder}
            />
          </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fbAppId: state.basicInfo.fbAppId,
    user: (state.basicInfo.user),
    superUser: (state.basicInfo.superUser),
    messengerComponents: state.messengerComponentsInfo.messengerComponents
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
    fetchBackup,
    createBackup,
    restoreBackup,
    fetchChatbot,
    checkWhitelistedDomains,
    deleteDomain,
    saveWhiteListDomains,
    fetchWhiteListedDomains,
    urlMetaData,
    getMessengerComponents
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureChatbot)
