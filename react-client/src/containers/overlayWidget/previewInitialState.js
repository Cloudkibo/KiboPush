/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { updateWidget } from '../../redux/actions/overlayWidgets.actions'
var MessengerPlugin = require('react-messenger-plugin').default

class PreviewInitialState extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      backgroundImage: 'https://kibopush.com/wp-content/uploads/2020/01/preview_background.jpg',
      loadScript: true
    }
    this.handleHeadlineChange = this.handleHeadlineChange.bind(this)
    this.loadsdk = this.loadsdk.bind(this)
    this.changeButtonText = this.changeButtonText.bind(this)
    props.getFbAppId()
  }
  handleHeadlineChange (e) {
    this.props.updateWidget(this.props.currentWidget, 'initialState', 'headline', e.target.value)
  }
  changeButtonText (e) {
    this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_text', e.target.value)
  }
  loadsdk (fbAppId) {
    console.log('inside loadsdk', fbAppId)
    window.fbAsyncInit = function () {
      FB.init({
        appId: fbAppId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v3.2'
      })
    };
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) { return }
      js = d.createElement(s); js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))
    this.setState({loadScript: false})
    if (window.FB) {
      console.log('inside window.fb')
      window.FB.XFBML.parse()
    }
  }
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.fbAppId && this.state.loadScript) {
      this.loadsdk(nextProps.fbAppId)
    }
  }

  render () {
    return (
      <div style={{ width:'100%', height: '100%', top: '0px', left: '0px',borderLeft: '0.07rem solid #EBEDF2', backgroundSize: 'cover', backgroundImage: 'url(' + this.state.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}} >
        <div style={{ width: '100%', height: '30%', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', textAlign: 'center', background: this.props.currentWidget.initialState.background_color}}> 
        <textarea value={this.props.currentWidget.initialState.headline} rows='2' style={{fontWeight: '600', fontSize: 'large', textAlign: 'center', height: 'auto', width: '350px', margin: '10px', background: this.props.currentWidget.initialState.background_color, color: this.props.currentWidget.initialState ? this.props.currentWidget.initialState.headline_color : '#000'}} maxLength='100' onChange={this.handleHeadlineChange} />
        {
          this.props.currentWidget.initialState.button_type ==='send_to_messenger' && this.props.fbAppId &&
          <center style={{marginLeft: '90px'}}>
            <MessengerPlugin
              appId={this.props.fbAppId}
              pageId={JSON.stringify(this.props.currentWidget.page.pageId)}
              size='large'
              color={this.props.currentWidget.initialState.button_background}
            />
          </center>
        }
        {
           this.props.currentWidget.initialState.button_type ==='with_checkbox' && 
           <div className='btn' style={{backgroundColor: `${this.props.currentWidget.initialState.button_background}`}}>
             <textarea style={{width: '180px', textAlign: 'center',height: '32px', 'background': `${this.props.currentWidget.initialState.button_background}`, 'color': `${this.props.currentWidget.initialState.button_text_color}`}} value={this.props.currentWidget.initialState.button_text} maxLength='25' onChange={this.changeButtonText} />
           </div>
        }
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fbAppId: state.basicInfo.fbAppId,
    currentWidget: state.overlayWidgetsInfo.currentWidget
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    getFbAppId: getFbAppId,
    updateWidget: updateWidget
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(PreviewInitialState)
