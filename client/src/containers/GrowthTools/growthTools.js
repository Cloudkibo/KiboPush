import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { Link } from 'react-router'

class GrowthTools extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      toolsData: [],
      totalLength: 0
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps is called')
  }

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
  }

  render () {
    return (
      <div>
        <Header />
        <HeaderResponsive />
        <Sidebar />
        <Responsive />
        <div className='container'>
          <br /><br /><br /><br /><br /><br />
          <h3>Growth Tools</h3>
          <div className='row'>
            <div
              className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 card-outer'>
              <div className='card'>
                <img className='img-card' src='img/customer_matching.jpg' alt='Card image cap' />
                <div className='col-md-6 col-sm-6 col-xs-6 card-body'>
                  <h4>Customer Matching Using Phone Numbers</h4>
                  <p>Upload your csv file containing your customers phone numbers to invite them for a chat on Messenger</p>
                  <Link to={`/customerMatchingUsingPhNum`} className='btn btn-primary'>
                    Open
                  </Link>
                </div>
              </div>
            </div>
            <div
              className='col-xl-6 col-lg-6 col-md-6 col-sm-6 col-xs-6 card-outer'>
              <div className='card'>
                <img className='img-card' src='img/facebook-messenger.png' alt='Card image cap' />
                <div className='col-md-6 col-sm-6 col-xs-6 card-body'>
                  <h4>Subscribe to Messenger</h4>
                  <p>Send messages and broadcasts to your followers by inviting them to your messenger</p>
                  <Link to={`/subscribeToMessenger`} className='btn btn-primary'>
                    Open
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GrowthTools
