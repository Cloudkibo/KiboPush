import React from 'react'
import PropTypes from 'prop-types'
import TreeView from '@material-ui/lab/TreeView'
import StyledTreeItem from './styledTreeItem'

class Sidebar extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      expandedNodes: []
    }
    this.getCollapseIcon = this.getCollapseIcon.bind(this)
    this.getExpandIcon = this.getExpandIcon.bind(this)
    this.getItems = this.getItems.bind(this)
    this.getChildren = this.getChildren.bind(this)
    this.expandAll = this.expandAll.bind(this)
    this.onNodeSelect = this.onNodeSelect.bind(this)
    this.getOrphanBlocks = this.getOrphanBlocks.bind(this)
  }

  componentDidMount () {
    if (this.props.data && this.props.data.length > 0) {
      this.expandAll(this.props.data)
    }
  }

  getItems () {
    const firstLevel = this.props.data.filter((item) => !item.parentId)
    const sidebar = (
      <StyledTreeItem
        nodeId={`${firstLevel[0].id}`}
        label={firstLevel[0].title}
        selected={firstLevel[0].id === this.props.currentBlock.uniqueId}
        completed={this.props.blocks.find((item) => item.uniqueId.toString() === firstLevel[0].id.toString()).payload.length > 0}
      >
        {this.getChildren(firstLevel[0].id)}
        {this.getOrphanBlocks(firstLevel[0].id)}
      </StyledTreeItem>
    )
    return sidebar
  }

  getChildren (id) {
    const children = this.props.data.filter((item) => item.parentId && item.parentId.toString() === id.toString())
    let elements = []
    if (children.length > 0) {
      for (let i = 0; i < children.length; i++) {
        elements.push(
          <StyledTreeItem
            key={children[i].id}
            nodeId={`${children[i].id}`}
            label={children[i].title}
            selected={children[i].id === this.props.currentBlock.uniqueId}
            completed={this.props.blocks.find((item) => item.uniqueId.toString() === children[i].id.toString()).payload.length > 0}
          >
            {this.getChildren(children[i].id)}
          </StyledTreeItem>
        )
      }
      return elements
    } else {
      return
    }
  }

  getOrphanBlocks (id) {
    const blocks = this.props.data.filter((item) => !item.parentId && item.id.toString() !== id.toString())
    let elements = []
    if (blocks.length > 0) {
      for (let i = 0; i < blocks.length; i++) {
        elements.push(
          <StyledTreeItem
            key={blocks[i].id}
            nodeId={`${blocks[i].id}`}
            label={blocks[i].title}
            selected={blocks[i].id === this.props.currentBlock.uniqueId}
            completed={this.props.blocks.find((item) => item.uniqueId.toString() === blocks[i].id.toString()).payload.length > 0}
          >
          {this.getChildren(blocks[i].id)}
        </StyledTreeItem>
        )
      }
      return elements
    } else {
      return
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

  expandAll (data) {
    const nodes = data.map((item) => `${item.id}`)
    this.setState({expandedNodes: nodes})
  }

  onNodeSelect (event, value) {
    const currentBlock = this.props.blocks.find((item) => item.uniqueId.toString() === value)
    this.props.updateParentState({currentBlock})
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.data && nextProps.data.length > 0) {
      this.expandAll(nextProps.data)
    }
  }

  render () {
    return (
      <div id='_chatbot_sidebar' style={{border: '1px solid #ccc', backgroundColor: 'white', padding: '0px'}} className='col-md-3'>
        <div style={{margin: '0px'}} className='m-portlet m-portlet-mobile'>
          <div id='_chatbot_sidebar_items' style={{height: '80vh'}} className='m-portlet__body'>
            {
              this.state.expandedNodes.length > 0 &&
              <TreeView
                defaultCollapseIcon={this.getCollapseIcon()}
                defaultExpandIcon={this.getExpandIcon()}
                defaultExpanded={this.state.expandedNodes}
                onNodeSelect={this.onNodeSelect}
              >
                {this.getItems()}
              </TreeView>
            }
          </div>
        </div>
      </div>
    )
  }
}

Sidebar.propTypes = {
  'data': PropTypes.array.isRequired,
  'currentBlock': PropTypes.object.isRequired,
  'blocks': PropTypes.array.isRequired,
  'updateParentState': PropTypes.func.isRequired
}

export default Sidebar
