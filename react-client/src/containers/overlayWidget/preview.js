/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ViewMessage from '../../components/ViewMessage/viewMessage'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
var MessengerPlugin = require('react-messenger-plugin').default

class Preview extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      backgroundImage: '',
      loadScript: true
    }
    this.handleHeadlineChange = this.handleHeadlineChange.bind(this)
    this.loadsdk = this.loadsdk.bind(this)
    props.getFbAppId()
  }
  handleHeadlineChange () {

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
    /*if (nextProps.landingPage.currentTab === 'initialState' || nextProps.landingPage.currentTab === 'setup') {
      this.setState({backgroundColor: nextProps.landingPage.initialState.backgroundColor})
    } else if (nextProps.landingPage.currentTab === 'submittedState' && nextProps.landingPage.submittedState.state && nextProps.landingPage.submittedState.state.backgroundColor) {
      this.setState({backgroundColor: nextProps.landingPage.submittedState.state.backgroundColor})
    } else {
      this.setState({backgroundColor: '#fff'})
    }
    if ((nextProps.landingPage.currentTab === 'initialState' || nextProps.landingPage.currentTab === 'setup') && nextProps.landingPage.initialState.pageTemplate === 'background' && nextProps.landingPage.initialState.mediaLink !== '') {
      this.setState({backgroundImage: nextProps.landingPage.initialState.mediaLink})
    } else {
      this.setState({backgroundImage: ''})
    }*/
    if (nextProps.fbAppId && this.state.loadScript) {
      this.loadsdk(nextProps.fbAppId)
    }
  }

  render () {
    return (
      <div className='col-md-6 col-lg-6 col-sm-6'>
        {          
          this.props.currentWidget.currentTab === 'optInActions' &&
          <div style={{borderLeft: '0.07rem solid #EBEDF2' }}>
            <div style={{paddingLeft: '50px'}}>
              <ViewMessage payload={this.props.currentWidget.optInMessage} />
            </div>
          </div>
        }
        { this.props.currentWidget.currentTab !== 'optInActions' &&
         <div style={{ width:'100%', height: '100%', top: '0px', left: '0px',borderLeft: '0.07rem solid #EBEDF2', backgroundColor: this.state.backgroundColor, backgroundImage: 'url(' + this.state.backgroundImage + ')', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}} >
           <div style={{ width: '100%', height: '30%', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', textAlign: 'center'}}> 
            <textarea value={this.props.currentWidget.initialState.headline} rows='2' style={{fontWeight: '600', fontSize: 'large', textAlign: 'center', height: 'auto', width: '350px', color: this.props.currentWidget.initialState ? this.props.currentWidget.initialState.headline_color : '#000'}} onChange={this.props.handleHeadlineChange} />
           {
             this.props.fbAppId &&
             <center style={{marginLeft: '90px'}}>
               <MessengerPlugin
                 appId={this.props.fbAppId}
                 pageId={JSON.stringify(this.props.currentWidget.page.pageId)}
                 size='large'
                 color='white'
                 ctaText='GET_THIS_IN_MESSENGER'
               />
             </center>
           }
           </div>
         </div>
        }
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
    getFbAppId: getFbAppId
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(Preview)
