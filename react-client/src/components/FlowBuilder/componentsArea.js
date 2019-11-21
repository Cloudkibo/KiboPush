import React from "react"
import PropTypes from 'prop-types'
import COMPONENTSPOPOVER from './componentsPopover'
import Audio from '../SimplifiedBroadcastUI/PreviewComponents/Audio'
import AudioModal from '../SimplifiedBroadcastUI/AudioModal'

class ComponentsArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showComponentsPopover: false
    }
    this.showComponentsPopover = this.showComponentsPopover.bind(this)
    this.toggleComponentsPopover = this.toggleComponentsPopover.bind(this)
  }

  showComponentsPopover () {
    this.setState({showComponentsPopover: true})
  }

  toggleComponentsPopover () {
    this.setState({showComponentsPopover: !this.state.showComponentsPopover})
  }

  render () {
    return (
      <div>
        <COMPONENTSPOPOVER
          showPopover={this.state.showComponentsPopover}
          togglePopover={this.toggleComponentsPopover}
          targetId={this.props.targetId}
        />
        <button
          id={this.props.targetId}
          onClick={this.showComponentsPopover}
          style={{border: '1px dashed #36a3f7', cursor: 'pointer'}}
          type="button"
          className="btn m-btn--pill btn-outline-info btn-sm m-btn m-btn--custom"
        >
          + Add Component
        </button>
      </div>
    )
  }
}

ComponentsArea.propTypes = {
  'targetId': PropTypes.string.isRequired
}

export default ComponentsArea
