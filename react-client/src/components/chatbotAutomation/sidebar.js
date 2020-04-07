import React from 'react'
import PropTypes from 'prop-types'
import TreeView from '@material-ui/lab/TreeView'
import StyledTreeItem from './styledTreeItem'

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      items: []
    }

    this.getCollapseIcon = this.getCollapseIcon.bind(this)
    this.getExpandIcon = this.getExpandIcon.bind(this)
    this.prepareSidebarData = this.prepareSidebarData.bind(this)
  }

  prepareSidebarData (data) {}

  getCollapseIcon () {
    return (
      <i className='fa fa-chevron-down' />
    )
  }

  getExpandIcon () {
    return (
      <i className='fa fa-chevron-right' />
    )
  }

  render () {
    return (
      <div style={{border: '1px solid #ccc', backgroundColor: 'white', padding: '0px'}} className='col-md-3'>
        <div className='m-portlet m-portlet-mobile'>
          <div style={{height: '75vh'}} className='m-portlet__body'>
            <TreeView
              defaultCollapseIcon={this.getCollapseIcon()}
              defaultExpandIcon={this.getExpandIcon()}
            >
              <StyledTreeItem nodeId='1' label='Welcome' selected={false} completed={true}>
                <StyledTreeItem nodeId="2" label="Calendar" selected={true} completed={false} />
                <StyledTreeItem nodeId="3" label="Chrome" selected={false} completed={false} />
                <StyledTreeItem nodeId="4" label="Webstorm" selected={false} completed={false} />
                <StyledTreeItem nodeId="5" label="Documents" selected={false} completed={false}>
                  <StyledTreeItem nodeId="10" label="OSS" selected={false} completed={false} />
                  <StyledTreeItem nodeId="6" label="Material-UI" selected={false} completed={false} />
                </StyledTreeItem>
              </StyledTreeItem>
            </TreeView>
          </div>
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  'data': PropTypes.array.isRequired
}

export default Sidebar
