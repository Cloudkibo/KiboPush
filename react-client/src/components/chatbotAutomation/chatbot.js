import React from 'react'
import PropTypes from 'prop-types'

class Chatbot extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render () {
    return (
      <div onClick={this.props.onItemClick} style={{paddingRight: '15px', cursor: 'pointer'}} className='tab-content'>
        <div className='tab-pane active'>
          <div className="m-widget5">
            <div style={{border: '1px solid #ccc', padding: '0px'}} className="m-widget5__item">
              <div style={{width: '50px'}} className="m-widget5__pic">
                <img style={{width: '50px'}} className="m-widget7__img" src={this.props.profilePic} alt="" />
              </div>
              <div style={{padding: '10px'}}>
                <span className="m--font-boldest">
                  {this.props.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Chatbot.propTypes = {
  'profilePic': PropTypes.string.isRequired,
  'name': PropTypes.string.isRequired,
  'onItemClick': PropTypes.func.isRequired
}

export default Chatbot
