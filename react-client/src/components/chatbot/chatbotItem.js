import React from 'react'
import PropTypes from 'prop-types'
import { generateRandomColor } from '../../utility/utils'

class Chatbot extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
  }

  render() {
    const colors = generateRandomColor()
    return (
      <div onClick={this.props.onItemClick} style={{ paddingRight: '15px', cursor: 'pointer' }} className='tab-content'>
        <div className='tab-pane active'>
          <div className="m-widget5">
            <div style={{ border: '1px solid #ccc', padding: '0px' }} className="m-widget5__item">
              <div style={{ width: '50px', background: colors.lightColor, textAlign: 'center', fontSize: '25px', fontWeight: 600, verticalAlign: 'middle' }} className="m-widget5__pic">
                <span style={{ width: '50px', color: colors.darkColor }} className="m-widget7__img">
                  {this.props.name.charAt(0)}
                </span>
              </div>
              <div style={{ padding: '10px', textAlign: 'center', verticalAlign: 'middle' }}>
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
  'name': PropTypes.string.isRequired,
  'onItemClick': PropTypes.func.isRequired
}

export default Chatbot
