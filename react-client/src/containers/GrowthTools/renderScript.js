/* eslint-disable no-useless-constructor */
import React from 'react'

class RenderScript extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      openBracket: '{',
      closeBracket: '}',
      forLoop: 'for ( var i = 0; i < length; i++ )'
    }
  }
  render () {
    return (
      <div className='tab-pane active m-scrollable' role='tabpanel'>
        <div className='m-messenger m-messenger--message-arrow m-messenger--skin-light'>
          <div style={{height: '550px', position: 'relative', overflow: 'visible', touchAction: 'pinch-zoom'}} className='m-messenger__messages'>
            <div style={{position: 'relative', overflowY: 'scroll', height: '100%', maxWidth: '100%', maxHeight: 'none', outline: 0, direction: 'ltr'}}>
              <div style={{position: 'relative', top: 0, left: 0, overflow: 'hidden', width: 'auto', height: 'auto'}} >
                <pre style={{background: 'white', padding: '10px'}}>
                  <code style={{background: 'white'}}>
                  &lt;!DOCTYPE html&gt;<br />
                  &lt;html lang="en"&gt;<br />
                  &ensp;&lt;head&gt;<br />
                  &ensp;&ensp;&lt;title&gt;Hello!&lt;/title&gt;<br />
                  &ensp;&ensp;&lt;meta charset="utf-8"&gt;<br />
                  &ensp;&ensp;&lt;meta http-equiv="X-UA-Compatible" content="IE=edge"&gt;<br />
                  &ensp;&ensp;&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;<br />
                  &ensp;&lt;/head&gt;<br />
                  &ensp;&lt;body&gt;<br />
                  &ensp;&ensp;&lt;h1&gt;Hi there!&lt;/h1&gt;<br />
                  &ensp;&ensp;&lt;script&gt;<br />
                  &ensp;&ensp;&ensp;let user_ref = makeid(16);<br />
                  &ensp;&ensp;&ensp;let app_id = {this.props.fbAppId}<br />
                &ensp;&ensp;&ensp;let page_id = {this.props.pageid}<br />
              &ensp;&ensp;&ensp;let domain_name = {this.props.selectedDomain}<br />
                  &ensp;&ensp;&ensp;let company_id = {this.props.user.companyId}<br />
                  &ensp;&ensp;&ensp;let user_opted_in = false<br />
                  &ensp;&ensp;&ensp;let cart_id<br /><br />

                  &ensp;&ensp;&ensp;console.log(user_ref)<br /><br />

                  &ensp;&ensp;&ensp;window.fbAsyncInit = function() {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;FB.init({this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;appId            : {this.props.fbAppId},<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;autoLogAppEvents : true,<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;xfbml            : true,<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;version          : 'v3.3'<br />
                  &ensp;&ensp;&ensp;&ensp;{this.state.closeBracket});<br /><br />

                  &ensp;&ensp;&ensp;&ensp;FB.Event.subscribe('messenger_checkbox', function(e) {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;ensp;console.log("messenger_checkbox event");<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;console.log(e);<br /><br />

                  &ensp;&ensp;&ensp;&ensp;&ensp;if (e.event == 'rendered') {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;console.log("Plugin was rendered");<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket} else if (e.event == 'checkbox') {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;var checkboxState = e.state;<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;console.log("Checkbox state: " + checkboxState);<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;user_opted_in = true<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket} else if (e.event == 'not_you') {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;console.log("User clicked 'not you'");<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket} else if (e.event == 'hidden') {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;console.log("Plugin was hidden");<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket}<br /><br />

                  &ensp;&ensp;&ensp;&ensp;&ensp;function makeid(length) {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;var result           = '';<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;var charactersLength = characters.length;<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{this.state.forLoop} {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;result += characters.charAt(Math.floor(Math.random() * charactersLength));<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;return result;<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket}<br /><br />

                  &ensp;&ensp;&ensp;&ensp;&ensp;var newDiv = document.createElement("div");<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;newDiv.setAttribute("class", "fb-messenger-checkbox")<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;newDiv.setAttribute("origin", domain_name)<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;newDiv.setAttribute("page_id", page_id)<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;newDiv.setAttribute("messenger_app_id", app_id)<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;newDiv.setAttribute("user_ref", user_ref)<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;newDiv.setAttribute("allow_login", "true")<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;newDiv.setAttribute("size", "large")<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;newDiv.setAttribute("skin", "light")<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;newDiv.setAttribute("center_align", "true")<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;document.body.insertBefore(newDiv, document.body.lastChild);<br /><br />

                  &ensp;&ensp;&ensp;&ensp;&ensp;function confirmOptIn() {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;setCartId()<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;if (user_opted_in) {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;'app_id':app_id,<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;'page_id':page_id,<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;'ref':'{this.state.openBracket}cart_id: "'+ cart_id +'", type: "checkbox", industry: "commerce", company_id: "'+ company_id +'"{this.state.closeBracket}',<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;'user_ref':user_ref<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket});<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket}<br /><br />

                  &ensp;&ensp;&ensp;&ensp;&ensp;function setCartId () {this.state.openBracket}<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;cart_id = makeid(15)<br />
                  &ensp;&ensp;&ensp;&ensp;&ensp;{this.state.closeBracket}<br /><br />

                  &ensp;&ensp;&lt;/script&gt;
                  &ensp;&ensp;&lt;script async defer src="https://connect.facebook.net/en_US/sdk.js"&gt;&lt;/script&gt;
                  &ensp;&ensp;&lt;input type="button" onclick="confirmOptIn()" value="Confirm Opt-in"/&gt;
                  &ensp;&lt;/body&gt;
                  &lt;/html&gt;
                </code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default RenderScript
