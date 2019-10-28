/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { connect } from 'react-redux'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
// import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import YouTube from 'react-youtube'

class InviteSubscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.getlink = this.getlink.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.state = {
      fblink: '',
      copied: false,
      selectPage: {},
      showVideo: false
    }
  }

  getlink () {
    let linkurl = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fweb.facebook.com%2F' +
      this.state.selectPage.pageName + '-' +
      this.state.selectPage.pageId + '%2F&amp;src=sdkpreparse'
    return linkurl
  }

  componentDidMount () {
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
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Invite Subscribers`;
  }

  onChangeValue (event) {
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

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        {/*
          this.state.showVideo &&
          <ModalContainer style={{width: '680px', top: 100}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px', top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='e89WqM7SjQA'
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
        */}
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
              Need help in understanding this page? <a href='http://kibopush.com/user-guide/' target='_blank'>Click Here </a>
              Or check out this <a href='#' onClick={() => { this.setState({showVideo: true}) }}>video tutorial</a>
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
                        <a style={{marginLeft: '30px'}} className='btn btn-primary' target='_blank' href={this.getlink()}>
                          <i className='fa fa-facebook' style={{marginRight: '10px'}} />
                          <span>Share Page</span>
                        </a>
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
                            this.setState({copied: true})
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
                          <button style={{marginLeft: '30px'}} type='button' className='btn btn-success'>
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

function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadMyPagesList: loadMyPagesList}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteSubscribers)
