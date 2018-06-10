import React from 'react'
import {injectStripe, CardElement} from 'react-stripe-elements'
const handleBlur = () => {
  console.log('[blur]');
};
const handleChange = (change) => {
  console.log('[change]', change);
};
const handleClick = () => {
  console.log('[click]');
};
const handleFocus = () => {
  console.log('[focus]');
};
const handleReady = () => {
  console.log('[ready]');
};
const createOptions = (fontSize, padding) => {
  return {
    style: {
      base: {
        fontSize,
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: 'Source Code Pro, monospace',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding,
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };
};
class CheckoutForm extends React.Component {

  handleSubmit (ev) {
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault()

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({name: 'Jenny Rosen'}).then(({token}) => {
      console.log('Received Stripe token:', token)
    })

    // However, this line of code will do the same thing:
    //
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    //
    // this.props.stripe.createSource({type: 'card', name: 'Jenny Rosen'});
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
Card details:
            </label>
<CardElement
onBlur={handleBlur}
onChange={handleChange}
onFocus={handleFocus}
onReady={handleReady}
{...createOptions(this.props.fontSize)}
/>
<br /><br />
<center>
<button className='btn btn-primary'>Pay $10.00</button>
        <button>Confirm order</button>
        </center>
      </form>
    );
  }
}

export default injectStripe(CheckoutForm)
