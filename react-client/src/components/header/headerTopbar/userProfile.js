import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import cookie from 'react-cookie'

class UserProfile extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}

    this.profilePicError = this.profilePicError.bind(this)
    this.getLiveChatLink = this.getLiveChatLink.bind(this)
  }

  profilePicError (e) {
    this.props.updatePicture({ user: this.props.user })
  }

  getLiveChatLink () {
    const environment = cookie.load('environment')
    let liveChatLink = ''
    switch (environment) {
      case 'staging':
        liveChatLink = 'https://skibochat.cloudkibo.com/liveChat'
        break
      case 'production':
        liveChatLink = 'https://kibochat.cloudkibo.com/liveChat'
        break
      default:
    }
    return liveChatLink
  }

  render() {
    return (
      <li className='m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
        <span className='m-nav__link m-dropdown__toggle'>
          <span className='m-topbar__userpic'>
            <img onError={this.profilePicError} src={(this.props.user && this.props.user.facebookInfo && this.props.user.facebookInfo.profilePic) ? this.props.user.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} className='m--img-rounded m--marginless m--img-centered' alt='' />
          </span>
          <span style={{color: 'black', paddingLeft: '10px'}} className='m-topbar__username'>
            {(this.props.user) ? this.props.user.name : ''} <i className='fa fa-chevron-down' />
          </span>
        </span>
        <div className='m-dropdown__wrapper'>
          <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
          <div className='m-dropdown__inner'>
            <div className='m-dropdown__header m--align-center'>
              <div className='m-card-user m-card-user--skin-dark'>
                <div className='m-card-user__pic'>
                  <img src={(this.props.user && this.props.user.facebookInfo && this.props.user.facebookInfo.profilePic) ? this.props.user.facebookInfo.profilePic : 'https://cdn.cloudkibo.com/public/icons/users.jpg'} className='m--img-rounded m--marginless' alt='' />
                </div>
                <div className='m-card-user__details'>
                  <span className='m-card-user__name m--font-weight-500'>
                    {(this.props.user) ? this.props.user.name : ''}
                  </span>
                  <span className='m-card-user__email'>
                    {(this.props.user) ? this.props.user.email : ''}
                  </span>
                  <span className='m-card-user__email'>
                    {this.state.planInfo}
                  </span>
                </div>
              </div>
            </div>
            <div className='m-dropdown__body'>
              <div className='m-dropdown__content'>
                <ul className='m-nav m-nav--skin-light'>
                  <li className='m-nav__section m--hide'>
                    <span className='m-nav__section-text'>My Pages</span>
                  </li>
                  {
                    this.props.showSetupUsingWizard && this.props.user && this.props.user.role !== 'agent' &&
                    <li className='m-nav__item'>
                      <Link to='/inviteUsingLinkWizard' className='m-nav__link'>
                        <i className='m-nav__link-icon flaticon-list-2' />
                        <span className='m-nav__link-text'>Setup Using Wizard</span>
                      </Link>
                    </li>
                  }
                  <li className='m-nav__item'>
                    {
                      window.location.hostname.toLowerCase().includes('kibochat')
                      ? <Link to='/liveChat' className='m-nav__link'>
                        <i className='m-nav__link-icon flaticon-chat-1' />
                        <span className='m-nav__link-text'>Messages</span>
                      </Link>
                      : <a href={this.getLiveChatLink} target='_blank' rel='noopener noreferrer' className='m-nav__link'>
                        <i className='m-nav__link-icon flaticon-chat-1' />
                        <span className='m-nav__link-text'>Messages</span>
                      </a>
                    }
                  </li>
                  {
                    this.props.showDisconnectFacebook && this.props.user && this.props.user.role === 'buyer' &&
                    <li className='m-nav__item'>
                      <span data-toggle="modal" data-target="#disconnectFacebook" className='m-nav__link'>
                        <i className='m-nav__link-icon la la-unlink' />
                        <span className='m-nav__link-text'>Disconnect Facebook</span>
                      </span>
                    </li>
                  }
                  <li className='m-nav__separator m-nav__separator--fit' />
                  <li className='m-nav__item'>
                    <a href='http://kibopush.com/faq/' target='_blank' rel='noopener noreferrer' className='m-nav__link'>
                      <i className='m-nav__link-icon flaticon-info' />
                      <span className='m-nav__link-text'>FAQ</span>
                    </a>
                  </li>
                  <li className='m-nav__item'>
                    <Link to='/settings'>
                      <i className='m-nav__link-icon flaticon-settings' />
                      <span className='m-nav__link-text'>&nbsp;&nbsp;&nbsp;Settings</span>
                    </Link>
                  </li>
                  <li className='m-nav__separator m-nav__separator--fit' />
                  <li className='m-nav__item'>
                    <span onClick={this.props.logout} className='btn m-btn--pill    btn-secondary m-btn m-btn--custom m-btn--label-brand m-btn--bolder'>
                      Logout
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }
}

UserProfile.defaultProps = {
  'showSetupUsingWizard': true,
  'showDisconnectFacebook': true
}

UserProfile.propTypes = {
  'updatePicture': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'showSetupUsingWizard': PropTypes.bool,
  'showDisconnectFacebook': PropTypes.bool,
  'logout': PropTypes.func.isRequired
}

export default UserProfile
