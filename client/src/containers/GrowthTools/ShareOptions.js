/**
 * Created by sojharo on 13/11/2017.
 */
/* eslint-disable no-undef */

import React from 'react'
import Sidebar from '../../components/sidebar/sidebar'
import Responsive from '../../components/sidebar/responsive'
import Header from '../../components/header/header'
import HeaderResponsive from '../../components/header/headerResponsive'
import { connect } from 'react-redux'
import {
  loadMyPagesList

} from '../../redux/actions/pages.actions'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import CopyToClipboard from 'react-copy-to-clipboard'

class ShareOptions extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.onChange = this.onChange.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.onChangeValue = this.onChangeValue.bind(this)
    this.props.loadMyPagesList()
    this.state = {
      'pageid': '',
      'showbutton': true,
      'fblink': 'https://m.me/',
      'copied': false,
      'showCopyLink': true
    }
  }

  componentWillReceiveProps (nextprops) {
    if (nextprops.pages && nextprops.pages.length > 0) {
      if (nextprops.pages[0].pageUserName) {
        this.setState({
          'pageid': nextprops.pages[0].pageId,
          'fblink': 'https://m.me/' + nextprops.pages[0].pageUserName
        })
      } else {
        this.setState({
          'pageid': nextprops.pages[0].pageId,
          'fblink': 'https://m.me/' + nextprops.pages[0].pageId
        })
      }
    } else if (nextprops.pages && nextprops.pages.length === 0) {
      // user has no connected pages
      this.setState({
        'showbutton': false

      })
    }
  }

  onChangeValue (event) {
    let page
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageId === event.target.value) {
        page = this.props.pages[i]
        break
      }
    }
    if (page.pageUserName) {
      this.setState({
        'pageid': page.pageId,
        'fblink': 'https://m.me/' + page.pageUserName
      })
    } else {
      this.setState({
        'pageid': page.pageId,
        'fblink': 'https://m.me/' + page.pageId
      })
    }
  }

  onChange (event) {
    this.setState({})
  }

  handleChange (e) {
    this.setState({})
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
    document.title = 'KiboPush | Subscribe to Messenger'
  }

  render () {
    return (
      <div>
        <Header />
        <div
          className='m-grid__item m-grid__item--fluid m-grid m-grid--ver-desktop m-grid--desktop m-body'>
          <Sidebar />
          <div className='m-grid__item m-grid__item--fluid m-wrapper'>
            <div className='m-subheader '>
              <div className='d-flex align-items-center'>
                <div className='mr-auto'>
                  <h3 className='m-subheader__title'>Share</h3>
                </div>
              </div>
            </div>
            <div className='m-content'>
              <div
                className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
                role='alert'>
                <div className='m-alert__icon'>
                  <i className='flaticon-exclamation m--font-brand' />
                </div>
                <div className='m-alert__text'>
                  Share your messenger and page link with customers
                </div>
              </div>
              <div className='row'>
                <div
                  className='col-xl-12 col-lg-12  col-md-12 col-sm-12 col-xs-12'>
                  <div className='m-portlet m-portlet--mobile'>
                    <div className='m-portlet__head'>
                      <div className='m-portlet__head-caption'>
                        <div className='m-portlet__head-title'>
                          <h3 className='m-portlet__head-text'>
                            Copy the Page Messenger link
                          </h3>
                        </div>
                      </div>
                    </div>
                    {
                      this.state.showbutton === true
                        ? <div className='m-portlet__body'>
                          { this.props.pages &&
                          <div className='form-group m-form__group row'>
                            <label className='col-form-label col-lg-3 col-sm-12'>
                            Choose Page
                          </label>
                            <div className='col-lg-4 col-md-9 col-sm-12'>
                              <select
                                className='custom-select'
                                onChange={this.onChangeValue}>
                                { this.props.pages.map((page, i) => (
                                (
                                  page.connected &&
                                  <option
                                    value={page.pageId}>{page.pageName}</option>
                                )
                              ))
                              }
                              </select>
                            </div>
                          </div>
                        }
                          <p>This is a link to your page, you can send it to your
                          friends
                        </p>
                          <div className='form-group m-form__group row'>
                            <label className='col-form-label col-lg-3 col-sm-12'>
                            Link
                          </label>
                            <input className='form-control m-input'
                              value={this.state.fblink} />
                          </div>
                          <div className='form-group m-form__group row'>
                            <CopyToClipboard text={this.state.fblink}
                              onCopy={() => this.setState(
                                             {copied: true})}>
                              { this.state.disabled === true
                              ? <button disabled onClick={() => {
                                this.setState({copied: true})
                              }}
                                className='btn btn-primary'
                                style={{margin: 5}}>Copy
                              </button>
                              : <button onClick={() => {
                                this.setState({copied: true})
                              }}
                                className='btn btn-primary'
                                style={{margin: 5}}>Copy
                              </button>
                            }
                            </CopyToClipboard>
                          </div>
                          <div className='form-group m-form__group row'>
                            { this.state.copied &&
                            <div className='alert m-alert--default' role='alert'>
                              Copied to Clipboard
                            </div>
                          }
                          </div>
                        </div>
                        : <div className='m-portlet__body'>
                          <div className='alert m-alert--default'
                            style={{marginTop: '150px'}}>
                          You don't have any connected pages. Please connect
                          pages
                          first.
                          <Link to='/addpages' className='btn btn-sm btn-blue'>
                            Add Pages</Link>
                          </div>
                        </div>
                    }
                  </div>
                </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(
  ShareOptions)
