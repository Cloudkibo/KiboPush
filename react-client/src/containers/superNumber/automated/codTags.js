import React from "react"
import PropTypes from 'prop-types'

class CodTags extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.expendRowToggle = this.expendRowToggle.bind(this)
    this.handleTags = this.handleTags.bind(this)
  }

  expendRowToggle () {
    let className = document.getElementById(`icon-codTags`).className
    if (className === 'la la-angle-up collapsed') {
      document.getElementById(`icon-codTags`).className = 'la la-angle-down'
    } else {
      document.getElementById(`icon-codTags`).className = 'la la-angle-up'
    }
  }

  handleTags (e, tag) {
    let codTags = this.props.codTags
    if (tag === 'cancel') {
      codTags.cancelled_tag = e.target.value
    } else if (tag === 'confirm') {
      codTags.confirmed_tag = e.target.value
    } else if (tag === 'no-response') {
      codTags.no_response_tag = e.target.value
    }
    this.props.updateState({ codTags })
  }

  render () {
    return (
      <div key='codTags' className='accordion' id='accordionCodTags'>
        <div className='card'>
          <div className='card-header' id='headingCodTags'>
            <h4 className='mb-0'>
              <div
                style={{fontSize: 'medium', fontWeight: '500'}}
                className='btn'
                data-target='#collapse_codTags'
                aria-expanded='true'
                aria-controls='#collapse_codTags'
              >
                Tags for COD Orders
              </div>
            </h4>
          </div>
          <div id='collapse_codTags' aria-labelledby='headingCodTags' data-parent="#accordion">
            <div className='card-body'>
              <form>
                <p>Automatically add tags to your orders based on COD order status.</p>
                <div className="form-group m-form__group col-lg-8">
                <label style={{fontWeight: 'normal'}}>Order Confirmed Tag</label>
                <input
                  style={{marginTop: '5px', width: '50%'}}
                  value={this.props.codTags.confirmed_tag}
                  onChange={(e) => {this.handleTags(e, 'confirm')}}
                  className="form-control m-input" />
                </div>
                <div className="form-group m-form__group col-lg-8">
                <label style={{fontWeight: 'normal'}}>Order Cancelled Tag</label>
                <input
                  style={{marginTop: '5px', width: '50%'}}
                  value={this.props.codTags.cancelled_tag}
                  onChange={(e) => {this.handleTags(e, 'cancel')}}
                  className="form-control m-input" />
                </div>
                <div className="form-group m-form__group col-lg-8">
                <label style={{fontWeight: 'normal'}}>No Response Tag</label>
                <input
                  style={{marginTop: '5px', width: '50%'}}
                  value={this.props.codTags.no_response_tag}
                  onChange={(e) => {this.handleTags(e, 'no-response')}}
                  className="form-control m-input" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CodTags.propTypes = {
  'updateState': PropTypes.func.isRequired

}

export default CodTags
