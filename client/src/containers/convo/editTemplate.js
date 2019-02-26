/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { createWelcomeMessage } from '../../redux/actions/welcomeMessage.actions'
import { bindActionCreators } from 'redux'
import AlertContainer from 'react-alert'
import GenericMessage from '../../components/GenericMessage'

class EditTemplate extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      broadcast: [],
      convoTitle: 'Welcome Message',
      buttonActions: ['open website', 'open webview', 'add share']
    }
    this.goBack = this.goBack.bind(this)
    this.saveMessage = this.saveMessage.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (broadcast) {
    this.setState(broadcast)
  }

  saveMessage () {
    this.props.createWelcomeMessage({_id: this.props.location.state.pages[0], welcomeMessage: this.state.broadcast}, this.msg)
  }

  goBack () {
    this.props.history.push({
      pathname: `/welcomeMessage`
    })
  }

  componentDidMount () {
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
      this.setState({broadcast: this.props.location.state.payload})
    }
  }

  scrollToTop () {
    this.top.scrollIntoView({behavior: 'instant'})
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
                <GenericMessage broadcast={this.state.broadcast} handleChange={this.handleChange} convoTitle={this.state.convoTitle} buttonActions={this.state.buttonActions} />
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
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(
    {
      createWelcomeMessage: createWelcomeMessage
    },
    dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(EditTemplate)
