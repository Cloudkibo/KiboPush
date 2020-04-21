import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchChatbotDetails,
  uploadAttachment,
  handleAttachment,
  handleMessageBlock,
  changeActiveStatus,
  deleteMessageBlock
} from '../../redux/actions/chatbotAutomation.actions'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { registerAction } from '../../utility/socketio'
import AlertContainer from 'react-alert'
import PROGRESS from '../../components/chatbotAutomation/progress'
import SIDEBAR from '../../components/chatbotAutomation/sidebar'
import MESSAGEAREA from '../../components/chatbotAutomation/messageArea'

class ConfigureChatbot extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      chatbot: props.location.state,
      blocks: [],
      sidebarItems: [],
      currentBlock: {title: ''},
      currentLevel: 1,
      progress: 0
    }

    this.handleChatbotDetails = this.handleChatbotDetails.bind(this)
    this.preparePayload = this.preparePayload.bind(this)
    this.isItParent = this.isItParent.bind(this)
    this.getParentId = this.getParentId.bind(this)
    this.updateState = this.updateState.bind(this)

    props.getFbAppId()
  }

  componentDidMount () {
    this.props.fetchChatbotDetails(this.props.location.state._id, this.handleChatbotDetails)
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push'
    document.title = 'KiboChat | Configure ChatBot'
  }

  updateState (state) {
    this.setState(state)
  }

  handleChatbotDetails (res) {
    if (res.status === 'success') {
      this.preparePayload(res.payload)
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
          isParent: false
          // isParent: this.isItParent(data[i]),
          // parentId: this.getParentId(data, data[i])
        })
        if (data[i].payload.length > 0) {
          completed = completed + 1
        }
      }
      progress = Math.floor((completed / data.length) * 100)
    } else {
      const id = new Date().getTime()
      blocks = [{
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
        quickReplies = quickReplies.filter((item) => item.title !== 'Home')
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
        replies = replies.filter((item) => item.title !== 'Home')
        if (replies.length > 0) {
          let payload = replies.map((item) => JSON.parse(item.payload))
          payload = payload.map((item) => item.filter((p) => p.action === 'send_message_block')[0].blockUniqueId)
          if (payload.includes(current.uniqueId)) {
            return data[i].uniqueId
          }
        }
      }
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
          ? <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
            <div className="m-loader m-loader--brand" style={{width: "30px", display: "inline-block"}} />
            <span className='m--font-brand'>Please wait...</span>
          </div>
          : <div>
            <div style={{margin: '15px'}} className='row'>
              <SIDEBAR data={this.state.sidebarItems} />
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
              />
            </div>
            <PROGRESS progress={`${this.state.progress}%`} />
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
    getFbAppId
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureChatbot)
