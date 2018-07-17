import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Header from './components/header/header'
import Sidebar from './components/sidebar/sidebar'
import auth from './utility/auth.service'

class App extends Component {
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
