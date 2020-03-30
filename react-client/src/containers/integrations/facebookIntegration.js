/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
// import auth from '../../utility/auth.service'
import { updateShowIntegrations, disconnectFacebook } from '../../redux/actions/basicinfo.actions'

class FacebookIntegration extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showModal: false
    }
    this.updateShowIntegrations = this.updateShowIntegrations.bind(this)
    this.disconnectFacebook = this.disconnectFacebook.bind(this)
    this.closeDialog = this.closeDialog.bind(this)
  }

  updateShowIntegrations () {
    this.props.updateShowIntegrations({showIntegrations: false}, this.props.history)
  }

  disconnectFacebook () {
    this.setState({showModal: true})
  }

  closeDialog () {
    this.setState({showModal: false})
  }

  UNSAFE_componentWillMount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  UNSAFE_componentWillUnmount () {
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-aside-left--fixed m-header--fixed m-header--fixed-mobile m-aside-left--enabled m-aside-left--skin-dark m-aside-left--offcanvas m-footer--push m-aside--offcanvas-default'
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Facebook Connect`
  }

  render () {
    return (
      <div style={{height: 100 + 'vh', margin: '25px 300px', width: '100%'}}>
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin' id='m_login' style={{boxShadow: '0px 0px 30px 0px #ccc'}}>
          <div className='m-grid__item m-grid__item--fluid m-grid m-grid--hor m-login m-login--singin m-login--2 m-login-2--skin-1'>
            <div className='m-login__wrapper'>
              <div className='m-login__logo'>
                <a href='#/'>
                  <img alt='' src='https://cdn.cloudkibo.com/public/img/logo.png' style={{maxWidth: 250}} />
                </a>
              </div>
              {
                this.props.user && this.props.user.facebookInfo && this.props.user.connectFacebook
                ? <div className='m-login__signin'>
                  <div className='m-login__head'>
                    <h3 className='m-login__title'>Facebook Integration</h3>
                  </div>
                  <br />
                  <br />
                  <center>
                    <div>
                      <span>You are currenty logged in as:</span>
                    </div>
                    <div style={{display: 'inline-block', width: '200px'}} className='m-card-user'>
                      <div className='m-card-user__pic'>
                        <img src={this.props.user.facebookInfo.profilepic} className='m--img-rounded m--marginless' alt='' />
                      </div>
                      <div className='m-card-user__details'>
                        <span className='m-card-user__name m--font-weight-500'>
                          {this.props.user.facebookInfo.name}
                        </span>
                      </div>
                    </div>
                  </center>
                </div>
                : <div className='m-login__signin'>
                  <div className='m-login__head'>
                    <h3 className='m-login__title'>Facebook Integration</h3>
                  </div>
                  <center>
                    <div>
                      <span>You have not connected any Facebook account. You must connect a Facebook account in order to proceed.</span>
                    </div>
                  </center>
                </div>
              }
              {
                this.props.user && this.props.user.facebookInfo && this.props.user.connectFacebook
                ? <div className='m-stack__item m-stack__item--center' style={{textAlign: 'center', paddingTop: 25}}>
                  <a href='/auth/facebook' style={{borderColor: '#716aca'}} className='btn btn-outline-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                    <span>
                      <i className='la la-refresh' />
                      <span>Re-Connect My Facebook Account</span>
                    </span>
                  </a>
                  <br />
                  <br />
                  <a href='#/' data-toggle="modal" data-target="#disconnect" onClick={this.disconnectFacebook} style={{borderColor: '#f4516c'}} className='btn btn-outline-danger m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                    <span>
                      <i className='la la-unlink' />
                      <span>Disconnect My Facebook Account</span>
                    </span>
                  </a>
                  <br />
                  <br />
                  <a href='#/' onClick={this.updateShowIntegrations} style={{borderColor: '#34bfa3'}} className='btn btn-outline-success m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                    <span>
                      <i className='la la-check' />
                      <span>Continue</span>
                    </span>
                  </a>
                </div>
                : <div className='m-stack__item m-stack__item--center' style={{textAlign: 'center', paddingTop: 25}}>
                  <a href='/auth/facebook' style={{borderColor: '#716aca'}} className='btn btn-outline-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                    <span>
                      <i className='la la-link' />
                      <span>Connect with Facebook</span>
                    </span>
                  </a>
                </div>
              }
            </div>
          </div>
          <div className='m-stack__item m-stack__item--center'>
            {/*
              this.props.location && this.props.location.state && this.props.location.state.account_type === 'team' &&
              <div className='m-login__account'>
                <span className='m-login__account-msg'>You may skip this step and let your team agents connect facebook pages.</span>&nbsp;&nbsp;
                <a onClick={this.skip} className='m-link m-link--focus m-login__account-link m--font-brand' style={{cursor: 'pointer'}}>Skip</a>
              </div>
            */}
          </div>
        </div>
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="disconnect" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
              <div className="modal-content">
                <div style={{ display: 'block' }} className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Disconnet Facebook Account
									</h5>
                  <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">
                      &times;
											</span>
                  </button>
                </div>
                <div style={{color: 'black'}} className="modal-body">
                <p>Are you sure you want to disconnect your Facebook account?</p>
              <button style={{float: 'right'}}
                className='btn btn-primary btn-sm'
                onClick={() => {
                  this.props.disconnectFacebook()
                  this.closeDialog()
                }} data-dismiss='modal'>Yes
              </button>
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
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    updateShowIntegrations,
    disconnectFacebook
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(FacebookIntegration)
