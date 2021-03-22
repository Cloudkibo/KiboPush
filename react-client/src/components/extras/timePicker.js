import React from 'react'
import PropTypes from 'prop-types'

class TimePicker extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      clicked: this.props.value ? true : false
    }

    this.onClick = this.onClick.bind(this)
    this.onTimeChange = this.onTimeChange.bind(this)
  }

  onClick () {
    this.setState({clicked: true})
  }

  onTimeChange (e) {
    this.props.onTimeChange(e.target.value)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.value) {
      this.setState({clicked: true})
    }
  }

  render () {
    return (
      <div className='m-widget4'>
        <div
          style={{
            padding: '10px',
            border: '1px solid #999',
            borderRadius: '12px',
            cursor: 'pointer'
          }}
          onClick={this.onClick}
          className="m-widget4__item"
        >
          <div className="m-widget4__img m-widget4__img--logo">
            <i style={{fontSize: '2.5rem'}} className='la la-clock-o' />
          </div>
          <div className="m-widget4__info">
            {
              this.state.clicked
              ? <>
                <span style={{fontSize: '12px'}} className="m-widget4__title m--font-brand">
                  {this.props.label}
                </span>
                <br />
                <input
                  type="time"
                  className='form-control'
                  style={{padding: '0px', border: '0px', boxShadow: 'none'}}
                  value={this.props.value}
                  onChange={this.onTimeChange}
                />
              </>
              : <span className="m-widget4__title">
                {this.props.label}
              </span>
            }
          </div>
        </div>
      </div>
    )
  }
}

TimePicker.propTypes = {
  'label': PropTypes.string.isRequired,
  'value': PropTypes.string.isRequired,
  'onTimeChange': PropTypes.func.isRequired
}

export default TimePicker
