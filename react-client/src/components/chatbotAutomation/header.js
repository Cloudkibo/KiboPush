import React from 'react'
import PropTypes from 'prop-types'

class Header extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      waitingForDelete: false,
      waitingForPublish: false,
      waitingForDisable: false
    }
    this.onDelete = this.onDelete.bind(this)
    this.afterDelete = this.afterDelete.bind(this)
    this.onDisable = this.onDisable.bind(this)
    this.afterDisable = this.afterDisable.bind(this)
    this.onPublish = this.onPublish.bind(this)
    this.afterPublish = this.afterPublish.bind(this)
  }

  onDelete () {
    this.setState({waitingForDelete: true})
    this.props.onDelete(this.afterDelete)
  }

  afterDelete (res) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Step deleted successfully')
    } else {
      this.props.alertMsg.error(res.description)
    }
    this.setState({waitingForDelete: false})
  }

  onDisable () {
    this.setState({waitingForDisable: true})
    this.props.onDisable(this.afterDisable)
  }

  afterDisable (res) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Bot disbabled successfully')
    } else {
      this.props.alertMsg.error(res.description)
    }
    this.setState({waitingForDisable: false})
  }

  onPublish () {
    this.setState({waitingForPublish: true})
    this.props.onPublish(this.afterPublish)
  }

  afterPublish (res) {
    if (res.status === 'success') {
      this.props.alertMsg.success('Bot published successfully')
    } else {
      this.props.alertMsg.error(res.description)
    }
    this.setState({waitingForPublish: false})
  }

  render () {
    return (
      <div className='row'>
        <div className='col-md-6'>
          <h3>{this.props.title}</h3>
        </div>
        <div className='col-md-6'>
          {
            this.props.isPublished
            ? <button
              style={{marginLeft: '10px'}}
              type='button'
              className={`pull-right btn btn-danger m-btn m-btn--icon ${this.state.waitingForDisable && 'm-loader m-loader--light m-loader--left'}`}
              onClick={this.onDisable}
            >
              <span>
                {
                  !this.state.waitingForDisable &&
                  <i className='fa flaticon-close' />
                }
                <span>Disable</span>
              </span>
            </button>
            : <button
              style={{marginLeft: '10px'}}
              type='button'
              className={`pull-right btn btn-success m-btn m-btn--icon ${this.state.waitingForPublish && 'm-loader m-loader--light m-loader--left'}`}
              onClick={this.onPublish}
              disabled={!this.props.canPublish}
            >
              <span>
                {
                  !this.state.waitingForPublish &&
                  <i className='fa flaticon-paper-plane' />
                }
                <span>Publish</span>
              </span>
            </button>
          }
          <button
            style={{marginLeft: '10px'}}
            type='button'
            className='btn btn-primary pull-right m-btn m-btn--icon'
            onClick={this.props.onTest}
            disabled={!this.props.canTest}
          >
            <span>
              <i className='fa flaticon-chat-1' />
              <span>Test</span>
            </span>
          </button>
          {
            this.props.showDelete &&
            <button
              style={{marginLeft: '10px'}}
              type='button'
              className={`pull-right btn btn-primary ${this.state.waitingForDelete && 'm-loader m-loader--light m-loader--left'}`}
              onClick={this.onDelete}
            >
              Delete Step
            </button>
          }
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  'title': PropTypes.string.isRequired,
  'showDelete': PropTypes.bool.isRequired,
  'onDelete': PropTypes.func.isRequired,
  'onTest': PropTypes.func.isRequired,
  'canTest': PropTypes.bool.isRequired,
  'canPublish': PropTypes.bool.isRequired,
  'onPublish': PropTypes.func.isRequired,
  'onDisable': PropTypes.func.isRequired,
  'isPublished': PropTypes.bool.isRequired
}

export default Header
