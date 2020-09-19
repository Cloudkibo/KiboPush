import React from 'react'
import PropTypes from 'prop-types'

// Components
import SELECTPLATFROM from './headerMenu/selectPlatform'
import PLANPERMISSIONS from './headerMenu/planPermissions'

class HeaderMenu extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      selectedPlatform: {},
      planInfo: ''
    }

    this.changeMode = this.changeMode.bind(this)
  }

  changeMode (mode) {
    this.props.updateMode({ mode: mode }, this.props.user)
  }

  render() {
    const { showSelectPlatform, user, showPlanPermissions } = this.props
    return (
      <div id='m_header_menu' className='m-header-menu m-aside-header-menu-mobile m-aside-header-menu-mobile--offcanvas m-header-menu--skin-light m-header-menu--submenu-skin-light m-aside-header-menu-mobile--skin-dark m-aside-header-menu-mobile--submenu-skin-dark'>
        <ul className='m-menu__nav  m-menu__nav--submenu-arrow '>
          {
            showSelectPlatform &&
            <SELECTPLATFROM
              selectedPlatform={this.props.selectedPlatform}
              changePlatform={this.props.changePlatform}
              enableMessenger={this.props.user && this.props.user.actingAsUser && this.props.user.actingAsUser.platforms && this.props.user.actingAsUser.platforms.filter((platform) => platform === 'messenger').length < 1? false : true}
              enableWhatsApp={this.props.user && this.props.user.actingAsUser && this.props.user.actingAsUser.platforms && this.props.user.actingAsUser.platforms.filter((platform) => platform === 'whatsApp').length < 1 ? false : true}
              enableSms={this.props.user && this.props.user.actingAsUser && this.props.user.actingAsUser.platforms && this.props.user.actingAsUser.platforms.filter((platform) => platform === 'sms').length < 1? false : true}
            />
          }
          {
            showPlanPermissions &&
            (
              user && user.isSuperUser
              ? <PLANPERMISSIONS
                changeMode={this.changeMode}
              />
              : <li className='m-menu__item  m-menu__item--submenu m-menu__item--rel' data-redirect='true' aria-haspopup='true'>
                <a href='https://kibopush.com/user-guide/' target='_blank' rel='noopener noreferrer' className='m-menu__link m-menu__toggle'>
                  <i className='m-menu__link-icon flaticon-info' />
                  <span className='m-menu__link-text'>
                    Documentation
                  </span>
                </a>
              </li>
            )
          }
        </ul>
      </div>
    )
  }
}

HeaderMenu.propTypes = {
  'showSelectPlatform': PropTypes.bool.isRequired,
  'showPlanPermissions': PropTypes.bool.isRequired,
  'selectedPlatform': PropTypes.object.isRequired,
  'changePlatform': PropTypes.func.isRequired,
  'updateMode': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired
}

export default HeaderMenu
