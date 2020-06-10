/* eslint-disable no-return-assign */
/**
 * Created by imran on 11/11/2017.
 */

import React from 'react'
import { Link } from 'react-router-dom'

class IconStack extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.renderItem = this.renderItem.bind(this)
  }

  renderItem () {
    return (
      <div className='m-widget21__item' style={{display: 'flex'}} id={this.props.id}>
      <span className='m-widget21__icon'>
        <button
          className={`btn btn-${this.props.iconStyle} m-btn m-btn--icon m-btn--icon-only m-btn--custom m-btn--pill`}
          style={{width: this.props.iconWidth ? this.props.iconWidth : '40px', height: this.props.iconHeight ? this.props.iconHeight : '40px'}}
          >
          <i className={`${this.props.icon} m--font-light`} style={{fontSize: this.props.iconFontSize ? this.props.iconFontSize : '1.3rem'}}/>
        </button>
      </span>
      <div className='m-widget21__info' style={{marginLeft: '10px'}}>
        <span className='m-widget21__title' style={{fontWeight: 'bold', fontSize: this.props.titleFontSize ? this.props.titleFontSize : '14px'}}>
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

  render () {
    if (this.props.path) {
      return (
        <Link to={{pathname: this.props.path, state: this.props.state}} style={{color: '#575962'}}>
          {this.renderItem()}
        </Link>
      )
    } else {
      return (
        <div>
          {this.renderItem()}
        </div>
      )
    }
  }
}

export default IconStack
