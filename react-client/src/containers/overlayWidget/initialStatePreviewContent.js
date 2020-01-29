/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
var MessengerPlugin = require('react-messenger-plugin').default

class PreviewContentInitialState extends React.Component {
  render () {
    return (
     <div style={{width:'100%', height:'100%'}}>
       { this.props.widgetType !== 'bar' &&
        <span>
          <i className='la la-close' style={{float: 'right', marginTop:'5px', marginRight:'5px'}} />
        </span>
        }
      <div className='col-12' style={{width: '100%',height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
        <div style={{marginBottom: `${this.props.widgetType !== 'bar'? '75px': '0px'}`}}>
          <textarea value={this.props.initialState.headline} rows='2' style={{resize: 'none', fontWeight: '600', border:'1px dashed lightgray', fontSize: `${this.props.widgetType === 'page_takeover'? 'x-large' : 'large'}`, textAlign: 'center', height: 'auto', width:  `${this.props.widgetType === 'page_takeover'? '400px' : '300px'}`, margin: '10px', background: this.props.initialState.background_color, color: this.props.initialState ? this.props.initialState.headline_color : '#000'}} maxLength='100' onChange={this.props.handleHeadlineChange} />
          <br />
          { this.props.widgetType !== 'bar' &&
            <textarea value={this.props.initialState.description} rows='2' style={{resize: 'none',fontWeight: '300', fontSize: 'small', border:'1px dashed lightgray', textAlign: 'center', height: 'auto', width:  `${this.props.widgetType === 'page_takeover'? '400px' : '320px'}`, margin: '10px', background: this.props.initialState.background_color, color: this.props.initialState.description_color}} maxLength='100' onChange={this.props.handleDescriptionChange} />
          }
          {
            this.props.initialState.button_type ==='send_to_messenger' && this.props.fbAppId &&
            <center style={{marginLeft: '90px'}}>
              <MessengerPlugin
                appId={this.props.fbAppId}
                pageId={JSON.stringify(this.props.fbPageId)}
                size='large'
                color={this.props.initialState.button_background}
              />
            </center>
          
          }
          {
            this.props.initialState.button_type ==='with_checkbox' &&
            <div className='btn' style={{marginTop: '10px', backgroundColor: `${this.props.initialState.button_background}`, padding: '5px'}}>
              <textarea style={{ margin: '1px 1px -4px 1px', padding: '5px',resize: 'none', width: '180px', border:'1px dashed lightgray', textAlign: 'center',height: '32px', 'background': `${this.props.initialState.button_background}`, 'color': `${this.props.initialState.button_text_color}`}} value={this.props.initialState.button_text} maxLength='25' onChange={this.props.changeButtonText} />
            </div>
          }
          </div>
        </div>
      </div>
    )
  }
}

export default PreviewContentInitialState
