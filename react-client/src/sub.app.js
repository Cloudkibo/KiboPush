import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import Header from './components/header/header'
import SimpleHeader from './containers/wizard/header'
import Sidebar from './components/sidebar/sidebar'
import auth from './utility/auth.service'
import $ from 'jquery'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      path: '/',
      showContent: (auth.getToken() !== undefined && auth.getToken() !== '')
    }
  }

  componentDidMount () {
    this.props.history.push({
      pathname: '/',
      state: {obj: {_id: 1}}
    })
    console.log('browser history', this.props.history)
    this.unlisten = this.props.history.listen(location => {
      this.setState({path: location.pathname})
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
    if (!this.state.showContent) {
      let interval = setInterval(() => {
        if (auth.getToken() !== undefined && auth.getToken() !== '') {
          window.location.reload()
          clearInterval(interval)
        }
      }, 1000)
    }
  }
  UNSAFE_componentWillUnmount () {
    this.unlisten()
  }

  isWizardOrLogin (path) {
    if (path === '/addPageWizard' || path === '/inviteUsingLinkWizard' || path === '/greetingTextWizard' ||
        path === '/welcomeMessageWizard' || path === '/autopostingWizard' || path === '/menuWizard' ||
        path === '/responseMethods' || path === '/paymentMethodsWizard' || path === '/finish' ||
        path === '/resendVerificationEmail' || path === '/connectFb' || path === '/addfbpages') {
      return true
    }
    return false
  }
  render () {
    console.log("Public URL ", process.env.PUBLIC_URL)
    console.log('auth.getToken', auth.getToken())
    console.log('browser history', this.props.history)
    return (
      <div>
        {
          auth.loggedIn() && ['/addfbpages', '/facebookIntegration', '/integrations'].indexOf(this.state.path) === -1
           ? <div>
             <Header />
             {
               this.state.showContent &&
               <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
                 <Sidebar />
                 { this.props.children }
               </div>
             }
           </div>
           : ['/addfbpages', '/facebookIntegration', '/integrations'].indexOf(this.state.path) > -1
           ? <div>
             <SimpleHeader />
             {
               this.state.showContent &&
               <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
                 { this.props.children }
               </div>
             }
           </div>
           : (
             this.state.showContent &&
             <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
               { this.props.children }
             </div>
           )
        }
      </div>
    )
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired
}

export default connect()(App)
