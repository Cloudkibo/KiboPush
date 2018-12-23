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
              Create Landing Page
            </h3>
          </div>
        </div>
        <div className='m-portlet__head-tools'>
          <button className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' onClick={this.props.onSave}>
            <span>Save</span>
          </button>
          {this.props.isEdit && !this.props.isActive &&
            <button className='addLink btn btn-primary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' style={{marginLeft: '5px'}} onClick={() => this.props.onEdit(true)}>
              <span>Activate</span>
            </button>
          }
          {this.props.isEdit && this.props.isActive &&
            <button className='addLink btn btn-secondary m-btn m-btn--custom m-btn--icon m-btn--air m-btn--pill' style={{marginLeft: '5px'}} onClick={() => this.props.onEdit(false)}>
              <span>Deactivate</span>
            </button>
          }
        </div>
      </div>
    )
  }
}

export default Header
