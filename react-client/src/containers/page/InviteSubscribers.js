/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { connect } from 'react-redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import YouTube from 'react-youtube'
import AlertContainer from 'react-alert'

class InviteSubscribers extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.getlink = this.getlink.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.state = {
      fblink: '',
      copied: false,
      selectPage: {},
      openVideo: false
    }
    this.openVideoTutorial = this.openVideoTutorial.bind(this)
  }
  openVideoTutorial () {
    this.setState({
      openVideo: true
    })
    this.refs.videoInviteSubscriber.click()
  }
  getlink() {
    let linkurl = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fweb.facebook.com%2F' +
      this.state.selectPage.pageName + '-' +
      this.state.selectPage.pageId + '%2F&amp;src=sdkpreparse'
    return linkurl
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.pageUserName) {
      this.setState({
        fblink: `https://m.me/${this.props.location.state.pageUserName}`,
        selectPage: this.props.location.state
      })
    } else if (this.props.location.state && this.props.location.state.pageId) {
      this.setState({
        fblink: `https://m.me/${this.props.location.state.pageId}`,
        selectPage: this.props.location.state
      })
    } else if (this.props.pages && this.props.pages.length > 0 && this.props.pages[0].pageUserName) {
      this.setState({
        fblink: `https://m.me/${this.props.pages[0].pageUserName}`,
        selectPage: this.props.pages[0]
      })
    } else {
      if (this.props.pages && this.props.pages.length > 0) {
        this.setState({
          fblink: `https://m.me/${this.props.pages[0].pageId}`,
          selectPage: this.props.pages[0]
        })
      }
    }
    const hostname = window.location.hostname;
    let title = '';
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Invite Subscribers`;
  }

  onChangeValue(event) {
    if (event.target.value !== -1) {
      let page
      for (let i = 0; i < this.props.pages.length; i++) {
        if (this.props.pages[i].pageId === event.target.value) {
          page = this.props.pages[i]
          break
        }
      }
      if (page.pageUserName) {
        this.setState({
          fblink: `https://m.me/${page.pageUserName}`,
          selectPage: page
        })
      } else {
        this.setState({
          fblink: `https://m.me/${page.pageId}`,
          selectPage: page
        })
      }
    } else {
      this.setState({
        fblink: '',
        selectPage: {}
      })
    }
  }

  render() {
    var alertOptions = {
      offset: 14,
      position: 'top right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
      <AlertContainer ref={a => this.msg = a} {...alertOptions} />
      <a href='#/' style={{ display: 'none' }} ref='videoInviteSubscriber' data-toggle='modal' data-backdrop='static' data-keyboard='false' data-target="#videoInviteSubscriber">InviteSubscribers</a>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="videoInviteSubscriber" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog modal-lg" role="document">
            <div className="modal-content" style={{ width: '687px', top: '100' }}>
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Invite Subscribers Video Tutorial
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
              {this.state.openVideo && <YouTube
                  videoId='e89WqM7SjQA'
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
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Invite Subscribers</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding this page? <a href='http://kibopush.com/user-guide/' target='_blank' rel='noopener noreferrer'>Click Here </a>
              Or check out this <a href='#/' onClick={this.openVideoTutorial}>video tutorial</a>
            </div>
          </div>
          <div className='row'>
            <div className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
              <div className='m-portlet m-portlet--tab'>
                <form className='m-form m-form--fit m-form--label-align-right'>
                  <div className='m-portlet__body'>
                    <div className='form-group m-form__group row'>
                      <div className='col-md-2'>
                        <label className='form-label'>
                          Change Page
                        </label>
                      </div>
                      <div className='col-md-10'>
                        <select className='form-control m-input' value={this.state.selectPage.pageId} onChange={this.onChangeValue}>
                          {
                            this.props.pages && this.props.pages.length > 0 && this.props.pages.map((page, i) => (
                              <option key={page.pageId} value={page.pageId}>{page.pageName}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className='row'>
                <div className='col-xl-6 col-lg-6  col-md-6 col-sm-6 col-xs-6'>
                  <div className='m-portlet m-portlet--tab'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <span className='m-portlet__head-icon m--hide'>
                            <i className='la la-gear' />
                          </span>
                          <h3 className='m-portlet__head-text'>
                            Share Your Page
                          </h3>
                        </div>
                      </div>
                    </div>
                    <form className='m-form m-form--fit m-form--label-align-right'>
                      <div className='m-portlet__body'>
                        <div className='form-group m-form__group m--margin-top-10'>
                          <div className='alert m-alert m-alert--default' role='alert'>
                            Build your audience by sharing the page on your timeline.
                            This will let your friends know about your Facebook page.
                          </div>
                        </div>
                        <div className='m--space-30' />
                        <button style={{ marginLeft: '30px'}} className='btn btn-primary'
                          onClick={(e) => {
                            e.preventDefault()
                            if (this.props.user.actingAsUser) {
                              this.msg.error('You are not allowed to perform this action')
                            } else {
                              window.open(this.getlink(), '_blank')
                            }
                          }}>
                          <i className='fa fa-facebook' style={{ marginRight: '10px' }} />
                          <span>Share Page</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className='col-xl-6 col-lg-6  col-md-6 col-sm-6 col-xs-6'>
                  <div className='m-portlet m-portlet--tab'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <span className='m-portlet__head-icon m--hide'>
                            <i className='la la-gear' />
                          </span>
                          <h3 className='m-portlet__head-text'>
                            Share Page Link
                          </h3>
                        </div>
                      </div>
                    </div>
                    <form className='m-form m-form--fit m-form--label-align-right'>
                      <div className='m-portlet__body'>
                        <div className='form-group m-form__group m--margin-top-10'>
                          <div className='alert m-alert m-alert--default' role='alert'>
                            This is the link to your facebook page. Copy this link and share it with people to invite them to become susbcribers of your page
                            <input className='form-control m-input m-input--air' value={this.state.fblink} />
                          </div>
                        </div>
                        <div className='m--space-30' />
                        <CopyToClipboard text={this.state.fblink}
                          onCopy={() => {
                            this.setState({ copied: true })
                            toastr.options = {
                              'closeButton': true,
                              'debug': false,
                              'newestOnTop': false,
                              'progressBar': false,
                              'positionClass': 'toast-bottom-right',
                              'preventDuplicates': false,
                              'showDuration': '300',
                              'hideDuration': '1000',
                              'timeOut': '5000',
                              'extendedTimeOut': '1000',
                              'showEasing': 'swing',
                              'hideEasing': 'linear',
                              'showMethod': 'fadeIn',
                              'hideMethod': 'fadeOut'
                            }

                            toastr.success('Link Copied Successfully', 'Copied!')
                          }
                          }>
                          <button style={{ marginLeft: '30px' }} type='button' className='btn btn-success'>
                            Copy Link
                          </button>
                        </CopyToClipboard>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loadMyPagesList: loadMyPagesList }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteSubscribers)
