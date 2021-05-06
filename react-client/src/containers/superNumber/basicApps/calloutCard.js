import React from "react"
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

class CalloutCard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleInput = this.handleInput.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  handleCheckbox (e) {
    let callOutCard = JSON.parse(JSON.stringify(this.props.callOutCard))
    callOutCard.enabled = e.target.checked
    this.props.updateState({callOutCard})
  }

  handleInput (e, value) {
    let callOutCard = JSON.parse(JSON.stringify(this.props.callOutCard))
    if (value === 'cardText' && e.target.value.length <= 60) {
      callOutCard.cardText = e.target.value
    } else if (value === 'cardDelay'){
      callOutCard.cardDelay = e.target.value
    }
    this.props.updateState({callOutCard})
  }

  render () {
    return (
      <div className='accordion'>
        <div className='card'>
          <div className='card-header'>
            <h4 className='mb-0'>
              <div
                style={{fontSize: 'medium', fontWeight: '500'}}
                className='btn'
                aria-expanded='true'
              >
                Callout Card
                <i data-for='info' className='la la-info-circle' style={{cursor: 'pointer', marginLeft: '15px'}}
                  data-tip='Callout card makes the chat button more noticeable to new visitors of your store. A store visitor will see the callout card once in 24 hours'
                />
              </div>
            </h4>
          </div>
          <div data-parent="#accordion">
            <div className='card-body'>
              <div className='form-group m-form__group'>
                <ReactTooltip
                id='info'
                place='right'
                type='info'
                multiline={true}
              />
              </div>
              <div className='form-group m-form__group'>
                <div className='form-group m-form__group' style={{paddingLeft: '15px'}}>
                  <label className="m-checkbox" style={{fontWeight: '300'}}>
                    <input
                      type="checkbox"
                      onChange={this.handleCheckbox}
                      checked={this.props.callOutCard.enabled} />
                      Show callout card above chat button
                    <span></span>
                  </label>
                </div>
                <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                  <label style={{fontWeight: 'normal'}}>Callout Card text:</label>
                  <textarea type="text" className="form-control m-input"
                    style={{marginLeft: '42px', width: '45%', marginTop: '-7px'}}
                    onChange={(e) => this.handleInput(e, 'cardText')}
                    value={this.props.callOutCard.cardText} />
                </div>
                <div className='form-group m-form__group' style={{paddingLeft: '30px'}}>
                  <div className='row'>
                    <label style={{fontWeight: 'normal'}}>Callout Card delay:</label>
                    <input className="form-control m-input" required
                      type='number' style={{width: '10%', marginTop: '-7px', marginLeft: '28px'}}
                      min='5' step='1' max='8'
                      onChange={(e) => this.handleInput(e, 'cardDelay')}
                      value={this.props.callOutCard.cardDelay} />
                    <span style={{marginLeft: '10px'}}>seconds</span>
                  </div>
                  <span style={{paddingLeft: '148px'}}>Time after which callout card is displayed, after chat button has loaded
                  </span>
                </div>
                <div className='form-group m-form__group row' style={{paddingLeft: '30px'}}>
                  <a href='https://cdn.shopify.com/s/files/1/0070/3666/5911/files/callout_card_chat_widget_preview.png?1385' target='_blank' rel='noopener noreferrer' className='m-btn--icon'>
                    <span>
                      <i className="fa fa-external-link"></i>
                      <span>
                        Preview
                      </span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CalloutCard.propTypes = {
  'callOutCard': PropTypes.object.isRequired,
  'updateState': PropTypes.func.isRequired
}

export default CalloutCard
