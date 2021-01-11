import React from 'react'
import PropTypes from 'prop-types'

class SubscriptionItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className='col-lg-4 col-md-4 col-sm-4'>
        <div
          style={{
            margin: '5px',
            border: '1px solid #ccc',
            borderRadius: '10px',
            position: 'relative',
            boxShadow: '0 5px 10px 2px rgba(204,204,204,.8)'
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-5px',
              color: '#666',
              cursor: 'pointer'
            }}
            onClick={this.props.onRemove}
          >
            <i className='la la-times-circle' />
          </span>
          <div style={{padding: '10px'}} className="m-card-user">
            <div className="m-card-user__pic">
              <img style={{width: '30px'}} src={this.props.profilePic || 'http://cdn.cloudkibo.com/public/img/default/default-user.jpg'} className="m--img-rounded m--marginless" alt="" />
            </div>
            <div style={{paddingLeft: '5px'}} class="m-card-user__details">
              <span style={{fontSize: '10px'}} className="m-card-user__name m--font-weight-500">
                {this.props.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

SubscriptionItem.propTypes = {
  'profilePic': PropTypes.string,
  'name': PropTypes.string.isRequired,
  'onRemove': PropTypes.func.isRequired
}

export default SubscriptionItem
