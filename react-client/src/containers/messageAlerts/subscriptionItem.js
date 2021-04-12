import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

class SubscriptionItem extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div className='col-lg-6 col-md-6 col-sm-6'>

        <ReactTooltip
          id='alert_subscription'
          place='bottom'
          type='dark'
          effect='solid'
        />

        <div
          style={{
            margin: '10px',
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
          <div className='m-widget4'>
            <div style={{padding: '10px'}} className="m-widget4__item">
              <div className="m-widget4__img m-widget4__img--logo">
                <img src={this.props.profilePic || 'http://cdn.cloudkibo.com/public/img/default/default-user.jpg'} alt="" />
              </div>
              <div
                className="m-widget4__info"
                style={{
                  overflow: 'hidden',
                  width: '125px',
                  whiteSpace: this.props.description ? 'nowrap' : 'break-spaces',
                  textOverflow: 'ellipsis',
                  display: this.props.description ? 'block' : 'table-cell'
                }}
              >
                <span style={{fontSize: '12px'}} className="m-widget4__title">
                  {this.props.name}
                </span>
                <br />
                {
                  this.props.description &&
                  <span
                    style={{fontSize: '10px'}}
                    className="m-widget4__sub"
                    data-tip={this.props.description}
                    data-for='alert_subscription'
                  >
                    {this.props.description}
                  </span>
                }
              </div>
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
  'onRemove': PropTypes.func.isRequired,
  'description': PropTypes.string
}

export default SubscriptionItem
