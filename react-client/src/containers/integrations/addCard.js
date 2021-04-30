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

class AddCard extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      responseReturned: false,
      error: false,
      cardError: false,
      cardErrorMessage: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onCardChange = this.onCardChange.bind(this)
  }

  componentDidMount () {
    this.props.setClick(this.handleSubmit)
    var addScript = document.createElement('script')
    addScript.setAttribute('src', 'https://js.stripe.com/v3/')
    document.body.appendChild(addScript)
  }

  onCardChange () {
    this.setState({
      cardError: false,
      cardErrorMessage: ''
    })
  }

  handleSubmit (e) {
    if (this.props.stripe) {
      this.props.stripe
        .createToken({})
        .then((payload) => {
          if (payload.error) {
            this.setState({
              cardError: true,
              cardErrorMessage: payload.error.message
            })
            return
          } else if (payload.token && !this.state.responseReturned) {
            this.setState({
              error: true,
              cardError: false,
              cardErrorMessage: ''
            })
            return
          } else {
            this.setState({
              error: false,
              cardError: false,
              cardErrorMessage: ''
            })
            this.props.handleCard(payload.token.id)
          }
        })
    } else {
      console.log('Stripe.js hasnt loaded yet.')
    }
  }
  onChange (response) {
    this.setState({responseReturned: true, error: false})
  }
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label style={{fontWeight: 'normal'}} className='control-label'>
          Add Card details:
        </label>
        <br /><br />
        <CardElement
          {...createOptions(this.props.fontSize)}
          onChange={this.onCardChange}
        />
        {
          this.state.cardError &&
          <div id='email-error' style={{color: 'red', fontWeight: 'inherit'}}><bold>{this.state.cardErrorMessage}</bold></div>
        }
        <br /><br />
        <ReCAPTCHA ref='recaptcha' sitekey={this.props.captchaKey} onChange={this.onChange.bind(this)} />
        {this.state.error &&
          <div id='email-error' style={{color: 'red', fontWeight: 'inherit'}}><bold>Please verify</bold></div>
        }
      </form>
    )
  }
}
export default injectStripe(AddCard)
