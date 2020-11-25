import React, { Component } from 'react';
import auth from './utility/auth.service'
import SubApp from './sub.app'
import Routes from './routes'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    if (!auth.loggedIn()) {
      let interval = setInterval(() => {
        if (auth.getToken()) {
          window.location.reload()
          clearInterval(interval)
        }
      }, 1000)
    }
  }

  showLoader () {
    return (
      <>
        <header id='headerDiv' className='m-grid__item m-header ' data-minimize-offset='200' data-minimize-mobile-offset='200' >
          <div className='m-container m-container--fluid m-container--full-height'>
            <div className='m-stack m-stack--ver m-stack--desktop'>
              <div className='m-stack__item m-brand m-brand--skin-dark'>
                <div className='m-stack m-stack--ver m-stack--general'>
                  <div className='m-stack__item m-stack__item--middle m-brand__logo'>
                    <h4 style={{color: 'white'}} className='m-brand__logo-wrapper'>
                      KIBOPUSH
                    </h4>
                  </div>
                  <div className='m-stack__item m-stack__item--middle m-brand__tools'>
                    <span id='m_aside_left_minimize_toggle' className='m-brand__icon m-brand__toggler m-brand__toggler--left m--visible-desktop-inline-block'>
                      <span />
                    </span>
                  </div>
                </div>
              </div>
              <div className='m-stack__item m-stack__item--fluid m-header-head' id='m_header_nav' />
            </div>
          </div>
        </header>
        <button className='m-aside-left-close  m-aside-left-close--skin-dark ' id='m_aside_left_close_btn'>
          <i className='la la-close' />
        </button>
        <div id='m_aside_left' className='m-grid__item m-aside-left  m-aside-left--skin-dark'>
          <div
            id='m_ver_menu'
            className='m-aside-menu  m-aside-menu--skin-dark m-aside-menu--submenu-skin-dark m-scroller mCustomScrollbar _mCS_2 mCS-autoHide'
            data-menu-vertical='1'
            data-menu-scrollable='1'
          />
        </div>
        <div style={{position: 'fixed', top: '50%', left: '60%', transform: 'translate(-50%, -50%)'}}>
          <div className="m-spinner m-spinner--brand m-spinner--lg" />
        </div>
      </>
    )
  }

  render () {
    if (auth.loggedIn) {
      return (
        <SubApp history={this.props.history}>
          <Routes />
        </SubApp>
      )
    } else {
      return this.showLoader()
    }
  }
}

export default App
