import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class QuickActions extends React.Component {
  render() {
    return (
      <li style={{ marginRight: '10px', padding: '0' }} className='m-nav__item m-topbar__quick-actions m-topbar__quick-actions--img m-dropdown m-dropdown--large m-dropdown--header-bg-fill m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
        <span className='m-nav__link m-dropdown__toggle'>
          <span className='m-nav__link-badge m-badge m-badge--dot m-badge--info m--hide' />
          <span className='m-nav__link-icon'>
            <i className='flaticon-share' />
          </span>
        </span>
        <div className='m-dropdown__wrapper'>
          <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
          <div className='m-dropdown__inner'>
            <div className='m-dropdown__body m-dropdown__body--paddingless'>
              <div className='m-dropdown__content'>
                <div className='m-scrollable' data-scrollable='false' data-max-height='380' data-mobile-max-height='200'>
                  <div className='m-nav-grid m-nav-grid--skin-light'>
                    <div className='m-nav-grid__row'>
                      {
                        window.location.hostname.toLowerCase().includes('kiboengage') &&
                        this.props.subscribers && this.props.subscribers.length === 0
                        ? <Link to='/broadcasts' className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-file' />
                          <span className='m-nav-grid__text'>Send New Broadcast</span>
                        </Link>
                        : window.location.hostname.toLowerCase().includes('kiboengage')
                        ? <Link to='/broadcasts' className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-file' />
                          <span className='m-nav-grid__text'>Send New Broadcast</span>
                        </Link>
                        : null
                      }
                      {
                        window.location.hostname.toLowerCase().includes('kiboengage') &&
                        this.props.subscribers && this.props.subscribers.length === 0
                        ? <Link to='/poll' className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-time' />
                          <span className='m-nav-grid__text'>Send New Poll</span>
                        </Link>
                        : window.location.hostname.toLowerCase().includes('kiboengage')
                        ? <Link to='/poll' className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-time' />
                          <span className='m-nav-grid__text'>Send New Poll</span>
                        </Link>
                        : null
                      }
                    </div>
                    <div className='m-nav-grid__row'>
                      {
                        window.location.hostname.toLowerCase().includes('kiboengage') &&
                        this.props.subscribers && this.props.subscribers.length === 0
                        ? <Link to='/surveys' className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-folder' />
                          <span className='m-nav-grid__text'>Send New Survey</span>
                        </Link>
                        : window.location.hostname.toLowerCase().includes('kiboengage')
                        ? <Link to='/surveys' className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-folder' />
                          <span className='m-nav-grid__text'>Send New Survey</span>
                        </Link>
                        : null
                      }
                      {
                        !window.location.hostname.toLowerCase().includes('kiboengage') &&
                        <Link to='/bots' className='m-nav-grid__item'>
                          <i className='m-nav-grid__icon flaticon-clipboard' />
                          <span className='m-nav-grid__text'>Create New Bot</span>
                        </Link>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }
}

QuickActions.propTypes = {
  'subscribers': PropTypes.array.isRequired
}

export default QuickActions
