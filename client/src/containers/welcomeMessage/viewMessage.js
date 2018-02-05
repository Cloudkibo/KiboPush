import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Header from '../../components/header/header'
import ViewMessage from '../../components/ViewMessage/viewMessage'
import { Link } from 'react-router'

class ViewWelcomeMessage extends React.Component {
  componentDidMount () {
    require('../../../public/js/jquery-3.2.0.min.js')
    require('../../../public/js/jquery.min.js')
    var addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/theme-plugins.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/material.min.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', '../../../js/main.js')
    document.body.appendChild(addScript)
    addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://unpkg.com/react-select/dist/react-select.js')
    document.body.appendChild(addScript)
  }

  render () {
    console.log('View Welcome Message', this.props.location.state)
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-6'>
                  <h3>View Welcome Message</h3>
                  <p>Page: {this.props.location.state.page.pageName}</p>
                  <Link to='/welcomeMessage' style={{float: 'left', lineHeight: 2.5}} className='btn btn-secondary btn-sm'> Back </Link>
                </div>
                <div className='col-xl-6'>
                  <ViewMessage payload={this.props.location.state.page.welcomeMessage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ViewWelcomeMessage
