import React from "react"
import PropTypes from 'prop-types'

class SendMessageModal extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleNumber = this.handleNumber.bind(this)
    this.handleTemplate = this.handleTemplate.bind(this)
  }

  handleTemplate (e) {
    this.props.updateState({
      selectedTemplateName: e.target.value,
      selectedTemplate: this.props.templates[e.target.value]['english']
    })
  }

  handleNumber (e) {
    this.props.updateState({supportNumber: e.target.value})
  }

  render () {
    return (
      <div className="modal-body">
        <div className="form-group m-form__group col-lg-12">
        <label style={{fontWeight: 'normal'}}>WhatsApp Support Number:</label>
        <input
          style={{marginTop: '5px'}}
          placeholder='Enter your WhatsApp support number here...'
          value={this.props.supportNumber}
          onChange={this.handleNumber}
          className="form-control m-input" />
        </div>
        {this.props.showSelectTemplate &&
          <div className='form-group m-form__group col-lg-12'>
          <label style={{fontWeight: 'normal'}}>Select a Template:</label>
            <div className="row m-radio-inline" style={{marginTop: '5px'}}>
              <div className='col-md-6'>
              <label className="m-radio" style={{fontWeight: 'lighter'}}>
                <input
                  type='radio'
                  value='ORDER_CONFIRMATION'
                  onChange={this.handleTemplate}
                  onClick={this.handleTemplate}
                  checked={this.props.selectedTemplateName === 'ORDER_CONFIRMATION'}
                />
              Order Confirmation
                <span></span>
              </label>
            </div>
            {this.props.showShipment &&
              <div className='col-md-6'>
                <label className="m-radio" style={{fontWeight: 'lighter'}}>
                  <input
                    type='radio'
                    value='ORDER_SHIPMENT'
                    onChange={this.handleTemplate}
                    onClick={this.handleTemplate}
                    checked={this.props.selectedTemplateName === 'ORDER_SHIPMENT'}
                   />
                 Order Shipment
                  <span></span>
                </label>
              </div>
            }
            </div>
        </div>
      }
        <div className='form-group m-form__group col-lg-12'>
          <label style={{fontWeight: 'normal'}}>Template Message:</label>
          <textarea
            style={{resize: 'none'}}
            readonly rows='6'
            value={this.props.templateMessage}
            className='form-control m-input m-input--solid' />
        </div>
        <div className='row' style={{paddingTop: '30px'}}>
          <div className='col-lg-6 m--align-left'>
          </div>
          <div className='col-lg-6 m--align-right'>
            <button onClick={this.props.sendMessage} class="btn btn-primary">Send</button>
        </div>
      </div>
      </div>
    )
  }
}

SendMessageModal.propTypes = {
  'showSelectTemplate': PropTypes.bool,
  'supportNumber': PropTypes.string.isRequired,
  'templateMessage': PropTypes.string.isRequired,
  'selectedTemplateName': PropTypes.string.isRequired,
  'templates': PropTypes.object.isRequired,
  'updateState': PropTypes.func.isRequired,
  'sendMessage': PropTypes.func.isRequired,
  'showShipment': PropTypes.string.isRequired,
}

export default SendMessageModal
