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
      <div style={{position: 'absolute', bottom: 0, marginBottom: '15px', width: '100%', right: '15px'}} className='row'>
        <div className='col-md-6'>
          {
            this.props.showPrevious &&
            <button
              type='button'
              className='pull-left btn btn-secondary m-btn m-btn--icon'
              onClick={this.props.onPrevious}
            >
              <span>
                <i className='la la-arrow-left' />
                <span>Previous</span>
              </span>
            </button>
          }
        </div>
        <div className='col-md-6'>
          {
            this.props.showNext &&
            <button
              type='button'
              className={`pull-right btn btn-primary m-btn m-btn--icon ${this.state.loading && 'm-loader m-loader--light m-loader--right'}`}
              onClick={this.onNext}
            >
              <span>
                <span>Next</span>
                {
                  !this.state.loading &&
                  <i style={{paddingLeft: '.5em'}} className='la la-arrow-right' />
                }
              </span>
            </button>
          }
        </div>
      </div>
    )
  }
}

Footer.propTypes = {
  'showPrevious': PropTypes.bool.isRequired,
  'showNext': PropTypes.bool.isRequired,
  'onNext': PropTypes.func.isRequired,
  'onPrevious': PropTypes.func.isRequired
}

export default Footer
