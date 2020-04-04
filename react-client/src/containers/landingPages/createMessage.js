/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

  import React from 'react'
  import { connect } from 'react-redux'
  import { bindActionCreators } from 'redux'
  import GenericMessage from '../../components/SimplifiedBroadcastUI/GenericMessage'
  import { updateLandingPageData } from '../../redux/actions/landingPages.actions'
  import AlertContainer from 'react-alert'
  import { validateFields } from '../../containers/convo/utility'
  import {getFileIdsOfBroadcast, deleteInitialFiles, deleteFile} from '../../utility/utils'

  class LandingPageMessage extends React.Component {
    constructor (props, context) {
      super(props, context)
      this.state = {
        buttonActions: ['open website', 'open webview'],
        broadcast: props.landingPage.optInMessage ? props.landingPage.optInMessage : [],
        pageId: props.pages.filter((page) => page.pageId === props.landingPage.pageId)[0]._id,
        convoTitle: 'Landing Page Opt-In Message'
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
      if (this.props.location.state && this.props.location.state.module === 'edit') {
        document.title = `${title} | Edit Message`
      } else {
        document.title = `${title} | Create Message`
      }
      this.setState({initialFiles: this.props.location.state.initialFiles})
    }
    saveMessage () {
      if (!validateFields(this.state.broadcast, this.msg)) {
        return
      }
      let newFiles = this.props.location.state.newFiles
      if (newFiles) {
        newFiles = newFiles.concat(this.state.newFiles)
      } else {
        newFiles = this.state.newFiles
      }
      let currentFiles = getFileIdsOfBroadcast(this.state.broadcast)
      newFiles = deleteInitialFiles(newFiles, currentFiles)
      this.props.landingPage.newFiles = newFiles
      this.props.updateLandingPageData(this.props.landingPage, this.props.landingPage.currentTab, 'optInMessage', this.state.broadcast)
      let initialFiles = this.state.initialFiles.concat(newFiles)
      this.setState({newFiles: [], initialFiles})
      this.msg.success('Message has been saved.')
    }

    goBack () {
      this.editing = true
      if (this.props.location.state && this.props.location.state.module === 'edit') {
        const currentLP = this.props.landingPages.filter((lp) => lp.pageId._id === this.state.pageId)[0]
        this.props.landingPage.isActive = true
        this.props.landingPage.pageId = currentLP.pageId
        this.props.landingPage._id = currentLP._id
        this.props.landingPage.currentTab = 'optInActions'
        this.props.history.push({
          pathname: `/editLandingPage`,
          state: {module: 'edit', landingPage: this.props.landingPage, _id: this.state.pageId, initialFiles: this.props.location.state.realInitialFiles}
        })
      } else {
        this.props.history.push({
          pathname: `/createLandingPage`,
          state: {pageId: this.props.landingPage.pageId.pageId, _id: this.state.pageId, initialFiles: this.props.location.state.realInitialFiles}
        })
      }
    }

    componentWillUnmount () {
      if (!this.editing) {
        if (this.state.newFiles) {
          for (let i = 0; i < this.state.newFiles.length; i++) {
            deleteFile(this.state.newFiles[i])
          }
        }
        if (this.props.location.state.newFiles) {
          for (let i = 0; i < this.props.location.state.newFiles.length; i++) {
            deleteFile(this.props.landingPage.newFiles[i])
          }
        }
      }
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
            newFiles={this.state.newFiles}
            initialFiles={this.state.initialFiles}
            pageId={this.props.landingPage.pageId}
            broadcast={this.state.broadcast}
            handleChange={this.handleChange}
            convoTitle={this.state.convoTitle}
            buttonActions={this.state.buttonActions}
            pages={[this.state.pageId]} />
        </div>
      )
    }
  }

  function mapStateToProps (state) {
    console.log('state in Landing Page- CreateMessage', state)
    return {
      landingPage: state.landingPagesInfo.landingPage,
      landingPages: state.landingPagesInfo.landingPages,
      pages: state.pagesInfo.pages
    }
  }

  function mapDispatchToProps (dispatch) {
    return bindActionCreators({
      updateLandingPageData: updateLandingPageData
    }, dispatch)
  }
  export default connect(mapStateToProps, mapDispatchToProps)(LandingPageMessage)
