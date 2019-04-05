import React from 'react'
import ViewMessage from '../../components/ViewMessage/viewMessage'
import { browserHistory } from 'react-router'

class ViewWelcomeMessage extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.goBack = this.goBack.bind(this)
  }

  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | View Message`
  }

  goBack () {
    browserHistory.push({
      pathname: `/welcomeMessage`,
      state: { module: 'welcome' }
    })
  }
  render () {
    return (
      <div className='m-grid__item m-grid__item--fluid m-wrapper'>
        <div className='m-content'>
          <div className='row'>
            <div className='col-xl-6'>
              <h3>View Welcome Message</h3>
              <p>Page: {this.props.location.state.payload.pageName}</p>
              <button onClick={() => this.goBack()} style={{ float: 'left', lineHeight: 2.5 }} className='btn btn-secondary btn-sm'> Back </button>
            </div>
            <div className='col-xl-6'>
              <ViewMessage payload={this.props.location.state.payload.welcomeMessage} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ViewWelcomeMessage
