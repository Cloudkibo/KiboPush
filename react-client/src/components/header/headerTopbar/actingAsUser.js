import React from 'react'
import PropTypes from 'prop-types'

class ActingAsUser extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      showViewingAsDropDown: false
    }

    this.showViewingAsDropDown = this.showViewingAsDropDown.bind(this)
    this.removeActingAsUser = this.removeActingAsUser.bind(this)
    this.handleActingUser = this.handleActingUser.bind(this)
  }

  showViewingAsDropDown() {
    this.setState({ showViewingAsDropDown: true })
  }

  removeActingAsUser() {
    this.props.setUsersView({type: 'unset', domain_email: this.props.actingAsUserEmail}, this.handleActingUser)
  }

  handleActingUser () {
    window.location.reload()
  }

  render() {
    return (
      <li style={{ marginRight: '20px', padding: '0' }} className='m-nav__item m-topbar__user-profile m-topbar__user-profile--img  m-dropdown m-dropdown--medium m-dropdown--arrow m-dropdown--header-bg-fill m-dropdown--align-right m-dropdown--mobile-full-width m-dropdown--skin-light' data-dropdown-toggle='click'>
        <div style={{ marginTop: '15px' }}>
          <span className='m-topbar__userpic'>
            <div style={{ display: 'inline-block', height: '41px' }}>
              <span className='m-nav__link-text' style={{ lineHeight: '41px', verticalAlign: 'middle', textAlign: 'center' }}>
                <li className='m-menu__item  m-menu__item--submenu m-menu__item--relm-portlet__nav-item m-dropdown m-dropdown--inline m-dropdown--arrow m-dropdown--align-right m-dropdown--align-push' data-dropdown-toggle='click'>
                  <span style={{ fontSize: '0.85em' }} onClick={this.showViewingAsDropDown} className='m-portlet__nav-link m-dropdown__toggle dropdown-toggle btn btn--sm m-btn--pill btn-secondary m-btn m-btn--label-brand'>
                    Viewing As...
                  </span>
                  {
                    this.state.showViewingAsDropDown &&
                    <div className='m-dropdown__wrapper'>
                      <span className='m-dropdown__arrow m-dropdown__arrow--right m-dropdown__arrow--adjust' />
                      <div className='m-dropdown__inner'>
                        <div className='m-dropdown__body'>
                          <div className='m-dropdown__content'>
                            <ul className='m-nav'>
                              <li style={{ textAlign: 'center' }} className='m-nav__item'>
                                <span>
                                  Currently viewing as: <strong>{this.props.actingAsUserName} </strong>
                                </span>
                              </li>
                              <li style={{ textAlign: 'center' }} className='m-nav__item'>
                                <span onClick={this.removeActingAsUser} className='m-btn m-btn--pill m-btn--hover-brand btn btn-secondary' style={{ cursor: 'pointer' }}>
                                  <span className='m-nav__link-text'>
                                    Switch back to my view
                                </span>
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </li>
              </span>
            </div>
          </span>
        </div>
      </li>
    )
  }
}

ActingAsUser.propTypes = {
  'setUsersView': PropTypes.func.isRequired,
  'actingAsUserEmail': PropTypes.string.isRequired,
  'actingAsUserName': PropTypes.string.isRequired
}

export default ActingAsUser
