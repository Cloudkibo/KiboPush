import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import YouTube from 'react-youtube'

class Info extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      openVideo: false
    }
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }

  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoLiveChat.click()
  }

  render() {
    return (
      <div className='row'>
        <a href='#/' style={{ display: 'none' }} ref='videoLiveChat' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoLiveChat">videoLiveChat</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoLiveChat" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Livechat Video Tutorial
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  this.setState({
                    openVideo: false
                  })}}>
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                {
                  this.state.openVideo &&
                  <YouTube
                    videoId={this.props.videoId}
                    opts={{
                      height: '390',
                      width: '640',
                      playerVars: { // https://developers.google.com/youtube/player_parameters
                        autoplay: 0
                      }
                    }}
                  />
                }
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="guideLinesDialog" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Message Types
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p> Following are the types of messages that can be sent to facebook messenger.</p>
                <div className='panel-group accordion' id='accordion1'>
                  <div className='panel panel-default'>
                    <div className='panel-heading guidelines-heading'>
                      <h4 className='panel-title'>
                        <a className='guidelines-link accordion-toggle accordion-toggle-styled collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_1' aria-expanded='false'>Subscription Messages</a>
                      </h4>
                    </div>
                    <div id='collapse_1' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
                      <div className='panel-body'>
                        <p>Subscription messages can&#39;t contain ads or promotional materials, but can be sent at any time regardless of time passed since last user activity. In order to send Subscription Messages, please apply for Subscription Messages Permission by following the steps given on this&nbsp;
                      <a href='https://developers.facebook.com/docs/messenger-platform/policy/app-to-page-subscriptions' target='_blank' rel='noopener noreferrer'>link.</a></p>
                      </div>
                    </div>
                  </div>
                  <div className='panel panel-default'>
                    <div className='panel-heading guidelines-heading'>
                      <h4 className='panel-title'>
                        <a className='guidelines-link accordion-toggle collapsed' data-toggle='collapse' data-parent='#accordion1' href='#collapse_2' aria-expanded='false'>Promotional Messages</a>
                      </h4>
                    </div>
                    <div id='collapse_2' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
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
                    <div id='collapse_3' className='panel-collapse collapse' aria-expanded='false' style={{ height: '0px' }}>
                      <div className='panel-body'>
                        After the end of the 24 hours window you have an ability to send "1 follow up message" to these recipients. After that you won&#39;t be able to send them ads or promotional messages until they interact with you again.
                    </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{padding: '0px'}} className='col'>
          <div style={{marginBottom: '15px'}} className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding this page? <a href={this.props.clickHereLink} target='_blank' rel='noopener noreferrer'>Click Here. </a>
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial.</a>
            </div>
          </div>
        </div>
        {
          this.props.showGuideline &&
          <div style={{paddingRight: '0px'}} className='col'>
            <div style={{marginBottom: '15px'}} className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible' role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation m--font-brand' />
              </div>
              <div className='m-alert__text'>
                To view Facebook guidelines regarding types of messages <Link className='linkMessageTypes' style={{ color: '#5867dd', cursor: 'pointer' }} data-toggle="modal" data-target="#guideLinesDialog" >Click here.</Link>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

Info.propTypes = {
  'showGuideline': PropTypes.bool.isRequired,
  'clickHereLink': PropTypes.string.isRequired,
  'videoId': PropTypes.string.isRequired
}

export default Info
