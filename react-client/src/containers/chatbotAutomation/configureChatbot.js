import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  fetchChatbotDetails,
  uploadAttachment,
  handleAttachment
} from '../../redux/actions/chatbotAutomation.actions'
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
      currentBlock: {}
    }

    this.handleChatbotDetails = this.handleChatbotDetails.bind(this)
    this.preparePayload = this.preparePayload.bind(this)
    this.isItParent = this.isItParent.bind(this)
    this.getParentId = this.getParentId.bind(this)
  }

  componentDidMount () {
    this.props.fetchChatbotDetails(this.props.location.state._id, this.handleChatbotDetails)
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-header--fixed m-header--fixed-mobile m-footer--push'
    document.title = 'KiboChat | Configure ChatBot'
  }

  handleChatbotDetails (res) {
    if (res.status === 'success') {
      this.preparePayload(res.payload)
    } else {
      this.msg.error('An unexpected error occured. Please try again later')
    }
    this.setState({loading: false})
  }

  preparePayload (data) {
    let blocks = []
    let sidebarItems = []
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        blocks.push({
          title: data[i].title,
          payload: data[i].payload,
          uniqueId: data[i].uniqueId,
          triggers: this.state.chatbot.startingBlockId === data[i]._id ? this.state.chatbot.triggers : undefined
        })
        sidebarItems.push({
          title: data[i].title,
          id: data[i].uniqueId,
          isParent: this.isItParent(data[i]),
          parentId: this.getParentId(data, data[i])
        })
      }
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
    this.setState({blocks, sidebarItems, currentBlock: blocks[0]})
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
        <div style={{margin: '15px'}} className='row'>
          <SIDEBAR data={this.state.sidebarItems} />
          <MESSAGEAREA
            block={this.state.currentBlock}
            chatbot={this.state.chatbot}
            alertMsg={this.msg}
            uploadAttachment={this.props.uploadAttachment}
            handleAttachment={this.props.handleAttachment}
          />
        </div>
        <PROGRESS progress='65%' />
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
    uploadAttachment,
    handleAttachment
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ConfigureChatbot)
