import React from "react"
import PropTypes from 'prop-types'
import ACTIONSPOPOVER from './actionsPopover'

class ActionsArea extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      showComponentsPopover: false
    }
    this.showComponentsPopover = this.showComponentsPopover.bind(this)
    this.toggleComponentsPopover = this.toggleComponentsPopover.bind(this)
    this.addActionItem = this.addActionItem.bind(this)
  }

  showComponentsPopover () {
    this.setState({showComponentsPopover: true})
  }

  toggleComponentsPopover () {
    this.setState({showComponentsPopover: !this.state.showComponentsPopover})
  }

  addActionItem (type) {
    console.log(type)
  }

  render () {
    console.log('currentId in actionsArea', this.props.currentId)
    return (
      <div>

        <ACTIONSPOPOVER
          showPopover={this.state.showComponentsPopover}
          togglePopover={this.toggleComponentsPopover}
          targetId={`action-${this.props.currentId}`}
          addActionItem={this.addActionItem}
        />

        <button
          id={`action-${this.props.currentId}`}
          style={{border: '1px dashed #36a3f7'}}
          onClick={this.showComponentsPopover}
          type="button"
          className="btn m-btn--pill btn-outline-info btn-sm m-btn m-btn--custom"
        >
          + Add Action
        </button>
      </div>
    )
  }
}

ActionsArea.propTypes = {
  'currentId': PropTypes.string.isRequired
}

export default ActionsArea
