import React from 'react'
import CreateBroadcastTemplate from './createBroadcastTemplate'

class EditBroacastTemplate extends React.Component {
  componentDidMount () {
    const hostname = window.location.hostname
    let title = ''
    if (hostname.includes('kiboengage.cloudkibo.com')) {
      title = 'KiboEngage'
    } else if (hostname.includes('kibochat.cloudkibo.com')) {
      title = 'KiboChat'
    }

    document.title = `${title} | Edit Broadcast Template`
  }
  render () {
    return (
      <CreateBroadcastTemplate template={this.props.location.state} />
    )
  }
}

export default EditBroacastTemplate
