/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

  import React from 'react'
  import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
  import AlertContainer from 'react-alert'
  import { validateFields } from '../../containers/convo/utility'
  import { connect } from 'react-redux'
  import { bindActionCreators } from 'redux'
  import { updateWidget } from '../../redux/actions/overlayWidgets.actions'

  class WidgetMessage extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.state = {
        buttonActions: ['open website', 'open webview'],
        broadcast: props.currentWidget.optInMessage ? props.currentWidget.optInMessage : [],
        convoTitle: 'Overlay Widget Opt-In Message'
      }
      this.saveMessage = this.saveMessage.bind(this)
      this.goBack = this.goBack.bind(this)
      this.handleChange = this.handleChange.bind(this)
    }

    handleChange (broadcast) {
      this.setState(broadcast)
    }

    componentDidMount () {
      const hostname = window.location.hostname
      let title = ''
      if (hostname.includes('kiboengage.cloudkibo.com')) {
        title = 'KiboEngage'
      } else if (hostname.includes('kibochat.cloudkibo.com')) {
        title = 'KiboChat'
      }
      document.title = `${title} | Create Message`
    }
    saveMessage () {
      if (!validateFields(this.state.broadcast, this.msg)) {
        return
      }
      this.props.updateWidget(this.props.currentWidget, null, 'optInMessage', this.state.broadcast)
      this.msg.success('Message has been saved.')
    }

    goBack () {
      this.props.history.push({
        pathname: `/createOverlayWidget`
      })
    }

    render () {
      var alertOptions = {
        offset: 75,
        position: 'top right',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
      }
      console.log('this.state.broadcast', this.state.broadcast)
      return (
        <div style={{width: '100%'}}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <div className='m-content' style={{marginBottom: '-30px'}}>
            <div className='row'>
              <div className='col-12'>
                <div className='pull-right'>
                  <button className='btn btn-primary' style={{marginRight: '20px'}} onClick={this.goBack}>
                    Back
                  </button>
                  <button className='btn btn-primary' disabled={(this.state.broadcast.length === 0)} onClick={this.saveMessage}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <GenericMessage
            pageId={this.props.currentWidget.page._id}
            broadcast={this.state.broadcast}
            handleChange={this.handleChange}
            convoTitle={this.state.convoTitle}
            buttonActions={this.state.buttonActions}
            pages={this.props.pages} />
        </div>
      )
    }
  }

  function mapStateToProps (state) {
    console.log('state in Landing Page- CreateMessage', state)
    return {
      currentWidget: state.overlayWidgetsInfo.currentWidget,
      pages: state.pagesInfo.pages
    }
  }

  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
      updateWidget: updateWidget
    }, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps)(WidgetMessage)
