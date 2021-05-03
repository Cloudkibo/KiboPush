import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class MenuItem extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getMenuItem = this.getMenuItem.bind(this)
    this.getParentItem = this.getParentItem.bind(this)
    this.onItemClick = this.onItemClick.bind(this)
    this.isItemActive = this.isItemActive.bind(this)
  }

  onItemClick (name) {
    document.getElementById('m_aside_left_close_btn').click()
    this.props.onItemClick(name)
  }

  isItemActive (name) {
    const value = name.replace(/\s+/g, '')
    if (value.toLowerCase() === this.props.activeItem) {
      return true
    } else {
      return false
    }
  }

  getParentItem (name, icon, submenu) {
    return (
      <li className='m-menu__item  m-menu__item--submenu' aria-haspopup='true' data-menu-submenu-toggle='hover'>
        <span className='m-menu__link m-menu__toggle'>
          {
            icon
            ? <i className={`m-menu__link-icon ${icon}`} title={name} />
            : <i className='m-menu__link-bullet m-menu__link-bullet--dot'><span /></i>
          }
          <span className='m-menu__link-text'>{name}</span>
          <i className='m-menu__ver-arrow la la-angle-right' />
        </span>
        <div className='m-menu__submenu'>
          <span className='m-menu__arrow' />
          <ul className='m-menu__subnav'>
            <li className='m-menu__item  m-menu__item--parent' aria-haspopup='true' >
              <span className='m-menu__link'>
                <span className='m-menu__link-text'>
                  {name}
                </span>
              </span>
            </li>
            {
              submenu && submenu.map((item) => (
                item.nestedmenu ? this.getParentItem(item.name, undefined, item.nestedmenu)
                : this.getMenuItem(
                  item.name,
                  {
                    route: item.route,
                    state: item.routeState,
                    link: item.link
                  },
                  item.icon
                )
              ))
            }
          </ul>
        </div>
      </li>
    )
  }

  getMenuItem (name, route, icon) {
    return (
      <li className={`m-menu__item  m-menu__item--submenu ${this.isItemActive(name) ? 'm-menu__item--active' : ''}`} aria-haspopup='true' data-menu-submenu-toggle='hover'>
        {
          route.route
          ? <Link onClick={() => { this.onItemClick(name) }} to={route.route} state={route.state} className='m-menu__link m-menu__toggle'>
            {
              icon
              ? <i className={`m-menu__link-icon ${icon}`} title={name} />
              : <i className='m-menu__link-bullet m-menu__link-bullet--dot'>
                <span />
              </i>
            }
            <span className='m-menu__link-text'>{name}</span>
          </Link>
          : <a href={route.link} target='_blank' rel='noopener noreferrer' className='m-menu__link m-menu__toggle'>
            <i className={`m-menu__link-icon ${icon}`} title={name} />
            <span className='m-menu__link-text'>{name}</span>
          </a>
        }
      </li>
    )
  }

  render () {
    if (this.props.submenu) {
      return this.getParentItem(this.props.name, this.props.icon, this.props.submenu)
    } else {
      return this.getMenuItem(
        this.props.name,
        {
          route: this.props.route,
          state: this.props.routeState,
          link: this.props.link
        },
        this.props.icon
      )
    }
  }
}

MenuItem.propTypes = {
  'name': PropTypes.string.isRequired,
  'route': PropTypes.string,
  'icon': PropTypes.string.isRequired,
  'routeState': PropTypes.object,
  'submenu': PropTypes.array,
  'link': PropTypes.string,
  'activeItem': PropTypes.string.isRequired,
  'onItemClick': PropTypes.func.isRequired
}

export default MenuItem