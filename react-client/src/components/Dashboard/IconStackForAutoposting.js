/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { Link } from 'react-router'

class IconStackForAutoposting extends React.Component {
  render () {
    return (
        <div className='m-widget21__item' style={{display: 'flex'}}>
          <span className='m-widget21__icon'>
            <a className={`btn btn-${this.props.iconStyle} m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill`}
            style={{marginTop: '10px', width: '60px', height: '60px'}}>
              <i className={`${this.props.icon} m--font-light`} style={{fontSize: 'x-large'}} />
            </a>
          </span>
          <div className='m-widget21__info' style={{marginLeft: '10px'}}>
            <span className='m-widget21__title' style={{fontWeight: 500}}>
              {this.props.title}
            </span>
            <br />
            <span className='m-widget21__sub'>
              {this.props.connectedText} connected:&nbsp;&nbsp;<b style={{fontWeight: 500}}> {this.props.connected} </b>
            </span>
            <br />
            <span className='m-widget21__sub'>
              {this.props.otherText} Sent:&nbsp;&nbsp; <b style={{fontWeight: 500}}> {this.props.received} </b>
            </span>
            <br />
            <span className='m-widget21__sub'>
              Subscribers Reach:&nbsp;&nbsp; <b style={{fontWeight: 500}}> {this.props.sent} </b>
            </span>
          </div>
        </div>
    )
  }
}

export default IconStackForAutoposting
