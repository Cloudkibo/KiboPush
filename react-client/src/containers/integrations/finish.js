import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class Finish extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    return (
      <div className="m-grid__item m-grid__item--order-tablet-and-mobile-2 m-login__aside" style={{padding: '2rem'}}>
        <div style={{position: 'relative'}}>
          <div style={{position: 'absolute', marginTop: '25%', left: '15%'}}>
            <center>
              <img alt='completed' src='https://cdn.cloudkibo.com/public/icons/PE-Success-Icon.png' width='150' height='150'></img>
              <br /><br />
              <span>
                {this.props.description}
              </span>
              <br /><br /><br /><br></br>
              {this.props.showFinishButton &&
                <Link to='/dashboard' className='btn btn-success m-btn m-btn--custom m-btn--icon'>
                  Finish
                </Link>
              }
            </center>
          </div>
        </div>
      </div>
    )
  }
}
Finish.propTypes = {
  'description': PropTypes.string.isRequired,
  'showFinishButton': PropTypes.bool
}

export default Finish