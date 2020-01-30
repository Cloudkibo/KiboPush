/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getFbAppId } from '../../redux/actions/basicinfo.actions'
import { updateWidget } from '../../redux/actions/overlayWidgets.actions'
import PreviewContent from './initialStatePreviewContent'

class PreviewInitialState extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      backgroundImage: 'https://kibopush.com/wp-content/uploads/2020/01/preview_background.jpg',
      loadScript: true,
      fbPageId: ''
    }
    this.handleHeadlineChange = this.handleHeadlineChange.bind(this)
    this.loadsdk = this.loadsdk.bind(this)
    this.changeButtonText = this.changeButtonText.bind(this)
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
    props.getFbAppId()
  }
  handleDescriptionChange(e) {
    this.props.updateWidget(this.props.currentWidget, 'initialState', 'description', e.target.value)
  }

  handleHeadlineChange (e) {
    this.props.updateWidget(this.props.currentWidget, 'initialState', 'headline', e.target.value)
  }
  changeButtonText (e) {
    this.props.updateWidget(this.props.currentWidget, 'initialState', 'button_text', e.target.value)
  }
  componentDidMount () {
    this.setState({
      fbPageId: this.props.pages.filter((page) => page._id === this.props.currentWidget.pageId)[0].pageId
    })
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
        { this.props.currentWidget.type === 'bar' &&
        <div style={{ width: '100%', height: '25%', padding: '10px', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', textAlign: 'center', background: this.props.currentWidget.initialState.background_color}}> 
          <PreviewContent 
            widgetType='bar' 
            initialState={this.props.currentWidget.initialState} 
            fbAppId={this.props.fbAppId}
            fbPageId={this.state.fbPageId}
            changeButtonText={this.changeButtonText}
            handleDescriptionChange={this.handleDescriptionChange}
            handleHeadlineChange={this.handleHeadlineChange} />      
        </div>
        }
        { this.props.currentWidget.type === 'modal' &&
          <div style={{background: 'rgba(33, 37, 41, 0.6)', zIndex: '99999', width:'100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{width: '350px', height: '400px', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', background: this.props.currentWidget.initialState.background_color }}>
          <PreviewContent 
            widgetType='modal' 
            initialState={this.props.currentWidget.initialState} 
            fbAppId={this.props.fbAppId}
            fbPageId={this.state.fbPageId}
            changeButtonText={this.changeButtonText}
            handleDescriptionChange={this.handleDescriptionChange}
            handleHeadlineChange={this.handleHeadlineChange} /> 
          </div>
        </div>
        }
        { this.props.currentWidget.type === 'slide_in' &&
        <div style={{width:'100%', height: '100%', display:'flex', justifyContent: 'center', alignItems: 'center'}}>
          <div style={{width: '100%'}}>
            <div style={{float: 'right', width: '350px', height: '400px', boxShadow: '0 1px 5px 0 rgba(0,0,0,0.33)', background: this.props.currentWidget.initialState.background_color }}>
            <PreviewContent 
              widgetType='slide_in' 
              initialState={this.props.currentWidget.initialState} 
              fbAppId={this.props.fbAppId}
              fbPageId={this.state.fbPageId}
              changeButtonText={this.changeButtonText}
              handleDescriptionChange={this.handleDescriptionChange}
              handleHeadlineChange={this.handleHeadlineChange} /> 
          </div>
        </div>
      </div>
      }
        { this.props.currentWidget.type === 'page_takeover' &&
          <div style={{border: '1px solid lightgrey',zIndex: '99999', width:'100%', height: '100%', background: this.props.currentWidget.initialState.background_color, display:'flex', justifyContent: 'center', alignItems: 'center'}}>
            <PreviewContent 
              widgetType='page_takeover' 
              initialState={this.props.currentWidget.initialState} 
              fbAppId={this.props.fbAppId}
              fbPageId={this.state.fbPageId}
              changeButtonText={this.changeButtonText}
              handleDescriptionChange={this.handleDescriptionChange}
              handleHeadlineChange={this.handleHeadlineChange} /> 
        </div>
        }
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    fbAppId: state.basicInfo.fbAppId,
    pages: (state.pagesInfo.pages),
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
