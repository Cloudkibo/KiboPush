import React from 'react'
import PropTypes from 'prop-types'
import TreeView from '@material-ui/lab/TreeView'
import StyledTreeItem from '../chatbotAutomation/styledTreeItem'

class TreeStructure extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      expandedNodes: []
    }
    this.getCollapseIcon = this.getCollapseIcon.bind(this)
    this.getExpandIcon = this.getExpandIcon.bind(this)
    this.expandAll = this.expandAll.bind(this)
    this.getItems = this.getItems.bind(this)
    this.onNodeSelect = this.onNodeSelect.bind(this)
  }

  componentDidMount () {
    if (this.props.data && this.props.data.length > 0) {
      this.expandAll(this.props.data)
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

  getItems () {
    const firstLevel = this.props.data.filter((item) => !item.parentId)
    const sidebar = (
      <StyledTreeItem
        onNodeSelect={this.onNodeSelect}
        nodeId={`${firstLevel[0].id}`}
        label={firstLevel[0].title}
        completed={this.props.blocks.find((item) => item.uniqueId.toString() === firstLevel[0].id.toString()).payload.length > 0}
      >
        {this.getChildren(firstLevel[0].id)}
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
            onNodeSelect={this.onNodeSelect}
            key={children[i].id}
            nodeId={`${children[i].id}`}
            label={children[i].title}
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

  onNodeSelect (value) {
    const currentBlock = this.props.blocks.find((item) => item.uniqueId.toString() === value)
    this.props.updateParentState({currentBlock, showTreeStructure: false})
  }

  render () {
    return (
        <div style={{
            background: 'white',
            position: 'fixed',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1050
          }}
          className='m-grid__item m-grid__item--fluid m-wrapper'
        >
          <div className='m-subheader '>
            <div className='d-flex align-items-center'>
              <div className='mr-auto'>
                <h3 className='m-subheader__title'>Overall Tree Structure</h3>
              </div>
              <i style={{fontSize: '2rem', cursor: 'pointer'}} onClick={this.props.onClose} className='la la-times pull-right' />
            </div>
          </div>
          <div
            style={{
              backgroundColor: 'white',
              overflow: 'scroll',
              width: '100%',
              height: '100%',
              padding: '2.2rem'
            }}>
            {
              this.state.expandedNodes.length > 0 &&
              <TreeView
                defaultCollapseIcon={this.getCollapseIcon()}
                defaultExpandIcon={this.getExpandIcon()}
                defaultExpanded={this.state.expandedNodes}
              >
                {this.getItems()}
              </TreeView>
            }
          </div>
        </div>
    )
  }
}

TreeStructure.propTypes = {
  'data': PropTypes.array.isRequired,
  'blocks': PropTypes.array.isRequired,
  'onClose': PropTypes.func.isRequired,
  'updateParentState': PropTypes.func.isRequired
}

export default TreeStructure
