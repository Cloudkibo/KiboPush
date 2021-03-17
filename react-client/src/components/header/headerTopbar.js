import React from 'react'
import PropTypes from 'prop-types'
import auth from '../../utility/auth.service'

// Components
import ACTINGASUSER from './headerTopbar/actingAsUser'
import NOTIFICATIONS from './headerTopbar/notifications'
import QUICKACTIONS from './headerTopbar/quickActions'
import APPCHOOSER from './headerTopbar/appChooser'
import USERPROFILE from './headerTopbar/userProfile'

class HeaderTopbar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}

    this.logout = this.logout.bind(this)
    this.shouldShowBasedOnPlan = this.shouldShowBasedOnPlan.bind(this)
  }

  logout () {
    this.props.logout(auth.logout)
  }

  shouldShowBasedOnPlan(user) {
    if (user.currentPlan.unique_ID === 'plan_E' && user.platform === 'whatsApp') {
      return false
    }
    return true
  }

  render() {
    const {
      showNotifcations,
      showQuickActions,
      showAppChooser,
      showDocumentation
    } = this.props
    console.log('INSIDE RENDER IN HEADER', this.props)
    return (
      <div id='m_header_topbar' className='m-topbar  m-stack m-stack--ver m-stack--general'>
        <div className='m-stack__item m-topbar__nav-wrapper'>
          <ul className='m-topbar__nav m-nav m-nav--inline'>
            {
              this.props.superUser &&
              <ACTINGASUSER
                actingAsUserName={this.props.superUser.actingAsUser.name}
                actingAsUserEmail={this.props.superUser.actingAsUser.domain_email}
                setUsersView={this.props.setUsersView}
              />
            }
            {
              showNotifcations && this.props.user && this.shouldShowBasedOnPlan(this.props.user) &&
              <NOTIFICATIONS
                notifications={this.props.notifications}
                totalNotifications={this.props.totalNotifications}
                unreadNotifications={this.props.unreadNotifications}
                user={this.props.user}
                gotoView={this.props.gotoView}
                goToSettings={this.props.goToSettings}
                loadingMoreNotifications={this.props.loadingMoreNotifications}
                fetchNotifications={this.props.fetchNotifications}
              />
            }
            {
              showQuickActions && this.props.user && this.props.user.isSuperUser &&
              this.props.user.facebookInfo && this.props.otherPages &&
              <QUICKACTIONS
                subscribers={this.props.subscribers}
              />
            }
            {
              showAppChooser && this.props.user && this.shouldShowBasedOnPlan(this.props.user) &&
              <APPCHOOSER
                currentEnvironment={this.props.currentEnvironment}
                user={this.props.user}
              />
            }
            <USERPROFILE
              updatePicture={this.props.updatePicture}
              user={this.props.user}
              logout={this.logout}
              showDisconnectFacebook={this.props.user && this.props.user.role === 'buyer' && this.props.user.platform === 'messenger'}
              showSetupUsingWizard={this.props.user && this.props.user.role !== 'agent' && this.props.user.platform === 'messenger'}
              showMessages={this.props.user && this.shouldShowBasedOnPlan(this.props.user)}
            />
            {
              showDocumentation &&
              <li className='btn btn-sm m-btn m-btn--pill m-btn--gradient-from-focus m-btn--gradient-to-danger'>
                <a href='https://kibopush.com/user-guide/' target='_blank' rel='noopener noreferrer' style={{color: 'white', textDecoration: 'none'}}> Documentation </a>
              </li>
            }
          </ul>
        </div>
      </div>
    )
  }
}

HeaderTopbar.propTypes = {
  'showNotifcations': PropTypes.bool.isRequired,
  'showQuickActions': PropTypes.bool.isRequired,
  'showAppChooser': PropTypes.bool.isRequired,
  'showDocumentation': PropTypes.bool.isRequired,
  'user': PropTypes.object.isRequired,
  'currentEnvironment': PropTypes.object.isRequired,
  'userView': PropTypes.bool.isRequired,
  'notifications': PropTypes.array.isRequired,
  'unreadNotifications': PropTypes.number.isRequired,
  'totalNotifications': PropTypes.number.isRequired,
  'gotoView': PropTypes.func.isRequired,
  'goToSettings': PropTypes.func.isRequired,
  'subscribers': PropTypes.array.isRequired,
  'otherPages': PropTypes.array.isRequired,
  'updatePicture': PropTypes.func.isRequired,
  'logout': PropTypes.func.isRequired,
  'loadingMoreNotifications': PropTypes.bool.isRequired,
  'fetchNotifications': PropTypes.func.isRequired
}

export default HeaderTopbar
