import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from './components/header/header'
import Sidebar from './components/sidebar/sidebar'
import auth from './utility/auth.service'
import { browserHistory } from 'react-router'
import $ from 'jquery'

class App extends Component {
  componentDidMount () {
    this.unlisten = browserHistory.listen(location => {
      if (!this.isWizardOrLogin(location.pathname)) {
        /* eslint-disable */
        if ($('#sidebarDiv')) {
          $('#sidebarDiv').removeClass('hideSideBar')
        }
        if ($('#headerDiv')) {
          $('#headerDiv').removeClass('hideHeader')
        }
        /* eslint-enable */
      }
    })
  }
  componentWillUnmount () {
    this.unlisten()
  }

  isWizardOrLogin (path) {
    if (path === '/addPageWizard' || path === '/inviteUsingLinkWizard' || path === '/greetingTextWizard' ||
        path === '/welcomeMessageWizard' || path === '/autopostingWizard' || path === '/menuWizard' ||
        path === '/responseMethods' || path === '/paymentMethodsWizard' || path === '/finish' ||
        path === '/resendVerificationEmail' || path === '/connectFb') {
      return true
    }
    return false
  }
  render () {
    return (
      <div>
        { auth.loggedIn()
           ? <div>
             <Header />
             <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
               <Sidebar />
               { this.props.children }
             </div>
           </div>
           : <div>
             { this.props.children }
           </div>
        }
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
}

export default connect()(App)
