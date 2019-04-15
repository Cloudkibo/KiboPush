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
    this.showLastMessage = this.showLastMessage.bind(this)
  }

  showLastMessage () {
    let content = []
    if (this.props.session.lastPayload.componentType === 'text') {
      content.push(<span className='m-widget4__sub'>
        {
          !this.props.session.lastRepliedBy
          ? <span>{(this.props.session.lastPayload.text.length > 30) ? this.props.session.lastPayload.text.slice(0, 30) + '...' : this.props.session.lastPayload.text}</span>
          : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
          ? <span>You: {(this.props.session.lastPayload.text.length > 30) ? this.props.session.lastPayload.text.slice(0, 25) + '...' : this.props.session.lastPayload.text }</span>
          : <span>{(this.props.session.lastPayload.text.length > 30) ? this.props.session.lastPayload.text.slice(0, 20) + '...' : this.props.session.lastPayload.text}</span>
        }
      </span>)
    } else if (this.props.session.lastPayload.componentType === 'image') {
      content.push(<span className='m-widget4__sub'>
        {
          !this.props.session.lastRepliedBy
          ? <span>sent an image</span>
          : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
          ? <span>You sent an image</span>
          : <span>{this.props.session.lastRepliedBy.name} sent an image</span>
        }
      </span>)
    } else if (this.props.session.lastPayload.componentType === 'file') {
      content.push(<span className='m-widget4__sub'>
        {
          !this.props.session.lastRepliedBy
          ? <span>sent a file</span>
          : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
          ? <span>You sent a file</span>
          : <span>{this.props.session.lastRepliedBy.name} sent a file</span>
        }
      </span>)
    } else if (this.props.session.lastPayload.componentType === 'audio') {
      content.push(<span className='m-widget4__sub'>
        {
          !this.props.session.lastRepliedBy
          ? <span>sent an audio</span>
          : this.props.session.lastRepliedBy.type === 'agent' && this.props.session.lastRepliedBy.id === this.props.user._id
          ? <span>You sent an audio</span>
          : <span>{this.props.session.lastRepliedBy.name} sent an audio</span>
        }
      </span>)
    }
    return content
  }

  render () {
    console.log('session item', this.props.session)
    console.log('this.props', this.props)
    return (
      <div key={this.props.session._id}>
        <div style={this.props.session._id === this.props.activeSession._id ? styles.activeSessionStyle : styles.sessionStyle} onClick={() => this.props.changeActiveSession(this.props.session)} className='m-widget4__item'>
          <div className='m-widget4__img m-widget4__img--pic'>
            <img style={{width: '56px', height: '56px'}} src='https://www.mastermindpromotion.com/wp-content/uploads/2015/02/facebook-default-no-profile-pic-300x300.jpg' alt='' />
          </div>
          <div className='m-widget4__info'>
            <span className='m-widget4__title'>
              {this.props.session.number}
            </span>
            <br />
            {this.showLastMessage()}
            <br />
            <span className='m-widget4__sub'>
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
