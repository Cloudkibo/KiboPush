import React from 'react'
import PropTypes from 'prop-types'
import COMPONENTCONTAINER from './componentContainer'

class CarouselArea extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }

  render () {
    return (
      <div id='_chatbot_message_area_carousel' className='row'>
        <div className='col-md-12'>
          <div className="form-group m-form__group">
            <span className='m--font-boldest'>{this.props.title}</span>
              <COMPONENTCONTAINER onRemove={this.props.onRemove}>
                <button
                    id={`_edit_carousel`}
                    type="button"
                    style={{border: '1px solid #36a3f7'}}
                    className="btn m-btn--pill btn-outline-info btn-sm"
                    onClick={this.props.onClick}
                >
                    {this.props.buttonTitle}
                </button>
              </COMPONENTCONTAINER>
            </div>
          </div>
        </div>
    )
  }
}

CarouselArea.propTypes = {
    title: PropTypes.string.isRequired,
    buttonTitle: PropTypes.string.isRequired
}

export default CarouselArea
