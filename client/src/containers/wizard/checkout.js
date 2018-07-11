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
      responseReturned: false,
      error: false
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
    // if (!this.state.responseReturned) {
    //   this.setState({error: true})
    //   return
    // }
    console.log('ev', ev)
    if (this.props.stripe) {
      console.log('this.props.stripe', this.props.stripe)
      this.props.stripe
        .createToken({})
        .then((payload) => {
          console.log('[token]', payload)
          if (payload.token && !this.state.responseReturned) {
            this.setState({error: true})
            return
          }
          this.props.setCard(payload.token.id, false)
        })
    } else {
      console.log('Stripe.js hasnt loaded yet.')
    }
  }
  onChange (response) {
    this.setState({responseReturned: true})
    console.log('response', response)
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
        <ReCAPTCHA ref='recaptcha' sitekey={this.props.captchaKey} onChange={this.onChange.bind(this)} />
        {this.state.error &&
          <div id='email-error' style={{color: 'red', fontWeight: 'inherit'}}><bold>Please verify</bold></div>
        }
        <br /><br />
        <center>
          <button className='btn btn-primary'>Save</button>
        </center>
      </form>
    )
  }
}
export default injectStripe(CheckoutForm)
