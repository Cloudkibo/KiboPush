import React from 'react'
import PropTypes from 'prop-types'

class Collapse extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {}

    this.toggleCollapse = this.toggleCollapse.bind(this)
  }

  toggleCollapse (row) {
    let className = document.getElementById(`icon-${this.props.id}`).className
    if (className === 'la la-angle-up collapsed') {
      document.getElementById(`icon-${this.props.id}`).className = 'la la-angle-down'
    } else {
      document.getElementById(`icon-${this.props.id}`).className = 'la la-angle-up'
    }
  }

  render () {
    return (
      <div key={this.props.id} className='accordion' id={`accordion-${this.props.id}`} style={{ marginTop: '15px' }}>
        <div className='card'>
          <div className='card-header' id={`heading-${this.props.id}`}>
            <h4 className='mb-0'>
              <div
                onClick={this.toggleCollapse}
                className='btn'
                data-toggle='collapse'
                data-target={`#collapse_${this.props.id}`}
                aria-expanded='true'
                aria-controls={`#collapse_${this.props.id}`}
              >
               {this.props.title}
              </div>
              {
                this.props.showBadge &&
                <span style={{fontSize: '0.8rem'}} className={`m-badge m-badge--${this.props.badgeStyle} m-badge--wide`}>
    							{this.props.badgeText}
    						</span>
              }
              <span style={{ overflow: 'visible', float: 'right' }}>
                <i
                  style={{ fontSize: '20px', cursor: 'pointer' }}
                  className='la la-angle-down'
                  data-toggle='collapse'
                  onClick={this.toggleCollapse}
                  id={`icon-${this.props.id}`}
                  data-target={`#collapse_${this.props.id}`}
                />
              </span>
            </h4>
          </div>
          <div id={`collapse_${this.props.id}`} className='collapse' aria-labelledby={`heading-${this.props.id}`} data-parent="#accordion">
            <div className='card-body'>
              {this.props.body}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Collapse.defaultProps = {
  'showBadge': false
}

Collapse.propTypes = {
  'id': PropTypes.string.isRequired,
  'title': PropTypes.string.isRequired,
  'body': PropTypes.element.isRequired,
  'showBadge': PropTypes.bool,
  'badgeText': PropTypes.string,
  'badgeStyle': PropTypes.string
}

export default Collapse
