import React from 'react'
import PropTypes from 'prop-types'

class SelectPlatform extends React.Component {
  render() {
    const { icon, platform } = this.props.selectedPlatform
    return (
      <li className='m-menu__item  m-menu__item--submenu m-menu__item--rel' data-menu-submenu-toggle='click' data-redirect='true' aria-haspopup='true'>

        <span className='m-menu__link m-menu__toggle'>
          <i className={`m-menu__link-icon ${icon}`} />
          <span className='m-menu__link-text'>
            {`Platform: ${platform}`}
          </span>
          <i className='m-menu__hor-arrow la la-angle-down' />
          <i className='m-menu__ver-arrow la la-angle-right' />
        </span>

        <div className='m-menu__submenu m-menu__submenu--classic m-menu__submenu--left'>
          <span className='m-menu__arrow m-menu__arrow--adjust' />
          <ul className='m-menu__subnav'>
            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.props.changePlatform('messenger') }}>
              <button type='button' className='btn btn-link m-menu__link '>
                <i className='m-menu__link-icon fa fa-facebook-square' />
                <span style={{width: 'auto'}} className='m-menu__link-text'>
                  Messenger
                </span>
              </button>
            </li>
            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.props.changePlatform('sms') }}>
              <button type='button' className='btn btn-link m-menu__link '>
                <i className='m-menu__link-icon flaticon flaticon-chat-1' />
                <span style={{width: 'auto'}} className='m-menu__link-text'>
                  SMS
                </span>
              </button>
            </li>
            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.props.changePlatform('whatsApp') }}>
              <button type='button' className='btn btn-link m-menu__link '>
                <i className='m-menu__link-icon socicon socicon-whatsapp' />
                <span style={{width: 'auto'}} className='m-menu__link-text'>
                  WhatsApp
                </span>
              </button>
            </li>
          </ul>
        </div>
      </li>
    )
  }
}

SelectPlatform.propTypes = {
  'selectedPlatform': PropTypes.object.isRequired,
  'changePlatform': PropTypes.func.isRequired
}

SelectPlatform.defaultProps = {

}

export default SelectPlatform
