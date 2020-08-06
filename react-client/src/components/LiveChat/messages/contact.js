import React from 'react'
import PropTypes from 'prop-types'

class Contact extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    return (
      <div className='m-widget4'>
        <div className='m-widget4__item' style={{paddingTop: '3px', paddingBottom: '3px'}}>
          <div className='m-widget4__img m-widget4__img--pic'>
            <img style={{width: '40px', height: '40px'}} src='https://cdn.cloudkibo.com/public/icons/users.jpg' alt='' />
          </div>
          <div className='m-widget4__info' style={{paddingLeft: '1rem'}}>
            <span className='m-widget4__title'>
              {this.props.name}
            </span>
            <br />
            <span className='m-widget4__sub'>
              {this.props.number}
            </span>
          </div>
        </div>
      </div>
    )
  }
}

Contact.propTypes = {
  'name': PropTypes.string.isRequired,
  'number': PropTypes.string.isRequired
}

export default Contact
