import React from "react"
import PropTypes from 'prop-types'

class ActionsArea extends React.Component {
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
      codTags.cancelTag = e.target.value
    } else if (tag === 'confirm') {
      codTags.confirmTag = e.target.value
    } else if (tag === 'no-response') {
      codTags.noResponseTag = e.target.value
    }
    this.props.updateState({ codTags })
  }

  render () {
    return (
      <div key='codTags' className='accordion' id='accordionCodTags'>
        <div className='card'>
          <div className='card-header' id='headingCodTags'>
            <h4 className='mb-0' onClick={() => this.expendRowToggle()}>
              <div
                style={{fontSize: 'medium', fontWeight: '500'}}
                className='btn'
                data-toggle='collapse'
                data-target='#collapse_codTags'
                aria-expanded='true'
                aria-controls='#collapse_codTags'
              >
                Tags for COD Orders
              </div>
              <span style={{float: 'right', marginRight: '12px', marginTop: '5px'}}>
                <i
                  id='icon-codTags'
                  style={{ fontSize: '20px', marginLeft: '30px', cursor: 'pointer' }}
                  className='la la-angle-down'
                  data-toggle='collapse'
                  data-target='#collapse_codTags'
                />
              </span>
            </h4>
          </div>
          <div id='collapse_codTags' className='collapse' aria-labelledby='headingCodTags' data-parent="#accordion">
            <div className='card-body'>
              <form>
                <p>Automatically add tags to your orders based on COD order status.</p>
                <div className="form-group m-form__group col-lg-8">
                <label style={{fontWeight: 'normal'}}>Order Confirmed Tag</label>
                <input
                  style={{marginTop: '5px', width: '50%'}}
                  value={this.props.codTags.confirmTag}
                  onChange={(e) => {this.handleTags(e, 'confirm')}}
                  className="form-control m-input" />
                </div>
                <div className="form-group m-form__group col-lg-8">
                <label style={{fontWeight: 'normal'}}>Order Cancelled Tag</label>
                <input
                  style={{marginTop: '5px', width: '50%'}}
                  value={this.props.codTags.cancelTag}
                  onChange={(e) => {this.handleTags(e, 'cancel')}}
                  className="form-control m-input" />
                </div>
                <div className="form-group m-form__group col-lg-8">
                <label style={{fontWeight: 'normal'}}>No Response Tag</label>
                <input
                  style={{marginTop: '5px', width: '50%'}}
                  value={this.props.codTags.noResponseTag}
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

ActionsArea.propTypes = {
  'language': PropTypes.string.isRequired,
  'supportNumber': PropTypes.string.isRequired,
  'updateState': PropTypes.func.isRequired

}

export default ActionsArea
