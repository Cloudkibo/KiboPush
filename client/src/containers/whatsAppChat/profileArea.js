import React from 'react'
import PropTypes from 'prop-types'

class ProfileArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    return (
      <div className='col-xl-3'>
        <div className='m-portlet m-portlet--full-height'>
          <div style={{padding: '0rem 1.5rem'}} className='m-portlet__body'>
            <div className='m-card-profile'>
              <div className='m-card-profile__pic'>
                <div className='m-card-profile__pic-wrapper'>
                  <img style={{width: '80px', height: '80px'}} src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg' alt='' />
                </div>
              </div>
              <div className='m-card-profile__details'>
                <span className='m-card-profile__name'>
                  {this.props.activeSession.number}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ProfileArea.propTypes = {
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired
}

export default ProfileArea
