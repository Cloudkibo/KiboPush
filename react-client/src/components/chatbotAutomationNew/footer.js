import React from 'react'
import PropTypes from 'prop-types'

class Footer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      loading: false
    }
    this.onNext = this.onNext.bind(this)
    this.afterNext = this.afterNext.bind(this)
  }

  onNext () {
    this.setState({loading: true})
    this.props.onNext(this.afterNext)
  }

  afterNext () {
    this.setState({loading: false})
  }

  render () {
    return (
      <div id='_cb_ma_footer' style={{position: 'absolute', bottom: 0, marginBottom: '15px', width: '100%', right: '15px'}} className='row'>
        <div className='col-md-6'>
        </div>
        <div className='col-md-6'>
          <button
            type='button'
            id='_cb_ma_footer_next'
            className={`pull-right btn btn-primary m-btn m-btn--icon ${this.state.loading && 'm-loader m-loader--light m-loader--right'}`}
            onClick={this.onNext}
            disabled={this.props.disableNext}
          >
            <span>
              <span>Save Changes</span>
            </span>
          </button>
        </div>
      </div>
    )
  }
}

Footer.propTypes = {
  'onNext': PropTypes.func.isRequired,
  'disableNext': PropTypes.bool.isRequired
}

export default Footer
