import React from 'react'
import { Link } from 'react-router'
import YouTube from 'react-youtube'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'

class Info extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showVideo: false,
      showGuideLines: false
    }
    this.showGuideLinesDialog = this.showGuideLinesDialog.bind(this)
    this.closeGuideLinesDialog = this.closeGuideLinesDialog.bind(this)
  }

  showGuideLinesDialog () {
    this.setState({showGuideLines: true})
  }

  closeGuideLinesDialog () {
    this.setState({showGuideLines: false})
  }

  render () {
    return (
      <div className='row'>
        {
          this.state.showVideo &&
          <ModalContainer style={{ width: '680px', top: 100 }}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='XUXc2ZD_lQY'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        {
          this.state.showGuideLines &&
          <ModalContainer style={{width: '500px'}}
            onClose={this.closeGuideLinesDialog}>
            <ModalDialog style={{width: '500px'}}
              onClose={this.closeGuideLinesDialog}>
              <h4>Message Types</h4>
              <p> Following are the types of messages that can be sent to facebook messenger.</p>
              <div className='panel-group accordion' id='accordion1'>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Subscription Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      <p>Subscription messages can&#39;t contain ads or promotional materials, but can be sent at any time regardless of time passed since last user activity. In order to send Subscription Messages, please apply for Subscription Messages Permission by following the steps given on this&nbsp;
                      <a href='https://developers.facebook.com/docs/messenger-platform/policy/app-to-page-subscriptions' target='_blank'>link.</a></p>
                    </div>
                  </div>
                </div>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Promotional Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      Promotional messages can contain ads and promotional materials, but can only be sent to subscribers who were active in the past 24 hours.
                    </div>
                  </div>
                </div>
                <div className='panel panel-default'>
                  <div className='panel-heading guidelines-heading'>
                    <h4 className='panel-title'>
                      <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_3' aria-expanded='false'>Follow-Up Messages</a>
                    </h4>
                  </div>
                  <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{height: '0px'}}>
                    <div className='panel-body'>
                      After the end of the 24 hours window you have an ability to send "1 follow up message" to these recipients. After that you won&#39;t be able to send them ads or promotional messages until they interact with you again.
                    </div>
                  </div>
                </div>
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='col'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            { this.props.module === 'WHATSAPP' && <div className='m-alert__text'>
              Need help in understanding this page? <a href='http://kibopush.com/twilio/' target='_blank'>Click Here. </a>
              Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial.</a>
            </div>
            }
            { this.props.module === 'KIBOCHAT' && <div className='m-alert__text'>
              Need help in understanding this page? <a href='http://kibopush.com/livechat/' target='_blank'>Click Here. </a>
              Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial.</a>
            </div>
            }
          </div>
        </div>
        { this.props.module === 'KIBOCHAT' &&
        <div className='col'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-exclamation m--font-brand' />
            </div>
            <div className='m-alert__text'>
              To view Facebook guidelines regarding types of messages <Link className='linkMessageTypes' style={{color: '#5867dd', cursor: 'pointer'}} onClick={this.showGuideLinesDialog} >Click here.</Link>
            </div>
          </div>
        </div>
        }
      </div>
    )
  }
}

export default Info
