/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
var MessengerPlugin = require('react-messenger-plugin').default

class ContentRightSide extends React.Component {
  render () {
    return (
      <div>
        <div className='row'>
          <div className='col-md-8 col-lg-8 col-sm-8'>
            <textarea className='addMenu' value={this.props.title} rows='3' style={{fontWeight: '600', fontSize: 'xx-large', textAlign: 'center', height: 'auto', marginBottom: '10px', color: this.props.initialState ? this.props.initialState.titleColor : '#000'}} onChange={this.props.handleTitleChange} />
            <textarea className='addMenu' value={this.props.description} rows='3' style={{fontWeight: '500', fontSize: 'large', textAlign: 'center', height: 'auto', color: this.props.initialState ? this.props.initialState.descriptionColor : '#000'}} onChange={this.props.handleDescriptionChange} />
            <br /><br />
            {this.props.currentTab && this.props.currentTab === 'submittedState'
            ? <center style={{marginTop: '10px'}}>
              <button className='btn btn-primary m-btn m-btn--custom m-btn--icon'>
                <span>
                  <input type='text' value={this.props.buttonText} style={{width: '150px', backgroundColor: '#337ab7', border: '0', color: 'white'}} onChange={this.props.handleButtonText} />
                  <i className='la la-edit' />
                </span>
              </button>
            </center>
            : this.props.fbAppId &&
            <center style={{marginTop: '10px', marginLeft: '90px'}}>
              <MessengerPlugin
                appId={this.props.fbAppId}
                pageId={JSON.stringify(this.props.pageId)}
                size='large'
              />
            </center>
            }
          </div>
          <div className='col-md-4 col-lg-4 col-sm-4' style={{height: '400px', lineHeight: '400px'}}>
            <img className='col-md-12 col-lg-12 col-sm-12' style={{width: 'auto', height: 'auto', verticalAlign: 'baseline'}} src={this.props.initialState.mediaLink} />
          </div>
        </div>
      </div>
    )
  }
}

export default ContentRightSide
