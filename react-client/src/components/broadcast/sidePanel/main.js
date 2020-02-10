import React from 'react'
import PropTypes from 'prop-types'
import TEXT from './text'

class SidePanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.getComponent = this.getComponent.bind(this)
  }

  getComponent (component) {
    switch (component) {
      case 'text':
        return <TEXT
          updateBroadcastData={this.props.updateBroadcastData}
          blockId={this.props.panelProps.blockId}
          componentId={this.props.panelProps.componentId}
        />
      default:
        return null
    }
  }

  render () {
    return (
      <div className="m-quick-sidebar__content">
        <div id='broadcast_side_panel_header' style={this.props.panelProps.headerStyle}>
          <div style={{padding: '20px'}}>
            <h5>
              {this.props.panelProps.action + ' ' + this.props.panelProps.component} component
              <span style={{cursor: 'pointer'}} id="m_quick_sidebar_close" class="pull-right" onClick={() => {this.props.handleSidePanel(false)}}>
                <i class="la la-close"></i>
              </span>
            </h5>
          </div>
        </div>
        <div id='broadcast_side_panel_body' style={{padding: '20px'}}>
          { this.props.panelProps.visible && this.getComponent(this.props.panelProps.component) }
        </div>
        <div id='broadcast_side_panel_footer' style={{bottom: 0, right: 0, position: 'fixed', padding: '20px'}}>
          <div className='pull-right'>
            <button onClick={() => {this.props.handleSidePanel(false)}} className='btn btn-primary'>
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }
}

SidePanel.propTypes = {
  'panelProps': PropTypes.object.isRequired,
  'handleSidePanel': PropTypes.func.isRequired,
  'updateBroadcastData': PropTypes.func.isRequired
}

export default SidePanel
