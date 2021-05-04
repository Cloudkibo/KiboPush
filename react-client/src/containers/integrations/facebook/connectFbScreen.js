/**
 * Created by sojharo on 20/07/2017.
 */
/* eslint-disable no-undef */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Header from './../../wizard/header'

class ConnectFbScreen extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedPlan: null
    }
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Connect Facebook Account`
    /* eslint-disable */
    $('#sidebarDiv').addClass('hideSideBar')
    /* eslint-enable */
    document.getElementsByTagName('body')[0].className = 'm-page--fluid m--skin- m-content--skin-light2 m-footer--push m-aside--offcanvas-default'
  }

  render () {
    return (
      <div>
        <Header showTitle hideMessages hideSettings />
        <div className="m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-grid--tablet-and-mobile m-grid--hor-tablet-and-mobile m-login m-login--1 m-login--singin" style={{ height: 'calc(100vh - 110px)', overflowY: 'scroll', margin: '20px' }}>
          <div className="m-grid__item m-grid__item--fluid m-grid m-grid--center m-grid--hor m-grid__item--order-tablet-and-mobile-1	m-login__content" style={{backgroundImage: 'url(https://cdn.cloudkibo.com/public/assets/app/media/img//bg/bg-4.jpg)'}}>
            <div className="m-grid__item m-grid__item--middle">
              <h3 className="m-login__welcome">
                Configure SMS Channel
              </h3>
              <p className="m-login__msg">
                Get connected with your contacts with a 98%
                <br />
                open rate of sms
              </p>
            </div>
          </div>
          <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
            {
              this.props.user && this.props.user.facebookInfo && this.props.user.connectFacebook ?
                <div>
                  <div className='m-login__head'>
                    <h3 className='m-login__title'>Facebook Integration</h3>
                  </div>
                  <br />
                  <br />
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
                :
                <div>
                  <div className='m-login__head'>
                    <h3 className='m-login__title'>Facebook Integration</h3>
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <center>
                  <a href='/auth/facebook' style={{borderColor: '#716aca'}} className='btn btn-outline-brand m-btn m-btn--custom m-btn--icon m-btn--pill m-btn--air'>
                    <span>
                      <i className='la la-refresh' />
                      <span>Connect My Facebook Account</span>
                    </span>
                  </a>
                  </center>
                </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user: (state.basicInfo.user),
    superUser: (state.basicInfo.superUser),
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ConnectFbScreen)
