/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

  import React from 'react'
  import { connect } from 'react-redux'
  import { bindActionCreators } from 'redux'
  import CreateMessage from '../../components/CreateMessage/createMessage'

  class LandingPageMessage extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.state = {
        optInMessage: this.props.location.state.editMessage ? this.props.location.state.editMessage : []
      }
      this.saveMessage = this.saveMessage.bind(this)
    }
    saveMessage (message) {
      this.setState({
        optInMessage: message
      })
    }
    render () {
      return (
        <CreateMessage title='Landing Page Opt-In Message' module='landingPage' pages={[]} saveMessage={this.saveMessage} editMessage={this.state.optInMessage} />
      )
    }
  }

  function mapStateToProps (state) {
    return {
    }
  }

  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
    }, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps)(LandingPageMessage)
