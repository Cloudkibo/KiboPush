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
          <div className="m-widget4">
            <div style={{ border: '1px solid #ccc', padding: '0px', margin: '0.5rem 0px' }} className="m-widget4__item">
              <div style={{ width: '50px', background: colors.lightColor, textAlign: 'center', fontSize: '25px', fontWeight: 600, verticalAlign: 'middle' }} className="m-widget4__img">
                <span style={{ width: '50px', color: colors.darkColor }} className="m-widget7__img">
                  {this.props.name.charAt(0)}
                </span>
              </div>
              <div className='m-widget4__info'>
                <span className="m-widget4__title">
                  {this.props.name}
                </span>
                {
                  this.props.showSubtitle &&
                  <>
                    <br />
                    <span className='m-widget4__sub'>DialogFlow: <i className='fa fa-check-circle m--font-success' /></span>
                  </>
                }
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
  'onItemClick': PropTypes.func.isRequired,
  'showSubtitle': PropTypes.bool.isRequired
}

export default Chatbot
