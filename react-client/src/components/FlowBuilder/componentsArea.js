import React from "react"
import PropTypes from 'prop-types'
import DragSortableList from 'react-drag-sortable'
import COMPONENTSPOPOVER from './componentsPopover'

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
    this.setState({showComponentsPopover: true}, () => {
      this.props.changeMessage(this.props.currentId)
    })
  }

  toggleComponentsPopover () {
    this.setState({showComponentsPopover: !this.state.showComponentsPopover}, () => {
      this.props.changeMessage(this.props.currentId)
    })
  }

  render () {
    return (
      <div>

        <COMPONENTSPOPOVER
          showPopover={this.state.showComponentsPopover}
          togglePopover={this.toggleComponentsPopover}
          targetId={`message-${this.props.currentId}`}
          showAddComponentModal={this.props.showAddComponentModal}
        />

        <DragSortableList
          style={{overflowY: 'scroll', height: '75vh'}}
          items={this.props.items}
          dropBackTransitionDuration={0.3}
          type='vertical'
        />

        <button
          id={`message-${this.props.currentId}`}
          onClick={this.showComponentsPopover}
          style={{border: '1px dashed #36a3f7', cursor: 'pointer', marginLeft: '22%', marginRight: '22%'}}
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
  'currentId': PropTypes.string,
  'showAddComponentModal': PropTypes.func.isRequired,
  'items': PropTypes.array.isRequired,
  'changeMessage': PropTypes.func.isRequired
}

export default ComponentsArea
