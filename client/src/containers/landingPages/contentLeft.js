/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class ContentLeftSide extends React.Component {
  render () {
    return (
      <div>
        <br />
        <div className='row'>
          <div className='col-md-4 col-lg-4 col-sm-4' style={{height: '400px', lineHeight: '400px'}}>
            <img className='col-md-12 col-lg-12 col-sm-12' style={{width: 'auto', height: 'auto', verticalAlign: 'baseline'}} src={this.props.initialState.mediaLink} />
          </div>
          <div className='col-md-8 col-lg-8 col-sm-8 '>
            <textarea className='addMenu' value={this.props.title} rows='3' style={{fontWeight: '600', fontSize: 'xx-large', textAlign: 'center', height: 'auto', marginBottom: '10px', color: this.props.initialState ? this.props.initialState.titleColor : '#000'}} onChange={() => this.props.handleTitleChange()} />
            <textarea className='addMenu' value={this.props.description} rows='3' style={{fontWeight: '500', fontSize: 'large', textAlign: 'center', height: 'auto', color: this.props.initialState ? this.props.initialState.descriptionColor : '#000'}} onChange={this.props.handleDescriptionChange} />
            <br /><br />
            {this.props.currentTab && this.props.currentTab === 'submittedState'
            ? <center>
              <button className='btn btn-primary m-btn m-btn--custom m-btn--icon'>
                <span>
                  <input type='text' value={this.props.buttonText} style={{width: '150px', backgroundColor: '#337ab7', border: '0', color: 'white'}} onChange={this.props.handleButtonText} />
                  <i className='la la-edit' />
                </span>
              </button>
            </center>
            : this.props.fbAppId &&
            <div className='fb-send-to-messenger'
              messenger_app_id={this.props.fbAppId}
              page_id={this.props.pageId}
              data-ref='send to messenger'
              color='blue'
              size='standard' />
          }
          </div>
        </div>
      </div>
    )
  }
}

export default ContentLeftSide
