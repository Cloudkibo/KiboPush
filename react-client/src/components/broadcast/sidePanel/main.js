import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { uploadAttachment } from '../../../redux/actions/convos.actions'
import TEXT from './text'
import ATTACHMENTS from './attachments'

class SidePanel extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.getComponent = this.getComponent.bind(this)
    this.getComponentName = this.getComponentName.bind(this)
    this.showErrorMessage = this.showErrorMessage.bind(this)
  }

  showErrorMessage (message) {
    this.props.alertMsg.error(message)
  }

  getComponentName (name) {
    if (['attachments', 'file', 'media'].includes(name)) {
      return 'attachments'
    } else {
      return name
    }
  }

  getComponent (component) {
    switch (component) {
      case 'text':
        return <TEXT
          updateBroadcastData={this.props.updateBroadcastData}
          blockId={this.props.panelProps.blockId}
          componentData={this.props.panelProps.componentData}
        />
      case 'attachments':
        return <ATTACHMENTS
          updateBroadcastData={this.props.updateBroadcastData}
          blockId={this.props.panelProps.blockId}
          componentData={this.props.panelProps.componentData}
          showErrorMessage={this.showErrorMessage}
          uploadAttachment={this.props.uploadAttachment}
          page={this.props.page}
        />
      case 'file':
        return <ATTACHMENTS
          updateBroadcastData={this.props.updateBroadcastData}
          blockId={this.props.panelProps.blockId}
          componentData={this.props.panelProps.componentData}
          showErrorMessage={this.showErrorMessage}
          uploadAttachment={this.props.uploadAttachment}
          page={this.props.page}
        />
      case 'audio':
        return <ATTACHMENTS
          updateBroadcastData={this.props.updateBroadcastData}
          blockId={this.props.panelProps.blockId}
          componentData={this.props.panelProps.componentData}
          showErrorMessage={this.showErrorMessage}
          uploadAttachment={this.props.uploadAttachment}
          page={this.props.page}
        />
      case 'media':
        return <ATTACHMENTS
          updateBroadcastData={this.props.updateBroadcastData}
          blockId={this.props.panelProps.blockId}
          componentData={this.props.panelProps.componentData}
          showErrorMessage={this.showErrorMessage}
          uploadAttachment={this.props.uploadAttachment}
          page={this.props.page}
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
              {this.props.panelProps.action + ' ' + this.getComponentName(this.props.panelProps.componentData.componentName)} component
              {
                /*
                <span style={{cursor: 'pointer'}} id="m_quick_sidebar_close" class="pull-right" onClick={() => {this.props.handleSidePanel(false)}}>
                  <i class="la la-close"></i>
                </span>
                */
              }
            </h5>
          </div>
        </div>
        <div id='broadcast_side_panel_body' style={{padding: '20px'}}>
          { this.props.panelProps.visible && this.getComponent(this.props.panelProps.componentData.componentName) }
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
  'updateBroadcastData': PropTypes.func.isRequired,
  'page': PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
      uploadAttachment
  }, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(SidePanel)
