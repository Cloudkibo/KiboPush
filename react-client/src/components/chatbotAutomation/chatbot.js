import React from 'react'
import PropTypes from 'prop-types'

class Chatbot extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.onSettingsClick = this.onSettingsClick.bind(this)
  }

  onSettingsClick(e) {
    this.props.onSettingsClick()
    e.stopPropagation()
  }

  render() {
    return (
      <div onClick={this.props.onItemClick} style={{ paddingRight: '15px', cursor: 'pointer' }} className='tab-content'>
        <div className='tab-pane active'>
          <div className="m-widget4">
            <div style={{ border: '1px solid #ccc', padding: '0px', margin: '0.5rem 0px' }} className="m-widget4__item">
              <div style={{ width: '50px' }} className="m-widget4__img">
                <img src={this.props.profilePic} alt="" />
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
              {
                this.props.onSettingsClick &&
                <div style={{padding: '10px'}} className='m-widget4__ext'>
                  <span className='m-widget4__number'>
                    <i onClick={this.onSettingsClick} style={{ marginLeft: '15px', fontSize: '1.5rem', cursor: 'pointer' }} className='fa fa-cog' />
                  </span>
                </div>
              }
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
  'onItemClick': PropTypes.func.isRequired,
  'onSettingsClick': PropTypes.func,
  'showSubtitle': PropTypes.bool
}

export default Chatbot
