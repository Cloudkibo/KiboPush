import React from 'react'
import CreateBroadcastTemplate from './createBroadcastTemplate'

class EditBroacastTemplate extends React.Component {
  render () {
    return (
      <div>
        <CreateBroadcastTemplate template={this.props.location.state} />
      </div>
    )
  }
}

export default EditBroacastTemplate
