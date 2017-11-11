/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import {
  addPages,
  enablePage,
  removePageInAddPage
} from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import { Alert } from 'react-bs-notifier'

class AddPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {counter: 0,
      showAlert: false,
      alertmsg: '',
      timeout: 2000}
  }

  componentWillMount () {
    this.props.addPages()
  }

  gotoView () {
    this.props.history.push({
      pathname: `/pages`

    })
    // browserHistory.push(`/pollResult/${poll._id}`)
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
    document.title = 'KiboPush | Add Pages'
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.otherPages && nextprops.otherPages.length <= 0 &&
      this.state.counter < 2) {
      console.log('calling addPages')
      this.props.addPages()
      this.setState({counter: this.state.counter + 1})
    }
    if (nextprops.page_connected && nextprops.page_connected !== '') {
      this.setState({showAlert: true, alertmsg: nextprops.page_connected})
    } else {
      this.setState({showAlert: false, alertmsg: ''})
    }
  }
  onDismissAlert () {
    this.setState({showAlert: false, alertmsg: ''})
  }
  render () {
    return (
      <div>
        <Header />
        <div className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Manage Pages</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div className='row'>
                <div className='col-xl-12'>
                  <div className='m-portlet m-portlet--full-height '>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                                Add Pages
                              </h3>
                        </div>
                      </div>
                      <div className='m-portlet__head-tools'>
                        <ul className='nav nav-pills nav-pills--brand m-nav-pills--align-right m-nav-pills--btn-pill m-nav-pills--btn-sm' role='tablist'>
                          <li className='nav-item m-tabs__item'>
                            <Link to='/pages' className='nav-link m-tabs__link active' data-toggle='tab' role='tab'>
                                  View Connected Pages
                                </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className='m-portlet__body'>
                      <div className='m-widget4'>
                       {
                (this.props.otherPages) &&
                this.props.otherPages.map((page, i) => (

                  <div className='m-widget4__item'>
                          <div className='m-widget4__img m-widget4__img--icon'>
                            <img src={page.pagePic} width={60} height={60} className='m--img-rounded m--marginless m--img-centered' alt='' />
                          </div>
                          <div className='m-widget4__info'>
                            <span className='m-widget4__text'>
                                {page.pageName}
                                </span>
                          </div>
                          <div className='m-widget4__ext'>
                          {(page.connected) &&
                            
                            <a href='#' onClick={() => this.props.removePageInAddPage(page)} className='m-widget4__icon'>
                              <button type='button' className='btn m-btn--pill btn-danger btn-sm m-btn m-btn--custom'>Disconnect</button>
                            </a>
                            }
                            {(!page.connected) &&

                            <a href='#'  onClick={() => this.props.enablePage(page)} className='m-widget4__icon'>
                              <button type='button' className='btn m-btn--pill btn-primary btn-sm m-btn m-btn--custom'>Connect</button>
                            </a>
                  
                            }
                            
                          </div>
                        </div>
                ))
              }

                        
                       
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*
             <div className='container'>
            <br /><br /><br /><br /><br /><br />
            <div className='row'>
              <main
                className='col-xl-6 push-xl-3 col-lg-12 push-lg-0 col-md-12 col-sm-12 col-xs-12'>
                <h3>Add Pages</h3>
                {this.state.showAlert === true &&
                <center>
                  <Alert type='danger' timeout={this.state.timeout}
                    onDismiss={this.onDismissAlert.bind(this)}>
                    {this.state.alertmsg}
                  </Alert>
                </center>

                    }
                {
                (this.props.otherPages) &&
                this.props.otherPages.map((page, i) => (
                  <div className='ui-block'>
                    <div className='birthday-item inline-items'>

                      <div className='birthday-author-name'>
                        <a href='#'
                          className='h6 author-name'>{page.pageName} </a>

                      </div>
                      {(page.connected) &&
                      <button onClick={() => this.props.removePageInAddPage(page)}
                        className='btn btn-sm bg-blue'>Disconnect
                      </button>
                      }
                      {(!page.connected) &&
                      <button onClick={() => this.props.enablePage(page)}
                        className='btn btn-sm bg-blue'>Connect
                      </button>
                      }
                    </div>
                  </div>
                ))
              }
                <button onClick={() => this.gotoView()}
                  className='btn btn-sm bg-blue'>Done
              </button>
              </main>

            </div>
          </div>
          */}

        </div>
      </div>

    )
  }
}

function mapStateToProps (state) {
  console.log(state)
  return {
    otherPages: (state.pagesInfo.otherPages),
    page_connected: (state.pagesInfo.page_connected)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    enablePage: enablePage,
    removePageInAddPage: removePageInAddPage,
    addPages: addPages
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(AddPage)
