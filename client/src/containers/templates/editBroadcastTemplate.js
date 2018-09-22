import React from 'react'
import CreateBroadcastTemplate from './createBroadcastTemplate'

class EditBroacastTemplate extends React.Component {
  render () {
    return (
      <CreateBroadcastTemplate template={this.props.location.state} />
    )
  }
}

export default EditBroacastTemplate
