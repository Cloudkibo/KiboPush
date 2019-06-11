/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ModalContainer, ModalDialog } from 'react-modal-dialog'
import YouTube from 'react-youtube'
import { fetchWhiteListedDomains } from '../../redux/actions/settings.actions'
import { browserHistory } from 'react-router'
import { loadMyPagesList } from '../../redux/actions/pages.actions'
import CopyToClipboard from 'react-copy-to-clipboard'
import AlertContainer from 'react-alert'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import RenderScript from './renderScript'

class CheckBox extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      pageid: '',
      showVideo: false,
      domains: [],
      selectedDomain: '',
      script: ''
    }

    props.loadMyPagesList()
    props.getFbAppId()

    this.onChangeValue = this.onChangeValue.bind(this)
    this.changeDomain = this.changeDomain.bind(this)
    this.selectPage = this.selectPage.bind(this)
    this.handleFetch = this.handleFetch.bind(this)
    this.goToSettings = this.goToSettings.bind(this)
    this.setScript = this.setScript.bind(this)
  }

  goToSettings () {
    browserHistory.push({
      pathname: '/settings',
      state: {module: 'whitelistDomains'}
    })
  }

  componentWillReceiveProps (nextprops) {
    console.log('nextprops in Checkbox', nextprops)
    if (nextprops.pages && nextprops.pages.length > 0) {
    this.selectPage()
    }
    if (nextprops.pages && nextprops.fbAppId) {
      this.setScript()
    }
  }

  setScript (domain, page) {
    let script = `<!DOCTYPE html>
     <html lang="en">
     <head>
       <title>Hello!</title>
       <meta charset="utf-8">
       <meta http-equiv="X-UA-Compatible" content="IE=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1">
     </head>
     <body>
       <h1>Hi there!</h1>
       <script>

         let user_ref = makeid(16);
         let app_id = ${this.props.fbAppId}
         let page_id = ${page ? page : this.state.pageid}
         let domain_name = ${domain ? domain : this.state.selectedDomain}
         let company_id = ${this.props.user.companyId}
         let user_opted_in = false
         let cart_id

         console.log(user_ref)

         window.fbAsyncInit = function() {
           FB.init({
             appId            : ${this.props.fbAppId},
             autoLogAppEvents : true,
             xfbml            : true,
             version          : 'v3.3'
           });

           FB.Event.subscribe('messenger_checkbox', function(e) {
             console.log("messenger_checkbox event");
             console.log(e);

             if (e.event == 'rendered') {
               console.log("Plugin was rendered");
             } else if (e.event == 'checkbox') {
               var checkboxState = e.state;
               console.log("Checkbox state: " + checkboxState);
               user_opted_in = true
             } else if (e.event == 'not_you') {
               console.log("User clicked 'not you'");
             } else if (e.event == 'hidden') {
               console.log("Plugin was hidden");
             }

           });
         };

         function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
               result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
         }

         var newDiv = document.createElement("div");
         newDiv.setAttribute("class", "fb-messenger-checkbox")
         newDiv.setAttribute("origin", domain_name)
         newDiv.setAttribute("page_id", page_id)
         newDiv.setAttribute("messenger_app_id", app_id)
         newDiv.setAttribute("user_ref", user_ref)
         newDiv.setAttribute("allow_login", "true")
         newDiv.setAttribute("size", "large")
         newDiv.setAttribute("skin", "light")
         newDiv.setAttribute("center_align", "true")
         document.body.insertBefore(newDiv, document.body.lastChild);

         function confirmOptIn() {
           setCartId()
           if (user_opted_in) {
             FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, {
               'app_id':app_id,
               'page_id':page_id,
               'ref':'{cart_id: "'+ cart_id +'", type: "checkbox", industry: "commerce", company_id: "'+ company_id +'"}',
               'user_ref':user_ref
             });
           }
         }

         function setCartId () {
           cart_id = makeid(15)
         }

       </script>
       <script async defer src="https://connect.facebook.net/en_US/sdk.js"></script>
       <input type="button" onclick="confirmOptIn()" value="Confirm Opt-in"/>
     </body>
    </html>
    `
    this.setState({script: script})
  }

  changeDomain (event) {
    this.setState({selectedDomain: event.target.value})
    this.setScript(event.target.value)
  }

  onChangeValue (event) {
    let page
    for (let i = 0; i < this.props.pages.length; i++) {
      if (this.props.pages[i].pageId === event.target.value) {
        page = this.props.pages[i]
        break
      }
    }
    if (page) {
      this.setState({
        pageid: page.pageId,
      })
      this.setScript(null, page.pageId)
      this.props.fetchWhiteListedDomains(page.pageId, this.handleFetch)
    }
  }

  handleFetch (resp) {
    if (resp.status === 'success') {
      this.setState({domains: resp.payload, selectedDomain: resp.payload[0]})
      this.setScript(resp.payload[0])
    }
  }

  selectPage () {
    if (this.props.pages && this.props.pages.length > 0) {
      this.setState({
        pageid: this.props.pages[0].pageId
      })
      this.setScript(null, this.props.pages[0].pageId)
      this.props.fetchWhiteListedDomains(this.props.pages[0].pageId, this.handleFetch)
    }
  }

  componentDidMount () {
    console.log('in componentDidMount')
    const hostname =  window.location.hostname;
    let title = '';
    if(hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage';
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat';
    }

    document.title = `${title} | Checkbox Plugin`;

  }
  render () {
    var alertOptions = {
      offset: 14,
      position: 'bottom right',
      theme: 'dark',
      time: 5000,
      transition: 'scale'
    }
    console.log('selectedDomain', this.state.selectedDomain)
    console.log('pageid', this.state.pageid)
    console.log('this.state.script', this.state.script)
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <AlertContainer ref={a => { this.msg = a }} {...alertOptions} />
        {
          this.state.showVideo &&
          <ModalContainer style={{width: '680px',  top: 100}}
            onClose={() => { this.setState({showVideo: false}) }}>
            <ModalDialog style={{width: '680px',  top: 100}}
              onClose={() => { this.setState({showVideo: false}) }}>
              <div>
                <YouTube
                  videoId='_E6gGHBEaEU'
                  opts={{
                    height: '390',
                    width: '640',
                    playerVars: { // https://developers.google.com/youtube/player_parameters
                      autoplay: 1
                    }
                  }}
                  />
              </div>
            </ModalDialog>
          </ModalContainer>
        }
        <div className='m-content'>
          {this.props.pages && this.props.pages.length === 0 &&
            <div
              className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30'
              role='alert'>
              <div className='m-alert__icon'>
                <i className='flaticon-exclamation m--font-danger' />
              </div>
              <div className='m-alert__text'>
                You do not have any connected pages. Please click
                <Link to='/addpages' style={{color: 'blue', cursor: 'pointer'}}> here </Link> to connect your facebook page.
              </div>
            </div>
          }
          <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
            <div className='m-alert__icon'>
              <i className='flaticon-technology m--font-accent' />
            </div>
            <div className='m-alert__text'>
              Need help in understanding Checkbox? Here is the <a href='https://kibopush.com/checkbox-plugin/' target='_blank'>documentation</a>.
            </div>
          </div>
          <div className='m-portlet m-portlet--mobile'>
            <div className='m-portlet__head'>
              <div className='m-portlet__head-caption'>
                <div className='m-portlet__head-title'>
                  <h3 className='m-portlet__head-text'>
                    Checkbox Plugin
                  </h3>
                </div>
              </div>
            </div>
            <div className='m-portlet__body'>
              <span>This checkbox plugin allows you to display a checkbox in forms on your website that allows users to opt-in to receive messages. Plase copy the code below in your website form to add the checkbox. You might need to make some modifications in the code.</span>
              <br />
              <br />
              <br />
            { this.props.pages && this.props.pages.length > 0 &&
              <div className='row'>
                <div className='col-3'>
                  <label class='control-label' style={{marginTop: '8px'}}>Choose Page:</label>
                </div>
                <div className='col-9'>
                  <select
                    className='custom-select'
                    style={{width: '50%'}}
                    onChange={this.onChangeValue}
                  >
                    { this.props.pages.map((page, i) => (
                      (
                        page.connected &&
                        <option value={page.pageId} key={page.pageId}>{page.pageName}</option>
                      )
                    ))}
                  </select>
                </div>
              </div>
            }
            <br />
              { this.state.domains.length > 0
                ? <div className='row'>
                    <div className='col-3'>
                    <label class='control-label' style={{marginTop: '8px'}}>
                      Choose WhiteListed Domain:
                    </label>
                  </div>
                <div className='col-9'>
                    <select
                      className='custom-select'
                      style={{width: '50%'}}
                      onChange={this.changeDomain}
                    >
                      { this.state.domains.map((domain, i) => (
                        (
                          <option value={domain} key={i}>{domain}</option>
                        )
                      ))}
                    </select>
                  </div>
                </div>
                : <span>You do not have any whitelisted domains for the selected page. Please click
              <Link onClick={this.goToSettings} style={{color: 'blue', cursor: 'pointer'}}> here </Link> to add whitelist domains.</span>
              }
            <br />
            { this.state.pageid !== '' && this.state.selectedDomain !== '' && this.state.selectedDomain !== undefined &&
              <div className='alert alert-success'>
                <h4 className='block'>Code for Checkbox Plugin</h4>
                <br />
                <RenderScript
                  fbAppId={this.props.fbAppId}
                  pageid={this.state.pageid}
                  selectedDomain={this.state.selectedDomain}
                  user={this.props.user} />
                <br />
                <CopyToClipboard text={this.state.script}
                  onCopy={() => {
                    this.msg.success('Code Copied Successfully')
                  }}>
                  <button type='button' className='btn btn-success widgetButton'>
                    Copy Code
                  </button>
                </CopyToClipboard>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
    )
  }
}
function mapStateToProps (state) {
  return {
    pages: (state.pagesInfo.pages),
    user: (state.basicInfo.user),
    fbAppId: state.basicInfo.fbAppId
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    fetchWhiteListedDomains,
    loadMyPagesList,
    getFbAppId
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(CheckBox)
