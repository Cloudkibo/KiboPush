/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import AlertContainer from 'react-alert'

class ChatWidget extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      scriptLine: '<script src=\'https://staging.kibopush.com/scripts/widgetApp.js\'></script>'
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
      <div id='target' className='col-lg-8 col-md-8 col-sm-4 col-xs-12'>
        <div className='m-portlet m-portlet--full-height m-portlet--tabs  '>
          <div className='m-portlet__head'>
            <div className='m-portlet__head-tools'>
              <ul className='nav nav-tabs m-tabs m-tabs-line   m-tabs-line--left m-tabs-line--primary' role='tablist'>
                <li className='nav-item m-tabs__item'>
                  <span className='nav-link m-tabs__link active'>
                    <i className='flaticon-share m--hide' />
                    Add KiboPush Widget
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
                      <img src='https://winnerweb.com.br/assets/images/home/icons/cpanel.png' alt='widget_intro_image' style={{maxWidth: 150, maxHeight: 150, padding: 0, margin: 0}} />
                      <p>{"To embed the widget on your website, you need to put this line before </head> tag or before </body> tag of HTML of your website's each page."}</p>
                      <div className='alert alert-success'>
                        <span>&lt;script src='https://staging.kibopush.com/scripts/widgetApp.js' &gt; &lt;/script&gt;</span>
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
                      <div className='alert alert-success'>
                        <div>
                          <p>{'Then you must add a button on your page with our onclick function. Example of button is given below.'}</p>
                          <div>&lt;button onclick='loadKiboPushWidget()'&gt; Live Help &lt;/button&gt;</div>
                        </div>
                        <div>
                          <CopyToClipboard text={"<button onclick='loadKiboPushWidget()'> Live Help </button>"}
                            onCopy={() => this.setState({copied: true})}>
                            <button type='button' className='btn btn-success widgetButton'>
                              Copy Code
                            </button>
                          </CopyToClipboard>
                        </div>
                      </div>
                      <p className='uk-align-center' style={{fontSize: 15}}>Note: You can use any css desgin for the button. You can also use &lt;a&gt; tag if you don't want button.
                      Just remember to do the function call as shown above.<br />The&nbsp;<b>onclick='loadKiboPushWidget() &nbsp;</b>contains your unique client id. Never alter this function and its value.</p>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default ChatWidget
