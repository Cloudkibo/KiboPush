/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { createWelcomeMessage } from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import GenericMessage from '../../components/GenericMessage'
import { validateFields } from '../convo/utility'
import {
  loadMyPagesList
} from '../../redux/actions/pages.actions'
class EditTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      broadcast: [],
      selectedPage: [],
      convoTitle: 'Welcome Message',
      buttonActions: ['open website', 'open webview', 'add share'],
      pageId: this.props.pages.filter((page) => page._id === this.props.location.state.pages[0])[0].pageId
    }
    this.goBack = this.goBack.bind(this)
    this.saveMessage = this.saveMessage.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (broadcast) {
    this.setState(broadcast)
  }

  saveMessage () {
    console.log('this.state.broadcast in welcome message', this.state.broadcast)
    if (!validateFields(this.state.broadcast, this.msg)) {
      return
    }
    this.props.createWelcomeMessage({_id: this.props.location.state.pages[0], welcomeMessage: this.state.broadcast}, this.msg)
  }

  goBack () {
    this.props.history.push({
      pathname: `/welcomeMessage`
    })
  }

  componentDidMount () {
    this.props.loadMyPagesList()
    console.log('this.props.location.state.default_action', this.props.location.state.default_action)
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Edit Template`
    this.scrollToTop()
    if (this.props.location.state && this.props.location.state.payload) {
      var data = this.props.location.state.payload
      console.log('data in did mount method', data)
     // data[0].default_action = this.props.location.state.default_action
      this.setState({broadcast: this.props.location.state.payload})
    }
  }

  componentWillReceiveProps (nextProps) {
    if(nextProps.pages !== this.props.pages) {
    var pages= nextProps.pages.filter((page) => page._id === this.props.location.state.pages[0])
    console.log('PageSelected', pages[0])
    this.setState({selectedPage: pages[0].welcomeMessage}) 
    }
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
  }

  render () {
   // var broadcast = this.state.broadcast
    console.log('pages ine edit template', this.props.pages)
    console.log('this.state.selectedPage', this.state.selectedPage)
    console.log('this.props.location.state.pages[0])',this.props.location.state.pages[0])
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        <div style={{float: 'left', clear: 'both'}}
          ref={(el) => { this.top = el }} />
        <div className='m-content'>
          <div className='row'>
            <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--mobile'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                          Welcome Message
                        </h3>
                    </div>
                  </div>
                </div>
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
                  pageId={this.state.pageId}
                  pages={this.props.pages.filter((page) => page._id === this.props.location.state.pages[0])}
                  broadcast={this.state.broadcast}
                  handleChange={this.handleChange}
                  convoTitle={this.state.convoTitle}
                  buttonActions={this.state.buttonActions}
                  default_action={this.props.location.state.default_action ? this.props.location.state.default_action : ''}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      createWelcomeMessage: createWelcomeMessage,
      loadMyPagesList: loadMyPagesList
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplate)
