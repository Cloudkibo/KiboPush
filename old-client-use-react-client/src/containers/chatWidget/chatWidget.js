/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CopyToClipboard from 'react-copy-to-clipboard'
import AlertContainer from 'react-alert'

class ChatWidget extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      scriptLine: '<script type="text/javascript">\n window.__kibo_company_id = "5b59739612fa1c04af1f96be";\n document.addEventListener("DOMContentLoaded", function() {\n  var wa = document.createElement("script");\n  wa.type = "text/javascript";\n  wa.async = true;\n  wa.src ="https://cdn.cloudkibo.com/public/scripts/widgetAppSrc.js";\n  var s = document.getElementsByTagName("script")[0];\n  s.parentNode.insertBefore(wa, s);\n });\n</script>'
    }
    this.save = this.save.bind(this)
  }
  save (event) {
    event.preventDefault()
    if (this.state.ismatch) {
      this.props.changePass({old_password: this.refs.current.value, new_password: this.refs.new.value}, this.msg)
    }
  }

  componentDidMount () {
    document.title = 'KiboPush | api_settings'
  }
  componentWillReceiveProps (nextProps) {
  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-tools'>
                <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                  <li className='nav-item m-tabs__item'>
                    <span className='nav-link m-tabs__link active'>
                      <i className='flaticon-share m--hide' />
                    How to add KiboPush widget?
                  </span>
                  </li>
                </ul>
            </div>
          </div>
          <div className='tab-content'>
            <div className='tab-pane active' id='m_user_profile_tab_1'>
              <form className='m-form m-form--fit m-form--label-align-right'>
                <div className='m-portlet__body'>
                  <div className='form-group m-form__group row'>
                    <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
                    <div className='uk-text-center' style={{color: 'black'}}>
                      <h6>Prerequisite:</h6>
                      <p>
                        You should embed messenger chat plugin on your webiste. If not, please follow
                        <a href='https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/' target='_blank'> this guide</a>
                        &nbsp;to embed it.
                      </p>
                      <h6>Script Code:</h6>
                      <p>
                        {
                          'Once you have embedded messenger chat plugin on you website, copy this script code and paste it before the </body> tag of every page of your website.'
                        }
                      </p>
                      <div className='alert alert-success'>
                        <span>{'<script type="text/javascript">'}</span>
                        <br />
                        <span>{`window.__kibo_company_id = "${this.props.user.companyId}";`}</span>
                        <br />
                        <span>{'document.addEventListener("DOMContentLoaded", function() {'}</span>
                        <br />
                        <span>{'var wa = document.createElement("script");'}</span>
                        <br />
                        <span>{'wa.type = "text/javascript";'}</span>
                        <br />
                        <span>{'wa.async = true;'}</span>
                        <br />
                        <span>{'wa.src ="https://cdn.cloudkibo.com/public/scripts/widgetAppSrc.js";'}</span>
                        <br />
                        <span>{'var s = document.getElementsByTagName("script")[0];'}</span>
                        <br />
                        <span>{'s.parentNode.insertBefore(wa, s);'}</span>
                        <br />
                        <span>{'});'}</span>
                        <br />
                        <span>{'</script>'}</span>
                        <div>
                          <CopyToClipboard text={this.state.scriptLine}
                            onCopy={() => {
                              this.msg.success('Code Copied Successfully')
                            }}>
                            <button type='button' className='btn btn-success widgetButton'>
                              Copy Code
                            </button>
                          </CopyToClipboard>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
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
    user: (state.basicInfo.user)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatWidget)
