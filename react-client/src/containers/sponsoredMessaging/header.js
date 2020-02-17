/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'

class Header extends React.Component {
  render () {
    return (
      <div className='m-portlet__head'>
        <div className='m-portlet__head-caption'>
          <div className='m-portlet__head-title'>
            <h3 className='m-portlet__head-text'>
              {
              this.props.isEdit
              ? 'Edit Sponsored Message'
              : 'Create Sponsored Message'
            }
            </h3>
          </div>
        </div>
        <div className='m-portlet__head-tools'>
          <button onClick={this.props.onSave} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
            Save
          </button>
          <button style={{marginLeft: '5px'}} disabled={this.props.sendDisabled} onClick={this.props.onSend} className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill'>
            <span>
              Publish
              <span>
                <i className='la la-paper-plane-o' />
                </span>
            </span>
          </button>
        </div>
      </div>
    )
  }
}

export default Header
