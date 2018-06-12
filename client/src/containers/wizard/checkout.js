/* eslint-disable no-useless-constructor */
import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import {CardElement, injectStripe} from 'react-stripe-elements'

const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4'
        },
        padding
      },
      invalid: {
        color: '#9e2146'
      }
    }
  }
}

class CheckoutForm extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount () {
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.body.appendChild(addScript)
  }

  handleSubmit (ev) {
    ev.preventDefault()
    console.log('ev', ev)
    if (this.props.stripe) {
      console.log('this.props.stripe', this.props.stripe)
      this.props.stripe
        .createToken()
        .then((payload) => {
          console.log('[token]', payload)
          this.props.setCard(payload.token.id)
        })
    } else {
      console.log('Stripe.js hasnt loaded yet.')
    }
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Card details:
        </label>
        <CardElement
          {...createOptions(this.props.fontSize)}
        />
        <br /><br />
        <ReCAPTCHA ref='recaptcha' sitekey='6LckQ14UAAAAAFH2D15YXxH9o9EQvYP3fRsL2YOU' />
        <br /><br />
        <center>
          <button className='btn btn-primary'>Save</button>
        </center>
      </form>
    )
  }
}
export default injectStripe(CheckoutForm)
