/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

  import React from 'react'
  import { connect } from 'react-redux'
  import { bindActionCreators } from 'redux'
  import CreateMessage from '../../components/CreateMessage/createMessage'
  import { updateLandingPageData } from '../../redux/actions/landingPages.actions'
  import AlertContainer from 'react-alert'

  class LandingPageMessage extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.state = {
        optInMessage: this.props.landingPage.optInMessage ? this.props.landingPage.optInMessage : [],
        pageId: ''
      }
      this.saveMessage = this.saveMessage.bind(this)
    }
    saveMessage (message) {
      this.setState({
        optInMessage: message
      })
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'optInMessage', message)
      this.msg.success('Message has been saved.')
    }
    componentDidMount () {
      let pageId = this.props.pages.filter((page) => page.pageId === this.props.landingPage.pageId)[0]._id
      this.setState({
        pageId: pageId
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
      return (
        <div style={{width: '100%'}}>
          <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
          <CreateMessage title='Landing Page Opt-In Message' module='landingPage' pages={[this.props.landingPage.pageId]} saveMessage={this.saveMessage} editMessage={this.state.optInMessage} />
        </div>
      )
    }
  }

  function mapStateToProps (state) {
    console.log('state in Landing Page- CreateMessage', state)
    return {
      landingPage: state.landingPagesInfo.landingPage,
      pages: state.pagesInfo.pages
    }
  }

  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
      updateLandingPageData: updateLandingPageData
    }, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps)(LandingPageMessage)
