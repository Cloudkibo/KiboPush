/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Alert } from 'react-bs-notifier'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'

class InviteSubscribers extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.getlink = this.getlink.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.state = {
      fblink: '',
      copied: false,
      selectPage: {pageId: -1}
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
    }
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
    document.title = 'KiboPush | Invite Subscribers'
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
        selectPage: {pageId: -1}
      })
    }
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
                <div className='form-group'>
                  <label style={{paddingLeft: '5px'}}><strong>Page:</strong></label>
                  <div style={{padding: '5px'}} className='form-group form-inline'>
                    <select value={this.state.selectPage.pageId} className='input-sm' onChange={this.onChangeValue}>
                      <option value={-1}>--Select Page--</option>
                      {this.props.pages && this.props.pages.map((page, i) => (
                        <option value={page.pageId}>{page.pageName}</option>
                    ))
                    }
                    </select>
                  </div>
                  <br />
                </div>
                { this.props.pages.length === 0 &&
                  <div>
                    <center>
                      <Alert type='info'>
                        It seems you have not connected any Facebook pages yet. To invite subscribers you need to connect one or more Facebook pages first.
                        Click <Link to='/addPages' style={{color: 'blue', cursor: 'pointer'}}> here </Link> to connect pages.
                      </Alert>
                    </center>
                  </div>
                }
                { this.state.selectPage.pageId !== -1 &&
                <div
                  className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12'>
                  Build your audience by sharing a page link on your timeline.
                  This will let your friends know about your facebook page.
                  <br />
                  <a className='btn btn-blue' target='_blank'
                    href={this.getlink()}><i className='fa fa-facebook'
                      style={{marginRight: '10px'}} /><span>Share Page</span></a>
                  <hr />
                  This is a link to your page, use it to invite subscribers
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
              }
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    pages: (state.pagesInfo.pages)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({loadMyPagesList: loadMyPagesList}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InviteSubscribers)
