import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class PlanPermissions extends React.Component {
  render() {
    return (
      <li className='m-menu__item  m-menu__item--submenu m-menu__item--rel' data-menu-submenu-toggle='click' data-redirect='true' aria-haspopup='true'>
        <span className='m-menu__link m-menu__toggle'>
          <i className='m-menu__link-icon flaticon-settings' />
          <span className='m-menu__link-text'>
            Plans & Permissions
        </span>
          <i className='m-menu__hor-arrow la la-angle-down' />
          <i className='m-menu__ver-arrow la la-angle-right' />
        </span>
        <div className='m-menu__submenu m-menu__submenu--classic m-menu__submenu--left'>
          <span className='m-menu__arrow m-menu__arrow--adjust' />
          <ul className='m-menu__subnav'>
            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.props.changeMode('kiboengage') }}>
              <Link to='/plans' className='m-menu__link '>
                <i className='m-menu__link-icon fa fa-cc-stripe' />
                <span className='m-menu__link-text'>
                  Plans
              </span>
              </Link>
            </li>
            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.props.changeMode('kibochat') }}>
              <Link to='/permissions' className='m-menu__link '>
                <i className='m-menu__link-icon fa fa-key' />
                <span className='m-menu__link-text'>
                  Permissions
              </span>
              </Link>
            </li>
            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.props.changeMode('kibocommerce') }}>
              <Link to='/features' className='m-menu__link '>
                <i className='m-menu__link-icon fa fa-th-list' />
                <span className='m-menu__link-text'>
                  Features
              </span>
              </Link>
            </li>
            <li className='m-menu__item ' aria-haspopup='true' onClick={() => { this.props.changeMode('all') }}>
              <Link to='/usage' className='m-menu__link '>
                <i className='m-menu__link-icon fa fa-pie-chart' />
                <span className='m-menu__link-text'>
                  Usage
              </span>
              </Link>
            </li>
          </ul>
        </div>
      </li>
    )
  }
}

PlanPermissions.propTypes = {
  'changeMode': PropTypes.func.isRequired
}

export default PlanPermissions
