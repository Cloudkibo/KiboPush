import React from 'react'
import PropTypes from 'prop-types'
import TreeView from '@material-ui/lab/TreeView'
import StyledTreeItem from './styledTreeItem'

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {}
    this.getCollapseIcon = this.getCollapseIcon.bind(this)
    this.getExpandIcon = this.getExpandIcon.bind(this)
    this.getItems = this.getItems.bind(this)
  }

  getItems () {
    if (this.props.data.length > 1) {
      //
    } else {
      return (
        <StyledTreeItem
          nodeId={`${this.props.data[0].id}`}
          label={this.props.data[0].title}
          selected={true}
          completed={false}
        />
      )
    }
  }

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
        <div style={{margin: '0px'}} className='m-portlet m-portlet-mobile'>
          <div style={{height: '80vh'}} className='m-portlet__body'>
            <TreeView
              defaultCollapseIcon={this.getCollapseIcon()}
              defaultExpandIcon={this.getExpandIcon()}
            >
              {this.getItems()}
              {/*
                <StyledTreeItem nodeId='1' label='Welcome' selected={false} completed={true}>
                  <StyledTreeItem nodeId="2" label="Calendar" selected={true} completed={false} />
                  <StyledTreeItem nodeId="3" label="Chrome" selected={false} completed={false} />
                  <StyledTreeItem nodeId="4" label="Webstorm" selected={false} completed={false} />
                  <StyledTreeItem nodeId="5" label="Documents" selected={false} completed={false}>
                    <StyledTreeItem nodeId="10" label="OSS" selected={false} completed={false} />
                    <StyledTreeItem nodeId="6" label="Material-UI" selected={false} completed={false} />
                  </StyledTreeItem>
                </StyledTreeItem>
              */}
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
