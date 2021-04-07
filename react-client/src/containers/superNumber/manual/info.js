import React from "react"

class Info extends React.Component {
  render () {
    return (
      <div className='m-alert m-alert--icon m-alert--air m-alert--square alert alert-dismissible m--margin-bottom-30' role='alert'>
        <div className='m-alert__icon'>
          <i className='flaticon-technology m--font-accent' />
        </div>
        <div className='m-alert__text'>
          Manual WhatsApp Messages are sent from our official WhatsApp Business API approved phone number using message templates approved by WhatsApp.
          <br /><br />
          We include your business name and WhatsApp support number in every message. Your customers can recognize you and contact you easily if they need help.
        </div>
      </div>
    )
  }
}
export default Info
