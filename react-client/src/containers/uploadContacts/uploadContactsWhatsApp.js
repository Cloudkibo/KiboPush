/* eslint-disable no-undef */
/**
 * Created by sojharo on 20/07/2017.
 */

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class UploadContacts extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }
    document.title = `${title} | Upload Contacts`
  }

  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-subheader '>
          <div className='d-flex align-items-center'>
            <div className='mr-auto'>
              <h3 className='m-subheader__title'>Customer Base</h3>
            </div>
          </div>
        </div>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-12'>
              <div className='m-portlet'>
                <div className='m-portlet__body'>
                  In order to send broadcasts and have chat with your whatsApp customers, you need to make them subscribers of your whatsapp sanbox. In order to do so, please follow the instructions below:
                  <br /><br />
                  <b>1. Setup Webhook:</b> Go to <a href='https://www.twilio.com/console/sms/whatsapp/sandbox' target='_blank' rel='noopener noreferrer'>https://www.twilio.com/console/sms/whatsapp/sandbox</a>. Set this URL <i>https://webhook.cloudkibo.com/webhooks/twilio/receiveWhatsApp</i> in When the message comes in field.
                  <br /><br />
                  <b>2. Connect to sandbox:</b> Ask your customers to send a whatsApp message to your sandbox number {this.props.automated_options.twilioWhatsApp.sandboxNumber} with code <i>{this.props.automated_options.twilioWhatsApp.sandboxCode}</i>.
                  <br /><br />
                  <b>3: Become Subscriber:</b> Now ask your cutomer to send any whatsApp message to your sandbox number {this.props.automated_options.twilioWhatsApp.sandboxNumber}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    automated_options: (state.basicInfo.automated_options)
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(UploadContacts)
