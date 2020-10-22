import React from 'react'
import PropTypes from 'prop-types'

class ComponentSelection extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
    }
  }


  render () {
    return (
      <div id='_cb_ma_mo' className='row'>
        <div className='col-md-12'>
          <div className="form-group m-form__group">
            <button
                style={{border: 'none', cursor: 'pointer', background: 'none', marginRight: '15px'}}
                className='m-link m-link--state m-link--info'
                id='_add_attachment_selection'
                onClick={() => this.props.onSelectComponent('attachment')}
            >
                + Add Attachment
            </button>
            <button
                style={{border: 'none', cursor: 'pointer', background: 'none', marginRight: '15px'}}
                className='m-link m-link--state m-link--info'
                id='_add_carousel_selection'
                onClick={() => this.props.onSelectComponent('carousel')}
            >
                + Add Carousel
            </button>
            <button
                style={{border: 'none', cursor: 'pointer', background: 'none', marginRight: '15px'}}
                className='m-link m-link--state m-link--info'
                id='_add_link_carousel_selection'
                onClick={() => this.props.onSelectComponent('linkCarousel')}
            >
                + Add Link Carousel
            </button>
          </div>
        </div>
      </div>
    )
  }
}

ComponentSelection.defaultProps = {

}

ComponentSelection.propTypes = {
  'onSelectComponent': PropTypes.func.isRequired
}

export default ComponentSelection
