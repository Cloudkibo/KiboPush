import React from "react"
import PropTypes from 'prop-types'
import COMPONENTSPOPOVER from './componentsPopover'
import PREVIEW from '../broadcast/preview/main'
import ReactTooltip from 'react-tooltip'

const tooltipText = 'You can only add upto 3 components per message.'

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
    console.log('props in componentsArea', this.props)
    return (
      <div>

        <ReactTooltip
          place='right'
          type='info'
          multiline={true}
          disable={!(this.props.items.length === 4)}
        />

        <COMPONENTSPOPOVER
          showPopover={this.state.showComponentsPopover}
          togglePopover={this.toggleComponentsPopover}
          targetId={`message-${this.props.currentId}`}
          showAddComponentModal={this.props.showAddComponentModal}
          handleSidePanel={this.props.handleSidePanel}
          sidePanelStyle={this.props.sidePanelStyle}
          currentId={this.props.currentId}
          updateBroadcastData={this.props.updateBroadcastData}
        />

        <PREVIEW
          profilePic={this.props.page.pagePic}
          items={this.props.items}
          updateBroadcastData={this.props.updateBroadcastData}
          blockId={this.props.currentId}
          handleSidePanel={this.props.handleSidePanel}
          sidePanelStyle={this.props.sidePanelStyle}
          activeComponent={this.props.activeComponent}
        />

        <button
          data-tip={tooltipText}
          id={`message-${this.props.currentId}`}
          onClick={this.props.items.length !== 4 && this.showComponentsPopover}
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
  'showAddComponentModal': PropTypes.func.isRequired,
  'items': PropTypes.array.isRequired,
  'changeMessage': PropTypes.func.isRequired,
  'sidePanelStyle': PropTypes.object.isRequired,
  'handleSidePanel': PropTypes.func.isRequired,
  'currentId': PropTypes.string.isRequired,
  'updateBroadcastData': PropTypes.func.isRequired,
  'page': PropTypes.object.isRequired
}

export default ComponentsArea
