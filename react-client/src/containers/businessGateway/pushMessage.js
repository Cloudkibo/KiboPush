import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
import { updateCurrentCustomersInfo } from '../../redux/actions/businessGateway.actions'
import Footer from './footer'
import AlertContainer from 'react-alert'
import { validateFields } from '../convo/utility'

class PushMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      convoTitle: 'Push Message',
      buttonActions: ['open website', 'open webview']
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleNext = this.handleNext.bind(this)
  }
  handleChange (message) {
    var broadcast = message.broadcast
    this.props.updateCurrentCustomersInfo(this.props.customersInfo, 'pushMessage', broadcast, this.props.setSaveEnable)
  }
  handleNext () {
    var broadcast = this.props.customersInfo.pushMessage
    if (broadcast.length < 1) {
      this.msg.error('Create a message to send to your customers')
      return
    }
    if (validateFields(broadcast, this.msg)) {
      this.props.handleNext('pushMessage')
    }
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <GenericMessage
          pages={[this.props.page ? this.props.page._id : null]}
          pageId={this.props.page.pageId}
          broadcast={this.props.defaultMessage}
          handleChange={this.handleChange}
          showQuickRelplies = {false}
          convoTitle={this.state.convoTitle}
          hideUserOptions
          buttonActions={this.state.buttonActions} />
        <Footer tab='pushMessage' handleNext={this.handleNext} handleBack={this.props.handleBack} />
      </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    pages: state.pagesInfo.pages,
    customersInfo: state.businessGatewayInfo.customersInfo
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateCurrentCustomersInfo: updateCurrentCustomersInfo
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PushMessage)
