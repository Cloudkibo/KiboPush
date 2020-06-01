import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchChatbotDetails,
  uploadAttachment,
  handleAttachment,
  handleMessageBlock,
  changeActiveStatus,
  deleteMessageBlock,
  fetchBackup,
  createBackup,
  restoreBackup,
  fetchChatbot
} from '../../redux/actions/chatbotAutomation.actions'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { checkWhitelistedDomains } from '../../redux/actions/broadcast.actions'
import { saveWhiteListDomains, fetchWhiteListedDomains, deleteDomain } from '../../redux/actions/settings.actions'
import { registerAction } from '../../utility/socketio'
import AlertContainer from 'react-alert'
import PROGRESS from '../../components/chatbotAutomation/progress'
import SIDEBAR from '../../components/chatbotAutomation/sidebar'
import MESSAGEAREA from '../../components/chatbotAutomation/messageArea'
import BACKBUTTON from '../../components/extras/backButton'
import HELPWIDGET from '../../components/extras/helpWidget'
import MODAL from '../../components/extras/modal'
import WHITELISTDOMAINS from '../../components/chatbotAutomation/whitelistDomains'
import $ from 'jquery'

class ConfigureChatbot extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      chatbot: props.location.state.chatbot,
      blocks: [],
      sidebarItems: [],
      currentBlock: {title: ''},
      currentLevel: 1,
      progress: 0,
      showWhitelistDomains: false
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

    props.getFbAppId()
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
      progress
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
      pathname: '/chatbotAutomation'
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

  componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
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
                fetchBackup={this.props.fetchBackup}
                createBackup={this.props.createBackup}
                restoreBackup={this.props.restoreBackup}
                alertMsg={this.msg}
                fetchChatbotDetails={this.fetchChatbotDetails}
                fetchChatbot={this.fetchChatbot}
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
                changeActiveStatus={this.props.changeActiveStatus}
                deleteMessageBlock={this.props.deleteMessageBlock}
                registerSocketAction={registerAction}
                progress={this.state.progress}
                updateParentState={this.updateState}
                sidebarItems={this.state.sidebarItems}
                checkWhitelistedDomains={this.props.checkWhitelistedDomains}
                toggleWhitelistModal={this.toggleWhitelistModal}
              />
            </div>
            <PROGRESS progress={`${this.state.progress}%`} />
            <BACKBUTTON
              onBack={this.onBack}
              position='bottom-left'
            />
            <HELPWIDGET
              documentation={{visibility: false}}
              videoTutorial={{visibility: true, videoId: 'eszeTV3-Uzs'}}
            />
            <MODAL
              zIndex={9999}
              id='_cb_whitelist_domains'
              title='Manage Whitelist Domains'
              content={this.getWhitelistModalContent()}
            />
          </div>
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
    changeActiveStatus,
    deleteMessageBlock,
    getFbAppId,
    fetchBackup,
    createBackup,
    restoreBackup,
    fetchChatbot,
    checkWhitelistedDomains,
    deleteDomain,
    saveWhiteListDomains,
    fetchWhiteListedDomains
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureChatbot)
