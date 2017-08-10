/**
 * Created by sojharo on 20/07/2017.
 */

import React, {Component} from 'react'
import { Link } from 'react-router'
import ReactTooltip from 'react-tooltip'
class Sidebar extends Component {
  render () {
    return (
      <div className='fixed-sidebar'>
        <div className='fixed-sidebar-left sidebar--small' id='sidebar-left'>
          <Link to='02-ProfilePage.html' className='logo'>
            <img src='img/logo.png' alt='Olympus' />
          </Link>

          <div className='mCustomScrollbar' data-mcs-theme='dark'>
            <ul className='left-menu'>
              <li>
                <a className='js-sidebar-open'>
                  <svg className='olymp-menu-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-menu-icon' />
                  </svg>
                </a>
              </li>
              <li>
                <Link to='dashboard' data-toggle='tooltip'>
                  <svg className='olymp-newsfeed-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-newsfeed-icon' />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to='subscribers'>
                  <svg className='olymp-star-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-happy-faces-icon' />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to='broadcasts'>
                  <svg className='olymp-badge-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-badge-icon' />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to='surveys'>
                  <svg className='olymp-calendar-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-calendar-icon' />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to='workflows'>
                  <svg className='olymp-happy-faces-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-star-icon' />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to='poll'>
                  <svg className='olymp-headphones-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-manage-widgets-icon' />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to='subscribeToMessenger'>
                  <svg className='olymp-stats-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-manage-widgets-icon' />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to='stats'>
                  <svg className='olymp-stats-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-stats-icon' />
                  </svg>
                </Link>
              </li>
              <li>
                <Link to='pages' data-for='pages'>
                  <svg className='olymp-manage-widgets-icon left-menu-icon'>
                    <use xlinkHref='icons/icons.svg#olymp-manage-widgets-icon' />
                  </svg>
                </Link>
                <ReactTooltip id='pages' place='right'>Pages</ReactTooltip>
              </li>
            </ul>
          </div>
        </div>

        <div className='fixed-sidebar-left sidebar--large' id='sidebar-left-1'>
          <Link to='02-ProfilePage.html' className='logo'>
            <img src='img/logo.png' alt='Olympus' />
            <h6 className='logo-title'>olympus</h6>
          </Link>

          <div className='mCustomScrollbar' data-mcs-theme='dark'>
            <ul className='left-menu'>
              <li>
                <Link to='#' className='js-sidebar-open'>
                  <svg className='olymp-close-icon left-menu-icon'><use xlinkHref='icons/icons.svg#olymp-close-icon' /></svg>
                  <span className='left-menu-title'>Collapse Menu</span>
                </Link>
              </li>
              <li>
                <Link to='dashboard'>
                  <svg className='olymp-newsfeed-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='DASHBOARD'><use xlinkHref='icons/icons.svg#olymp-newsfeed-icon' /></svg>
                  <span className='left-menu-title'>DASHBOARD</span>
                </Link>
              </li>
              <li>
                <Link to='subscribers'>
                  <svg className='olymp-happy-faces-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='SUBSCRIBERS'><use xlinkHref='icons/icons.svg#olymp-happy-faces-icon' /></svg>
                  <span className='left-menu-title'>SUBSCRIBERS</span>
                </Link>
              </li>
              <li>
                <Link to='broadcasts'>
                  <svg className='olymp-badge-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='Community Badges'><use xlinkHref='icons/icons.svg#olymp-badge-icon' /></svg>
                  <span className='left-menu-title'>BROADCASTS</span>
                </Link>
              </li>
              <li>
                <Link to='surveys'>
                  <svg className='olymp-calendar-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='CALENDAR AND EVENTS'><use xlinkHref='icons/icons.svg#olymp-calendar-icon' /></svg>
                  <span className='left-menu-title'>SURVEYS</span>
                </Link>
              </li>
              <li>
                <Link to='workflows'>
                  <svg className='olymp-star-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='WORKFLOWS'><use xlinkHref='icons/icons.svg#olymp-star-icon' /></svg>
                  <span className='left-menu-title'>Workflows</span>
                </Link>
              </li>

              <li>
                <Link to='poll'>
                  <svg className='olymp-headphones-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='CREATE POLL'><use xlinkHref='icons/icons.svg#olymp-headphones-icon' /></svg>
                  <span className='left-menu-title'>Create Poll</span>
                </Link>
              </li>
              <li>
                <Link to='subscribeToMessenger'>
                  <svg className='olymp-weather-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='Subscribe To Messenger'><use xlinkHref='icons/icons.svg#olymp-manage-widgets-icon' /></svg>
                  <span className='left-menu-title'>Subscribe To Messenger</span>
                </Link>
              </li>

              <li>
                <Link to='stats'>
                  <svg className='olymp-stats-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='Account Stats'><use xlinkHref='icons/icons.svg#olymp-stats-icon' /></svg>
                  <span className='left-menu-title'>Analytics</span>
                </Link>
              </li>
              <li>
                <Link to='pages'>
                  <svg className='olymp-manage-widgets-icon left-menu-icon' data-toggle='tooltip' data-placement='right' title='' data-original-title='Manage Widgets'><use xlinkHref='icons/icons.svg#olymp-manage-widgets-icon' /></svg>
                  <span className='left-menu-title'>Pages</span>
                </Link>
              </li>
            </ul>

            <div className='profile-completion'>

              <div className='skills-item'>
                <div className='skills-item-info'>
                  <span className='skills-item-title'>Profile Completion</span>
                  <span className='skills-item-count'><span className='count-animate' data-speed='1000' data-refresh-interval='50' data-to='76' data-from='0' /><span className='units'>76%</span></span>
                </div>
                <div className='skills-item-meter'>
                  <span className='skills-item-meter-active bg-primary' style={{width: 76}} />
                </div>
              </div>

              <span>Complete <Link to='#'>your profile</Link> so people can know more about you!</span>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Sidebar
