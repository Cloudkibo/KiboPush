/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class AboveDescription extends React.Component {
  render () {
    return (
      <div>
        <br />
        <textarea className='addMenu' value={this.props.title} rows='2' style={{fontWeight: '600', fontSize: 'xx-large', textAlign: 'center', height: 'auto', color: this.props.initialState ? this.props.initialState.titleColor : '#000'}} onChange={this.props.handleTitleChange} />
        <br />
        {this.props.initialState.mediaLink !== '' &&
          <img style={{width: '300px', height: '300px', margin: '10px auto -5px auto', display: 'block'}} src={this.props.initialState.mediaLink} />
        }
        <br />
        <textarea className='addMenu' value={this.props.description} rows='2' style={{fontWeight: '500', fontSize: 'large', textAlign: 'center', height: 'auto', color: this.props.initialState ? this.props.initialState.descriptionColor : '#000'}} onChange={this.props.handleDescriptionChange} />
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
    )
  }
}

export default AboveDescription
