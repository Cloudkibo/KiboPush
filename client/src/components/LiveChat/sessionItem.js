import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

const styles = {
  sessionStyle: {
    cursor: 'pointer',
    padding: '1rem'
  },
  activeSessionStyle: {
    cursor: 'pointer',
    backgroundColor: '#f0f1f4',
    padding: '1rem'
  }
}

class SessionItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    console.log('session item', this.props.session)
    return (
      <div key={this.props.session._id}>
        <div style={this.props.session._id === (this.props.activeSession !== {} && this.props.activeSession._id) ? styles.activeSessionStyle : styles.sessionStyle} onClick={() => this.props.changeActiveSession(this.props.session)} className='m-widget4__item'>
          <div className='m-widget4__img m-widget4__img--pic'>
            <img style={{width: '56px', height: '56px'}} src={this.props.session.profilePic} alt='' />
          </div>
          <div className='m-widget4__info'>
            <span className='m-widget4__title'>
              {this.props.session.firstName + ' ' + this.props.session.lastName}
            </span>
            <br />
            {
              this.props.session.lastPayload && ((!this.props.session.lastPayload.componentType && this.props.session.lastPayload.text) || (this.props.session.lastPayload.componentType && this.props.session.lastPayload.componentType === 'text'))
              ? <span className='m-widget4__sub'>
                {
                  !this.props.session.lastRepliedBy
                  ? <span>{(this.props.session.lastPayload.text.length > 30) ? this.props.session.lastPayload.text.slice(0, 30) + '...' : this.props.session.lastPayload.text}</span>
                  : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
                  ? <span>You: {(this.props.session.lastPayload.text.length > 30) ? this.props.session.lastPayload.text.slice(0, 25) + '...' : this.props.session.lastPayload.text }</span>
                  : <span>{(this.props.session.lastPayload.text.length > 30) ? this.props.session.lastPayload.text.slice(0, 20) + '...' : this.props.session.lastPayload.text}</span>
                }
              </span>
              : this.props.session.lastPayload && this.props.session.lastPayload.componentType &&
              <span className='m-widget4__sub'>
                {
                  (!this.props.session.lastRepliedBy || this.props.session.lastRepliedBy === null) && this.props.session.lastPayload
                  ? <span>{this.props.session.firstName} sent {this.props.session.lastPayload.componentType}</span>
                  : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
                  ? <span>You sent {this.props.session.lastPayload.componentType}</span>
                  : <span>{this.props.session.lastRepliedBy.name} sent {this.props.session.lastPayload.componentType}</span>
                }
              </span>
            }
            {
              this.props.session.lastPayload && this.props.session.lastPayload.componentType && this.props.session.lastPayload.componentType === 'thumbsUp' &&
              <span className='m-widget4__sub'>
                {
                  !this.props.session.lastRepliedBy || this.props.session.lastRepliedBy === null
                  ? <span>{this.props.session.firstName}: <i className='fa fa-thumbs-o-up' /></span>
                  : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
                  ? <span>You:&nbsp;<i className='fa fa-thumbs-o-up' /></span>
                  : <span>{this.props.session.lastRepliedBy.name}: <i className='fa fa-thumbs-o-up' /></span>
                }
              </span>
            }
            <br />
            <span className='m-widget4__sub'>
              <i className='fa fa-facebook-square' />&nbsp;&nbsp;
              {(this.props.session.pageId.pageName.length > 10) ? this.props.session.pageId.pageName.slice(0, 10) + '...' : this.props.session.pageId.pageName}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <i className='fa fa-calendar' />&nbsp;&nbsp;
              {
                this.props.session.lastDateTime &&
                moment(this.props.session.lastDateTime).fromNow()
              }
            </span>
          </div>
          <div className='m-widget4__ext'>
            {
              this.props.session.unreadCount &&
              <a style={{backgroundColor: '#d9534f', color: '#fff'}} className='m-btn m-btn--pill m-btn--hover-brand btn btn-sm btn-danger'>
                {this.props.session.unreadCount}
              </a>
            }
          </div>
        </div>
      </div>
    )
  }
}

SessionItem.propTypes = {
  'session': PropTypes.object.isRequired,
  'activeSession': PropTypes.object.isRequired,
  'changeActiveSession': PropTypes.func.isRequired,
  'user': PropTypes.object.isRequired
}

export default SessionItem
