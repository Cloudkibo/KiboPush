import React from 'react'
import PropTypes from 'prop-types'

class ProfileHeader extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  unSubscribe() {
    this.props.unSubscribe({ subscriber_id: this.props.activeSession._id, page_id: this.props.activeSession.pageId._id }, this.handleUnsubscribe)
  }

  handleUnsubscribe (res) {
    if (res.status === 'success') {
      this.props.msg.success('Unsubscribed successfully')
      this.props.changeActiveSession('none')
    } else {
      this.props.msg.error('Unable to unsubscribe subscriber')
    }
  }

  render() {
    console.log('state in profile header', this.state)
    return (
      <div>
        <div className='m-card-profile__pic'>
          <div className='m-card-profile__pic-wrapper'>
            <img onError={(e) => this.props.profilePicError(e, this.props.activeSession)} style={{ width: '80px', height: '80px' }} src={this.props.activeSession.profilePic} alt='' />
          </div>
        </div>
        <div className='m-card-profile__details'>
          <span className='m-card-profile__name'>
            {this.props.activeSession.name}
          </span>
          {
            this.props.user && (this.props.user.role === 'admin' || this.props.user.role === 'buyer') &&
            <span className='m-card-profile__email m-link' data-toggle="modal" data-target="#unsubscribe" style={{ color: '#716aca', cursor: 'pointer' }}>
              (Unsubscribe)
            </span>
          }
          <br />
          <span className='m-card-profile__email m-link'>
            {
              (this.props.activeSession.gender && this.props.activeSession.locale) &&
                this.props.activeSession.gender + ', ' + this.props.activeSession.locale
            }
          </span>
          <br />
          {
            this.props.user.isSuperUser && this.props.activeSession.customerId &&
            <a href='#/' style={{ color: 'white' }}
              onClick={() => {
                window.open(`http://demoapp.cloudkibo.com/${this.props.activeSession.customerId}`, '_blank', 'fullscreen=yes')
              }}
              className='btn m-btn--pill    btn-primary'
            >
              <i className='fa fa-external-link' /> View Customer Details
            </a>
          }
        </div>
        
        <div style={{ background: 'rgba(33, 37, 41, 0.6)' }} className="modal fade" id="unsubscribe" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div style={{ transform: 'translate(0, 0)' }} className="modal-dialog" role="document">
            <div className="modal-content">
              <div style={{ display: 'block' }} className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Unsubscribe
									</h5>
                <button style={{ marginTop: '-10px', opacity: '0.5', color: 'black' }} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">
                    &times;
											</span>
                </button>
              </div>
              <div style={{ color: 'black' }} className="modal-body">
                <p>Are you sure you want to Unsubscribe this Subscriber?</p>
                <div style={{ width: '100%', textAlign: 'center' }}>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' onClick={this.unSubscribe} data-dismiss='modal'>
                      Yes
                    </button>
                  </div>
                  <div style={{ display: 'inline-block', padding: '5px' }}>
                    <button className='btn btn-primary' data-dismiss='modal'>
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

ProfileHeader.propTypes = {
  'activeSession': PropTypes.object.isRequired,
  'unSubscribe': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired,
  'profilePicError': PropTypes.func.isRequired
}

export default ProfileHeader