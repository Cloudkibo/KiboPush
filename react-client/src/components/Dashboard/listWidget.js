/* eslint-disable no-return-assign */
/**
 * Created by imran on 27/06/2019.
 */

import React from 'react'
import PropTypes from 'prop-types'

class ListWidget extends React.Component {
  render () {
    return (
      <div style={{paddingRight: '25px'}} className='m-widget5__item'>
        <div style={{paddingTop: '1.07rem'}} className='m-widget5__pic'>
          <img style={{display: 'block', margin: 'auto'}} className='m-widget7__img' src={this.props.imageUrl} alt='' />
        </div>
        <div
          className='m-widget5__content'
          style={{paddingLeft: '0px', verticalAlign: 'middle', width: '250px'}}
        >
          <h4 className='m-widget5__title'>
            {this.props.title}
          </h4>
          <span className='m-widget5__desc'>
            {this.props.description}
          </span>
        </div>
        {
          this.props.stats.map((s, i) => (
            <div className='m-widget5__stats1'>
              <span className='m-widget5__number'>
                {s.value}
              </span>
              <br />
              <span className='m-widget5__sales'>
                {s.stat}
              </span>
            </div>
          ))
        }
      </div>
    )
  }
}

ListWidget.propTypes = {
  'imageUrl': PropTypes.string.isRequired,
  'title': PropTypes.string.isRequired,
  'description': PropTypes.string.isRequired,
  'stats': PropTypes.array.isRequired
}

export default ListWidget
