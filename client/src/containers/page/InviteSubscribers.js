/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Alert } from 'react-bs-notifier'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import CopyToClipboard from 'react-copy-to-clipboard'

class InviteSubscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.getlink = this.getlink.bind(this)
    this.state = {
      fblink: `https://m.me/${props.location.state.pageId}`,
      copied: false
    }
  }

  getlink () {
    let linkurl = 'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fweb.facebook.com%2F' +
      this.props.location.state.pageName + '-' +
      this.props.location.state.pageId + '%2F&amp;src=sdkpreparse'
    return linkurl
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
          <br />
          <br />
          <br />
          <div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
            <h2 className='presentation-margin'>Invite Your Subscribers</h2>

            <div className='ui-block'>
              <div className='news-feed-form'>
                <div
                  className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                  Build your audience by sharing a page link on your timeline.
                  This will let your friends know about your facebook page.
                  <br />
                  <a className='btn btn-blue' target='_blank'
                    href={this.getlink()}><i className='fa fa-facebook'
                      style={{marginRight: '10px'}} /><span>Share Page</span></a>
                  <hr />
                  This is a link to your page, you can send it to your friends
                  <br />

                  <input value={this.state.fblink} />

                  <CopyToClipboard text={this.state.fblink}
                    onCopy={() => this.setState({copied: true})}>
                    <button onClick={() => { this.setState({copied: true}) }}
                      className='uk-button uk-button-small uk-button-primary'
                      style={{margin: 5}}>Copy
                    </button>
                  </CopyToClipboard>
                  {this.state.copied &&
                  <center>
                    <Alert type='success'>
                      Copied!
                    </Alert>
                  </center>
                  }
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

export default (InviteSubscribers)
