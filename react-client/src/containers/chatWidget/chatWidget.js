/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CopyToClipboard from 'react-copy-to-clipboard'

class ChatWidget extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      scriptLine: '<script type="text/javascript">\n window.__kibo_company_id = "5b59739612fa1c04af1f96be";\n document.addEventListener("DOMContentLoaded", function() {\n  var wa = document.createElement("script");\n  wa.type = "text/javascript";\n  wa.async = true;\n  wa.src ="http://cdn.cloudkibo.com/public/scripts/widgetAppSrc.js";\n  var s = document.getElementsByTagName("script")[0];\n  s.parentNode.insertBefore(wa, s);\n });\n</script>'
    }
    this.save = this.save.bind(this)
    this.goToWhitelistDomain = this.goToWhitelistDomain.bind(this)
  }

  goToWhitelistDomain () {
    this.props.history.push({
      pathname: `/settings`,
      state: {module: 'whitelistDomains'}
    })
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
  UNSAFE_componentWillReceiveProps (nextProps) {
  }
  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__head'>
                  <div className='m-portlet__head-caption'>
                    <div className='m-portlet__head-title'>
                      <h3 className='m-portlet__head-text'>
                        KiboPush Widget
                      </h3>
                    </div>
                  </div>
                </div>
                <div className='m-portlet__body'>
                  <div className='form-row' style={{display: 'block'}}>
                    <div className='form-group m-form__group col-md-12 col-sm-12 col-lg-12'>
                      <p>KiboPush widget is basically a wrapper around the Messenger Chat Plugin. It will enhance the Chat Plugin to extract additional information like IP, country and current page (the page the visitor is currently on) of the visitor of your website. </p>
                      <p>Please follow the steps below to embed this widget on your website.</p>
                    </div>
                    <div className='form-group m-form__group col-md-12 col-sm-12 col-lg-12'>
                      <h5>Step 1 -> Whitelist Domain:</h5>
                      <p>You need to whitelist your website URL on your Facebook Page to display the plugin. Please click <a href='#/' style={{color: '#5867dd', cursor: 'pointer'}} onClick={this.goToWhitelistDomain}> here </a>to whitelist your domain</p>
                    </div>
                    <div className='form-group m-form__group col-md-12 col-sm-12 col-lg-12'>
                      <h5>Step 2 -> Embed Messenger Plugin:</h5>
                      <p>Please follow the guide <a href='https://developers.facebook.com/docs/messenger-platform/discovery/customer-chat-plugin/' target='_blank' rel='noopener noreferrer'> here </a>to embed Messenger Plugin.</p>
                    </div>
                    <div className='form-group m-form__group col-md-12 col-sm-12 col-lg-12'>
                      <h5>Step 3 -> Add KiboPush Code:</h5>
                      <p>Copy the code below and paste it before the {'</body>'} tag of every page of your website.</p>
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
                          <span>{'wa.src ="http://cdn.cloudkibo.com/public/scripts/widgetAppSrc.js";'}</span>
                          <br />
                          <span>{'var s = document.getElementsByTagName("script")[0];'}</span>
                          <br />
                          <span>{'s.parentNode.insertBefore(wa, s);'}</span>
                          <br />
                          <span>{'});'}</span>
                          <br />
                          <span>{'</script>'}</span>
                          <br /><br />
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
