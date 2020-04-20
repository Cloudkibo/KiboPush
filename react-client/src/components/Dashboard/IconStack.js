/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { Link } from 'react-router-dom'

class IconStack extends React.Component {
  render () {
    return (
      <Link to={{pathname: this.props.path, state: this.props.state}} style={{color: '#575962'}}>
        <div className='m-widget21__item' style={{display: 'flex'}} id={this.props.id}>
          <span className='m-widget21__icon'>
            <a href='#/'
              className={`btn btn-${this.props.iconStyle} m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill`}
              style={{width: this.props.iconWidth ? this.props.iconWidth : '40px', height: this.props.iconHeight ? this.props.iconHeight : '40px'}}
              >
              <i className={`${this.props.icon} m--font-light`} />
            </a>
          </span>
          <div className='m-widget21__info' style={{marginLeft: '10px'}}>
            <span className='m-widget21__title' style={{fontWeight: 'bold'}}>
              {this.props.title}
            </span>
            <br />
            <span className='m-widget21__sub'>
              {this.props.subtitle}
            </span>
          </div>
        </div>
      </Link>
    )
  }
}

export default IconStack
