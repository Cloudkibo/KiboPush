/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'

class PostMetric extends React.Component {
  render () {
    return (
      <div className='m-widget21__item' style={{display: 'flex'}} id={this.props.id}>
        <span className='m-widget21__icon'>
          <button
            className={`btn btn-${this.props.iconStyle} m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill`}
            style={{cursor: 'default',width: this.props.iconWidth ? this.props.iconWidth : '40px', height: this.props.iconHeight ? this.props.iconHeight : '40px'}}
            >
            <i className={`${this.props.icon} m--font-light`} />
          </button>
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
    )
  }
}

export default PostMetric