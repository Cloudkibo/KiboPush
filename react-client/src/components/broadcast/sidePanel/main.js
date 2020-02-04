import React from 'react'
import PropTypes from 'prop-types'

class SidePanel extends React.Component {
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
        <div id='broadcast_side_panel_body' style={{padding: '20px'}}></div>
        <div id='broadcast_side_panel_footer' style={{bottom: 0, right: 0, position: 'fixed', padding: '20px'}}>
          <div className='pull-right'>
            <button style={{marginRight: '20px'}} className='btn btn-secondary' onClick={() => {this.props.handleSidePanel(false)}}>
              Cancel
            </button>
            <button className='btn btn-primary'>
              Add
            </button>
          </div>
        </div>
      </div>
    )
  }
}

SidePanel.propTypes = {
  'panelProps': PropTypes.object.isRequired,
  'handleSidePanel': PropTypes.func.isRequired
}

export default SidePanel
